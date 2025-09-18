import { supabase } from '@/lib/supabase';
import { AuthResult } from '../types';
import { handleAuthError } from '../utils';
import { getRedirectUrl } from '../../linking';

/**
 * Request a password reset for a user
 * 
 * @param email - User's email address
 * @returns AuthResult indicating if the reset email was sent successfully
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    // Generate appropriate redirect URL for reset password
    const redirectUrl = getRedirectUrl('reset-password');
    
    // Use Supabase's built-in resetPasswordForEmail method
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    if (error) {
      return { data: null, error };
    }
    
    return { data: null, error: null };
  } catch (error) {
    return handleAuthError(error);
  }
}

/**
 * Update password for an authenticated user
 * 
 * @param newPassword - The new password to set
 * @returns AuthResult indicating success or failure
 */
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  try {
    // Use Supabase's built-in updateUser method
    const { error } = await supabase.auth.updateUser({ 
      password: newPassword 
    });
    
    if (error) {
      return { data: null, error };
    }
    
    return { data: null, error: null };
  } catch (error) {
    return handleAuthError(error);
  }
}

/**
 * Resend verification email for email confirmation
 * 
 * @param email - User's email address
 * @returns AuthResult indicating if the verification email was sent successfully
 */
export async function resendVerificationEmail(email: string): Promise<AuthResult> {
  try {
    // Generate appropriate redirect URL for verification
    const redirectUrl = getRedirectUrl('verify-email');
    
    // Use Supabase's built-in resend method
    const { error } = await supabase.auth.resend({
      type: 'signup',
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
