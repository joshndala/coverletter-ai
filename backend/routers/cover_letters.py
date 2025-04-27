from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from database import get_db
from models.request_models import CoverLetterRequest
from schemas.cover_letter import CoverLetterCreate, CoverLetter, CoverLetterUpdate, CoverLetterOutput
from services import cover_letter_service
from routers.auth import get_current_user_dependency
import boto3
import uuid
import logging

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/cover-letters",
    tags=["cover-letters"],
    responses={404: {"description": "Not found"}},
)

bedrock = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-east-1' 
)

@router.post("/generate")
async def generate_cover_letter_content(request: CoverLetterRequest):
    """
    Generate cover letter content using AI.
    """
    try:
        response = await cover_letter_service.generate_cover_letter(request, bedrock)
        return response  
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("", response_model=CoverLetterOutput)
async def create_cover_letter(
    cover_letter: CoverLetterCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """Create a new cover letter."""
    return await cover_letter_service.create_cover_letter(
        db=db,
        user_id=current_user["id"],
        cover_letter_data=cover_letter
    )


@router.get("", response_model=List[CoverLetterOutput])
async def get_cover_letters(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """Get all cover letters for the current user."""
    return await cover_letter_service.get_cover_letters(
        db=db,
        user_id=current_user["id"]
    )


@router.get("/{cover_letter_id}", response_model=CoverLetterOutput)
async def get_cover_letter(
    cover_letter_id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """Get a specific cover letter by ID."""
    return await cover_letter_service.get_cover_letter(
        db=db,
        cover_letter_id=cover_letter_id,
        user_id=current_user["id"]
    )


@router.put("/{cover_letter_id}", response_model=CoverLetterOutput)
async def update_cover_letter(
    cover_letter_id: UUID,
    cover_letter: CoverLetterUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """Update a cover letter."""
    return await cover_letter_service.update_cover_letter(
        db=db,
        cover_letter_id=cover_letter_id,
        user_id=current_user["id"],
        cover_letter_data=cover_letter
    )


@router.delete("/{cover_letter_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cover_letter(
    cover_letter_id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """Delete a cover letter."""
    await cover_letter_service.delete_cover_letter(
        db=db,
        cover_letter_id=cover_letter_id,
        user_id=current_user["id"]
    )


@router.post("/{cover_letter_id}/experiences/{experience_id}", response_model=CoverLetterOutput)
async def add_experience_to_cover_letter(
    cover_letter_id: UUID,
    experience_id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """Add an experience to a cover letter."""
    return await cover_letter_service.add_experience_to_cover_letter(
        db=db,
        cover_letter_id=cover_letter_id,
        experience_id=experience_id,
        user_id=current_user["id"]
    )


@router.delete("/{cover_letter_id}/experiences/{experience_id}", response_model=CoverLetterOutput)
async def remove_experience_from_cover_letter(
    cover_letter_id: UUID,
    experience_id: UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """Remove an experience from a cover letter."""
    return await cover_letter_service.remove_experience_from_cover_letter(
        db=db,
        cover_letter_id=cover_letter_id,
        experience_id=experience_id,
        user_id=current_user["id"]
    )