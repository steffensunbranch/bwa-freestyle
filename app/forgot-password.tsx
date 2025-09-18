import React, { useState, useEffect } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View, Keyboard } from 'react-native';
import { Button, buttonVariants, buttonTextVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/auth';
import { Link, useLocalSearchParams } from 'expo-router';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { AlertTriangle, Check } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const { signInWithMagicLink, resetPassword } = useAuth();
  const { t } = useTranslation();
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{type: 'success' | 'error', title: string, message: string} | null>(null);


  // Pre-fill email if passed as parameter
  useEffect(() => {
    if (emailParam && typeof emailParam === 'string') {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleSendLink = async () => {
    if (!email.trim()) {
      setAlert({
        type: 'error',
        title: t('errors.somethingWentWrong'),
        message: t('errors.required')
      });
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    setAlert(null);
    
    try {
      // Default action: Send magic link (passwordless login)
      const { error } = await signInWithMagicLink(email);
      
      if (error) {
        setAlert({
          type: 'error',
          title: t('errors.somethingWentWrong'),
          message: error.message || t('errors.somethingWentWrong')
        });
      } else {
        setAlert({
          type: 'success',
                  title: t('auth.emailSent'),
        message: t('auth.magicLinkSent')
        });
      }
    } catch (error) {
      console.error('Error sending magic link:', error);
      setAlert({
        type: 'error',
        title: t('errors.somethingWentWrong'),
        message: t('errors.somethingWentWrong')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setAlert({
        type: 'error',
        title: t('errors.somethingWentWrong'),
        message: t('errors.required')
      });
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    setAlert(null);
    
    try {
      console.log('🔐 Attempting password reset for:', email);
      const { error } = await resetPassword(email);
      console.log('🔐 Password reset result:', { error: error?.message });
      
      if (error) {
        console.log('🔐 Password reset error:', error);
        setAlert({
          type: 'error',
          title: t('errors.somethingWentWrong'),
          message: error.message || t('errors.somethingWentWrong')
        });
      } else {
        console.log('🔐 Password reset successful!');
        setAlert({
          type: 'success',
          title: t('auth.emailSent'),
          message: t('auth.resetPasswordSent')
        });
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setAlert({
        type: 'error',
        title: t('errors.somethingWentWrong'),
        message: t('auth.resetPasswordError')
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView 
        className="flex-1 p-4" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 justify-center">
          <Text className="text-3xl font-bold text-center mb-8">
            {t('auth.getBackIn')}
          </Text>

          {alert && (
            <Alert
              variant={alert.type === 'error' ? 'destructive' : 'default'}
              icon={alert.type === 'error' ? AlertTriangle : Check}
              className="mb-6"
            >
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          <View className="mb-6">
            <Input
              placeholder={t('auth.email')}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoFocus
            />
          </View>
          
          {/* Primary Action - Password Reset */}
          <Button
            onPress={handleResetPassword}
            disabled={isLoading}
            size="lg"
            className="mb-4 flex-row items-center justify-center"
          >
            {isLoading ? (
              <ActivityIndicator size="small" className="text-primary-foreground" />
            ) : (
              <Text className="text-primary-foreground font-medium">
                {t('auth.resetMyPassword')}
              </Text>
            )}
          </Button>
          
          {/* Secondary Action - Magic Link */}
          <Button
            variant="outline"
            onPress={handleSendLink}
            disabled={isLoading}
            size="lg"
            className="mb-6 flex-row items-center justify-center"
          >
            {isLoading ? (
              <ActivityIndicator size="small" className="text-foreground" />
            ) : (
              <Text className="text-foreground font-medium">
                {t('auth.sendLoginLinkInstead')}
              </Text>
            )}
          </Button>

          <View className="flex-row justify-center items-center">
            <Text variant="muted">{t('auth.rememberPassword')}</Text>
            <Link 
              href="/login" 
              replace
              className="ml-1"
            >
              <Text className="text-primary font-medium">{t('auth.login')}</Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
