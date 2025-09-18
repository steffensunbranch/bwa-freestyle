import React, { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CustomOnboarding from '@/components/onboarding/CustomOnboarding';

const ONBOARDING_KEY = 'onboarding_completed';

async function markOnboardingComplete() {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (e) {
    console.error('Failed to set onboarding status', e);
  }
}

export default function OnboardingScreen() {
  const router = useRouter();

  const handleOnboardingComplete = useCallback(async () => {
    await markOnboardingComplete();
    router.replace('/login');
  }, [router]);

  return <CustomOnboarding onComplete={handleOnboardingComplete} />;
}


