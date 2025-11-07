import React from 'react';
import { ShoppingCart, Menu, Globe } from 'lucide-react';
// 
// 💡💡 ((  الحــــــــــل هنــــــــــا )) 💡💡
// شيلنا الأقواس من حوالين AnimatedLogo
//
import AnimatedLogo from './AnimatedLogo'; // <-- تم تصحيح السطر دا
import './AnimatedLogo.css'; 

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
}) => {

  // الكود دا بيصلح خطأ Error #62 (بتاع cartCount)
  const getCartCount = () => {
    if (typeof cartCount === 'number') {
      return cartCount; 
    }
    if (cartCount && cartCount.items && Array.isArray(cartCount.items)) {
      return cartCount.items.length; 
    }
    if (cartCount && typeof cartCount.total === 'number') {
      return cartCount.total; 
    }
    return 0; 
  };
  
  const displayCount = getCartCount();

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

          {/* اللوجو المتحرك */}
          <div className="flex-1 flex justify-center items-center">
            <div className="w-auto h-14">
              <AnimatedLogo />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* تم حذف زرار الثيم */}

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
              
              {displayCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {displayCount}
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