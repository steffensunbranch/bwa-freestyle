import { View } from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Stack } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Icon } from '@/components/ui/icon';
import { AlertTriangle, RefreshCw, Languages, Bell, ChevronRight, MoonStar, User, Info, LogOut } from 'lucide-react-native';
import { UserAvatar } from '@/components/user-avatar';
import { useUserName } from '@/lib/hooks/use-user-name';
import { Button } from '@/components/ui/button';
import LegalSettingsSheet from '@/components/account/LegalSettingsSheet';
import AccountSettingsSheet from '@/components/account/AccountSettingsSheet';
import NotificationsSettingsSheet from '@/components/account/NotificationsSettingsSheet';
import AppearanceSettingsSheet from '@/components/account/AppearanceSettingsSheet';
import LanguageSettingsSheet from '@/components/account/LanguageSettingsSheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


export default function AccountScreen() {
  const { session, signOut } = useAuth();
  const { t } = useTranslation();
  const userName = useUserName();

  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', title: string, message: string } | null>(null);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [showLegalSheet, setShowLegalSheet] = useState(false);
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [showNotificationsSheet, setShowNotificationsSheet] = useState(false);
  const [showAppearanceSheet, setShowAppearanceSheet] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);

  // Settings list options
  const settingsOptions = [
    {
      id: 'account',
      icon: <Icon as={User} size={20} />,
      title: t('account.settings.account'),
      onPress: () => setShowAccountSheet(true)
    },
    {
      id: 'notifications',
      icon: <Icon as={Bell} size={20} />,
      title: t('account.settings.notifications'),
      onPress: () => setShowNotificationsSheet(true)
    },
    {
      id: 'appearance',
      icon: <Icon as={MoonStar} size={20} />,
      title: t('account.settings.appearance'),
      onPress: () => setShowAppearanceSheet(true)
    },
    {
      id: 'language',
      icon: <Icon as={Languages} size={20} />,
      title: t('account.settings.language'),
      onPress: () => setShowLanguageSheet(true)
    },
    {
      id: 'legal',
      icon: <Icon as={Info} size={20} />,
      title: t('account.settings.legal'),
      onPress: () => setShowLegalSheet(true)
    },
  ];

  // Handle sign out
  const handleSignOut = async () => {
    try {
      console.log('Proceeding with sign out');
      const { error } = await signOut();
      if (error) {
        setAlertMessage({
          type: 'error',
          title: t('errors.signOutFailed'),
          message: `${t('errors.failedToSignOut')}: ${error?.message || t('errors.unexpectedError')}`
        });
      }
    } catch (error) {
      console.error('Error during sign out process:', error);
      setAlertMessage({
        type: 'error',
        title: t('errors.signOutFailed'),
        message: t('errors.unexpectedError')
      });
    }
  };



  return (
    <View className="flex-1 bg-background">
      {alertMessage && (
        <Alert
          variant={alertMessage.type === 'error' ? 'destructive' : 'default'}
          icon={alertMessage.type === 'error' ? AlertTriangle : RefreshCw}
          className="mx-4 mt-4"
        >
          <AlertTitle>{alertMessage.title}</AlertTitle>
          <AlertDescription>{alertMessage.message}</AlertDescription>
        </Alert>
      )}

      <View className="flex-1 px-4 py-2">
        {/* Header Section */}
        <View className="flex items-center justify-center flex-[0.35]">
          <View className="mb-3" style={{ width: 96, height: 96 }}>
            <UserAvatar className="h-full w-full" />
          </View>
          <Text variant="h2" className="text-center">{userName || t('ui.user')}</Text>
        </View>

        {/* Settings List */}
        <View className="flex-1 justify-center">
          {settingsOptions.map((option) => (
            <Button
              key={option.id}
              variant="ghost"
              size="lg"
              onPress={option.onPress}
              className="justify-start h-16 mb-3"
            >
              {option.icon}
              <Text variant="large" className="ml-3">{option.title}</Text>
            </Button>
          ))}
        </View>

        {/* Sign Out Button */}
        <View className="justify-end flex-[0.15]">
          <Button
            variant="destructive"
            size="lg"
            onPress={() => setShowSignOutDialog(true)}
            className="justify-start h-16"
          >
            <Icon as={LogOut} size={20} />
            <Text variant="large" className="ml-3">{t('auth.signOut')}</Text>
          </Button>
        </View>
      </View>

      {/* Sign Out Confirmation Dialog */}
      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('auth.signOut')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('auth.signOutConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>{t('ui.cancel')}</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onPress={handleSignOut}
            >
              <Text className="text-destructive-foreground">{t('auth.signOut')}</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bottom Sheets */}
      <LegalSettingsSheet
        isOpen={showLegalSheet}
        onClose={() => setShowLegalSheet(false)}
      />

      <AccountSettingsSheet
        isOpen={showAccountSheet}
        onClose={() => setShowAccountSheet(false)}
        email={session?.user?.email}
        userId={session?.user?.id}
      />

      <NotificationsSettingsSheet
        isOpen={showNotificationsSheet}
        onClose={() => setShowNotificationsSheet(false)}
      />

      <AppearanceSettingsSheet
        isOpen={showAppearanceSheet}
        onClose={() => setShowAppearanceSheet(false)}
      />

      <LanguageSettingsSheet
        isOpen={showLanguageSheet}
        onClose={() => setShowLanguageSheet(false)}
      />
    </View>
  );
}
