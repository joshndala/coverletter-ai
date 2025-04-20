from typing import List, Optional
import json
from models.request_models import CoverLetterRequest, CoverLetterOutput
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate
import re
from sqlalchemy.orm import Session
from models.cover_letter import CoverLetter, CoverLetterExperience
from sqlalchemy import and_
from fastapi import HTTPException, status
import uuid
from datetime import datetime
from sqlalchemy.exc import IntegrityError

from models.experience import Experience
from schemas.cover_letter import CoverLetterCreate, CoverLetterUpdate
from services.experience_service import get_top_experiences
from services.company_search_service import get_company_context_for_cover_letter

# Parser for the generated cover letter
parser = PydanticOutputParser(pydantic_object=CoverLetterOutput)

# CRUD Operations for Cover Letters
async def create_cover_letter(db: Session, user_id: uuid.UUID, cover_letter_data: CoverLetterCreate) -> CoverLetter:
    """Create a new cover letter for a user."""
    try:
        # Create a new cover letter instance
        cover_letter = CoverLetter(
            user_id=user_id,
            **cover_letter_data.model_dump()
        )
        
        # Add to database
        db.add(cover_letter)
        db.commit()
        db.refresh(cover_letter)
        
        return cover_letter
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create cover letter. Please check your input."
        )

async def get_cover_letters(db: Session, user_id: uuid.UUID) -> List[CoverLetter]:
    """Get all cover letters for a user."""
    return db.query(CoverLetter).filter(CoverLetter.user_id == user_id).all()

async def get_cover_letter(db: Session, cover_letter_id: uuid.UUID, user_id: uuid.UUID) -> CoverLetter:
    """Get a specific cover letter by ID."""
    cover_letter = db.query(CoverLetter).filter(
        CoverLetter.id == cover_letter_id,
        CoverLetter.user_id == user_id
    ).first()
    
    if not cover_letter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cover letter not found"
        )
    
    return cover_letter

async def update_cover_letter(
    db: Session,
    cover_letter_id: uuid.UUID,
    user_id: uuid.UUID,
    cover_letter_data: CoverLetterUpdate
) -> CoverLetter:
    """Update an existing cover letter."""
    cover_letter = await get_cover_letter(db, cover_letter_id, user_id)
    
    # Update only provided fields
    update_data = cover_letter_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(cover_letter, field, value)
    
    try:
        db.commit()
        db.refresh(cover_letter)
        return cover_letter
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update cover letter. Please check your input."
        )

async def delete_cover_letter(db: Session, cover_letter_id: uuid.UUID, user_id: uuid.UUID) -> None:
    """Delete a cover letter."""
    cover_letter = await get_cover_letter(db, cover_letter_id, user_id)
    
    try:
        db.delete(cover_letter)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete cover letter."
        )

async def add_experience_to_cover_letter(
    db: Session,
    cover_letter_id: uuid.UUID,
    experience_id: uuid.UUID,
    user_id: uuid.UUID
) -> CoverLetter:
    """Add an experience to a cover letter."""
    # Verify cover letter exists and belongs to user
    cover_letter = await get_cover_letter(db, cover_letter_id, user_id)
    
    # Verify experience exists and belongs to user
    experience = db.query(Experience).filter(
        Experience.id == experience_id,
        Experience.user_id == user_id
    ).first()
    
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found"
        )
    
    # Add experience to cover letter if not already added
    if experience not in cover_letter.experiences:
        cover_letter.experiences.append(experience)
        db.commit()
        db.refresh(cover_letter)
    
    return cover_letter

async def remove_experience_from_cover_letter(
    db: Session,
    cover_letter_id: uuid.UUID,
    experience_id: uuid.UUID,
    user_id: uuid.UUID
) -> CoverLetter:
    """Remove an experience from a cover letter."""
    # Verify cover letter exists and belongs to user
    cover_letter = await get_cover_letter(db, cover_letter_id, user_id)
    
    # Find the experience in the cover letter
    experience = db.query(Experience).filter(
        Experience.id == experience_id,
        Experience.user_id == user_id
    ).first()
    
    if not experience:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Experience not found"
        )
    
    # Remove experience from cover letter if it exists
    if experience in cover_letter.experiences:
        cover_letter.experiences.remove(experience)
        db.commit()
        db.refresh(cover_letter)
    
    return cover_letter

# Existing function for generating cover letter content
async def generate_cover_letter(request: CoverLetterRequest, bedrock_client):
    # Get company context if company name is provided
    company_context = ""
    if request.company_name:
        try:
            company_info = await get_company_context_for_cover_letter(
                company_name=request.company_name,
                job_description=request.job_description
            )
            if "context" in company_info and company_info["context"]:
                company_context = f"\n\nCompany Context:\n{company_info['context']}"
        except Exception as e:
            # Log the error but continue without company context
            print(f"Error getting company context: {str(e)}")
    
    prompt = construct_prompt(request, company_context)
    
    try:
        response = bedrock_client.invoke_model(
            modelId="us.meta.llama3-2-3b-instruct-v1:0",
            body=json.dumps({
                "prompt": prompt,
                "temperature": 0.7,
                "top_p": 0.9
            })
        )
        
        response_body = json.loads(response['body'].read())

        try:
            raw_output = response_body.get('generation', '')
            json_match = re.search(r"\{.*\}", raw_output, re.DOTALL)

            if not json_match:
                raise ValueError(f"Failed to extract JSON from model output: {raw_output}")

            clean_json = json_match.group()  # Extracted JSON block

            try:
                parsed_output = json.loads(clean_json)  # Parse the extracted JSON
                return parsed_output  # Ensure it's a valid dict
            except json.JSONDecodeError as e:
                raise Exception(f"Failed to decode JSON: {str(e)}\nExtracted JSON: {clean_json}")
            
        except Exception as parse_error:
            raise Exception(f"Failed to parse model output as JSON. Raw output: {response_body['generation']}")
            
    except Exception as e:
        raise Exception(f"Error generating cover letter: {str(e)}")


def construct_prompt(request: CoverLetterRequest, company_context: str = "") -> str:
    experiences_text = "\n".join([
        f"- {exp.title}: {exp.description} (Skills: {', '.join(exp.skills)})" 
        for exp in request.experiences
    ])
    
    template = """You are a professional cover letter writer. Your task is to generate a cover letter based on the following information:

        Company: {company_name}

        Job Description:
        {job_description}

        Relevant Experiences:
        {experiences}

        {hiring_manager_text}
        
        {company_context}

        Requirements:
        1. Write a compelling cover letter that:
        - Addresses the hiring manager personally (if provided)
        - Shows enthusiasm for the company
        - Connects the candidate's experiences with the job requirements
        - Maintains a professional yet engaging tone
        - Keeps the length to approximately 300-400 words

        2. Provide:
        - A percentage chance of getting the job
        - A brief explanation (100-150 words) of why the candidate is a good fit

        Return ONLY a valid JSON response. Do NOT include any extra text, explanations, or comments. Do NOT use Markdown formatting (e.g., no ```json). 

        Your response MUST start with an open curly bracket and end with closed curly bracket. Do not include any text outside the JSON block.
        """

    prompt = PromptTemplate(
        template=template,
        input_variables=["company_name", "job_description", "experiences", "hiring_manager_text", "company_context"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    hiring_manager_text = f"Hiring Manager: {request.hiring_manager}" if request.hiring_manager else ""
    
    return prompt.format(
        company_name=request.company_name,
        job_description=request.job_description,
        experiences=experiences_text,
        hiring_manager_text=hiring_manager_text,
        company_context=company_context
    )