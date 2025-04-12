interface UserData {
  email: string;
  full_name: string;
  firebase_uid: string;
}

interface SessionData {
  firebase_id_token: string;
  firebase_refresh_token?: string;
  user: UserData;
}

// Storage key
const AUTH_STORAGE_KEY = 'coverforme_auth';

/**
 * Save authentication data to localStorage
 */
export const saveAuthToStorage = (data: SessionData): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save auth data to localStorage:', error);
  }
};

/**
 * Get authentication data from localStorage
 */
export const getAuthFromStorage = (): SessionData | null => {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as SessionData;
  } catch (error) {
    console.error('Failed to get auth data from localStorage:', error);
    return null;
  }
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuthFromStorage = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear auth data from localStorage:', error);
  }
};

/**
 * Check if user is authenticated based on stored data
 */
export const isAuthenticated = (): boolean => {
  const authData = getAuthFromStorage();
  return !!authData?.firebase_id_token;
};

/**
 * Get the current user from storage
 */
export const getCurrentUserFromStorage = (): UserData | null => {
  const authData = getAuthFromStorage();
  return authData?.user || null;
};

/**
 * Get the stored Firebase ID token
 */
export const getStoredIdToken = (): string | null => {
  const authData = getAuthFromStorage();
  return authData?.firebase_id_token || null;
}; 