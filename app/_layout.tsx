import '@/global.css';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import '@/lib/i18n/i18n';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Text } from '@/components/ui/text';
import { useLocalNotification } from '@/lib/notifications/useNotification';
import { useOnboardingStatus } from '@/lib/hooks/use-onboarding-status';
import { useAuthDeepLink } from '@/lib/hooks/use-auth-deep-link';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <AppLayout />
              <PortalHost />
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}


export function AppLayout() {
  const { session, isLoading: authLoading } = useAuth();
  const { isOnboardingCompleted, isLoading: onboardingLoading } = useOnboardingStatus();
  const isLoggedIn = !!session;

  // Initialize local notifications
  useLocalNotification();

  // Handle auth deep links from email links
  useAuthDeepLink();


  // Show loading screen only during initial app load, not during auth operations
  if (authLoading || onboardingLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitle(props) {
          return (
            <Text className="ios:font-medium android:mt-1.5 text-xl">
              {props.children}
            </Text>
          );
        },
      }}>
      {/* Onboarding route (only shown if not completed) */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
      </Stack.Protected>

      {/* Auth routes (accessible when logged out) */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Protected routes (only accessible when logged in) */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Special auth routes (accessible both when logged in or out) */}
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
      <Stack.Screen name="confirm-email-change" options={{ headerShown: false }} />
    </Stack>
  );
}

