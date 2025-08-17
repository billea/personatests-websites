"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { createUserProfileDocument } from '@/lib/firestore';

// 1. Define the shape of the context data
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// 2. Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create a custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 4. Create the Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const previousUser = user;
      
      if (currentUser) {
        // If the user is logged in, ensure their profile exists in Firestore
        await createUserProfileDocument(currentUser);
        
        // Check if user just logged in (transition from null to User)
        if (!previousUser && currentUser) {
          // Check for return URL in localStorage
          const returnUrl = localStorage.getItem('auth_return_url');
          const returnContext = localStorage.getItem('auth_return_context');
          
          if (returnUrl && returnContext === 'feedback-360-test') {
            // Clear the stored values
            localStorage.removeItem('auth_return_url');
            localStorage.removeItem('auth_return_context');
            
            // Redirect back to the 360 feedback test
            console.log('Redirecting user back to 360 feedback test:', returnUrl);
            setTimeout(() => {
              router.push(returnUrl);
            }, 100); // Small delay to ensure auth state is fully updated
          }
        }
      }
      
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, router]);

  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
