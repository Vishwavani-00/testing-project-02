from fastapi import APIRouter, HTTPException
from app.utils.db import get_table_schema

router = APIRouter()


@router.get("/")
async def get_schema():
    try:
        schema = get_table_schema()
        return {"tables": schema, "table_count": len(schema)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
