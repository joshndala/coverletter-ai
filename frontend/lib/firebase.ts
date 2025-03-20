import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from "firebase/auth";

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
    const response = await fetch(`${API_URL}/register`, {
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
    
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        await firebaseSignOut(auth);
        return null;
      }
      throw new Error('Failed to get user data');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

// Sign out
export const signOut = async () => {
  try {
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
        callback(userData);
      } catch (error) {
        console.error("Auth state change error:", error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

export { auth };