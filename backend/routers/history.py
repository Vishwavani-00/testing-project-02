from fastapi import APIRouter, Query
from services.nlq_service import query_history

router = APIRouter()


@router.get("/")
async def get_history(limit: int = Query(default=20, le=100)):
    """Return recent query history."""
    return {
        "total": len(query_history),
        "items": query_history[-limit:][::-1]  # latest first
    }


@router.delete("/")
async def clear_history():
    """Clear all query history."""
    query_history.clear()
    return {"message": "History cleared"}
