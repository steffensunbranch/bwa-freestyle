import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Icon } from '@/components/ui/icon';
import { MoonStar, Sun, Smartphone } from 'lucide-react-native';
import BaseBottomSheet from './BaseBottomSheet';
import { useColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface AppearanceSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}


const THEME_PREFERENCE_KEY = 'theme_preference';

export function AppearanceSettingsSheet({
  isOpen,
  onClose
}: AppearanceSettingsSheetProps) {
  const { t } = useTranslation();
  const { setColorScheme } = useColorScheme();
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedPreference && ['light', 'dark', 'system'].includes(savedPreference)) {
          setSelectedTheme(savedPreference as 'light' | 'dark' | 'system');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);

  const handleThemeChange = async (value: string) => {
    const newTheme = value as 'light' | 'dark' | 'system';
    setSelectedTheme(newTheme);
    setColorScheme(newTheme);
    
    // Save preference to AsyncStorage
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  return (
    <BaseBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t('account.settings.appearance')}
    >
      <View className="space-y-3">
        <RadioGroup
          value={selectedTheme}
          onValueChange={handleThemeChange}
        >
          <View className="flex flex-row items-center justify-between p-4 rounded-xl bg-card">
            <Label htmlFor="theme-system">
              <View className="flex flex-row items-center gap-2">
                <Icon as={Smartphone} size={18} />
                <Text>{t('settings.systemDefault')}</Text>
              </View>
            </Label>
            <RadioGroupItem value="system" id="theme-system" />
          </View>

          <View className="flex flex-row items-center justify-between p-4 rounded-xl bg-card">
            <Label htmlFor="theme-light">
              <View className="flex flex-row items-center gap-2">
                <Icon as={Sun} size={18} />
                <Text>{t('settings.lightMode')}</Text>
              </View>
            </Label>
            <RadioGroupItem value="light" id="theme-light" />
          </View>

          <View className="flex flex-row items-center justify-between p-4 rounded-xl bg-card">
            <Label htmlFor="theme-dark">
              <View className="flex flex-row items-center gap-2">
                <Icon as={MoonStar} size={18} />
                <Text>{t('settings.darkMode')}</Text>
              </View>
            </Label>
            <RadioGroupItem value="dark" id="theme-dark" />
          </View>
        </RadioGroup>
      </View>
    </BaseBottomSheet>
  );
}

export default AppearanceSettingsSheet;
