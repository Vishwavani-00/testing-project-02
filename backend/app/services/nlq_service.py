import re
import time
import uuid
import requests
from app.utils.db import get_table_schema, execute_query
from app.models.query_models import SQLResult, ChartConfig, NLQueryResponse

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "tinyllama"

# In-memory query history
query_history: list[dict] = []


def build_schema_context(schema: dict) -> str:
    lines = []
    for table, columns in schema.items():
        col_str = ", ".join([f"{c['name']} ({c['type']})" for c in columns])
        lines.append(f"Table '{table}': {col_str}")
    return "\n".join(lines)


def generate_sql(question: str, schema_context: str) -> str:
    """Use TinyLlama via Ollama to convert NL to SQL."""

    # Few-shot prompt to guide tinyllama
    prompt = f"""You are a SQL expert. Convert the question to a valid SQLite SELECT query.

Database tables:
{schema_context}

Rules:
- Return ONLY the SQL query, nothing else
- No markdown, no explanation, no code blocks
- Use only SELECT statements
- Add LIMIT 100 if no limit specified
- Use proper SQLite syntax

Examples:
Question: Show total sales by region
SQL: SELECT region, SUM(sales_amount) AS total_sales FROM sales GROUP BY region ORDER BY total_sales DESC

Question: Top 5 products by revenue
SQL: SELECT product_name, SUM(sales_amount) AS revenue FROM sales GROUP BY product_name ORDER BY revenue DESC LIMIT 5

Question: List all customers
SQL: SELECT * FROM customers LIMIT 100

Now convert this:
Question: {question}
SQL:"""

    try:
        response = requests.post(
            OLLAMA_URL,
            json={"model": MODEL, "prompt": prompt, "stream": False},
            timeout=30
        )
        response.raise_for_status()
        sql = response.json().get("response", "").strip()

        # Clean up output
        sql = re.sub(r"```sql\n?", "", sql, flags=re.IGNORECASE)
        sql = re.sub(r"```\n?", "", sql)
        sql = sql.split("\n")[0].strip()  # take first line only

        # Ensure it starts with SELECT
        if not sql.upper().startswith("SELECT"):
            # Fallback: extract SELECT from anywhere in response
            match = re.search(r"(SELECT .+?)(?:\n|;|$)", sql, re.IGNORECASE | re.DOTALL)
            if match:
                sql = match.group(1).strip()
            else:
                raise ValueError(f"TinyLlama did not generate valid SQL: {sql}")

        return sql

    except requests.exceptions.ConnectionError:
        raise ConnectionError("Ollama is not running. Start it with: ollama serve")
    except Exception as e:
        raise RuntimeError(f"SQL generation failed: {str(e)}")


def generate_summary(question: str, results: list[dict]) -> str:
    """Generate a brief insight summary using TinyLlama."""
    if not results:
        return "No data returned for this query."

    sample = results[:3]
    sample_str = str(sample)[:300]

    prompt = f"""Write a 1-2 sentence business insight for this data query result.

Question: {question}
Sample results: {sample_str}
Total rows: {len(results)}

Insight:"""

    try:
        response = requests.post(
            OLLAMA_URL,
            json={"model": MODEL, "prompt": prompt, "stream": False},
            timeout=20
        )
        response.raise_for_status()
        summary = response.json().get("response", "").strip()
        # Take first 2 sentences max
        sentences = re.split(r'(?<=[.!?])\s+', summary)
        return " ".join(sentences[:2]) if sentences else summary
    except Exception:
        # Fallback summary if model fails
        if results:
            return f"Query returned {len(results)} rows. Top result: {list(results[0].values())[:3]}."
        return "Query completed successfully."


def validate_sql(sql: str) -> tuple[bool, str]:
    """Block dangerous SQL operations."""
    dangerous = ["drop ", "delete ", "update ", "insert ", "alter ", "create ", "truncate "]
    sql_lower = sql.lower()
    for keyword in dangerous:
        if keyword in sql_lower:
            return False, f"Blocked: '{keyword.strip()}' operations not allowed"
    if not sql_lower.strip().startswith("select"):
        return False, "Only SELECT queries are allowed"
    return True, ""


def determine_chart_type(columns: list, question: str) -> ChartConfig:
    """Auto-detect best chart type."""
    q = question.lower()
    n = len(columns)

    if any(k in q for k in ["trend", "over time", "monthly", "yearly", "weekly", "by month", "by year"]):
        return ChartConfig(chart_type="line", x_axis=columns[0] if n >= 1 else None,
                           y_axis=columns[1] if n >= 2 else None, title=question)
    if any(k in q for k in ["top", "count", "by", "per", "group", "compare", "most", "least"]) and n >= 2:
        return ChartConfig(chart_type="bar", x_axis=columns[0],
                           y_axis=columns[1], title=question)
    if n == 1 or n > 5:
        return ChartConfig(chart_type="table", title=question)

    return ChartConfig(chart_type="bar", x_axis=columns[0] if n >= 1 else None,
                       y_axis=columns[1] if n >= 2 else None, title=question)


def process_query(question: str) -> NLQueryResponse:
    """Main NLQ pipeline: NL → SQL → Execute → Chart + Summary."""
    start = time.time()

    schema = get_table_schema()
    schema_context = build_schema_context(schema)

    sql = generate_sql(question, schema_context)

    is_valid, error = validate_sql(sql)
    if not is_valid:
        raise ValueError(error)

    results = execute_query(sql)

    columns = list(results[0].keys()) if results else []
    rows = [list(r.values()) for r in results]

    sql_result = SQLResult(columns=columns, rows=rows, row_count=len(rows))
    chart = determine_chart_type(columns, question)
    summary = generate_summary(question, results)

    execution_time = (time.time() - start) * 1000
    query_id = str(uuid.uuid4())

    response = NLQueryResponse(
        question=question,
        sql=sql,
        result=sql_result,
        chart=chart,
        summary=summary,
        execution_time_ms=round(execution_time, 2),
        query_id=query_id,
        model="tinyllama"
    )

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
