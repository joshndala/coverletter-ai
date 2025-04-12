import { getAuthFromStorage } from '@/lib/sessionStorage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Define types based on our backend schema
export interface CoverLetterBase {
  company_name: string;
  hiring_manager?: string | null;
  job_description: string;
  generated_content?: string | null;
  status?: string;
}

export interface CoverLetterCreate extends CoverLetterBase {
  // No additional fields needed
}

export interface CoverLetterUpdate {
  company_name?: string;
  hiring_manager?: string | null;
  job_description?: string;
  generated_content?: string | null;
  status?: string;
}

export interface CoverLetterExperienceLink {
  experience_id: string;
  relevance_order: number;
}

export interface CoverLetter extends CoverLetterBase {
  id: string; // UUID as string
  user_id: string; // UUID as string
  created_at?: string; // ISO format datetime string
  updated_at?: string; // ISO format datetime string
  selected_experiences?: CoverLetterExperienceLink[];
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const auth = getAuthFromStorage();
  if (!auth || !auth.firebase_id_token) {
    throw new Error('User not authenticated');
  }
  
  return {
    'Authorization': `Bearer ${auth.firebase_id_token}`,
    'Content-Type': 'application/json'
  };
};

// Create a new cover letter
export const createCoverLetter = async (coverLetter: CoverLetterCreate): Promise<CoverLetter> => {
  try {
    const response = await fetch(`${API_URL}/cover-letters`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(coverLetter)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create cover letter');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating cover letter:", error);
    throw error;
  }
};

// Get all cover letters for the current user
export const getUserCoverLetters = async (): Promise<CoverLetter[]> => {
  try {
    const response = await fetch(`${API_URL}/cover-letters`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch cover letters');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching cover letters:", error);
    throw error;
  }
};

// Get a specific cover letter by ID
export const getCoverLetter = async (coverLetterId: string): Promise<CoverLetter> => {
  try {
    const response = await fetch(`${API_URL}/cover-letters/${coverLetterId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch cover letter');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching cover letter ${coverLetterId}:`, error);
    throw error;
  }
};

// Update an existing cover letter
export const updateCoverLetter = async (coverLetterId: string, update: CoverLetterUpdate): Promise<CoverLetter> => {
  try {
    const response = await fetch(`${API_URL}/cover-letters/${coverLetterId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(update)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update cover letter');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating cover letter ${coverLetterId}:`, error);
    throw error;
  }
};

// Delete a cover letter
export const deleteCoverLetter = async (coverLetterId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/cover-letters/${coverLetterId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete cover letter');
    }
  } catch (error) {
    console.error(`Error deleting cover letter ${coverLetterId}:`, error);
    throw error;
  }
};

// Generate cover letter content using AI
export interface GenerateCoverLetterRequest {
  company_name: string;
  hiring_manager?: string;
  job_description: string;
  experiences: Array<{
    title: string;
    description: string;
    skills: string[];
    duration: string;
  }>;
}

export interface GenerateCoverLetterResponse {
  cover_letter: string;
  chances: string;
  chances_explanation: string;
}

export const generateCoverLetterContent = async (request: GenerateCoverLetterRequest): Promise<GenerateCoverLetterResponse> => {
  try {
    const response = await fetch(`${API_URL}/cover-letters/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate cover letter content');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error generating cover letter content:", error);
    throw error;
  }
};

// Add an experience to a cover letter
export const addExperienceToCoverLetter = async (
  coverLetterId: string, 
  experienceId: string, 
  relevanceOrder: number
): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/cover-letters/${coverLetterId}/experiences/${experienceId}?relevance_order=${relevanceOrder}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to add experience to cover letter');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error adding experience to cover letter:`, error);
    throw error;
  }
};

// Remove an experience from a cover letter
export const removeExperienceFromCoverLetter = async (
  coverLetterId: string, 
  experienceId: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/cover-letters/${coverLetterId}/experiences/${experienceId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to remove experience from cover letter');
    }
  } catch (error) {
    console.error(`Error removing experience from cover letter:`, error);
    throw error;
  }
};
