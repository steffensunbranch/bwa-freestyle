import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { getRedirectUrl } from '@/lib/linking';
import { Platform } from 'react-native';

export type UpdateEmailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail?: string;
};

const UpdateEmailDialog = ({ open, onOpenChange, currentEmail }: UpdateEmailDialogProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [newEmail, setNewEmail] = useState('');
  const [updateEmailError, setUpdateEmailError] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const displayCurrentEmail = currentEmail ?? user?.email ?? '';

  const reset = () => {
    setNewEmail('');
    setUpdateEmailError('');
    setIsUpdatingEmail(false);
    setStatus('idle');
  };

  const handleOpenChange = (openVal: boolean) => {
    onOpenChange(openVal);
    if (!openVal) reset();
  };

  const handleUpdate = async () => {
    if (newEmail.trim() === '') {
      setUpdateEmailError(t('account.errorEmptyEmail'));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setUpdateEmailError(t('account.errorInvalidEmail'));
      return;
    }

    if (newEmail === displayCurrentEmail) {
      setUpdateEmailError(t('account.errorSameEmail'));
      return;
    }

    setUpdateEmailError('');
    setIsUpdatingEmail(true);
    setStatus('loading');

    try {
      let updateResult;
      
      if (Platform.OS === 'web') {
        // For web, don't specify a redirect URL to avoid localhost issues
        // The user will need to manually navigate to the confirmation page
        updateResult = await supabase.auth.updateUser({ email: newEmail });
      } else {
        // For mobile, use the proper redirect URL
        const redirectUrl = getRedirectUrl('confirm-email-change');
        updateResult = await supabase.auth.updateUser(
          { email: newEmail },
          { emailRedirectTo: redirectUrl }
        );
      }
      
      if (updateResult.error) throw updateResult.error;
      setStatus('success');
    } catch (err: any) {
      console.error('Error updating email:', err?.message ?? err);
      setUpdateEmailError(err?.message || t('account.errorUpdateEmail'));
      setStatus('error');
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="text-xl font-bold text-center text-foreground">
            {t('account.updateEmailTitle')}
          </DialogTitle>
          {status !== 'success' && (
            <DialogDescription className="text-sm text-center text-muted-foreground">
              {t('account.updateEmailDescription')}
            </DialogDescription>
          )}
        </DialogHeader>

        <View className="py-2">
          {status === 'success' ? (
            <View className="items-center">
              <View className="rounded-full bg-success/10 p-3 mb-4">
                <Icon as={Check} size={24} className="text-success" />
              </View>
              <Text className="text-center mb-2 text-foreground">
                {Platform.OS === 'web' ? t('account.updateEmailSuccessWeb') : t('account.updateEmailSuccess')}
              </Text>
              <Button variant="default" className="w-full mt-4" onPress={() => handleOpenChange(false)}>
                <Text className="text-center">{t('ui.close')}</Text>
              </Button>
            </View>
          ) : (
            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-muted-foreground mb-2">{t('account.currentEmail')}</Text>
                <View className="border border-border rounded-md px-3 py-3 bg-muted/30">
                  <Text className="text-foreground">{displayCurrentEmail}</Text>
                </View>
              </View>
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">{t('account.newEmail')}</Text>
                <Input
                  value={newEmail}
                  onChangeText={setNewEmail}
                  placeholder={t('account.enterNewEmail')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="w-full"
                />
                {updateEmailError ? (
                  <Text className="text-sm text-destructive mt-1">{updateEmailError}</Text>
                ) : null}
              </View>
            </View>
          )}
        </View>

        {status !== 'success' && (
          <DialogFooter className="flex-row justify-end space-x-2 pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 mr-1">
                <Text className="text-center">{t('ui.cancel')}</Text>
              </Button>
            </DialogClose>
            <Button
              variant="default"
              onPress={handleUpdate}
              className="flex-1 ml-1"
              disabled={isUpdatingEmail}
            >
              {isUpdatingEmail ? (
                <ActivityIndicator size="small" className="text-primary-foreground" />
              ) : (
                <Text className="text-center">{t('account.updateEmail')}</Text>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateEmailDialog;
