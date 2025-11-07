import React from 'react';
import { ShoppingCart, Menu, Globe } from 'lucide-react'; // <-- شيلنا Moon و Sun لأننا مش محتاجينهم
import { AnimatedLogo } from './AnimatedLogo'; // <-- الخطوة 1: استدعاء اللوجو
import './AnimatedLogo.css'; // <-- الخطوة 2: استدعاء ملف الأنيميشن

/**
 * Header Component
 * Main navigation header with animated logo, cart, and language switcher
 */
/**
 * Header Component
 * Main navigation header with animated logo, cart, and language switcher
 */
const Header = ({ 
  onOpenSidebar, 
  onOpenCart, 
  // الخطوة 4: شيلنا onToggleTheme و theme من الـ props
  onToggleLanguage, 
  language, 
  cartCount 
}) => {

  // الخطوة 5 (مهمة): إصلاح خطأ Error #62
  // الكود دا بيتحقق لو cartCount مجرد رقم، أو أوبجكت
  // وفي كل الحالات بيطلع "العدد" الصح
  const getCartCount = () => {
    if (typeof cartCount === 'number') {
      return cartCount; // لو هو رقم، اعرضه زي ما هو
    }
    if (cartCount && cartCount.items && Array.isArray(cartCount.items)) {
      return cartCount.items.length; // لو هو أوبجكت، هات عدد الأيتمز
    }
    if (cartCount && typeof cartCount.total === 'number') {
      return cartCount.total; // أو هات التوتال لو موجود
    }
    return 0; // لو أي حاجة تانية، رجع صفر
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

          {/* الخطوة 6: استبدال اللوجو النصي باللوجو المتحرك */}
          <div className="flex-1 flex justify-center items-center">
            <div className="w-auto h-14"> {/* اتحكم في ارتفاع اللوجو من هنا */}
              <AnimatedLogo />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* الخطوة 7: تم حذف زرار Dark Mode Toggle بالكامل */}

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
              
              {/* الخطوة 8: استخدام المتغير displayCount اللي صلحناه فوق */}
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