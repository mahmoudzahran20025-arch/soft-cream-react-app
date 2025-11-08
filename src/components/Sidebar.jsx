import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductsContext';
import { useGlobal } from '../context/GlobalProvider';
import {
  X, ShoppingCart, Package, Moon, Sun, Globe, Info, Phone, Clock, Sparkles
} from 'lucide-react';

/**
 * Sidebar Component - Enhanced & Matching Design
 * 
 * ✅ Fixed: Navigation links scroll to sections
 * ✅ Fixed: Burger button closes sidebar when clicked again
 * ✅ Enhanced: Matching design with Footer, Cart, Menu
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
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle navigation with smooth scroll
  const handleNavClick = (sectionId) => {
    onClose(); // Close sidebar first
    
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 300); // Wait for sidebar to close
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-sidebar-overlay animate-fade-in-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 ${language === 'ar' ? 'right-0 animate-slide-in-right-sidebar' : 'left-0 animate-slide-in-left-sidebar'} h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-sidebar`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        {/* Header - Enhanced Design */}
        <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-b border-pink-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white shadow-md">
                <img 
                  src="https://i.ibb.co/GfqnJKpV/softcreamlogo.png"
                  alt="Logo" 
                  className="w-8 h-8 object-contain" 
                />
              </div>
              <div>
                <h2 id="sidebar-title" className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {t('headerTitle') || 'سوفت كريم'}
                </h2>
                <p className="text-sm text-primary font-medium">
                  {t('headerSubtitle') || 'أطيب آيس كريم 🍦'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:rotate-90 shadow-md"
              aria-label={t('closeSidebar') || 'Close sidebar'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation - Enhanced Design */}
        <nav className="p-6 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {/* Menu Link */}
          <button
            onClick={() => handleNavClick('menu')}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 hover:from-primary hover:to-secondary hover:text-white transition-all duration-300 group shadow-sm border border-pink-100 dark:border-gray-600"
          >
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-sm">
              <Package className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <span className="text-base font-semibold text-gray-700 dark:text-gray-300 group-hover:text-white">
              {t('navMenu') || 'المنيو'}
            </span>
          </button>

          {/* Cart Link */}
          <button
            onClick={() => {
              onClose();
              setTimeout(() => {
                window.dispatchEvent(new Event('open-react-cart'));
              }, 300);
            }}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 hover:from-primary hover:to-secondary hover:text-white transition-all duration-300 group relative shadow-sm border border-green-100 dark:border-gray-600"
          >
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-sm">
              <ShoppingCart className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <span className="text-base font-semibold text-gray-700 dark:text-gray-300 group-hover:text-white">
              {t('navCart') || 'السلة'}
            </span>
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-gentle-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hours Link */}
          <button
            onClick={() => handleNavClick('footer-hours')}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 hover:from-primary hover:to-secondary hover:text-white transition-all duration-300 group shadow-sm border border-blue-100 dark:border-gray-600"
          >
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-sm">
              <Clock className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <span className="text-base font-semibold text-gray-700 dark:text-gray-300 group-hover:text-white">
              {t('footerNavHours') || 'ساعات العمل'}
            </span>
          </button>

          {/* Health Info Link */}
          <button
            onClick={() => handleNavClick('footer-health-info')}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 hover:from-primary hover:to-secondary hover:text-white transition-all duration-300 group shadow-sm border border-purple-100 dark:border-gray-600"
          >
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-sm">
              <Sparkles className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <span className="text-base font-semibold text-gray-700 dark:text-gray-300 group-hover:text-white">
              {t('footerNavHealthy') || 'معلومات صحية'}
            </span>
          </button>

          {/* Contact Link */}
          <button
            onClick={() => handleNavClick('footer-contact')}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-800 hover:from-primary hover:to-secondary hover:text-white transition-all duration-300 group shadow-sm border border-orange-100 dark:border-gray-600"
          >
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-sm">
              <Phone className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <span className="text-base font-semibold text-gray-700 dark:text-gray-300 group-hover:text-white">
              {t('footerNavContact') || 'تواصل معنا'}
            </span>
          </button>
        </nav>

        {/* Settings - Enhanced Design */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-pink-100 dark:border-gray-700 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <div className="space-y-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-primary hover:to-secondary hover:text-white transition-all duration-300 shadow-sm border border-pink-100 dark:border-gray-700 group"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-white">
                  {t('languageLabel') || 'اللغة'}
                </span>
              </div>
              <span className="text-sm font-bold text-primary group-hover:text-white">
                {language === 'ar' ? 'English' : 'العربية'}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-primary hover:to-secondary hover:text-white transition-all duration-300 shadow-sm border border-pink-100 dark:border-gray-700 group"
            >
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                ) : (
                  <Sun className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                )}
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-white">
                  {t('themeLabel') || 'المظهر'}
                </span>
              </div>
              <span className="text-sm font-bold text-primary group-hover:text-white">
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