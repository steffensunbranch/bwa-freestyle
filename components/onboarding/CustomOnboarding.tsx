import React, { useRef, useEffect } from 'react';
import { View, useWindowDimensions, Platform } from 'react-native';
// @ts-ignore - react-native-onboarding-swiper doesn't have TypeScript declarations
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SimpleWebOnboarding from './SimpleWebOnboarding';

interface CustomOnboardingProps {
  onComplete?: () => void;
}

// Custom Dot Component
const Square = ({ selected }: { selected: boolean }) => {
  return (
    <View
      className={`rounded-full mx-1 ${
        selected 
          ? 'w-8 h-2 bg-primary' 
          : 'w-2 h-2 bg-muted-foreground/30'
      }`}
    />
  );
};

// Custom Button Components using proper variants
const Done = ({ ...props }: { [key: string]: any }) => {
  const { t } = useTranslation();
  return (
    <Button
      onPress={props.onPress}
      variant="default"
      size="default"
      className="mx-2 w-28"
    >
      <Text variant="small">{t('onboarding.getStarted')}</Text>
    </Button>
  );
};

const Skip = ({ skipLabel, ...props }: { skipLabel: string; [key: string]: any }) => {
  return (
    <Button
      onPress={props.onPress}
      variant="outline"
      size="default"
      className="mx-2 w-20"
    >
      <Text variant="small">{skipLabel}</Text>
    </Button>
  );
};

const Next = ({ nextLabel, ...props }: { nextLabel: string; [key: string]: any }) => {
  return (
    <Button
      onPress={props.onPress}
      variant="default"
      size="default"
      className="mx-2 w-20"
    >
      <Text variant="small">{nextLabel}</Text>
    </Button>
  );
};

// Lottie Animation Component with proper web support
const LottieAnimation: React.FC<{ source: any; size: number }> = ({ source, size }) => {
  return (
    <LottieView
      source={source}
      autoPlay={true}
      loop={true}
      resizeMode="contain"
      style={{ width: size, height: size }}
      webStyle={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'block',
      }}
      renderMode="SOFTWARE"
      onAnimationFailure={(error) => {
        console.warn('Animation failed:', error);
      }}
    />
  );
};

const CustomOnboarding: React.FC<CustomOnboardingProps> = ({ onComplete }) => {
  // Use simple web version for web, native swiper for mobile
  if (Platform.OS === 'web') {
    return <SimpleWebOnboarding onComplete={onComplete} />;
  }

  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Calculate animation container size - larger for more impact
  const BOX = Math.min(width * 0.8, 400);

  // Animation data mapping
  const animationData = [
    require('../../assets/onboarding/lotties/Car.json'),
    require('../../assets/onboarding/lotties/Coding.json'),
    require('../../assets/onboarding/lotties/Social Media Marketing.json'),
    require('../../assets/onboarding/lotties/Money Transfer.json'),
  ];

  const pages = animationData.map((animation, index) => ({
    image: (
      <View 
        className="items-center justify-center mb-4"
        style={{ width: BOX, height: BOX }}
      >
        <LottieAnimation source={animation} size={BOX} />
      </View>
    ),
    title: (
      <Text variant="h2" className="text-center border-0 px-6">
        {t(`onboarding.slide${index + 1}.title`)}
      </Text>
    ),
    subtitle: (
      <Text variant="lead" className="text-center px-6">
        {t(`onboarding.slide${index + 1}.description`)}
      </Text>
    ),
  }));

  return (
    <View 
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Onboarding
        pages={pages}
        onDone={onComplete}
        onSkip={onComplete}
        DotComponent={Square}
        NextButtonComponent={Next}
        SkipButtonComponent={Skip}
        DoneButtonComponent={Done}
        skipLabel={t('onboarding.skip')}
        nextLabel={t('onboarding.next')}
        controlStatusBar={false}
      />
    </View>
  );
};

export default CustomOnboarding;
