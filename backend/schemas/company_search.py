from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List

class CompanySearchRequest(BaseModel):
    """Schema for company search request."""
    company_name: str = Field(..., description="Name of the company to search for")
    job_description: Optional[str] = Field(None, description="Optional job description to provide context")

class CompanySearchResponse(BaseModel):
    """Schema for company search response."""
    company_name: str = Field(..., description="Name of the company")
    search_results: Optional[str] = Field(None, description="Raw search results from SerpAPI")
    summary: Optional[str] = Field(None, description="Generated summary about the company")
    context: Optional[str] = Field(None, description="Context for cover letter generation")
    error: Optional[str] = Field(None, description="Error message if something went wrong")

class CompanyInfo(BaseModel):
    """Schema for company information."""
    company_name: str = Field(..., description="Name of the company")
    mission: Optional[str] = Field(None, description="Company mission statement")
    values: Optional[List[str]] = Field(None, description="Company values")
    culture: Optional[str] = Field(None, description="Company culture description")
    recent_news: Optional[List[str]] = Field(None, description="Recent news about the company")
    products_services: Optional[List[str]] = Field(None, description="Company products and services")
    leadership: Optional[List[str]] = Field(None, description="Company leadership team") 