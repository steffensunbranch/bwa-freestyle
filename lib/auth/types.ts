import { Session, User, AuthError } from '@supabase/supabase-js';

/**
 * Standard result type for all authentication operations
 */
export type AuthResult<T = void> = {
  data: T | null;
  error: AuthError | null;
};

/**
 * Core auth context type that provides authentication state and methods
 */
export type AuthContextType = {
  // State
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  
  // Email/password authentication
  signIn: (email: string, password: string) => Promise<AuthResult<Session>>;
  signUp: (email: string, password: string) => Promise<AuthResult<Session>>;
  signOut: () => Promise<AuthResult>;
  
  // Passwordless authentication
  signInWithMagicLink: (email: string) => Promise<AuthResult>;
  
  // Password management
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
  
  // Email verification
  resendVerificationEmail: (email: string) => Promise<AuthResult>;
};
