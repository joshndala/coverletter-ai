# This file contains the API routes for managing experiences
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.experience import Experience
from app.auth import get_current_user
from typing import List
from pydantic import BaseModel

class ExperienceCreate(BaseModel):
    title: str
    company: str
    description: str

router = APIRouter(prefix="/experiences")

@router.post("/")
def create_experience(
    experience: ExperienceCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_experience = Experience(**experience.dict(), user_id=current_user.id)
    db.add(db_experience)
    db.commit()
    return db_experience

@router.get("/", response_model=List[ExperienceCreate])
def get_experiences(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Experience).filter(Experience.user_id == current_user.id).all()