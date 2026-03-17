"""
Tests for FastAPI routers — /api/query/, /api/history/, /api/schema/
Run: pytest backend/tests/test_routers.py -v
"""

import pytest
import sys
import os
from unittest.mock import patch, MagicMock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# ─────────────────────────────────────────────
# Health & Root Tests
# ─────────────────────────────────────────────

class TestHealthEndpoints:

    def test_root_returns_200(self):
        res = client.get("/")
        assert res.status_code == 200
        assert "message" in res.json()

    def test_health_returns_ok(self):
        res = client.get("/health")
        assert res.status_code == 200
        assert res.json()["status"] == "ok"


# ─────────────────────────────────────────────
# Query Router Tests
# ─────────────────────────────────────────────

class TestQueryRouter:

    def test_empty_question_returns_400(self):
        res = client.post("/api/query/", json={"question": ""})
        assert res.status_code == 400

    def test_whitespace_question_returns_400(self):
        res = client.post("/api/query/", json={"question": "   "})
        assert res.status_code == 400

    def test_missing_question_returns_422(self):
        res = client.post("/api/query/", json={})
        assert res.status_code == 422

    @patch("routers.query.process_query")
    def test_valid_question_returns_200(self, mock_process):
        from models.query_models import NLQueryResponse, SQLResult, ChartConfig
        mock_process.return_value = NLQueryResponse(
            question="Show total sales",
            sql="SELECT SUM(sales_amount) FROM sales",
            result=SQLResult(columns=["total"], rows=[[100000]], row_count=1),
            chart=ChartConfig(chart_type="bar", x_axis=None, y_axis="total", title="Show total sales"),
            summary="Total sales amount is $100,000.",
            execution_time_ms=432.5,
            query_id="mock-uuid-123"
        )
        res = client.post("/api/query/", json={"question": "Show total sales"})
        assert res.status_code == 200
        data = res.json()
        assert data["question"] == "Show total sales"
        assert "sql" in data
        assert "result" in data
        assert "chart" in data
        assert "summary" in data
        assert "execution_time_ms" in data
        assert "query_id" in data

    @patch("routers.query.process_query")
    def test_sql_validation_error_returns_422(self, mock_process):
        mock_process.side_effect = ValueError("SQL validation failed: Dangerous keyword detected")
        res = client.post("/api/query/", json={"question": "DROP TABLE sales"})
        assert res.status_code == 422

    @patch("routers.query.process_query")
    def test_server_error_returns_500(self, mock_process):
        mock_process.side_effect = Exception("Database connection failed")
        res = client.post("/api/query/", json={"question": "Show sales"})
        assert res.status_code == 500


# ─────────────────────────────────────────────
# History Router Tests
# ─────────────────────────────────────────────

class TestHistoryRouter:

    def test_get_history_returns_200(self):
        res = client.get("/api/history/")
        assert res.status_code == 200
        data = res.json()
        assert "total" in data
        assert "items" in data
        assert isinstance(data["items"], list)

    def test_get_history_limit_param(self):
        res = client.get("/api/history/?limit=5")
        assert res.status_code == 200

    def test_delete_history_returns_200(self):
        res = client.delete("/api/history/")
        assert res.status_code == 200
        assert "message" in res.json()

    def test_history_empty_after_clear(self):
        client.delete("/api/history/")
        res = client.get("/api/history/")
        assert res.json()["total"] == 0


# ─────────────────────────────────────────────
# Schema Router Tests
# ─────────────────────────────────────────────

class TestSchemaRouter:

    @patch("routers.schema.get_table_schema")
    def test_schema_returns_200(self, mock_schema):
        mock_schema.return_value = {
            "sales": [{"name": "id", "type": "integer"}, {"name": "product_name", "type": "varchar"}],
            "customers": [{"name": "id", "type": "integer"}, {"name": "name", "type": "varchar"}]
        }
        res = client.get("/api/schema/")
        assert res.status_code == 200
        data = res.json()
        assert "tables" in data
        assert "table_count" in data
        assert data["table_count"] == 2

    @patch("routers.schema.get_table_schema")
    def test_schema_error_returns_500(self, mock_schema):
        mock_schema.side_effect = Exception("DB connection error")
        res = client.get("/api/schema/")
        assert res.status_code == 500
