from typing import List
import json
from ..models.request_models import CoverLetterRequest

async def generate_cover_letter(request: CoverLetterRequest, bedrock_client):
    # Construct the prompt
    prompt = construct_prompt(request)
    
    try:
        # Call AWS Bedrock with Llama 3
        response = bedrock_client.invoke_model(
            modelId='meta.llama3-2-3b-instruct-v1:0', 
            body=json.dumps({
                "prompt": prompt,
                "max_tokens": 1000,
                "temperature": 0.7,
                "top_p": 0.9,
            })
        )
        
        response_body = json.loads(response['body'].read())
        cover_letter = response_body['generation']  # Update based on actual response structure
        
        return cover_letter
    except Exception as e:
        raise Exception(f"Error generating cover letter: {str(e)}")

def construct_prompt(request: CoverLetterRequest) -> str:
    # Build a detailed prompt for the AI
    experiences_text = "\n".join([
        f"- {exp.title}: {exp.description} (Skills: {', '.join(exp.skills)})" 
        for exp in request.experiences
    ])
    
    prompt = f"""
    Generate a professional cover letter for {request.company_name}.
    
    Job Description:
    {request.job_description}
    
    Relevant Experiences:
    {experiences_text}
    
    {"Hiring Manager: " + request.hiring_manager if request.hiring_manager else ""}
    
    Please write a compelling cover letter that:
    1. Addresses the hiring manager personally (if provided)
    2. Shows enthusiasm for the company
    3. Connects the candidate's experiences with the job requirements
    4. Maintains a professional yet engaging tone
    5. Keeps the length to approximately 300-400 words
    """
    
    return prompt