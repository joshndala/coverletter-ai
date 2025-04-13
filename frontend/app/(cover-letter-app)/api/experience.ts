import { getAuthFromStorage } from '@/lib/sessionStorage';
import { authenticatedRequest } from '@/lib/apiClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Define types based on our backend schema
export interface Skill {
  id: string;
  name: string;
}

export interface ExperienceBase {
  company_name: string;
  title: string;
  location?: string;
  start_date: string; // ISO format date string
  end_date?: string | null; // ISO format date string, can be null
  is_current: boolean;
  description: string;
}

export interface ExperienceCreate extends ExperienceBase {
  // Remove skills field since it's not implemented in backend
}

export interface ExperienceUpdate {
  company_name?: string;
  title?: string;
  location?: string;
  start_date?: string;
  end_date?: string | null;
  is_current?: boolean;
  description?: string;
  // Remove skills field
}

export interface Experience extends ExperienceBase {
  id: string; // UUID as string
  user_id: string; // UUID as string
  // Remove skills field
  created_at?: string; // ISO format datetime string
  updated_at?: string; // ISO format datetime string
}

// Create a new experience
export const createExperience = async (experience: ExperienceCreate): Promise<Experience> => {
  try {
    return await authenticatedRequest<Experience>('experiences', {
      method: 'POST',
      body: JSON.stringify(experience)
    });
  } catch (error) {
    console.error("Error creating experience:", error);
    throw error;
  }
};

// Get all experiences for the current user
export const getUserExperiences = async (): Promise<Experience[]> => {
  try {
    return await authenticatedRequest<Experience[]>('experiences', {
      method: 'GET'
    });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    throw error;
  }
};

// Get a specific experience by ID
export const getExperience = async (experienceId: string): Promise<Experience> => {
  try {
    return await authenticatedRequest<Experience>(`experiences/${experienceId}`, {
      method: 'GET'
    });
  } catch (error) {
    console.error(`Error fetching experience ${experienceId}:`, error);
    throw error;
  }
};

// Update an existing experience
export const updateExperience = async (experienceId: string, update: ExperienceUpdate): Promise<Experience> => {
  try {
    return await authenticatedRequest<Experience>(`experiences/${experienceId}`, {
      method: 'PUT',
      body: JSON.stringify(update)
    });
  } catch (error) {
    console.error(`Error updating experience ${experienceId}:`, error);
    throw error;
  }
};

// Delete an experience
export const deleteExperience = async (experienceId: string): Promise<void> => {
  try {
    await authenticatedRequest(`experiences/${experienceId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error(`Error deleting experience ${experienceId}:`, error);
    throw error;
  }
};
