import { supabase } from '@/lib/supabase';
import { AuthResult } from '../types';
import { handleAuthError } from '../utils';
import { getRedirectUrl } from '../../linking';

/**
 * Sign in with magic link (passwordless authentication)
 * 
 * @param email - User's email address
 * @returns AuthResult indicating if the magic link was sent successfully
 */
export async function signInWithMagicLink(email: string): Promise<AuthResult> {
  try {
    // Get appropriate redirect URL for this platform
    const redirectUrl = getRedirectUrl('login');
    
    // Use Supabase's built-in signInWithOtp method
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      }
    });
    
    if (error) {
      return { data: null, error };
    }
    
    return { data: null, error: null };
  } catch (error) {
    return handleAuthError(error);
  }
}
