import { useState } from 'react';
import { View } from 'react-native';
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

export type UpdateNameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName?: string;
};

const UpdateNameDialog = ({ open, onOpenChange, currentName }: UpdateNameDialogProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const displayCurrentName = currentName ?? (user?.user_metadata?.full_name || user?.user_metadata?.name || '');

  const reset = () => {
    setNewName('');
    setError('');
    setStatus('idle');
  };

  const handleOpenChange = (openVal: boolean) => {
    onOpenChange(openVal);
    if (!openVal) reset();
  };

  const handleUpdate = async () => {
    const trimmed = newName.trim();
    if (trimmed.length === 0) {
      setError(t('account.errorEmptyName'));
      return;
    }

    if (trimmed === displayCurrentName) {
      setError(t('account.errorSameName'));
      return;
    }

    setError('');
    setStatus('loading');

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: trimmed },
      });
      if (updateError) throw updateError;
      setStatus('success');
    } catch (err: any) {
      console.error('Error updating name:', err?.message ?? err);
      setError(err?.message || t('account.errorUpdateName'));
      setStatus('error');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="text-xl font-bold text-center text-foreground">
            {t('account.updateNameTitle')}
          </DialogTitle>
          {status !== 'success' && (
            <DialogDescription className="text-sm text-center text-muted-foreground">
              {t('account.updateNameDescription')}
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
                {t('account.updateNameSuccess')}
              </Text>
              <Button variant="default" className="w-full mt-4" onPress={() => handleOpenChange(false)}>
                <Text className="text-center">{t('ui.close')}</Text>
              </Button>
            </View>
          ) : (
            <View className="space-y-6">
              {displayCurrentName && (
                <View>
                  <Text className="text-sm font-medium text-muted-foreground mb-2">{t('account.currentName')}</Text>
                  <View className="border border-border rounded-md px-3 py-3 bg-muted/30">
                    <Text className="text-foreground">
                      {displayCurrentName}
                    </Text>
                  </View>
                </View>
              )}
              <View>
                <Text className="text-sm font-medium text-foreground mb-2">
                  {displayCurrentName ? t('account.newName') : t('account.enterNewName')}
                </Text>
                <Input
                  value={newName}
                  onChangeText={setNewName}
                  placeholder={displayCurrentName ? t('account.enterNewName') : t('account.enterNewName')}
                  autoCapitalize="words"
                  className="w-full"
                />
                {error ? <Text className="text-sm text-destructive mt-1">{error}</Text> : null}
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
            <Button variant="default" onPress={handleUpdate} className="flex-1 ml-1">
              <Text className="text-center">{t('account.updateName')}</Text>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateNameDialog;
