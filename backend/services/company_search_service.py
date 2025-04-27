import os
from typing import Dict, Any, Optional
import json
import boto3
from langchain_community.utilities import SerpAPIWrapper
from langchain_community.chat_models import BedrockChat
from langchain_core.prompts import PromptTemplate

# Initialize the search utility
search = SerpAPIWrapper()

# Initialize Bedrock client
bedrock_client = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-east-1'
)

async def search_company_info(company_name: str) -> Dict[str, Any]:
    """
    Search for company information using SerpAPI and generate a summary using Bedrock.
    
    Args:
        company_name: The name of the company to search for
        
    Returns:
        A dictionary containing company information and a generated summary
    """
    try:
        # Step 1: Get info about the company using SerpAPI
        search_results = search.run(f"{company_name} company mission values news products services")
        
        # Step 2: Generate a summary using Bedrock
        summary = await generate_company_summary(company_name, search_results)
        
        return {
            "company_name": company_name,
            "search_results": search_results,
            "summary": summary
        }
    except Exception as e:
        return {
            "company_name": company_name,
            "error": str(e)
        }

async def generate_company_summary(company_name: str, search_results: str) -> str:
    """
    Generate a summary about the company using Bedrock.
    
    Args:
        company_name: The name of the company
        search_results: Raw search results from SerpAPI
        
    Returns:
        A generated summary about the company
    """
    # Construct the prompt
    prompt = f"""
    You are writing a personalized, enthusiastic cover letter.

    The user is applying to a job at {company_name}.

    Here is information about the company from a web search:
    {search_results}

    Write a paragraph about {company_name}, who they are and why someone would be excited to join them.
    Focus on their mission, values, culture, and recent developments.
    Keep the tone professional but enthusiastic.
    """
    
    try:
        # Call Bedrock directly
        response = bedrock_client.invoke_model(
            modelId="us.meta.llama3-2-3b-instruct-v1:0",
            body=json.dumps({
                "prompt": prompt,
                "temperature": 0.7,
                "top_p": 0.9,
                "max_tokens": 500
            })
        )
        
        response_body = json.loads(response['body'].read())
        return response_body.get('completion', '')
    except Exception as e:
        return f"Error generating company summary: {str(e)}"

async def get_company_context_for_cover_letter(company_name: str, job_description: str) -> Dict[str, Any]:
    """
    Get comprehensive company context for cover letter generation.
    
    Args:
        company_name: The name of the company
        job_description: The job description
        
    Returns:
        A dictionary containing company information and context for the cover letter
    """
    # Get company information
    company_info = await search_company_info(company_name)
    
    # Generate a more specific prompt for the cover letter context
    prompt = f"""
    You are writing a personalized, enthusiastic cover letter.

    The user is applying to a job at {company_name}.
    
    Job Description:
    {job_description}

    Here is information about the company from a web search:
    {company_info.get('search_results', '')}

    Write a paragraph about why this specific role at {company_name} is a great fit for the candidate.
    Focus on how the company's mission, values, and culture align with the job requirements.
    Keep the tone professional but enthusiastic.
    """
    
    try:
        # Call Bedrock directly
        response = bedrock_client.invoke_model(
            modelId="us.meta.llama3-2-3b-instruct-v1:0",
            body=json.dumps({
                "prompt": prompt,
                "temperature": 0.7,
                "top_p": 0.9,
                "max_tokens": 500
            })
        )
        
        response_body = json.loads(response['body'].read())
        context = response_body.get('completion', '')
        
        return {
            "company_name": company_name,
            "company_info": company_info,
            "context": context
        }
    except Exception as e:
        return {
            "company_name": company_name,
            "company_info": company_info,
            "error": str(e)
        } 