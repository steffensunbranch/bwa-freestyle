import { getEnvVar } from './getEnv';

// Supabase
export const SUPABASE_URL = getEnvVar('EXPO_PUBLIC_SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnvVar('EXPO_PUBLIC_SUPABASE_ANON_KEY');

// Legal URLs
// TODO: Replace these example URLs with actual URLs
export const TERMS_OF_SERVICE_URL = 'https://example.com/terms-of-service';
export const PRIVACY_POLICY_URL = 'https://example.com/privacy-policy';
