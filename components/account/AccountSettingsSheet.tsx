import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTranslation } from '@/lib/i18n/useTranslation';
import BaseBottomSheet from './BaseBottomSheet';
import { useAuth } from '@/lib/auth';
import UpdateEmailDialog from '@/components/account/UpdateEmailDialog';
import UpdateNameDialog from '@/components/account/UpdateNameDialog';
import DeleteAccountDialog from '@/components/account/DeleteAccountDialog';
import { CheckCircle, XCircle } from 'lucide-react-native';

interface AccountSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  userId?: string;
}

export function AccountSettingsSheet({
  isOpen,
  onClose,
  email,
  userId
}: AccountSettingsSheetProps) {
  const { t } = useTranslation();
  const { user, resetPassword } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Dialog state
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false);
  const [passwordResetAlert, setPasswordResetAlert] = useState<{
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Auto-dismiss alert after 4 seconds
  useEffect(() => {
    if (passwordResetAlert.show) {
      const timer = setTimeout(() => {
        setPasswordResetAlert(prev => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [passwordResetAlert.show]);

  // Deletion is handled within DeleteAccountDialog component

  const accountOptions = [
    {
      id: 'name',
      title: t('account.settings.updateName'),
      onPress: () => {
        setIsNameDialogOpen(true);
      }
    },
    {
      id: 'email',
      title: t('account.settings.updateEmail'),
      onPress: () => {
        setIsEmailDialogOpen(true);
      }
    },
    {
      id: 'password',
      title: t('account.settings.changePassword'),
      onPress: async () => {
        const targetEmail = user?.email ?? email;
        if (!targetEmail) {
          setPasswordResetAlert({
            show: true,
            type: 'error',
            title: t('errors.somethingWentWrong'),
            message: t('errors.required'),
          });
          return;
        }

        setIsSendingPasswordReset(true);
        try {
          const { error } = await resetPassword(targetEmail);
          if (error) {
            setPasswordResetAlert({
              show: true,
              type: 'error',
              title: t('errors.somethingWentWrong'),
              message: error.message,
            });
          } else {
            setPasswordResetAlert({
              show: true,
              type: 'success',
              title: t('auth.emailSent'),
              message: t('auth.resetPasswordSent'),
            });
          }
        } catch (e) {
          setPasswordResetAlert({
            show: true,
            type: 'error',
            title: t('errors.somethingWentWrong'),
            message: t('auth.resetPasswordError'),
          });
        } finally {
          setIsSendingPasswordReset(false);
        }
      }
    }
  ];

  return (
    <BaseBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t('account.settings.account')}
    >
      <View className="space-y-2">
        {/* Password Reset Alert */}
        {passwordResetAlert.show && (
          <Alert 
            variant={passwordResetAlert.type === 'error' ? 'destructive' : 'default'}
            icon={passwordResetAlert.type === 'error' ? XCircle : CheckCircle}
          >
            <AlertTitle>{passwordResetAlert.title}</AlertTitle>
            <AlertDescription>{passwordResetAlert.message}</AlertDescription>
          </Alert>
        )}
        
        {/* Account Options */}
        <View className="space-y-1">
          {accountOptions.map((option) => (
            <Button
              key={option.id}
              variant="ghost"
              size="lg"
              className="justify-start h-12"
              disabled={option.id === 'password' && isSendingPasswordReset}
              onPress={option.onPress}
            >
              <Text className="text-base">{option.title}</Text>
            </Button>
          ))}
        </View>

        {/* Delete Account */}
        <View className="pt-2 border-t border-border">
          <Button
            variant="destructive"
            size="lg"
            className="justify-start h-12"
            onPress={() => setIsDeleteDialogOpen(true)}
          >
            <Text className="text-base">{t('account.deleteAccount')}</Text>
          </Button>
        </View>

        <UpdateNameDialog
          open={isNameDialogOpen}
          onOpenChange={setIsNameDialogOpen}
          currentName={user?.user_metadata?.full_name || user?.user_metadata?.name}
        />
        <UpdateEmailDialog
          open={isEmailDialogOpen}
          onOpenChange={setIsEmailDialogOpen}
          currentEmail={email ?? user?.email}
        />
        <DeleteAccountDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          userId={userId}
          onDeleted={onClose}
        />

      </View>
    </BaseBottomSheet>
  );
}

export default AccountSettingsSheet;
