import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * GlobalProvider - i18n, Theme & Toast Management
 * 
 * ✅ Replaces: js/translations.js + js/global-functions.js (toggleLanguage, toggleTheme)
 * ✅ Features: Language switching (AR/EN), Theme switching (Light/Dark), Translation function, Toast notifications
 */

// Import translation data (internalized)
import { translationsData } from '../data/translations-data.js';
import { translationsDataAdditions } from '../data/translations-data-additions.js';

// Merge translation data
const translations = {
  ar: { ...translationsData.ar, ...translationsDataAdditions.ar },
  en: { ...translationsData.en, ...translationsDataAdditions.en }
};

const GlobalContext = createContext();

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within GlobalProvider');
  }
  return context;
};

export const GlobalProvider = ({ children }) => {
  // ========================================
  // State
  // ========================================
  
  // Language State
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || document.documentElement.lang || 'ar';
    }
    return 'ar';
  });

  // Theme State
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  // Toast State
  const [toasts, setToasts] = useState([]);

  // ========================================
  // Language Management
  // ========================================
  
  const setLanguage = useCallback((newLang) => {
    if (newLang !== 'ar' && newLang !== 'en') {
      console.error('Invalid language:', newLang);
      return;
    }

    setLanguageState(newLang);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLang);
      
      // Update HTML attributes
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      
      // Dispatch event for backward compatibility
      window.dispatchEvent(new CustomEvent('language-changed', {
        detail: { language: newLang }
      }));
      
      console.log('✅ Language changed to:', newLang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
  }, [language, setLanguage]);

  // ========================================
  // Theme Management
  // ========================================
  
  const setTheme = useCallback((newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') {
      console.error('Invalid theme:', newTheme);
      return;
    }

    setThemeState(newTheme);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      
      // Update html and body class for Tailwind dark mode
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
      
      // Dispatch event for backward compatibility
      window.dispatchEvent(new CustomEvent('theme-changed', {
        detail: { theme: newTheme }
      }));
      
      console.log('✅ Theme changed to:', newTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  // ========================================
  // Toast Management
  // ========================================
  
  const showToast = useCallback((options) => {
    const {
      type = 'info',
      title,
      message,
      duration = 5000
    } = options;

    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type,
      title,
      message,
      duration
    };

    setToasts(prev => [...prev, newToast]);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // ========================================
  // Translation Function
  // ========================================
  
  const t = useCallback((key, params = {}) => {
    const translation = translations[language]?.[key];
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key} (${language})`);
      return key;
    }
    
    // Replace parameters in translation
    let result = translation;
    Object.keys(params).forEach(param => {
      result = result.replace(`{${param}}`, params[param]);
    });
    
    return result;
  }, [language]);

  // ========================================
  // Effects
  // ========================================
  
  // Apply language on mount and change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language]);

  // Apply theme on mount and change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }
  }, [theme]);

  // ========================================
  // Context Value
  // ========================================
  
  const value = {
    language,
    setLanguage,
    toggleLanguage,
    theme,
    setTheme,
    toggleTheme,
    t,
    isRTL: language === 'ar',
    isDark: theme === 'dark',
    // Toast
    toasts,
    showToast,
    removeToast,
    clearToasts
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
