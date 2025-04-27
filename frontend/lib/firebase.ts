import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onIdTokenChanged
} from "firebase/auth";
import { saveAuthToStorage, clearAuthFromStorage } from './sessionStorage';
import { setAuthCookie, clearAuthCookie } from './cookies';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// API base URL - Updated to point to the FastAPI backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await registerWithBackend(userCredential.user);
  } catch (error) {
    console.error("Email sign-in error:", error);
    throw error;
  }
};

// Register with email and password
export const registerWithEmail = async (email: string, password: string, fullName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return await registerWithBackend(userCredential.user, { full_name: fullName });
  } catch (error) {
    console.error("Email registration error:", error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return await registerWithBackend(userCredential.user);
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

// Register user with backend
export const registerWithBackend = async (firebaseUser: any, additionalData = {}) => {
  try {
    // Get Firebase ID token
    const idToken = await firebaseUser.getIdToken();
    
    // Register with backend
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(additionalData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to register with backend');
    }
    
    const userData = await response.json();
    
    // Save authentication data to session storage
    saveAuthToStorage({
      firebase_id_token: idToken,
      user: {
        email: userData.email || firebaseUser.email,
        full_name: userData.full_name || firebaseUser.displayName || '',
        firebase_uid: userData.firebase_uid || firebaseUser.uid
      }
    });
    
    // Set auth cookie for middleware
    setAuthCookie(true);
    
    return userData;
  } catch (error) {
    console.error("Backend registration error:", error);
    throw error;
  }
};

// Get current user data from backend
export const getCurrentUser = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }
    
    const idToken = await currentUser.getIdToken();
    
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        await signOut();
        return null;
      }
      throw new Error('Failed to get user data');
    }
    
    const userData = await response.json();
    
    // Update session storage with fresh token and user data
    saveAuthToStorage({
      firebase_id_token: idToken,
      user: {
        email: userData.email,
        full_name: userData.full_name || '',
        firebase_uid: userData.firebase_uid
      }
    });
    
    return userData;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

// Sign out
export const signOut = async () => {
  try {
    // Clear session storage first
    clearAuthFromStorage();
    
    // Clear auth cookie
    clearAuthCookie();
    
    // Then sign out from Firebase
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

// Auth state observer
export const onAuthStateChanged = (callback: (user: any) => void) => {
  return auth.onAuthStateChanged(async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userData = await getCurrentUser();
        setAuthCookie(true);
        callback(userData);
      } catch (error) {
        console.error("Auth state change error:", error);
        clearAuthCookie();
        callback(null);
      }
    } else {
      // User signed out
      clearAuthFromStorage();
      clearAuthCookie();
      callback(null);
    }
  });
};

// Set up token refresh listener
// This will update the session storage whenever the token refreshes
if (typeof window !== 'undefined') {
  onIdTokenChanged(auth, async (user) => {
    if (user) {
      try {
        const idToken = await user.getIdToken();
        const currentStorage = JSON.parse(localStorage.getItem('coverforme_auth') || '{}');
        if (currentStorage.user) {
          saveAuthToStorage({
            ...currentStorage,
            firebase_id_token: idToken,
          });
        }
      } catch (error) {
        console.error("Token refresh error:", error);
      }
    }
  });
}

export { auth };