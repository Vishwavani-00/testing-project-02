from fastapi import APIRouter, HTTPException
from db.database import get_table_schema

router = APIRouter()


@router.get("/")
async def get_schema():
    """Return the database schema (tables and columns)."""
    try:
        schema = get_table_schema()
        return {"tables": schema, "table_count": len(schema)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch schema: {str(e)}")
