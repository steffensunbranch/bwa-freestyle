import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TabHomeScreen() { 
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-background px-4 py-2">
      <View className="flex-1 justify-center">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('tabs.home')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="mb-4">
              {t('tabs.homeWelcome')}
            </Text>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
