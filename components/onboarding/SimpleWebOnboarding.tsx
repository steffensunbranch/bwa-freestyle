import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, View, useWindowDimensions } from 'react-native';
import { FlashList, ListRenderItem, FlashListRef } from '@shopify/flash-list';
import LottieView from 'lottie-react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SimpleWebOnboardingProps {
  onComplete?: () => void;
}

const DATA = [
  { id: '1', animation: require('../../assets/onboarding/lotties/Car.json') },
  { id: '2', animation: require('../../assets/onboarding/lotties/Coding.json') },
  { id: '3', animation: require('../../assets/onboarding/lotties/Social Media Marketing.json') },
  { id: '4', animation: require('../../assets/onboarding/lotties/Money Transfer.json') },
];

const SimpleWebOnboarding: React.FC<SimpleWebOnboardingProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const listRef = useRef<FlashListRef<(typeof DATA)[number]>>(null);
  const snappingGuardRef = useRef(false);
  const [index, setIndex] = useState(0);

  const pageWidth = width;

  const clampIndex = useCallback((i: number) => {
    return Math.max(0, Math.min(DATA.length - 1, i));
  }, []);

  const computeIndexFromOffset = useCallback(
    (offsetX: number) => clampIndex(Math.round(offsetX / pageWidth)),
    [clampIndex, pageWidth]
  );

  const scrollToIndex = useCallback(
    (i: number, animated = true) => {
      const safe = clampIndex(i);
      try {
        listRef.current?.scrollToIndex({ index: safe, animated });
      } catch (e) {
        listRef.current?.scrollToOffset({ offset: safe * pageWidth, animated });
      }
    },
    [clampIndex, pageWidth]
  );

  const snapToNearest = useCallback(
    (offsetX: number) => {
      const next = computeIndexFromOffset(offsetX);
      if (next !== index) setIndex(next);
      if (snappingGuardRef.current) return;
      snappingGuardRef.current = true;
      scrollToIndex(next, true);
      setTimeout(() => {
        snappingGuardRef.current = false;
      }, 250);
    },
    [computeIndexFromOffset, index, scrollToIndex]
  );

  const renderItem: ListRenderItem<(typeof DATA)[number]> = useCallback(
    ({ item }) => {
      const BOX = Math.min(width * 0.6, 300);
      return (
        <View
          className="justify-center items-center px-6"
          style={{
            width: pageWidth,
            height: '100%',
            ...(Platform.OS === 'web'
              ? ({ scrollSnapAlign: 'center' } as any)
              : null),
          }}
        >
          <View
            className="items-center justify-center mb-12"
            style={{ width: BOX, height: BOX, pointerEvents: 'none' }}
          >
            <LottieView
              source={item.animation}
              autoPlay
              loop
              resizeMode="contain"
              style={{ width: '100%', height: '100%' }}
              webStyle={{ width: '100%', height: '100%', display: 'block' }}
              renderMode="SOFTWARE"
            />
          </View>

          <View className="items-center mb-12">
            <Text variant="h2" className="text-center border-0 mb-4">
              {t(`onboarding.slide${item.id}.title`)}
            </Text>
            <Text variant="lead" className="text-center px-6">
              {t(`onboarding.slide${item.id}.description`)}
            </Text>
          </View>
        </View>
      );
    },
    [pageWidth, t, width]
  );

  const getItemType = useCallback((_: (typeof DATA)[number]) => 'page', []);

  const contentContainerStyle = useMemo(() => {
    if (Platform.OS !== 'web') return undefined;
    return undefined; // removed unsupported props, FlashList only allows padding/bgColor
  }, []);

  const handleNext = useCallback(() => {
    if (index < DATA.length - 1) {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      scrollToIndex(nextIndex);
    } else {
      onComplete?.();
    }
  }, [index, onComplete, scrollToIndex]);

  const handleSkip = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  return (
    <View 
      className="flex-1 bg-background"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <View className="items-end px-6 py-4">
        {index < DATA.length - 1 && (
          <Button variant="ghost" size="sm" onPress={handleSkip}>
            <Text className="text-primary font-medium">{t('onboarding.skip')}</Text>
          </Button>
        )}
      </View>

      <View className="flex-1">
        <FlashList
          ref={listRef}
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          getItemType={getItemType}
          overrideItemLayout={(layout) => { layout.span = pageWidth; }}
          onScrollEndDrag={(e) => snapToNearest(e.nativeEvent.contentOffset.x)}
          onMomentumScrollEnd={(e) => snapToNearest(e.nativeEvent.contentOffset.x)}
          scrollEventThrottle={16}
          decelerationRate={Platform.OS === 'ios' ? 'fast' : undefined}
          contentContainerStyle={contentContainerStyle}
        />
      </View>

      <View className="flex-row justify-center mb-4">
        {DATA.map((_, i) => (
          <View
            key={i}
            className={`h-2 rounded-full mx-1 ${i === index ? 'w-8 bg-primary' : 'w-2.5 bg-muted'}`}
          />)
        )}
      </View>

      <View className="px-6 pb-6">
        <Button size="lg" className="w-full" onPress={handleNext}>
          <Text className="text-lg font-semibold">
            {index === DATA.length - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default SimpleWebOnboarding;
