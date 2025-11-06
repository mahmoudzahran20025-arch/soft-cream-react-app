import React from 'react';
import { ShoppingCart, Menu, Moon, Sun, Globe } from 'lucide-react';

/**
 * Header Component
 * Main navigation header with cart, theme toggle, and language switcher
 */
const Header = ({ 
  onOpenSidebar, 
  onOpenCart, 
  onToggleTheme, 
  onToggleLanguage, 
  theme, 
  language, 
  cartCount 
}) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Menu Button */}
          <button
            onClick={onOpenSidebar}
            className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-lg"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              🍦 Soft Cream
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Smart Nutrition & Energy
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-lg"
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={onToggleLanguage}
              className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-lg flex items-center gap-1"
              aria-label="Toggle language"
              title={language === 'ar' ? 'English' : 'العربية'}
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-bold">{language === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors shadow-lg"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
