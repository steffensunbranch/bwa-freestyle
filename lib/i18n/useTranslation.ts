import { useTranslation as useTranslationOriginal } from 'react-i18next';
import i18n, { LanguageStorage } from './i18n';
import { useState, useEffect } from 'react';

export function useTranslation() {
  // Use the original hook for translations
  const { t } = useTranslationOriginal();
  
  // Track current language with local state
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  
  // Listen for language changes
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLanguage(lng);
    };
    
    // Add event listener
    i18n.on('languageChanged', handleLanguageChanged);
    
    // Cleanup
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);
  
  return {
    t,
    i18n,
    changeLanguage: async (lng: string) => {
      // Change the language in i18n
      await i18n.changeLanguage(lng);
      // Persist the language preference
      await LanguageStorage.setStoredLanguage(lng);
    },
    currentLanguage
  };
}
