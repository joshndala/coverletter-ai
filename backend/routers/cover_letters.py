from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.request_models import CoverLetterRequest
from services.cover_letter_service import generate_cover_letter
import boto3

router = APIRouter()

bedrock = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-east-1' 
)

@router.post("/generate")
async def create_cover_letter(request: CoverLetterRequest):
    try:
        response = await generate_cover_letter(request, bedrock)
        return response  
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))