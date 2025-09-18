import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button, buttonVariants, buttonTextVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/auth';
import { Link, router } from 'expo-router';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { AlertTriangle, Check } from 'lucide-react-native';
import { cn } from '@/lib/utils';

export default function ResetPasswordScreen() {
  const { updatePassword, isLoading, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{type: 'success' | 'error', title: string, message: string} | null>(null);


  // For password reset links, we don't need to check authentication status
  // The Supabase updatePassword method will handle verification of the reset token
  // Users coming from password reset emails will have a special session token
  // that allows them to set a new password without being fully authenticated
  


  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setAlert({
        type: 'error',
        title: t('errors.somethingWentWrong'),
        message: t('errors.passwordMismatch')
      });
      return;
    }

    if (password.length < 6) {
      setAlert({
        type: 'error',
        title: t('errors.somethingWentWrong'),
        message: t('errors.passwordTooShort')
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await updatePassword(password);
      
      if (error) {
        setAlert({
          type: 'error',
          title: t('errors.somethingWentWrong'),
          message: error.message || t('errors.somethingWentWrong')
        });
      } else {
        setAlert({
          type: 'success',
          title: t('ui.success'),
          message: t('auth.passwordResetSuccess')
        });
        // Wait a bit before redirecting to main app
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1000);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setAlert({
        type: 'error',
        title: t('errors.somethingWentWrong'),
        message: t('errors.somethingWentWrong')
      });
    } finally {
      setIsSubmitting(false);
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
            {t('auth.resetPassword') || 'Reset Password'}
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

          <View className="flex flex-col gap-4 mb-6">
            <Input
              placeholder={t('auth.newPassword') || 'New Password'}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            
            <Input
              placeholder={t('auth.confirmPassword') || 'Confirm Password'}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <Button
            onPress={handleResetPassword}
            disabled={!password || !confirmPassword || isSubmitting || isLoading}
            size="lg"
            className="mb-6 flex-row items-center justify-center"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" className="text-primary-foreground" />
            ) : (
              <Text className="text-primary-foreground font-medium">
                {t('auth.resetPassword') || 'Reset Password'}
              </Text>
            )}
          </Button>

          <View className="flex-row justify-center items-center">
            <Text variant="muted">{t('ui.back') || 'Back'}</Text>
            <Link 
              href="/"
              replace
              className="ml-1"
            >
              <Text className={cn(buttonTextVariants({ variant: 'link' }), "font-medium")}>
                Home
              </Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
