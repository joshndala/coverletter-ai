# This file contains the API routes for generating cover letters
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.experience import Experience
from app.auth import get_current_user
import boto3
from pydantic import BaseModel

class CoverLetterRequest(BaseModel):
   job_description: str
   experience_ids: list[int] = None  # Optional - if None, AI picks relevant experiences

router = APIRouter(prefix="/cover-letter")

bedrock = boto3.client('bedrock-runtime')

@router.post("/generate")
async def generate_cover_letter(
   request: CoverLetterRequest,
   current_user = Depends(get_current_user),
   db: Session = Depends(get_db)
):
   # Get experiences
   experiences = []
   if request.experience_ids:
       experiences = db.query(Experience).filter(
           Experience.id.in_(request.experience_ids),
           Experience.user_id == current_user.id
       ).all()
   else:
       # Get all experiences for AI to choose from
       experiences = db.query(Experience).filter(
           Experience.user_id == current_user.id
       ).all()

   # Format prompt for Bedrock
   prompt = f"""Write a cover letter for:
Job Description: {request.job_description}
Candidate: {current_user.name}
Relevant Experiences:
{[f"{e.title} at {e.company}: {e.description}" for e in experiences]}
"""

   response = bedrock.invoke_model(
       modelId='meta.llama3-2-3b-instruct-v1:0',
       body=prompt
   )
   
   return {"cover_letter": response['body']}