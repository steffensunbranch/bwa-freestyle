import { View, ActivityIndicator, Keyboard, Platform, Linking } from 'react-native';
import { useState, useEffect } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { useAuthError } from '@/lib/auth/useAuthError';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { KeyboardAvoidingView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants, buttonTextVariants } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Check } from 'lucide-react-native';
import { cn } from '@/lib/utils';
import { TERMS_OF_SERVICE_URL, PRIVACY_POLICY_URL } from '@/lib/config';

export default function RegisterScreen() {
  const { email: emailParam } = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { alertMessage, handleAuthError, handleAuthSuccess, clearMessage } = useAuthError();
  const { 
    signUp,
    isLoading 
  } = useAuth();
  const { t } = useTranslation();

  // Pre-fill email if passed as parameter
  useEffect(() => {
    if (emailParam && typeof emailParam === 'string') {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleRegister = async () => {
    if (!email || !password) {
      handleAuthError(t('errors.required'));
      return;
    }
    

    Keyboard.dismiss();
    clearMessage();

    const { data, error } = await signUp(email, password);
    
    if (error) {
      handleAuthError(error.message || t('errors.somethingWentWrong'));
    } else if (data) {
      // Registration successful - show verification email message
      handleAuthSuccess(t('auth.verificationEmailSent'));
    }
  };

  return (
    <View className="flex-1 bg-background">
      <KeyboardAvoidingView className="flex-1 p-4" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="flex-1 justify-center">
          <Text className="text-3xl font-bold text-center mb-8">{t('auth.createAccount')}</Text>
          
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
          
          <View className="flex flex-col gap-4 mb-6">
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder={`${t('auth.email')} *`}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder={`${t('auth.password')} *`}
              secureTextEntry
            />
          </View>

          <Button
            onPress={handleRegister}
            disabled={isLoading}
            size="lg"
            className="mb-4 flex-row items-center justify-center"
          >
            {isLoading ? (
              <ActivityIndicator size="small" className="text-primary-foreground" />
            ) : (
              <>
                <Text className="text-primary-foreground">{t('auth.createAccount')}</Text>
              </>
            )}
          </Button>
          
          {/* Legal agreement text */}
          <View className="mb-6">
            <Text className="text-sm text-muted-foreground">
              {t('legal.agreeToTerms')}{' '}
              <Link href={TERMS_OF_SERVICE_URL} className={cn(buttonVariants({ variant: 'link' }), "inline p-0")}>
                <Text className={cn(buttonTextVariants({ variant: 'link' }), "text-sm")}>
                  {t('legal.termsOfService')}
                </Text>
              </Link>
              {' '}{t('legal.and')}{' '}
              <Link href={PRIVACY_POLICY_URL} className={cn(buttonVariants({ variant: 'link' }), "inline p-0")}>
                <Text className={cn(buttonTextVariants({ variant: 'link' }), "text-sm")}>
                  {t('legal.privacyPolicy')}
                </Text>
              </Link>
            </Text>
          </View>
          

          <View className="flex-row justify-center items-center">
            <Text variant="muted">{t('auth.alreadyHaveAccount')}</Text>
            <Link 
              href="/login" 
              replace
              className="ml-1">
              <Text className="text-primary font-medium">{t('auth.login')}</Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
