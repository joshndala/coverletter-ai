from pydantic import BaseModel, UUID4, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID


class CoverLetterBase(BaseModel):
    """Base schema for cover letter data."""
    job_title: str = Field(..., description="The title of the job being applied for")
    company_name: str = Field(..., description="The name of the company")
    job_description: str = Field(..., description="The full job description")
    tone: str = Field(..., description="The desired tone of the cover letter (e.g., professional, friendly)")
    max_length: int = Field(..., description="Maximum length of the cover letter in words", ge=100, le=1000)


class CoverLetterCreate(CoverLetterBase):
    """Schema for creating a new cover letter."""
    pass


class CoverLetterUpdate(BaseModel):
    """Schema for updating an existing cover letter."""
    job_title: Optional[str] = Field(None, description="The title of the job being applied for")
    company_name: Optional[str] = Field(None, description="The name of the company")
    job_description: Optional[str] = Field(None, description="The full job description")
    tone: Optional[str] = Field(None, description="The desired tone of the cover letter")
    max_length: Optional[int] = Field(None, description="Maximum length of the cover letter in words", ge=100, le=1000)


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


class ExperienceInCoverLetter(BaseModel):
    """Schema for an experience included in a cover letter."""
    id: UUID
    title: str
    company: str
    start_date: datetime
    end_date: Optional[datetime]
    description: str
    key_achievements: List[str]


class CoverLetterOutput(CoverLetterBase):
    """Schema for cover letter response data."""
    id: UUID
    user_id: UUID
    content: str
    created_at: datetime
    updated_at: datetime
    experiences: List[ExperienceInCoverLetter] = Field(default_factory=list)

    class Config:
        from_attributes = True


class CoverLetterInDB(CoverLetterOutput):
    pass 