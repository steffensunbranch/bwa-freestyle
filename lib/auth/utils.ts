import { AuthError } from '@supabase/supabase-js';
import { AuthResult } from './types';
import i18n from '../i18n/i18n';

/**
 * Standard error handler that creates consistent auth results
 * 
 * @param error - Any error that occurred during an auth operation
 * @returns Standardized AuthResult with error
 */
export function handleAuthError<T>(error: unknown): AuthResult<T> {
  console.error('Auth error:', error);
  
  if (error instanceof AuthError) {
    return { data: null, error };
  }
  
  const errorMessage = error instanceof Error ? error.message : i18n.t('errors.unknownAuthError');
  return {
    data: null,
    error: new AuthError(errorMessage, 500)
  };
}
