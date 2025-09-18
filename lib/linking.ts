import * as Linking from 'expo-linking';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { supabase } from './supabase';

// Expo Router handles routing automatically based on app/ folder structure

/**
 * Generate redirect URL for auth operations
 * Linking.createURL() handles all environment differences automatically
 */
export function getRedirectUrl(path: string = ''): string {
  return Linking.createURL(path);
}

/**
 * Create session from URL - handles auth tokens from deep links
 * Based on Supabase documentation for React Native/Expo
 */
export const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;
  if (!access_token) return;
  
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

