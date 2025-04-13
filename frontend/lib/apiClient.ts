import { getAuthFromStorage } from './sessionStorage';
import { handleApiError } from './authHandler';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiRequestOptions extends RequestInit {
  skipAuthCheck?: boolean;
}

/**
 * Get auth headers for API requests
 */
export const getAuthHeaders = () => {
  const auth = getAuthFromStorage();
  if (!auth || !auth.firebase_id_token) {
    throw new Error('User not authenticated');
  }
  
  return {
    'Authorization': `Bearer ${auth.firebase_id_token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Fetch API wrapper that handles authentication errors
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { skipAuthCheck = false, headers, ...restOptions } = options;
  
  try {
    // Get full URL
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Make the request
    const response = await fetch(url, {
      ...restOptions,
      headers: {
        ...headers
      }
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      // Check for authentication errors unless skipAuthCheck is true
      if (!skipAuthCheck) {
        const authErrorHandled = await handleApiError(response);
        if (authErrorHandled) {
          throw new Error('Authentication error');
        }
      }
      
      // Try to get detailed error message
      let errorDetail = 'An error occurred';
      try {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorData.message || 'An error occurred';
      } catch (e) {
        // If response is not JSON, use status text
        errorDetail = response.statusText;
      }
      
      throw new Error(errorDetail);
    }
    
    // Parse and return the response
    if (response.status === 204) {
      // No content
      return null as T;
    }
    
    return await response.json() as T;
  } catch (error) {
    console.error(`API request error: ${error}`);
    throw error;
  }
};

/**
 * Helper for making authenticated API requests
 */
export const authenticatedRequest = async <T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const { headers, ...restOptions } = options;
  
  try {
    const authHeaders = getAuthHeaders();
    
    return await apiRequest<T>(endpoint, {
      ...restOptions,
      headers: {
        ...authHeaders,
        ...headers
      }
    });
  } catch (error) {
    console.error(`Authenticated request error: ${error}`);
    throw error;
  }
}; 