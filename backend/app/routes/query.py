from fastapi import APIRouter, HTTPException
from app.models.query_models import NLQueryRequest, NLQueryResponse
from app.services.nlq_service import process_query

router = APIRouter()


@router.post("/", response_model=NLQueryResponse)
async def run_query(request: NLQueryRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    try:
        return process_query(request.question)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except ConnectionError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")
