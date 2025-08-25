"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
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
        // Check email verification for email/password users (Google users are pre-verified)
        const isGoogleUser = currentUser.providerData.some(provider => provider.providerId === 'google.com');
        
        if (!isGoogleUser && !currentUser.emailVerified) {
          console.log('🚨 AuthProvider: Blocking unverified email user:', currentUser.email);
          console.log('📧 Email verification status:', currentUser.emailVerified);
          // Sign out unverified users
          await signOut(auth);
          setUser(null);
          setLoading(false);
          return;
        }
        
        console.log('✅ AuthProvider: User verified, proceeding:', currentUser.email);
        
        // If the user is logged in, ensure their profile exists in Firestore
        try {
          await createUserProfileDocument(currentUser);
        } catch (error) {
          console.warn('Firebase permissions issue - continuing without profile creation:', error);
          // Continue loading even if profile creation fails due to permissions
        }
        
        // Check if user just logged in (transition from null to User)
        if (!previousUser && currentUser) {
          // Check for return URL in localStorage
          const returnUrl = localStorage.getItem('auth_return_url');
          const returnContext = localStorage.getItem('auth_return_context');
          
          if (returnUrl && (returnContext === 'feedback-360-test' || returnContext === 'couple-compatibility-test')) {
            // Clear the stored values
            localStorage.removeItem('auth_return_url');
            localStorage.removeItem('auth_return_context');
            
            // Instead of directly redirecting, show greeting first
            console.log(`User logged in, preparing greeting before ${returnContext}`);
            
            // Extract locale from returnUrl to show greeting in correct language
            const localeMatch = returnUrl.match(/\/([a-z]{2})\//);
            const locale = localeMatch ? localeMatch[1] : 'en';
            
            // Redirect to greeting page with return URL
            setTimeout(() => {
              router.push(`/${locale}/welcome?returnUrl=${encodeURIComponent(returnUrl)}&context=${returnContext}&userName=${encodeURIComponent(currentUser.displayName || currentUser.email || 'User')}`);
            }, 100);
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
