import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://nlq_user:nlq_password@localhost:5432/nlq_db"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def execute_query(sql: str) -> list[dict]:
    """Execute a SQL query and return results as list of dicts."""
    with engine.connect() as conn:
        result = conn.execute(text(sql))
        columns = list(result.keys())
        rows = result.fetchall()
        return [dict(zip(columns, row)) for row in rows]


def get_table_schema() -> dict:
    """Fetch all table names and their columns from the database."""
    schema = {}
    with engine.connect() as conn:
        tables = conn.execute(text(
            "SELECT table_name FROM information_schema.tables "
            "WHERE table_schema = 'public' AND table_type = 'BASE TABLE'"
        )).fetchall()

        for (table_name,) in tables:
            columns = conn.execute(text(
                f"SELECT column_name, data_type FROM information_schema.columns "
                f"WHERE table_name = '{table_name}' ORDER BY ordinal_position"
            )).fetchall()
            schema[table_name] = [{"name": col, "type": dtype} for col, dtype in columns]

    return schema
