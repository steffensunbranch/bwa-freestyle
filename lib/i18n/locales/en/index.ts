// Import all translation files
import auth from './auth.json';
import account from './account.json';
import notifications from './notifications.json';
import onboarding from './onboarding.json';
import navigation from './navigation.json';
import ui from './ui.json';
import errors from './errors.json';
import languages from './languages.json';
import legal from './legal.json';

// Merge everything back into the original structure
// This keeps the same t('auth.login') usage but allows organized files
export default {
  auth,
  account, 
  notifications,
  onboarding,
  // Flatten navigation components back to root level
  tabs: navigation.tabs,
  settings: navigation.settings,
  // Export ui namespace
  ui,
  errors,
  languages,
  legal
};
