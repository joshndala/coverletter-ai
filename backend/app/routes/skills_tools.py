# This file contains the API routes for managing skills and tools

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.skill import Skill
from app.models.tool import Tool
from app.auth import get_current_user
from typing import List
from pydantic import BaseModel

class SkillCreate(BaseModel):
    name: str
    proficiency_level: str

class ToolCreate(BaseModel):
    name: str
    expertise_level: str

router = APIRouter()

# Skills routes
@router.post("/skills/")
def create_skill(
    skill: SkillCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_skill = Skill(**skill.dict(), user_id=current_user.id)
    db.add(db_skill)
    db.commit()
    return db_skill

@router.get("/skills/", response_model=List[SkillCreate])
def get_skills(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Skill).filter(Skill.user_id == current_user.id).all()

# Tools routes
@router.post("/tools/")
def create_tool(
    tool: ToolCreate,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_tool = Tool(**tool.dict(), user_id=current_user.id)
    db.add(db_tool)
    db.commit()
    return db_tool

@router.get("/tools/", response_model=List[ToolCreate])
def get_tools(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Tool).filter(Tool.user_id == current_user.id).all()
