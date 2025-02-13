from typing import List
import json
from models.request_models import CoverLetterRequest, CoverLetterOutput
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate
import re

# Parser
parser = PydanticOutputParser(pydantic_object=CoverLetterOutput)

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

            return generated_content.dict()
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