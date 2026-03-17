"""
Tests for NLQ Service — SQL validation, chart detection, query history
Run: pytest backend/tests/test_nlq_service.py -v
"""

import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.nlq_service import validate_sql, determine_chart_type
from models.query_models import ChartConfig


# ─────────────────────────────────────────────
# SQL Validation Tests
# ─────────────────────────────────────────────

class TestValidateSQL:

    def test_valid_select_passes(self):
        sql = "SELECT * FROM sales LIMIT 100"
        is_valid, msg = validate_sql(sql)
        assert is_valid is True
        assert msg == ""

    def test_valid_select_with_where(self):
        sql = "SELECT region, SUM(sales_amount) FROM sales WHERE region = 'North' GROUP BY region"
        is_valid, msg = validate_sql(sql)
        assert is_valid is True

    def test_valid_select_with_join(self):
        sql = "SELECT s.product_name, c.name FROM sales s JOIN customers c ON s.id = c.id"
        is_valid, msg = validate_sql(sql)
        assert is_valid is True

    def test_drop_blocked(self):
        sql = "DROP TABLE sales"
        is_valid, msg = validate_sql(sql)
        assert is_valid is False
        assert "drop" in msg.lower()

    def test_delete_blocked(self):
        sql = "DELETE FROM sales WHERE id = 1"
        is_valid, msg = validate_sql(sql)
        assert is_valid is False
        assert "delete" in msg.lower()

    def test_update_blocked(self):
        sql = "UPDATE sales SET sales_amount = 0"
        is_valid, msg = validate_sql(sql)
        assert is_valid is False
        assert "update" in msg.lower()

    def test_insert_blocked(self):
        sql = "INSERT INTO sales (product_name) VALUES ('test')"
        is_valid, msg = validate_sql(sql)
        assert is_valid is False
        assert "insert" in msg.lower()

    def test_alter_blocked(self):
        sql = "ALTER TABLE sales ADD COLUMN new_col TEXT"
        is_valid, msg = validate_sql(sql)
        assert is_valid is False
        assert "alter" in msg.lower()

    def test_non_select_blocked(self):
        sql = "TRUNCATE TABLE customers"
        is_valid, msg = validate_sql(sql)
        assert is_valid is False

    def test_case_insensitive_block(self):
        sql = "DeLeTe FROM sales"
        is_valid, msg = validate_sql(sql)
        assert is_valid is False


# ─────────────────────────────────────────────
# Chart Type Detection Tests
# ─────────────────────────────────────────────

class TestDetermineChartType:

    def test_trend_question_returns_line(self):
        columns = ["month", "total_sales"]
        rows = [["Jan", 10000], ["Feb", 12000]]
        chart = determine_chart_type(columns, rows, "Show monthly sales trend")
        assert chart.chart_type == "line"

    def test_over_time_returns_line(self):
        columns = ["year", "revenue"]
        rows = [[2022, 50000], [2023, 60000]]
        chart = determine_chart_type(columns, rows, "Revenue over time")
        assert chart.chart_type == "line"

    def test_count_question_returns_bar(self):
        columns = ["region", "order_count"]
        rows = [["North", 100], ["South", 80]]
        chart = determine_chart_type(columns, rows, "Count of orders by region")
        assert chart.chart_type == "bar"

    def test_top_question_returns_bar(self):
        columns = ["product", "revenue"]
        rows = [["Laptop", 85000], ["Monitor", 32000]]
        chart = determine_chart_type(columns, rows, "Top 5 products by revenue")
        assert chart.chart_type == "bar"

    def test_single_column_returns_table(self):
        columns = ["product_name"]
        rows = [["Laptop"], ["Mouse"]]
        chart = determine_chart_type(columns, rows, "List all products")
        assert chart.chart_type == "table"

    def test_many_columns_returns_table(self):
        columns = ["a", "b", "c", "d", "e", "f"]
        rows = [[1, 2, 3, 4, 5, 6]]
        chart = determine_chart_type(columns, rows, "Show all details")
        assert chart.chart_type == "table"

    def test_chart_has_title(self):
        columns = ["region", "sales"]
        rows = [["North", 100]]
        question = "Sales by region"
        chart = determine_chart_type(columns, rows, question)
        assert chart.title == question

    def test_chart_x_axis_assigned(self):
        columns = ["region", "sales"]
        rows = [["North", 100]]
        chart = determine_chart_type(columns, rows, "Top regions by sales")
        assert chart.x_axis == "region"

    def test_chart_y_axis_assigned(self):
        columns = ["region", "sales"]
        rows = [["North", 100]]
        chart = determine_chart_type(columns, rows, "Top regions by sales")
        assert chart.y_axis == "sales"

    def test_default_returns_bar_for_two_cols(self):
        columns = ["category", "amount"]
        rows = [["Electronics", 50000]]
        chart = determine_chart_type(columns, rows, "Something random")
        assert chart.chart_type == "bar"


# ─────────────────────────────────────────────
# Query History Tests
# ─────────────────────────────────────────────

class TestQueryHistory:

    def test_history_is_list(self):
        from services.nlq_service import query_history
        assert isinstance(query_history, list)

    def test_history_item_structure(self):
        from services.nlq_service import query_history
        # Simulate adding a history item
        query_history.append({
            "query_id": "test-123",
            "question": "Show total sales",
            "sql": "SELECT SUM(sales_amount) FROM sales",
            "row_count": 1,
            "chart_type": "bar",
            "summary": "Total sales is $100,000.",
            "created_at": "2026-03-17T10:00:00"
        })
        last = query_history[-1]
        assert "query_id" in last
        assert "question" in last
        assert "sql" in last
        assert "row_count" in last
        assert "chart_type" in last
        assert "summary" in last
        assert "created_at" in last
        # Cleanup
        query_history.pop()
