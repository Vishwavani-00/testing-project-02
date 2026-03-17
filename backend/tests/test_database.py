"""
Tests for database utilities — schema fetch, query execution
Run: pytest backend/tests/test_database.py -v
"""

import pytest
import sys
import os
from unittest.mock import patch, MagicMock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


class TestExecuteQuery:

    @patch("db.database.engine")
    def test_execute_query_returns_list(self, mock_engine):
        mock_conn = MagicMock()
        mock_result = MagicMock()
        mock_result.keys.return_value = ["id", "product_name", "sales_amount"]
        mock_result.fetchall.return_value = [
            (1, "Laptop Pro", 85000),
            (2, "Monitor", 32000)
        ]
        mock_conn.__enter__ = MagicMock(return_value=mock_conn)
        mock_conn.__exit__ = MagicMock(return_value=False)
        mock_conn.execute.return_value = mock_result
        mock_engine.connect.return_value = mock_conn

        from db.database import execute_query
        result = execute_query("SELECT id, product_name, sales_amount FROM sales")

        assert isinstance(result, list)
        assert len(result) == 2
        assert result[0]["product_name"] == "Laptop Pro"
        assert result[1]["sales_amount"] == 32000

    @patch("db.database.engine")
    def test_execute_query_empty_result(self, mock_engine):
        mock_conn = MagicMock()
        mock_result = MagicMock()
        mock_result.keys.return_value = ["id"]
        mock_result.fetchall.return_value = []
        mock_conn.__enter__ = MagicMock(return_value=mock_conn)
        mock_conn.__exit__ = MagicMock(return_value=False)
        mock_conn.execute.return_value = mock_result
        mock_engine.connect.return_value = mock_conn

        from db.database import execute_query
        result = execute_query("SELECT id FROM sales WHERE id = -1")
        assert result == []

    @patch("db.database.engine")
    def test_execute_query_dict_keys_match_columns(self, mock_engine):
        mock_conn = MagicMock()
        mock_result = MagicMock()
        mock_result.keys.return_value = ["region", "total_sales"]
        mock_result.fetchall.return_value = [("North", 150000)]
        mock_conn.__enter__ = MagicMock(return_value=mock_conn)
        mock_conn.__exit__ = MagicMock(return_value=False)
        mock_conn.execute.return_value = mock_result
        mock_engine.connect.return_value = mock_conn

        from db.database import execute_query
        result = execute_query("SELECT region, SUM(sales_amount) FROM sales GROUP BY region")
        assert "region" in result[0]
        assert "total_sales" in result[0]
        assert result[0]["region"] == "North"


class TestGetTableSchema:

    @patch("db.database.engine")
    def test_get_table_schema_returns_dict(self, mock_engine):
        mock_conn = MagicMock()

        def mock_execute(query):
            sql = str(query)
            mock_result = MagicMock()
            if "information_schema.tables" in sql:
                mock_result.fetchall.return_value = [("sales",), ("customers",)]
            elif "sales" in sql:
                mock_result.fetchall.return_value = [
                    ("id", "integer"), ("product_name", "character varying")
                ]
            elif "customers" in sql:
                mock_result.fetchall.return_value = [
                    ("id", "integer"), ("name", "character varying")
                ]
            else:
                mock_result.fetchall.return_value = []
            return mock_result

        mock_conn.__enter__ = MagicMock(return_value=mock_conn)
        mock_conn.__exit__ = MagicMock(return_value=False)
        mock_conn.execute.side_effect = mock_execute
        mock_engine.connect.return_value = mock_conn

        from db.database import get_table_schema
        schema = get_table_schema()

        assert isinstance(schema, dict)
        assert "sales" in schema
        assert "customers" in schema
        assert schema["sales"][0]["name"] == "id"
        assert schema["sales"][1]["name"] == "product_name"

    @patch("db.database.engine")
    def test_get_table_schema_empty_db(self, mock_engine):
        mock_conn = MagicMock()
        mock_result = MagicMock()
        mock_result.fetchall.return_value = []
        mock_conn.__enter__ = MagicMock(return_value=mock_conn)
        mock_conn.__exit__ = MagicMock(return_value=False)
        mock_conn.execute.return_value = mock_result
        mock_engine.connect.return_value = mock_conn

        from db.database import get_table_schema
        schema = get_table_schema()
        assert schema == {}
