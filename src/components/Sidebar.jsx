import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useGlobal } from '../context/GlobalProvider';
import { storage } from '../services/storage';
import {
  X, ShoppingCart, Package, Moon, Sun, Globe, Phone, Clock, Sparkles, 
  ShoppingBag, User, Award
} from 'lucide-react';

/**
 * Sidebar Component - Enhanced & Complete
 * 
 * ✅ Welcome message with user name
 * ✅ Active orders badge on "My Orders" button
 * ✅ Auto-check orders on click (toast if empty)
 * ✅ Navigation links scroll to sections
 * ✅ Global control functions
 */

const Sidebar = ({ isOpen, onClose }) => {
  const { getCartCount } = useCart();
  const { language, toggleLanguage, theme, toggleTheme, t } = useGlobal();
  
  const [userData, setUserData] = useState(null);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  
  const cartCount = getCartCount();

  // Load user data and orders count
  useEffect(() => {
    updateUserData();
    updateOrdersCount();
  }, []);

  // Listen for orders updates
  useEffect(() => {
    const handleOrdersUpdated = () => {
      updateOrdersCount();
    };

    window.addEventListener('ordersUpdated', handleOrdersUpdated);
    
    return () => {
      window.removeEventListener('ordersUpdated', handleOrdersUpdated);
    };
  }, []);

  // Listen for user data updates
  useEffect(() => {
    const handleUserDataUpdated = () => {
      updateUserData();
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdated);
    
    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdated);
    };
  }, []);

  const updateUserData = () => {
    const data = storage.getUserData();
    setUserData(data);
  };

  const updateOrdersCount = () => {
    const count = storage.getActiveOrdersCount();
    setActiveOrdersCount(count);
  };

  // Handle Orders button click
  const handleOrdersClick = () => {
    onClose();
    
    setTimeout(() => {
      const allOrders = storage.getOrders();
      
      if (allOrders.length === 0) {
        // Show toast: No orders
        const toastEvent = new CustomEvent('show-toast', {
          detail: {
            message: language === 'ar' ? 'لا توجد طلبات سابقة' : 'No previous orders',
            type: 'info'
          }
        });
        window.dispatchEvent(toastEvent);
      } else {
        // Open OrdersBadge modal
        window.dispatchEvent(new Event('open-my-orders-modal'));
      }
    }, 300);
  };

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
    onClose();
    
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 300);
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
                  {t('headerSubtitle') || 'أطيب آيس كريم 🦄'}
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

          {/* Welcome Message */}
          {userData && userData.name && (
            <div className="mt-3 p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl backdrop-blur-sm border border-pink-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-md">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {language === 'ar' ? 'مرحباً بك' : 'Welcome'}
                  </p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
                    {userData.name}
                  </p>
                </div>
                <Award className="w-5 h-5 text-yellow-500 animate-pulse" />
              </div>
            </div>
          )}
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

          {/* Orders History Link */}
          <button
            onClick={handleOrdersClick}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 hover:from-primary hover:to-secondary hover:text-white transition-all duration-300 group relative shadow-sm border border-amber-100 dark:border-gray-600"
          >
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors shadow-sm">
              <ShoppingBag className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <span className="text-base font-semibold text-gray-700 dark:text-gray-300 group-hover:text-white">
              {language === 'ar' ? 'طلباتي' : 'My Orders'}
            </span>
            {activeOrdersCount > 0 && (
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-gentle-pulse">
                {activeOrdersCount}
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

// ================================================================
// ===== Global Sidebar Control Functions =====
// ================================================================

export const openSidebar = () => {
  window.dispatchEvent(new Event('sidebar-open'));
};

export const closeSidebar = () => {
  window.dispatchEvent(new Event('sidebar-close'));
};

export const toggleSidebar = () => {
  window.dispatchEvent(new Event('sidebar-toggle'));
};

export const updateSidebarBadges = () => {
  window.dispatchEvent(new Event('cart-updated'));
  window.dispatchEvent(new Event('ordersUpdated'));
};

export const updateSidebarProfile = () => {
  window.dispatchEvent(new Event('userDataUpdated'));
};

export const syncSidebarTheme = () => {
  window.dispatchEvent(new Event('theme-changed'));
};

export const syncSidebarLanguage = () => {
  window.dispatchEvent(new Event('language-changed'));
};

// Expose to window
if (typeof window !== 'undefined') {
  window.sidebarControls = {
    open: openSidebar,
    close: closeSidebar,
    toggle: toggleSidebar,
    updateBadges: updateSidebarBadges,
    updateProfile: updateSidebarProfile,
    syncTheme: syncSidebarTheme,
    syncLanguage: syncSidebarLanguage
  };
  
  console.log('✅ Sidebar controls exposed to window.sidebarControls');
}

export default Sidebar;