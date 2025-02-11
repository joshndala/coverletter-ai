from typing import List
import json
from models.request_models import CoverLetterRequest

async def generate_cover_letter(request: CoverLetterRequest, bedrock_client):
    prompt = construct_prompt(request)
    
    try:
        response = bedrock_client.invoke_model(
            modelId="us.meta.llama3-2-3b-instruct-v1:0",
            body=json.dumps({
                "prompt": prompt,  
                #"max_tokens": 1000, 
                "temperature": 0.7,
                "top_p": 0.9
            })
        )
        
        response_body = json.loads(response['body'].read())
        try:
            # Try to parse the generated text as JSON
            generated_content = json.loads(response_body['generation'])
            return generated_content
        except json.JSONDecodeError as json_error:
            # If JSON parsing fails, return the raw text with error details
            raise Exception(f"Failed to parse model output as JSON. Raw output: {response_body['generation']}")
            
    except Exception as e:
        raise Exception(f"Error generating cover letter: {str(e)}")

def construct_prompt(request: CoverLetterRequest) -> str:
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

    Also, give me the chances of getting the job based on the experiences provided. Along with the
    chances, provide an explanation of why the candidate is a good fit for the job. Keep the explanation
    length to approximately 100-150 words.

    Return your response in the following JSON format, and make sure it's valid JSON:
    {{"cover_letter": "<the cover letter text>", "chances": "<percentage>", "chances_explanation": "<explanation text>"}}

    ONLY RETURN THE JSON, NOTHING ELSE. START YOUR RESPONSE WITH '{{' AND END IT WITH '}}'.
    """
    
    return prompt