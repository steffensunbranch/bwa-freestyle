import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { AuthContextType } from './types';
import {
  signInWithEmail,
  signUpWithEmail,
  signOut as handleSignOut,
} from './methods/email-password';
import {
  signInWithMagicLink,
} from './methods/passwordless';
import {
  resetPassword,
  updatePassword,
  resendVerificationEmail,
} from './methods/password-management';

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider component that wraps your app and makes auth object available to any
 * child component that calls useAuth().
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Auth state
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    // Get initial session and set up auth state listener
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Get initial session - Supabase will handle auto-refresh
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // Check email verification status if we have a user
        if (data.session?.user) {
          setIsEmailVerified(!!data.session.user.email_confirmed_at);
        }
        
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Call initialization
    initAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check email verification status if we have a user
        if (currentSession?.user) {
          setIsEmailVerified(!!currentSession.user.email_confirmed_at);
        } else {
          setIsEmailVerified(false);
          if (event === 'SIGNED_OUT') {
            console.log('Supabase User signed out with handleSignOut');
          }
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const handleSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signInWithEmail(email, password);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const handleSignUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signUpWithEmail(email, password);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Handle sign out
  const handleSignOutAuth = async () => {
    setLoading(true);
    try {
      const result = await handleSignOut();
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Handle magic link sign in
  const handleMagicLinkSignIn = async (email: string) => {
    setLoading(true);
    try {
      const result = await signInWithMagicLink(email);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async (email: string) => {
    setLoading(true);
    try {
      const result = await resetPassword(email);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Handle password update
  const handleUpdatePassword = async (newPassword: string) => {
    setLoading(true);
    try {
      const result = await updatePassword(newPassword);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerificationEmail = async (email: string) => {
    setLoading(true);
    try {
      const result = await resendVerificationEmail(email);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Combine all auth methods and state in context value
  const value: AuthContextType = {
    // State
    session,
    user,
    isLoading,
    isAuthenticated: !!session,
    isEmailVerified,
    
    // Authentication methods
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOutAuth,
    
    // Passwordless authentication
    signInWithMagicLink: handleMagicLinkSignIn,
    
    // Password management
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    
    // Email verification
    resendVerificationEmail: handleResendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook for easy access to the auth context
 * 
 * @returns {AuthContextType} The auth context with all authentication methods and state
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
