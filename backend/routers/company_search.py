from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from database import get_db
from schemas.company_search import CompanySearchRequest, CompanySearchResponse
from services import company_search_service
from services.auth_service import get_current_user
import logging

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/company-search",
    tags=["company-search"],
    responses={404: {"description": "Not found"}},
)

@router.post("", response_model=CompanySearchResponse)
async def search_company(
    request: CompanySearchRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Search for company information and generate a summary.
    """
    try:
        if request.job_description:
            # If job description is provided, get comprehensive context
            result = await company_search_service.get_company_context_for_cover_letter(
                company_name=request.company_name,
                job_description=request.job_description
            )
        else:
            # Otherwise, just get basic company information
            result = await company_search_service.search_company_info(
                company_name=request.company_name
            )
        
        return CompanySearchResponse(
            company_name=result["company_name"],
            search_results=result.get("search_results"),
            summary=result.get("summary"),
            context=result.get("context"),
            error=result.get("error")
        )
    except Exception as e:
        logger.error(f"Error searching for company: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching for company: {str(e)}"
        ) 