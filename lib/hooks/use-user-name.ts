import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

/**
 * Hook to get the current user's name from their metadata
 * @returns The user's name or null if not available
 */
export function useUserName() {
  const [name, setName] = useState<string | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user) {
      // Try to get name from user metadata, with fallbacks
      const userName = 
        session.user.user_metadata?.full_name || 
        session.user.user_metadata?.name || 
        session.user.email?.split('@')[0] || 
        null;
      
      setName(userName);
    } else {
      setName(null);
    }
  }, [session]);

  return name;
}
