import React, { createContext, useContext, useState, useEffect } from 'react';
import { languages, translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('kisan_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('kisan_lang', currentLang);
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const t = (key) => {
    if (translations[currentLang] && translations[currentLang][key] !== undefined) {
      return translations[currentLang][key];
    }
    // Fallback to English
    if (translations.en && translations.en[key] !== undefined) {
      return translations.en[key];
    }
    return key;
  };

  const changeLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLang(langCode);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLang, languages, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
