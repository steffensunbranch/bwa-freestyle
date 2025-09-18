import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Href, Link } from 'expo-router';
import BaseBottomSheet from './BaseBottomSheet';
import { TERMS_OF_SERVICE_URL, PRIVACY_POLICY_URL } from '@/lib/config';

interface LegalSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LegalSettingsSheet({
  isOpen,
  onClose
}: LegalSettingsSheetProps) {
  const { t } = useTranslation();

  return (
    <BaseBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t('account.settings.legal')}
    >
        <View className="space-y-3">
          <Link href={PRIVACY_POLICY_URL as Href} className="p-4 rounded-xl bg-card">
            <Text>{t('legal.privacyPolicy')}</Text>
          </Link>
          <Link href={TERMS_OF_SERVICE_URL as Href} className="p-4 rounded-xl bg-card">
            <Text>{t('legal.termsOfService')}</Text>
          </Link>
        </View>
    </BaseBottomSheet>
  );
}

export default LegalSettingsSheet;
