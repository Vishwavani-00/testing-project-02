from fastapi import APIRouter, Query
from app.services.nlq_service import query_history

router = APIRouter()


@router.get("/")
async def get_history(limit: int = Query(default=20, le=100)):
    return {"total": len(query_history), "items": query_history[-limit:][::-1]}


@router.delete("/")
async def clear_history():
    query_history.clear()
    return {"message": "History cleared"}
