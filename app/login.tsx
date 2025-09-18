import { View, ActivityIndicator, Keyboard, Platform } from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useAuthError } from '@/lib/auth/useAuthError';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { KeyboardAvoidingView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants, buttonTextVariants } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Check } from 'lucide-react-native';
import { Link, Href } from 'expo-router';
import { cn } from '@/lib/utils';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { alertMessage, handleAuthError, clearMessage } = useAuthError();
  
  const {
    signIn,
    isLoading
  } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async () => {
    if (!email || !password) {
      handleAuthError(t('errors.required'));
      return;
    }

    Keyboard.dismiss();
    // Don't clear message here - let the error handling set it
    // clearMessage();

    console.log('🔐 Attempting login with:', { email, password: '***' });
    const { error } = await signIn(email, password);
    console.log('🔐 Login result:', { error: error?.message });

    if (error) {
      console.log('🔐 Login error:', error);
      // Handle both string errors and error objects
      const errorMessage = typeof error === 'string' ? error : error.message || t('errors.somethingWentWrong');
      handleAuthError(errorMessage);
    } else {
      console.log('🔐 Login successful!');
    }
  };

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView className="flex-1 p-4" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="flex-1 justify-center">
          <Text className="text-3xl font-bold text-center mb-8">{t('auth.login')}</Text>

          {alertMessage && (
            <Alert
              variant={alertMessage.type === 'error' ? 'destructive' : 'default'}
              icon={alertMessage.type === 'error' ? AlertTriangle : Check}
              className="mb-6"
            >
              <AlertTitle>{alertMessage.title}</AlertTitle>
              <AlertDescription>{alertMessage.message}</AlertDescription>
            </Alert>
          )}

          <View className="mb-6">
            {/* Input Fields */}
            <View className="flex flex-col gap-4 mb-4">
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder={t('auth.email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                value={password}
                onChangeText={setPassword}
                placeholder={t('auth.password')}
                secureTextEntry
              />
            </View>

            {/* Helper Links */}
            <View className="items-end">
              <Link
                href={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}` as any}
                className={cn(buttonVariants({ variant: 'link' }), "p-0")}
              >
                <Text className={cn(buttonTextVariants({ variant: 'link' }), "text-sm")}>
                  {t('auth.forgotPassword')}
                </Text>
              </Link>
            </View>
          </View>

          <Button
            onPress={handleLogin}
            disabled={isLoading}
            size="lg"
            className="mb-4 flex-row items-center justify-center"
          >
            {isLoading ? (
              <ActivityIndicator size="small" className="text-primary-foreground" />
            ) : (
              <>
                <Text className="text-primary-foreground">{t('auth.login')}</Text>
              </>
            )}
          </Button>


          <View className="flex-row justify-center items-center">
            <Text variant="muted">{t('auth.dontHaveAccount')}</Text>
            <Link
              href={`/register${email ? `?email=${encodeURIComponent(email)}` : ''}` as Href}
              className="ml-1"
            >
              <Text className={cn(buttonTextVariants({ variant: 'link' }), "font-medium")}>
                {t('auth.register')}
              </Text>
            </Link>
          </View>

        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
