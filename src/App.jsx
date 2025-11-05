import React, { useState, useEffect } from 'react';
import { ProductsProvider, useProducts } from './context/ProductsContext';
import { GlobalProvider } from './context/GlobalProvider';
import ProductsGrid from './components/ProductsGrid';
import ProductModal from './components/ProductModal';
import NutritionSummary from './components/NutritionSummary';
import FilterBar from './components/FilterBar';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import FeaturedSwiper from './components/FeaturedSwiper';
import MarqueeSwiper from './components/MarqueeSwiper';
import Sidebar from './components/Sidebar';
import ToastContainer from './components/Toast/ToastContainer';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import AnimatedBackground from './components/AnimatedBackground/AnimatedBackground';
import { ShoppingCart, Menu } from 'lucide-react';

// ✅ Inner App Component (has access to ProductsContext + GlobalProvider)
function AppContent() {
  const { cart, addToCart, getCartCount, loading } = useProducts();
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // 🔗 Listen for events from Vanilla JS
  useEffect(() => {
    // Event: Open cart from header button
    const handleOpenCart = () => {
      console.log('🆕 React received: open-react-cart');
      setShowCart(true);
    };

    // Event: Open checkout from Vanilla JS
    const handleOpenCheckout = () => {
      console.log('🆕 React received: open-react-checkout');
      setShowCheckout(true);
    };

    window.addEventListener('open-react-cart', handleOpenCart);
    window.addEventListener('open-react-checkout', handleOpenCheckout);

    return () => {
      window.removeEventListener('open-react-cart', handleOpenCart);
      window.removeEventListener('open-react-checkout', handleOpenCheckout);
    };
  }, []);

  // Note: Cart clearing is now handled by ProductsContext

  // 🔗 Update header badge when cart changes
  useEffect(() => {
    const cartCount = getCartCount();
    
    // Update sidebar badges
    if (window.sidebarModule && window.sidebarModule.updateSidebarBadges) {
      window.sidebarModule.updateSidebarBadges();
    }

    // Update header cart badge
    const headerBadge = document.getElementById('headerCartBadge');
    if (headerBadge) {
      headerBadge.textContent = cartCount;
      headerBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    }

    console.log('🆕 React cart count updated:', cartCount);
  }, [cart, getCartCount]);

  const cartItemsCount = getCartCount();

  const handleCheckout = (cart, total) => {
    console.log('🛒 Initiating checkout:', { cart, total });
    setShowCart(false);
    setShowCheckout(true);
    
    // Dispatch event for Vanilla JS checkout module
    window.dispatchEvent(new CustomEvent('react-initiate-checkout', {
      detail: { cart, total }
    }));
  };

  return (
    <>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Page Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Menu Button */}
              <button
                onClick={() => setShowSidebar(true)}
                className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-lg"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  🍦 Soft Cream
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Smart Nutrition & Energy
                </p>
              </div>
              
              {/* Cart Button */}
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative p-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors shadow-lg"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Featured Swiper - ✅ Pure React Component */}
        <section className="container mx-auto px-4 py-8">
          <FeaturedSwiper />
        </section>

        {/* Marquee Swiper - ✅ Pure React Component */}
        <section className="w-full">
          <MarqueeSwiper />
        </section>

        {/* Filter Bar */}
        <FilterBar />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <ProductsGrid onAddToCart={addToCart} />
        </main>

        {/* Product Modal */}
        <ProductModal onAddToCart={addToCart} />

        {/* Cart Modal - ✅ NEW: Pure React Component */}
        <CartModal
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout}
        />

        {/* Checkout Modal - ✅ Pure React Component */}
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          cart={cart}
        />

        {/* Sidebar - ✅ Pure React Component */}
        <Sidebar
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
        />

        {/* Toast Container - ✅ Pure React Component */}
        <ToastContainer />

        {/* Loading Screen - ✅ Pure React Component */}
        <LoadingScreen isLoading={loading} />
      </div>
    </>
  );
}

// ✅ Main App Component (wraps with GlobalProvider + ProductsProvider)
function App() {
  return (
    <GlobalProvider>
      <ProductsProvider>
        <AppContent />
      </ProductsProvider>
    </GlobalProvider>
  );
}

export default App;
