import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useGlobal } from '../context/GlobalProvider';
import {
  X, ShoppingCart, Package, Moon, Sun, Globe, Home, Info, Phone, Menu
} from 'lucide-react';

/**
 * Sidebar Component - Pure React Sidebar
 * 
 * ✅ Replaces: js/sidebar.js + js/orders-badge.js
 * ✅ Features: Navigation, Language toggle, Theme toggle, Cart badge
 */

const Sidebar = ({ isOpen, onClose }) => {
  const { getCartCount } = useProducts();
  const { language, toggleLanguage, theme, toggleTheme, t } = useGlobal();
  
  const cartCount = getCartCount();

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9000]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 ${language === 'ar' ? 'right-0' : 'left-0'} h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-[9001] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : language === 'ar' ? 'translate-x-full' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white shadow-lg">
              <Menu className="w-6 h-6" />
            </div>
            <div>
              <h2 id="sidebar-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {t('headerTitle') || 'سوفت كريم'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('headerSubtitle') || 'أطيب آيس كريم 🍦'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:rotate-90"
            aria-label={t('closeSidebar') || 'Close sidebar'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2">
          {/* Menu Link */}
          <a
            href="#menu"
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            onClick={onClose}
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Package className="w-5 h-5 text-primary group-hover:text-white" />
            </div>
            <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
              {t('navMenu') || 'المنيو'}
            </span>
          </a>

          {/* Cart Link */}
          <a
            href="#cart"
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group relative"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              // Dispatch event to open cart
              window.dispatchEvent(new Event('open-react-cart'));
            }}
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5 text-primary group-hover:text-white" />
            </div>
            <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
              {t('navCart') || 'السلة'}
            </span>
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>

          {/* About Link */}
          <a
            href="#about"
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            onClick={onClose}
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Info className="w-5 h-5 text-primary group-hover:text-white" />
            </div>
            <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
              {t('navAbout') || 'من نحن'}
            </span>
          </a>

          {/* Contact Link */}
          <a
            href="#contact"
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            onClick={onClose}
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Phone className="w-5 h-5 text-primary group-hover:text-white" />
            </div>
            <span className="text-base font-semibold text-gray-700 dark:text-gray-300">
              {t('navContact') || 'تواصل'}
            </span>
          </a>
        </nav>

        {/* Settings */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="space-y-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('languageLabel') || 'اللغة'}
                </span>
              </div>
              <span className="text-sm font-bold text-primary">
                {language === 'ar' ? 'English' : 'العربية'}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('themeLabel') || 'المظهر'}
                </span>
              </div>
              <span className="text-sm font-bold text-primary">
                {theme === 'light' ? (t('darkMode') || 'ليلي') : (t('lightMode') || 'نهاري')}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
