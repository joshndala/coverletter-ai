from typing import List, Optional
import json
from models.request_models import CoverLetterRequest, CoverLetterOutput
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate
import re
from sqlalchemy.orm import Session
from models.cover_letter import CoverLetter, CoverLetterExperience
from sqlalchemy import and_
from fastapi import HTTPException
import uuid
from datetime import datetime

# Parser for the generated cover letter
parser = PydanticOutputParser(pydantic_object=CoverLetterOutput)

# CRUD Operations for Cover Letters
async def create_cover_letter(
    db: Session,
    user_id: uuid.UUID,
    company_name: str,
    job_description: str,
    hiring_manager: Optional[str] = None,
    generated_content: Optional[str] = None,
    status: str = "draft"
):
    """
    Create a new cover letter for a user.
    """
    cover_letter = CoverLetter(
        user_id=user_id,
        company_name=company_name,
        hiring_manager=hiring_manager,
        job_description=job_description,
        generated_content=generated_content,
        status=status
    )
    
    db.add(cover_letter)
    db.commit()
    db.refresh(cover_letter)
    
    return cover_letter


async def get_user_cover_letters(
    db: Session,
    user_id: uuid.UUID
) -> List[CoverLetter]:
    """
    Retrieve all cover letters for a user.
    """
    cover_letters = db.query(CoverLetter).filter(CoverLetter.user_id == user_id).all()
    return cover_letters


async def get_cover_letter(
    db: Session,
    cover_letter_id: uuid.UUID,
    user_id: uuid.UUID
) -> CoverLetter:
    """
    Retrieve a specific cover letter for a user.
    """
    cover_letter = db.query(CoverLetter).filter(
        and_(
            CoverLetter.id == cover_letter_id,
            CoverLetter.user_id == user_id
        )
    ).first()
    
    if not cover_letter:
        raise HTTPException(status_code=404, detail="Cover letter not found")
    
    return cover_letter


async def update_cover_letter(
    db: Session,
    cover_letter_id: uuid.UUID,
    user_id: uuid.UUID,
    company_name: Optional[str] = None,
    hiring_manager: Optional[str] = None,
    job_description: Optional[str] = None,
    generated_content: Optional[str] = None,
    status: Optional[str] = None
) -> CoverLetter:
    """
    Update an existing cover letter for a user.
    """
    # Get the cover letter
    cover_letter = await get_cover_letter(db, cover_letter_id, user_id)
    
    # Update fields if provided
    if company_name is not None:
        cover_letter.company_name = company_name
    if hiring_manager is not None:
        cover_letter.hiring_manager = hiring_manager
    if job_description is not None:
        cover_letter.job_description = job_description
    if generated_content is not None:
        cover_letter.generated_content = generated_content
    if status is not None:
        cover_letter.status = status
    
    # Update timestamp
    cover_letter.updated_at = datetime.utcnow()
    
    # Commit changes
    db.commit()
    db.refresh(cover_letter)
    
    return cover_letter


async def delete_cover_letter(
    db: Session,
    cover_letter_id: uuid.UUID,
    user_id: uuid.UUID
) -> bool:
    """
    Delete a cover letter for a user.
    """
    # Get the cover letter (to verify it exists and belongs to the user)
    cover_letter = await get_cover_letter(db, cover_letter_id, user_id)
    
    # Delete the cover letter
    db.delete(cover_letter)
    db.commit()
    
    return True


async def add_experience_to_cover_letter(
    db: Session,
    cover_letter_id: uuid.UUID,
    experience_id: uuid.UUID,
    user_id: uuid.UUID,
    relevance_order: int
) -> CoverLetterExperience:
    """
    Add an experience to a cover letter.
    """
    # Verify the cover letter exists and belongs to the user
    cover_letter = await get_cover_letter(db, cover_letter_id, user_id)
    
    # Create the link
    link = CoverLetterExperience(
        cover_letter_id=cover_letter_id,
        experience_id=experience_id,
        relevance_order=relevance_order
    )
    
    db.add(link)
    db.commit()
    db.refresh(link)
    
    return link


async def remove_experience_from_cover_letter(
    db: Session,
    cover_letter_id: uuid.UUID,
    experience_id: uuid.UUID,
    user_id: uuid.UUID
) -> bool:
    """
    Remove an experience from a cover letter.
    """
    # Verify the cover letter exists and belongs to the user
    cover_letter = await get_cover_letter(db, cover_letter_id, user_id)
    
    # Find and delete the link
    link = db.query(CoverLetterExperience).filter(
        and_(
            CoverLetterExperience.cover_letter_id == cover_letter_id,
            CoverLetterExperience.experience_id == experience_id
        )
    ).first()
    
    if not link:
        raise HTTPException(status_code=404, detail="Experience not linked to this cover letter")
    
    db.delete(link)
    db.commit()
    
    return True


# Existing function for generating cover letter content
async def generate_cover_letter(request: CoverLetterRequest, bedrock_client):
    prompt = construct_prompt(request)
    
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


def construct_prompt(request: CoverLetterRequest) -> str:
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
        input_variables=["company_name", "job_description", "experiences", "hiring_manager_text"],
        partial_variables={"format_instructions": parser.get_format_instructions()}
    )
    
    hiring_manager_text = f"Hiring Manager: {request.hiring_manager}" if request.hiring_manager else ""
    
    return prompt.format(
        company_name=request.company_name,
        job_description=request.job_description,
        experiences=experiences_text,
        hiring_manager_text=hiring_manager_text
    )