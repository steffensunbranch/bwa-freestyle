import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export type AuthErrorState = {
  type: 'error' | 'success';
  title: string;
  message: string;
} | null;

/**
 * Custom hook for handling authentication errors consistently across screens
 * 
 * @returns Object with error state and handler functions
 */
export function useAuthError() {
  const { t } = useTranslation();
  const [alertMessage, setAlertMessage] = useState<AuthErrorState>(null);
  

  /**
   * Handle authentication errors with consistent messaging
   */
  const handleAuthError = (message: string) => {
    setAlertMessage({
      type: 'error',
      title: t('errors.somethingWentWrong'),
      message
    });
  };

  /**
   * Handle authentication success with consistent messaging
   */
  const handleAuthSuccess = (message: string) => {
    setAlertMessage({
      type: 'success',
      title: t('auth.success'),
      message
    });
  };

  /**
   * Clear any current error/success message
   */
  const clearMessage = () => {
    setAlertMessage(null);
  };

  return {
    alertMessage,
    handleAuthError,
    handleAuthSuccess,
    clearMessage,
    setAlertMessage
  };
}
