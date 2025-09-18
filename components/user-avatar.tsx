import React from 'react';
import { useUserAvatar } from '@/lib/hooks/use-user-avatar';
import { useUserName } from '@/lib/hooks/use-user-name';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/lib/i18n/useTranslation';

export type UserAvatarProps = {
  /**
   * Size class for the avatar (defaults to standard size)
   */
  className?: string;
};

/**
 * A component that displays the current user's avatar
 * Falls back to initials if no avatar is available
 */
export function UserAvatar({ className = "h-10 w-10" }: UserAvatarProps) {
  const avatarUrl = useUserAvatar();
  const userName = useUserName();
  const { t } = useTranslation();
  
  // Create initials from the user's name
  const initials = userName
    ? userName
        .split(/\s+/) // Split by whitespace
        .filter(Boolean) // Remove empty strings
        .map((word: string) => word[0]) // Get first letter of each word
        .slice(0, 2) // Take first two initials
        .join('')
        .toUpperCase()
    : 'U'; // Fallback to single 'U' for User
  
  return (
    <Avatar
      alt={userName || t('ui.userAvatar')}
      className={className}>
      {avatarUrl && <AvatarImage source={{ uri: avatarUrl }} />}
      <AvatarFallback>
        <Text>{initials}</Text>
      </AvatarFallback>
    </Avatar>
  );
}
