from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas.experience import ExperienceCreate, Experience, ExperienceUpdate
from services.experience_service import (
    create_experience, 
    get_user_experiences, 
    get_experience, 
    update_experience,
    delete_experience
)
from models.experience import Experience as ExperienceModel
from routers.auth import get_current_user_dependency
import uuid
import logging

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/experiences",
    tags=["experiences"],
    responses={404: {"description": "Not found"}},
)


@router.post("/", response_model=Experience, status_code=status.HTTP_201_CREATED)
async def add_experience(
    experience: ExperienceCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Create a new experience for the logged-in user.
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
    
    return await create_experience(
        db=db,
        user_id=user_id,
        company_name=experience.company_name,
        title=experience.title,
        location=experience.location,
        start_date=experience.start_date,
        end_date=experience.end_date,
        is_current=experience.is_current,
        description=experience.description
    )


@router.get("/", response_model=List[Experience])
async def get_experiences(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Retrieve all experiences for the logged-in user.
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
    
    return await get_user_experiences(db=db, user_id=user_id)


@router.get("/{experience_id}", response_model=Experience)
async def get_single_experience(
    experience_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Retrieve a specific experience by ID for the logged-in user.
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
    
    return await get_experience(db=db, experience_id=experience_id, user_id=user_id)


@router.put("/{experience_id}", response_model=Experience)
async def modify_experience(
    experience_id: uuid.UUID,
    experience_update: ExperienceUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Update a specific experience by ID for the logged-in user.
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
    
    return await update_experience(
        db=db,
        experience_id=experience_id,
        user_id=user_id,
        company_name=experience_update.company_name,
        title=experience_update.title,
        location=experience_update.location,
        start_date=experience_update.start_date,
        end_date=experience_update.end_date,
        is_current=experience_update.is_current,
        description=experience_update.description
    )


@router.delete("/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_experience(
    experience_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user_dependency)
):
    """
    Delete a specific experience by ID for the logged-in user.
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
    
    result = await delete_experience(db=db, experience_id=experience_id, user_id=user_id)
    if not result:
        raise HTTPException(status_code=404, detail="Experience not found")
    return None

# Debug endpoint - for temporary use only
@router.get("/debug/all", tags=["debug"])
async def debug_get_all_experiences(db: Session = Depends(get_db)):
    """
    Debug endpoint to get all experiences in the database.
    For development use only.
    """
    # Get all experiences
    experiences = db.query(ExperienceModel).all()
    logger.info(f"DEBUG: Found {len(experiences)} total experiences in database")
    
    # Return simplified version of all experiences
    return [
        {
            "id": str(exp.id),
            "user_id": str(exp.user_id),
            "company_name": exp.company_name,
            "title": exp.title
        }
        for exp in experiences
    ]
