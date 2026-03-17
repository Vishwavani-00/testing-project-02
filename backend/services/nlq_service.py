import os
import re
import json
import time
import uuid
from openai import OpenAI
from db.database import get_table_schema, execute_query
from models.query_models import SQLResult, ChartConfig, NLQueryResponse
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# In-memory query history store
query_history: list[dict] = []


def build_schema_context(schema: dict) -> str:
    """Build a schema string for LLM context."""
    lines = []
    for table, columns in schema.items():
        col_str = ", ".join([f"{c['name']} ({c['type']})" for c in columns])
        lines.append(f"Table: {table}\nColumns: {col_str}")
    return "\n\n".join(lines)


def generate_sql(question: str, schema_context: str) -> str:
    """Use OpenAI to convert natural language to SQL."""
    prompt = f"""You are an expert SQL generator. Convert the user's natural language question into a valid PostgreSQL query.

Database Schema:
{schema_context}

Rules:
- Return ONLY the SQL query, no explanation, no markdown, no code blocks
- Use proper PostgreSQL syntax
- Add LIMIT 1000 if no limit is specified
- Use proper column aliases for readability
- Never use DROP, DELETE, UPDATE, INSERT, ALTER, CREATE, TRUNCATE

User Question: {question}

SQL Query:"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_tokens=500
    )
    sql = response.choices[0].message.content.strip()
    # Strip markdown code blocks if present
    sql = re.sub(r"```sql\n?", "", sql)
    sql = re.sub(r"```\n?", "", sql)
    return sql.strip()


def generate_summary(question: str, sql: str, results: list[dict]) -> str:
    """Generate a natural language summary of the query results."""
    sample = results[:5] if len(results) > 5 else results
    prompt = f"""Given the following data query and results, write a concise 2-3 sentence business insight summary.

Question: {question}
SQL: {sql}
Sample Results (first 5 rows): {json.dumps(sample, default=str)}
Total Rows: {len(results)}

Write a clear, business-friendly insight summary:"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=200
    )
    return response.choices[0].message.content.strip()


def determine_chart_type(columns: list[str], rows: list, question: str) -> ChartConfig:
    """Auto-determine the best chart type based on data and question."""
    question_lower = question.lower()
    num_cols = len(columns)

    # Time-based → line chart
    time_keywords = ["trend", "over time", "monthly", "yearly", "weekly", "daily", "by year", "by month"]
    if any(k in question_lower for k in time_keywords):
        return ChartConfig(
            chart_type="line",
            x_axis=columns[0] if num_cols >= 1 else None,
            y_axis=columns[1] if num_cols >= 2 else None,
            title=question
        )

    # Distribution / count → bar chart
    bar_keywords = ["count", "top", "most", "least", "by", "per", "group", "compare"]
    if any(k in question_lower for k in bar_keywords) and num_cols >= 2:
        return ChartConfig(
            chart_type="bar",
            x_axis=columns[0],
            y_axis=columns[1],
            title=question
        )

    # Single column or many columns → table
    if num_cols == 1 or num_cols > 5:
        return ChartConfig(chart_type="table", title=question)

    # Default → bar
    return ChartConfig(
        chart_type="bar",
        x_axis=columns[0] if num_cols >= 1 else None,
        y_axis=columns[1] if num_cols >= 2 else None,
        title=question
    )


def validate_sql(sql: str) -> tuple[bool, str]:
    """Basic SQL safety validation."""
    dangerous = ["drop ", "delete ", "update ", "insert ", "alter ", "create ", "truncate "]
    sql_lower = sql.lower()
    for keyword in dangerous:
        if keyword in sql_lower:
            return False, f"Dangerous keyword detected: {keyword.strip()}"
    if not sql_lower.strip().startswith("select"):
        return False, "Only SELECT queries are allowed"
    return True, ""


def process_query(question: str) -> NLQueryResponse:
    """Main pipeline: NL → SQL → Execute → Chart + Summary."""
    start_time = time.time()

    # Get schema
    schema = get_table_schema()
    schema_context = build_schema_context(schema)

    # Generate SQL
    sql = generate_sql(question, schema_context)

    # Validate SQL
    is_valid, error_msg = validate_sql(sql)
    if not is_valid:
        raise ValueError(f"SQL validation failed: {error_msg}")

    # Execute query
    results = execute_query(sql)

    if not results:
        columns, rows = [], []
    else:
        columns = list(results[0].keys())
        rows = [list(row.values()) for row in results]

    sql_result = SQLResult(columns=columns, rows=rows, row_count=len(rows))

    # Determine chart type
    chart = determine_chart_type(columns, rows, question)

    # Generate summary
    summary = generate_summary(question, sql, results) if results else "No data returned for this query."

    execution_time = (time.time() - start_time) * 1000
    query_id = str(uuid.uuid4())

    response = NLQueryResponse(
        question=question,
        sql=sql,
        result=sql_result,
        chart=chart,
        summary=summary,
        execution_time_ms=round(execution_time, 2),
        query_id=query_id
    )

    # Store in history
    query_history.append({
        "query_id": query_id,
        "question": question,
        "sql": sql,
        "row_count": len(rows),
        "chart_type": chart.chart_type,
        "summary": summary,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%S")
    })

    return response
