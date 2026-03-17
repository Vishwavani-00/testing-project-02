from fastapi import APIRouter, HTTPException
from models.query_models import NLQueryRequest, NLQueryResponse, ErrorResponse
from services.nlq_service import process_query

router = APIRouter()


@router.post("/", response_model=NLQueryResponse)
async def run_query(request: NLQueryRequest):
    """
    Accept a natural language question, generate SQL, execute it,
    and return results with chart config and insight summary.
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    try:
        response = process_query(request.question)
        return response
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Query processing failed: {str(e)}"
        )
