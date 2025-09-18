import { Tabs } from "expo-router";
import { Icon } from "@/components/ui/icon";
import { User, Home } from "lucide-react-native";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";

export default function TabsLayout() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center' as const,
        headerRight: () => <ThemeToggle />,
        headerStyle: { backgroundColor: THEME[colorScheme ?? 'light'].background },
        tabBarStyle: { 
          backgroundColor: THEME[colorScheme ?? 'light'].background,
          borderTopColor: THEME[colorScheme ?? 'light'].border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <Icon as={Home} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('tabs.account'),
          tabBarIcon: ({ color, size }) => (
            <Icon as={User} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}