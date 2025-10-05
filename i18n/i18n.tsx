
import React, { createContext, useState, useContext, ReactNode } from 'react';
import tr from './locales/tr.json';
import en from './locales/en.json';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, any>;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translationsData = { tr, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('tr');
  
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let result = translationsData[language] as any;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        console.warn(`Translation not found for key: ${key}`);
        return key; // Return the key if translation is not found
      }
    }
    
    if (typeof result === 'string' && params) {
        Object.keys(params).forEach(paramKey => {
            result = result.replace(`{{${paramKey}}}`, String(params[paramKey]));
        });
    }

    return result;
  };

  const value = {
    language,
    setLanguage,
    translations: translationsData[language],
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
