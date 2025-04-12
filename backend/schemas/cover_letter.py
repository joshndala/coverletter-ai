from pydantic import BaseModel, UUID4
from typing import List, Optional
from datetime import datetime


class CoverLetterBase(BaseModel):
    company_name: str
    hiring_manager: Optional[str] = None
    job_description: str
    generated_content: Optional[str] = None
    status: Optional[str] = "draft"


class CoverLetterCreate(CoverLetterBase):
    pass


class CoverLetterUpdate(BaseModel):
    company_name: Optional[str] = None
    hiring_manager: Optional[str] = None
    job_description: Optional[str] = None
    generated_content: Optional[str] = None
    status: Optional[str] = None


class CoverLetterExperienceLink(BaseModel):
    experience_id: UUID4
    relevance_order: int


class CoverLetter(CoverLetterBase):
    id: UUID4
    user_id: UUID4
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    selected_experiences: Optional[List[CoverLetterExperienceLink]] = None
    
    class Config:
        from_attributes = True 