from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ExperienceBase(BaseModel):
    title: str
    description: str
    skills: List[str]
    duration: str

class ExperienceCreate(ExperienceBase):
    pass

class Experience(ExperienceBase):
    id: int
    cover_letter_id: int

    class Config:
        from_attributes = True

class CoverLetterRequest(BaseModel):
    company_name: str
    hiring_manager: Optional[str] = None
    job_description: str
    experiences: List[ExperienceCreate]

class CoverLetterResponse(BaseModel):
    id: int
    cover_letter: str
    created_at: datetime

class CoverLetterList(BaseModel):
    id: int
    company_name: str
    created_at: datetime

    class Config:
        from_attributes = True

class CoverLetterDetail(BaseModel):
    id: int
    company_name: str
    hiring_manager: Optional[str]
    job_description: str
    generated_content: str
    created_at: datetime
    experiences: List[Experience]

    class Config:
        from_attributes = True