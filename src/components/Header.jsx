import React from 'react';
import { ShoppingCart, Menu, Globe } from 'lucide-react';

/**
 * Header Component - Professional Brand Design
 * RTL-aware, clean, and animated
 * ✅ Fixed: Burger button toggles sidebar (open/close)
 */
const Header = ({ 
  onOpenSidebar,
  isSidebarOpen, // ⚡ NEW: Need this to toggle
  onOpenCart, 
  onToggleLanguage, 
  language, 
  cartCount 
}) => {

  const getCartCount = () => {
    if (typeof cartCount === 'number') return cartCount; 
    if (cartCount && cartCount.items && Array.isArray(cartCount.items)) return cartCount.items.length; 
    if (cartCount && typeof cartCount.total === 'number') return cartCount.total; 
    return 0; 
  };
  
  const displayCount = getCartCount();
  const brandText = "SOFTCREAM";
  const isRTL = language === 'ar';

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          
          {/* Menu Button - Toggle Sidebar */}
          <button
            onClick={onOpenSidebar}
            className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-lg"
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* 🎨 BRAND LOGO - Professional Design */}
          <div className="flex-1 flex justify-center items-center">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Logo Image - Enhanced Glow */}
              <div className="h-12 w-auto flex-shrink-0">
                <img 
                  src="https://i.ibb.co/GfqnJKpV/softcreamlogo.png"
                  alt="Soft Cream" 
                  className="h-full w-auto object-contain animate-pulse-glow transition-transform hover:scale-110 drop-shadow-2xl" 
                  style={{
                    filter: 'drop-shadow(0 4px 20px rgba(255, 107, 157, 0.6))'
                  }}
                />
              </div>

              {/* Brand Text - Animated Letters */}
              <div className="flex items-center gap-0.5" dir="ltr">
                {Array.from(brandText).map((letter, i) => (
                  <span
                    key={i}
                    className="font-bold text-xl md:text-2xl animate-text-wave-fast uppercase tracking-tight transition-all hover:scale-125 cursor-default"
                    style={{
                      animationDelay: `${i * 0.05}s`,
                      display: 'inline-block'
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
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