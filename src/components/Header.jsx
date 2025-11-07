import React from 'react';
import { ShoppingCart, Menu, Globe } from 'lucide-react'; // <-- شيلنا Moon و Sun لأننا مش محتاجينهم
import { AnimatedLogo } from './AnimatedLogo'; // <-- الخطوة 1: استدعاء اللوجو
import './AnimatedLogo.css'; // <-- الخطوة 2: استدعاء ملف الأنيميشن

/**
 * Header Component
 * Main navigation header with animated logo, cart, and language switcher
 */
const Header = ({ 
  onOpenSidebar, 
  onOpenCart, 
  onToggleLanguage, 
  language, 
  cartCount 
  // <-- الخطوة 3: شيلنا onToggleTheme و theme من هنا
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

          {/* --- الخطوة 4: تم استبدال اللوجو النصي باللوجو المتحرك --- */}
          <div className="flex-1 flex justify-center items-center">
            {/* الـ div دا بيتحكم في حجم اللوجو عشان يتجاوب مع الموبايل 
              h-14 = ارتفاع 56 بكسل. w-auto = العرض أوتوماتيك
            */}
            <div className="w-auto h-14">
              <AnimatedLogo />
            </div>
          </div>
          {/* --- نهاية جزء اللوجو --- */}
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* --- الخطوة 5: تم حذف زرار Dark Mode Toggle --- */}

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