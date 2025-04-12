from pydantic import BaseModel, UUID4
from typing import List, Optional
from datetime import date, datetime


class SkillBase(BaseModel):
    name: str


class SkillCreate(SkillBase):
    pass


class Skill(SkillBase):
    id: UUID4
    
    class Config:
        from_attributes = True


class ExperienceBase(BaseModel):
    company_name: str
    title: str
    location: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    is_current: bool = False
    description: str


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(BaseModel):
    company_name: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None


class Experience(ExperienceBase):
    id: UUID4
    user_id: UUID4
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True 