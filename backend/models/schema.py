from pydantic import BaseModel, UUID4
from typing import Optional, List
from datetime import datetime

class ExperienceBase(BaseModel):
    title: str
    description: str
    skills: List[str]
    duration: str

class ExperienceCreate(ExperienceBase):
    pass

class Experience(ExperienceBase):
    id: UUID4
    user_id: UUID4
    created_at: datetime
    
    class Config:
        from_attributes = True

class CoverLetterRequest(BaseModel):
    company_name: str
    hiring_manager: Optional[str] = None
    job_description: str
    experience_ids: List[UUID4]  # Changed to use IDs of existing experiences

class CoverLetterOutput(BaseModel):
    id: UUID4
    company_name: str
    generated_content: str
    chances: str
    chances_explanation: str
    created_at: datetime

    class Config:
        from_attributes = True

class CoverLetterWithExperiences(CoverLetterOutput):
    experiences: List[Experience]

    class Config:
        from_attributes = True