import { getAuthFromStorage } from '@/lib/sessionStorage';
import { authenticatedRequest } from '@/lib/apiClient';

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

// Create a new cover letter
export const createCoverLetter = async (coverLetter: CoverLetterCreate): Promise<CoverLetter> => {
  try {
    return await authenticatedRequest<CoverLetter>('cover-letters', {
      method: 'POST',
      body: JSON.stringify(coverLetter)
    });
  } catch (error) {
    console.error("Error creating cover letter:", error);
    throw error;
  }
};

// Get all cover letters for the current user
export const getUserCoverLetters = async (): Promise<CoverLetter[]> => {
  try {
    return await authenticatedRequest<CoverLetter[]>('cover-letters', {
      method: 'GET'
    });
  } catch (error) {
    console.error("Error fetching cover letters:", error);
    throw error;
  }
};

// Get a specific cover letter by ID
export const getCoverLetter = async (coverLetterId: string): Promise<CoverLetter> => {
  try {
    return await authenticatedRequest<CoverLetter>(`cover-letters/${coverLetterId}`, {
      method: 'GET'
    });
  } catch (error) {
    console.error(`Error fetching cover letter ${coverLetterId}:`, error);
    throw error;
  }
};

// Update an existing cover letter
export const updateCoverLetter = async (coverLetterId: string, update: CoverLetterUpdate): Promise<CoverLetter> => {
  try {
    return await authenticatedRequest<CoverLetter>(`cover-letters/${coverLetterId}`, {
      method: 'PUT',
      body: JSON.stringify(update)
    });
  } catch (error) {
    console.error(`Error updating cover letter ${coverLetterId}:`, error);
    throw error;
  }
};

// Delete a cover letter
export const deleteCoverLetter = async (coverLetterId: string): Promise<void> => {
  try {
    await authenticatedRequest(`cover-letters/${coverLetterId}`, {
      method: 'DELETE'
    });
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
    return await authenticatedRequest<GenerateCoverLetterResponse>('cover-letters/generate', {
      method: 'POST',
      body: JSON.stringify(request)
    });
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
    return await authenticatedRequest(`cover-letters/${coverLetterId}/experiences/${experienceId}?relevance_order=${relevanceOrder}`, {
      method: 'POST'
    });
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
    await authenticatedRequest(`cover-letters/${coverLetterId}/experiences/${experienceId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error(`Error removing experience from cover letter:`, error);
    throw error;
  }
};
