import { useEffect } from 'react';
import { useLinkingURL } from 'expo-linking';
import { createSessionFromUrl } from '@/lib/linking';

/**
 * Hook to handle auth deep links from email links
 * Based on Supabase documentation for React Native/Expo
 */
export function useAuthDeepLink() {
  const url = useLinkingURL();
  
  useEffect(() => {
    // Handle linking into app from email app
    if (url) {
      createSessionFromUrl(url).catch((error) => {
        console.error('Error creating session from URL:', error);
      });
    }
  }, [url]);
}
