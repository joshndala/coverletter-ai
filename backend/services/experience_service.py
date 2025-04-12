from typing import List, Optional
from sqlalchemy.orm import Session
from models.experience import Experience
import uuid
from datetime import date
from fastapi import HTTPException
from sqlalchemy import and_, text
import logging

# Configure logging
logger = logging.getLogger(__name__)


async def create_experience(
    db: Session,
    user_id: uuid.UUID,
    company_name: str,
    title: str,
    location: Optional[str],
    start_date: date,
    end_date: Optional[date],
    is_current: bool,
    description: str
):
    """
    Create a new experience entry for a user.
    """
    # Create content for embedding (combine all fields for better semantic search)
    content_for_embedding = f"{company_name} {title} {location or ''} {description}"
    
    # Create experience record
    experience = Experience(
        user_id=user_id,
        company_name=company_name,
        title=title,
        location=location,
        start_date=start_date,
        end_date=end_date,
        is_current=is_current,
        description=description,
        content_for_embedding=content_for_embedding
    )
    
    db.add(experience)
    db.commit()
    db.refresh(experience)
    
    return experience


async def get_user_experiences(
    db: Session,
    user_id: uuid.UUID
) -> List[Experience]:
    """
    Retrieve all experiences for a user.
    """
    logger.info(f"Fetching experiences for user_id: {user_id}, type: {type(user_id)}")
    
    # Check if user_id is None and handle it
    if user_id is None:
        logger.error("User ID is None, cannot fetch experiences")
        return []
        
    experiences = db.query(Experience).filter(Experience.user_id == user_id).all()
    logger.info(f"Found {len(experiences)} experiences")
    
    # Use SQLAlchemy text() for raw SQL queries
    try:
        raw_query = text(f"SELECT * FROM experiences WHERE user_id = :user_id")
        raw_experiences = db.execute(raw_query, {"user_id": str(user_id)}).fetchall()
        logger.info(f"Raw SQL query found {len(raw_experiences)} experiences")
    except Exception as e:
        logger.error(f"Error executing raw SQL query: {str(e)}")
    
    return experiences


async def get_experience(
    db: Session,
    experience_id: uuid.UUID,
    user_id: uuid.UUID
) -> Experience:
    """
    Retrieve a specific experience for a user.
    """
    experience = db.query(Experience).filter(
        and_(
            Experience.id == experience_id,
            Experience.user_id == user_id
        )
    ).first()
    
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    return experience


async def update_experience(
    db: Session,
    experience_id: uuid.UUID,
    user_id: uuid.UUID,
    company_name: Optional[str] = None,
    title: Optional[str] = None,
    location: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    is_current: Optional[bool] = None,
    description: Optional[str] = None
) -> Experience:
    """
    Update an existing experience entry for a user.
    """
    # Get the experience
    experience = await get_experience(db, experience_id, user_id)
    
    # Update fields if provided
    if company_name is not None:
        experience.company_name = company_name
    if title is not None:
        experience.title = title
    if location is not None:
        experience.location = location
    if start_date is not None:
        experience.start_date = start_date
    if end_date is not None:
        experience.end_date = end_date
    if is_current is not None:
        experience.is_current = is_current
    if description is not None:
        experience.description = description
    
    # Update content for embedding if any field changed
    if any(x is not None for x in [company_name, title, location, description]):
        experience.content_for_embedding = f"{experience.company_name} {experience.title} {experience.location or ''} {experience.description}"
    
    # Commit changes
    db.commit()
    db.refresh(experience)
    
    return experience


async def delete_experience(
    db: Session,
    experience_id: uuid.UUID,
    user_id: uuid.UUID
) -> bool:
    """
    Delete an experience entry for a user.
    """
    # Get the experience (to verify it exists and belongs to the user)
    experience = await get_experience(db, experience_id, user_id)
    
    # Delete the experience
    db.delete(experience)
    db.commit()
    
    return True
