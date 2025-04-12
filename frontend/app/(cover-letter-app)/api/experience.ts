import { getAuthFromStorage } from '@/lib/sessionStorage';

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

// Create a new experience
export const createExperience = async (experience: ExperienceCreate): Promise<Experience> => {
  try {
    const response = await fetch(`${API_URL}/experiences`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(experience)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create experience');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error creating experience:", error);
    throw error;
  }
};

// Get all experiences for the current user
export const getUserExperiences = async (): Promise<Experience[]> => {
  try {
    const response = await fetch(`${API_URL}/experiences`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch experiences');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching experiences:", error);
    throw error;
  }
};

// Get a specific experience by ID
export const getExperience = async (experienceId: string): Promise<Experience> => {
  try {
    const response = await fetch(`${API_URL}/experiences/${experienceId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch experience');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching experience ${experienceId}:`, error);
    throw error;
  }
};

// Update an existing experience
export const updateExperience = async (experienceId: string, update: ExperienceUpdate): Promise<Experience> => {
  try {
    const response = await fetch(`${API_URL}/experiences/${experienceId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(update)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update experience');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating experience ${experienceId}:`, error);
    throw error;
  }
};

// Delete an experience
export const deleteExperience = async (experienceId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/experiences/${experienceId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete experience');
    }
  } catch (error) {
    console.error(`Error deleting experience ${experienceId}:`, error);
    throw error;
  }
};
