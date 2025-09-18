import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Check, AlertTriangle, Info } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function ConfirmEmailChange() {
  const { t } = useTranslation();
  const router = useRouter();
  const { type, token, email_change_token_new, email_change_token_current } = useLocalSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'info'>('loading');
  const [message, setMessage] = useState('');
  const { user, session } = useAuth();

  useEffect(() => {
    const processToken = async () => {
      try {
        // Check what type of email change token we have
        const currentEmailToken = token || email_change_token_current;
        const newEmailToken = email_change_token_new;
        
        // For the "current" email token (first email confirmation)
        if (currentEmailToken) {
          setStatus('info');
                  setMessage(t('account.emailChange.currentEmailConfirmed'));
          return;
        }
        
        // For the "new" email token (second email confirmation)
        if (newEmailToken) {
          // Supabase handles the token verification and email change confirmation
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: newEmailToken as string,
            type: 'email_change',
          });

          if (error) {
            throw error;
          }

          setStatus('success');
          setMessage(t('account.emailChange.success'));
          return;
        }
        
        // If no tokens are found
        setStatus('error');
        setMessage(t('account.emailChange.invalidToken'));
      } catch (error: any) {
        console.error('Error confirming email change:', error.message);
        setStatus('error');
        setMessage(error.message || t('account.emailChange.error'));
      }
    };

    processToken();
  }, [token, email_change_token_new, t]);

  return (
    <View className="flex-1 justify-center items-center p-4 bg-background">
      <View className="w-full max-w-md p-6 bg-card rounded-lg shadow-sm border border-border">
        <View className="items-center mb-6">
          {status === 'loading' ? (
            <ActivityIndicator size="large" className="mb-4" />
          ) : status === 'success' ? (
            <View className="rounded-full bg-success/10 p-3 mb-4">
              <Icon as={Check} size={32} className="text-success" />
            </View>
          ) : status === 'info' ? (
            <View className="rounded-full bg-primary/10 p-3 mb-4">
              <Icon as={Info} size={32} className="text-primary" />
            </View>
          ) : (
            <View className="rounded-full bg-destructive/10 p-3 mb-4">
              <Icon as={AlertTriangle} size={32} className="text-destructive" />
            </View>
          )}
          
          <Text className="text-2xl font-bold text-center">
                    {status === 'loading' 
          ? t('account.emailChange.processing')
          : status === 'success' 
          ? t('account.emailChange.confirmed')
          : status === 'info'
          ? t('account.emailChange.partialConfirmation')
          : t('account.emailChange.failed')}
          </Text>
          
          {message && (
            <Text className="text-center text-muted-foreground mt-2">
              {message}
            </Text>
          )}
        </View>
        
        {status !== 'loading' && (
          <Button 
            onPress={() => router.replace('/')}
            className="w-full"
          >
            <Text>{t('ui.continue')}</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
