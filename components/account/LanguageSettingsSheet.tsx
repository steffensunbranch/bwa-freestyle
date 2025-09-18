import React from 'react';
import { View } from 'react-native';
import { useTranslation } from '@/lib/i18n/useTranslation';
import BaseBottomSheet from './BaseBottomSheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';

interface LanguageSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguageSettingsSheet({
  isOpen,
  onClose
}: LanguageSettingsSheetProps) {
  const { t, currentLanguage, changeLanguage } = useTranslation();

  // Available languages with native names
  const availableLanguages = [
    { code: 'en', name: t('languages.en'), nativeName: 'English' },
    { code: 'fr', name: t('languages.fr'), nativeName: 'Français' },
    // Add more languages as needed
  ];
  

  const handleLanguageChange = async (value: string) => {
    await changeLanguage(value);
  };

  return (
    <BaseBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t('account.settings.language')}
    >
      <RadioGroup 
        value={currentLanguage || 'en'}
        onValueChange={handleLanguageChange}
      >
        {availableLanguages.map((lang) => (
          <View key={lang.code} className="flex flex-row items-center justify-between p-4 rounded-xl bg-card">
            <Label htmlFor={`r-${lang.code}`}>
              <View>
                <Text>{lang.nativeName}</Text>
                {lang.code !== currentLanguage && (
                  <Text className="text-muted-foreground text-sm">
                    {t(`languages.${lang.code}`)}
                  </Text>
                )}
              </View>
            </Label>
            <RadioGroupItem 
              value={lang.code} 
              id={`r-${lang.code}`}
            />
          </View>
        ))}
      </RadioGroup>
    </BaseBottomSheet>
  );
}

export default LanguageSettingsSheet;
