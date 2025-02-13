from pydantic import BaseModel
from typing import List
from typing import Optional, List 

class Experience(BaseModel):
    title: str
    description: str
    skills: List[str]
    duration: str

class CoverLetterRequest(BaseModel):
    company_name: str
    hiring_manager: Optional[str] = None
    job_description: str
    experiences: List[Experience]
    duration: Optional[str] = None

class CoverLetterOutput(BaseModel):
    cover_letter: str
    chances: str
    chances_explanation: str