from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.request_models import CoverLetterRequest
from schemas.cover_letter import CoverLetterCreate, CoverLetter, CoverLetterUpdate
from services.cover_letter_service import (
    generate_cover_letter,
    create_cover_letter,
    get_user_cover_letters,
    get_cover_letter,
    update_cover_letter,
    delete_cover_letter,
    add_experience_to_cover_letter,
    remove_experience_from_cover_letter
)
from routers.auth import get_current_user_dependency
import boto3
import uuid
import logging

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/cover-letters",
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
        response = await generate_cover_letter(request, bedrock)
        return response  
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=CoverLetter, status_code=status.HTTP_201_CREATED)
async def create_cover_letter_endpoint(
    cover_letter: CoverLetterCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Create a new cover letter for the logged-in user.
    """
    user_id = current_user.get("uid")
    
    # Convert string user_id to UUID object if needed
    if isinstance(user_id, str):
        try:
            user_id = uuid.UUID(user_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format"
            )
    
    return await create_cover_letter(
        db=db,
        user_id=user_id,
        company_name=cover_letter.company_name,
        hiring_manager=cover_letter.hiring_manager,
        job_description=cover_letter.job_description,
        generated_content=cover_letter.generated_content,
        status=cover_letter.status
    )


@router.get("/", response_model=List[CoverLetter])
async def get_cover_letters(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Retrieve all cover letters for the logged-in user.
    """
    user_id = current_user.get("uid")
    
    # Convert string user_id to UUID object if needed
    if isinstance(user_id, str):
        try:
            user_id = uuid.UUID(user_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format"
            )
    
    return await get_user_cover_letters(db=db, user_id=user_id)


@router.get("/{cover_letter_id}", response_model=CoverLetter)
async def get_single_cover_letter(
    cover_letter_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Retrieve a specific cover letter by ID for the logged-in user.
    """
    user_id = current_user.get("uid")
    
    # Convert string user_id to UUID object if needed
    if isinstance(user_id, str):
        try:
            user_id = uuid.UUID(user_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format"
            )
    
    return await get_cover_letter(db=db, cover_letter_id=cover_letter_id, user_id=user_id)


@router.put("/{cover_letter_id}", response_model=CoverLetter)
async def update_cover_letter_endpoint(
    cover_letter_id: uuid.UUID,
    cover_letter_update: CoverLetterUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Update a specific cover letter by ID for the logged-in user.
    """
    user_id = current_user.get("uid")
    
    # Convert string user_id to UUID object if needed
    if isinstance(user_id, str):
        try:
            user_id = uuid.UUID(user_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format"
            )
    
    return await update_cover_letter(
        db=db,
        cover_letter_id=cover_letter_id,
        user_id=user_id,
        company_name=cover_letter_update.company_name,
        hiring_manager=cover_letter_update.hiring_manager,
        job_description=cover_letter_update.job_description,
        generated_content=cover_letter_update.generated_content,
        status=cover_letter_update.status
    )


@router.delete("/{cover_letter_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cover_letter_endpoint(
    cover_letter_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Delete a specific cover letter by ID for the logged-in user.
    """
    user_id = current_user.get("uid")
    
    # Convert string user_id to UUID object if needed
    if isinstance(user_id, str):
        try:
            user_id = uuid.UUID(user_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format"
            )
    
    result = await delete_cover_letter(db=db, cover_letter_id=cover_letter_id, user_id=user_id)
    if not result:
        raise HTTPException(status_code=404, detail="Cover letter not found")
    return None


@router.post("/{cover_letter_id}/experiences/{experience_id}")
async def add_experience(
    cover_letter_id: uuid.UUID,
    experience_id: uuid.UUID,
    relevance_order: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Add an experience to a cover letter with a specified relevance order.
    """
    user_id = current_user.get("uid")
    
    # Convert string user_id to UUID object if needed
    if isinstance(user_id, str):
        try:
            user_id = uuid.UUID(user_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format"
            )
    
    return await add_experience_to_cover_letter(
        db=db,
        cover_letter_id=cover_letter_id,
        experience_id=experience_id,
        user_id=user_id,
        relevance_order=relevance_order
    )


@router.delete("/{cover_letter_id}/experiences/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_experience(
    cover_letter_id: uuid.UUID,
    experience_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Remove an experience from a cover letter.
    """
    user_id = current_user.get("uid")
    
    # Convert string user_id to UUID object if needed
    if isinstance(user_id, str):
        try:
            user_id = uuid.UUID(user_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID format"
            )
    
    result = await remove_experience_from_cover_letter(
        db=db,
        cover_letter_id=cover_letter_id,
        experience_id=experience_id,
        user_id=user_id
    )
    return None