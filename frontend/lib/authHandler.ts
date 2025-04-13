import { clearAuthFromStorage } from './sessionStorage';
import { toast } from '@/components/ui/use-toast';

let isRedirecting = false;

/**
 * Handle authentication error (like token expiration)
 * This will clear the auth data and redirect to the login page
 */
export const handleAuthError = (redirectUrl: string = '/login') => {
  // Prevent multiple redirects
  if (isRedirecting) return;
  isRedirecting = true;
  
  // Clear auth data
  clearAuthFromStorage();
  
  // Show toast notification about session expiration
  toast({
    title: "Session Expired",
    description: "Your session has expired. Please log in again.",
    variant: "destructive",
  });
  
  // Redirect to login page
  setTimeout(() => {
    window.location.href = redirectUrl;
    isRedirecting = false;
  }, 100);
};

/**
 * Check if a response is an authentication error (401)
 */
export const isAuthError = (response: Response): boolean => {
  return response.status === 401;
};

/**
 * Handles API response errors including auth errors
 * Returns true if the error was handled, false otherwise
 */
export const handleApiError = async (response: Response): Promise<boolean> => {
  if (isAuthError(response)) {
    handleAuthError();
    return true;
  }
  return false;
}; 