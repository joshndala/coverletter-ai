from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from database import engine, get_db
import models, schemas
from models.request_models import CoverLetterRequest 
from services.cover_letter_service import generate_cover_letter
import boto3

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AWS Bedrock client
bedrock = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-east-1' 
)

@app.post("/api/generate-cover-letter")
async def create_cover_letter(request: CoverLetterRequest):
    try:
        response = await generate_cover_letter(request, bedrock)
        return response  
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))