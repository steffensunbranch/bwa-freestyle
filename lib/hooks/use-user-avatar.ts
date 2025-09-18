import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

/**
 * Hook to get the current user's avatar URL from their metadata
 * @returns The user's avatar URL or null if not available
 */
export function useUserAvatar() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user) {
      // Try to get avatar from user metadata
      const avatar = session.user.user_metadata?.avatar_url || null;
      setAvatarUrl(avatar);
    } else {
      setAvatarUrl(null);
    }
  }, [session]);

  return avatarUrl;
}
