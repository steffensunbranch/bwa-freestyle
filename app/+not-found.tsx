import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: t('errors.notFoundTitle') }} />
      <View>
        <Text>{t('errors.pageNotFound')}</Text>

        <Link href="/">
          <Text>{t('ui.goToHome')}</Text>
        </Link>
      </View>
    </>
  );
}
