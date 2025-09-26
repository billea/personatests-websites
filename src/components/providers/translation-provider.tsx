"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
// We are importing the class directly from the JS file.
// Note: We will need to adjust the engine to not self-initialize.
import { TranslationEngine } from '@/lib/translation-engine';

// 1. Create the context
const TranslationContext = createContext<TranslationEngine | null>(null);

// 2. Create a custom hook for easy access to the context
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  
  // Create a wrapper for the t function to ensure proper binding and add debugging
  const t = (key: string) => {
    const result = context.t(key);
    // Add debugging for failed translations
    if (result === key) {
      console.warn(`Translation missing for key: ${key} in language: ${context.currentLanguage}`);
    }
    return result;
  };
  
  return {
    t,
    setLanguage: context.setLanguage.bind(context),
    currentLanguage: context.currentLanguage,
    translations: context.getTranslations(),
  };
};

// 3. Create the Provider component
interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const [engine, setEngine] = useState<TranslationEngine | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [, forceUpdate] = useState({});
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    
    // Initialize the engine only on the client side
    const initEngine = async () => {
      const i18nEngine = new TranslationEngine();
      
      // Extract language from pathname (e.g., /ko/tests -> "ko")
      const pathSegments = pathname.split('/');
      const localeFromPath = pathSegments[1]; // First segment after leading slash
      
      // Determine the language to use
      const supportedLanguages = ['en', 'ko', 'es', 'fr', 'de', 'it', 'ja', 'pt', 'zh'];
      const initialLanguage = supportedLanguages.includes(localeFromPath) ? localeFromPath : 'en';
      
      console.log('TranslationProvider initializing with language:', initialLanguage, 'from pathname:', pathname);
      
      // Add a listener to force re-render when language changes
      const originalSetLanguage = i18nEngine.setLanguage.bind(i18nEngine);
      i18nEngine.setLanguage = async (lang: string) => {
        console.log('Changing language to:', lang);
        await originalSetLanguage(lang);
        // Force a re-render by updating state
        forceUpdate({});
      };
      
      // Initialize with the detected language
      await i18nEngine.init(initialLanguage);
      
      // Verify translations are loaded before proceeding
      console.log('Translation engine initialized. Current language:', i18nEngine.currentLanguage);
      console.log('Available translations for current language:', Object.keys((i18nEngine.translations as any)[i18nEngine.currentLanguage] || {}));
      console.log('Test translation - tests.page_title:', i18nEngine.t('tests.page_title'));
      console.log('Test results.dimensions translation - E:', i18nEngine.t('results.dimensions.E'));
      console.log('Test results.dimensions translation - 8:', i18nEngine.t('results.dimensions.8'));
      console.log('Test results.dimensions translation - Self-Awareness:', i18nEngine.t('results.dimensions.Self-Awareness'));
      
      setEngine(i18nEngine);
      setIsReady(true);
    };

    setIsReady(false);
    initEngine();
  }, [pathname]); // Re-initialize when pathname changes

  // Prevent hydration mismatch by not rendering until client is mounted
  if (!isMounted) {
    return null;
  }

  // Render a loading state while the engine is initializing or translations aren't ready
  if (!engine || !isReady) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-gray-500">Loading translations...</div>
    </div>;
  }

  return (
    <TranslationContext.Provider value={engine}>
      {children}
    </TranslationContext.Provider>
  );
};
