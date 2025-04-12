"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, getCurrentUser, signOut as firebaseSignOut } from '@/lib/firebase';
import { getCurrentUserFromStorage, isAuthenticated } from '@/lib/sessionStorage';

interface User {
  email: string;
  full_name: string;
  firebase_uid: string;
  [key: string]: any; // For any additional properties
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  signOut: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first for a faster initial load
    if (typeof window !== 'undefined') {
      const storedUser = getCurrentUserFromStorage();
      if (storedUser) {
        setUser(storedUser);
      }
    }

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(async (userData) => {
      setLoading(true);
      
      if (userData) {
        setUser(userData);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signOut: firebaseSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 