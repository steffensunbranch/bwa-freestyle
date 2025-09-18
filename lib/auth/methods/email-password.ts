import { supabase } from '@/lib/supabase';
import { AuthResult } from '../types';
import { handleAuthError } from '../utils';

/**
 * Sign in with email and password
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns AuthResult with session if successful
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult<any>> {
  try {
    // Use Supabase's built-in signInWithPassword method
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    return handleAuthError(error);
  }
}

/**
 * Sign up with email and password
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns AuthResult with session if successful (or null if email confirmation required)
 */
export async function signUpWithEmail(
  email: string,
  password: string
): Promise<AuthResult<any>> {
  try {
    // Use Supabase's built-in signUp method
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password 
    });
    
    if (error) {
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    return handleAuthError(error);
  }
}

/**
 * Sign out the current user
 * 
 * @returns AuthResult indicating success or failure
 */
export async function signOut(): Promise<AuthResult> {
  try {
    // Use Supabase's built-in signOut method
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { data: null, error };
    }
    
    return { data: null, error: null };
  } catch (error) {
    return handleAuthError(error);
  }
}
