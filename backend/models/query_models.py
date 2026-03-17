from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class NLQueryRequest(BaseModel):
    question: str
    table_hint: Optional[str] = None  # optional hint for which table to query


class SQLResult(BaseModel):
    columns: List[str]
    rows: List[List[Any]]
    row_count: int


class ChartConfig(BaseModel):
    chart_type: str       # bar, line, pie, table
    x_axis: Optional[str] = None
    y_axis: Optional[str] = None
    title: str


class NLQueryResponse(BaseModel):
    question: str
    sql: str
    result: SQLResult
    chart: ChartConfig
    summary: str
    execution_time_ms: float
    query_id: str


class QueryHistoryItem(BaseModel):
    query_id: str
    question: str
    sql: str
    row_count: int
    chart_type: str
    summary: str
    created_at: datetime


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    suggestion: Optional[str] = None
