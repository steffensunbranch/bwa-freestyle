import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
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
import { useTranslation } from '@/lib/i18n/useTranslation';
import { router } from 'expo-router';

export interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
  onDeleted?: () => void;
}

export default function DeleteAccountDialog({
  open,
  onOpenChange,
  userId,
  onDeleted,
}: DeleteAccountDialogProps) {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: ACCOUNT DELETION - App Store Requirement
      // Apple App Store and Google Play Store require apps to provide account deletion functionality
      // if they allow account creation. This is mandatory for app approval.
      // 
      // Implementation with Supabase:
      // 1. Delete user data from your custom tables first:
      //    const { error: dataError } = await supabase
      //      .from('user_profiles') // or your custom tables
      //      .delete()
      //      .eq('user_id', userId);
      // 
      // 2. Then delete the auth user (this also deletes from auth.users):
      //    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      // 
      // Note: You'll need to call this from a server/edge function with service role key,
      // as client-side code cannot delete users directly for security reasons.
      // 
      // Alternative: Create a Supabase Edge Function or API endpoint that:
      // - Verifies the user's identity
      // - Deletes all user data
      // - Deletes the auth user
      // - Returns success/error status

      // After successful deletion, sign out the user
      await signOut();

      // Close the dialog
      onOpenChange(false);

      // Notify parent and navigate to login
      onDeleted?.();
      router.replace('./login');
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="text-xl font-bold text-center text-foreground">
            {t('account.deleteAccountConfirmTitle')}
          </DialogTitle>
          <DialogDescription className="text-sm text-center text-muted-foreground">
            {t('account.deleteAccountConfirmMessage')}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-row justify-end space-x-2 pt-2">
          <DialogClose asChild>
            <Button 
              variant="outline" 
              className="flex-1 mr-1"
              disabled={isDeleting}
            >
              <Text className="text-center">{t('ui.cancel')}</Text>
            </Button>
          </DialogClose>
          <Button 
            variant="destructive"
            onPress={handleDeleteAccount}
            className="flex-1 ml-1"
            disabled={isDeleting}
          >
            <Text className="text-center">{isDeleting ? t('ui.loading') : t('account.confirmDelete')}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
