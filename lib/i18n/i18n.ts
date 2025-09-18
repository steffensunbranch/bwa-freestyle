import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import merged translations (organized files, same usage)
import enTranslations from './locales/en';
import frTranslations from './locales/fr';

// Define resources - organized by feature domains
const resources = {
  en: {
    translation: enTranslations
  },
  fr: {
    translation: frTranslations
  }
};

// Get device language
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

// Language storage utilities
export const LanguageStorage = {
  STORAGE_KEY: 'user_language_preference',
  
  async getStoredLanguage(): Promise<string | null> {
    try {
      // Only access AsyncStorage in browser environment
      if (typeof window === 'undefined') {
        return null;
      }
      return await AsyncStorage.getItem(this.STORAGE_KEY);
    } catch (error) {
      console.log('Error getting stored language:', error);
      return null;
    }
  },
  
  async setStoredLanguage(language: string): Promise<void> {
    try {
      // Only access AsyncStorage in browser environment
      if (typeof window === 'undefined') {
        return;
      }
      await AsyncStorage.setItem(this.STORAGE_KEY, language);
    } catch (error) {
      console.log('Error storing language:', error);
    }
  }
};

// Initialize i18n with proper language detection
const initI18n = () => {
  // Use device language as initial language, will be updated when stored language is loaded
  const initialLanguage = deviceLanguage;

  i18next
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v4',
      resources,
      lng: initialLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false // React already escapes values
      },
    });

  // Load stored language preference asynchronously after initialization
  LanguageStorage.getStoredLanguage().then((storedLanguage) => {
    if (storedLanguage && storedLanguage !== initialLanguage) {
      i18next.changeLanguage(storedLanguage);
    }
  });
};

// Initialize the i18n system
initI18n();

export default i18next;
