import React, { useState, useEffect } from 'react';
import { View, Platform, Alert as RNAlert, Linking } from 'react-native';
import { Text } from '@/components/ui/text';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useLocalNotification } from '@/lib/notifications/useNotification';
import { Link } from 'expo-router';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react-native';
import BaseBottomSheet from './BaseBottomSheet';

interface NotificationsSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsSettingsSheet({
  isOpen,
  onClose
}: NotificationsSettingsSheetProps) {
  const { t } = useTranslation();
  // Local notifications work on both platforms
  const isDemoEnabled = true;
  
  
  /**
   * Open device settings for the app
   */
  const openDeviceSettings = async () => {
    try {
      if (Platform.OS === 'ios') {
        // On iOS, open app-specific settings
        await Linking.openURL('app-settings:');
      } else {
        // On Android, open app settings
        await Linking.openSettings();
      }
    } catch (error) {
      console.error('Error opening device settings:', error);
      // Fallback: just show a message
      RNAlert.alert(
        t('notifications.settings.settingsError'),
        t('notifications.settings.settingsErrorDesc')
      );
    }
  };
  
  /**
   * Handle local notification toggle - always opens device settings
   */
  const onTogglePush = () => {
    RNAlert.alert(
      t('notifications.settings.manageNotifications'),
      t('notifications.settings.manageNotificationsDesc'),
      [
        { text: t('ui.cancel'), style: 'cancel' },
        { text: t('notifications.settings.openSettings'), onPress: openDeviceSettings }
      ]
    );
  };

  return (
    <BaseBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t('account.settings.notifications')}
    >
      <View className="space-y-3">
        <View className="p-4 rounded-xl bg-card">
          <Text className="text-sm text-muted-foreground">
            {t('notifications.settings.pushNotifications')} - {t('notifications.enableFirst')}
          </Text>
        </View>
          
        
      </View>
    </BaseBottomSheet>
  );
}

export default NotificationsSettingsSheet;
