import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
// import * as Haptics from 'expo-haptics'; // TODO: Add haptics
import { useColorScheme } from 'nativewind';
import { Moon, Sun } from 'lucide-react-native';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  function handleToggle() {
    // TODO: Add haptic feedback when toggling themes
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    toggleColorScheme();
  }

  return (
    <Button
      onPress={handleToggle}
      variant="ghost"
      size="icon"
      className="web:mr-5 translate-x-1">
      <Icon 
        as={colorScheme === 'dark' ? Sun : Moon} 
        size={22}
        className="text-foreground"
      />
    </Button>
  );
}
