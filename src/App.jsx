import React, { useState, useEffect } from 'react';
import { ProductsProvider, useProducts } from './context/ProductsContext';
import { GlobalProvider } from './context/GlobalProvider';
import ProductsGrid from './components/ProductsGrid';
import ProductModal from './components/ProductModal';
import NutritionSummary from './components/NutritionSummary';
import FilterBar from './components/FilterBar';
import Header from './components/Header';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import OrdersBadge from './components/CheckoutModal/OrdersBadge';
import MyOrdersModal from './components/CheckoutModal/MyOrdersModal';
import TrackingModal from './components/CheckoutModal/TrackingModal';
import FeaturedSwiper from './components/FeaturedSwiper';
import MarqueeSwiper from './components/MarqueeSwiper';
import Sidebar from './components/Sidebar';
import ToastContainer from './components/Toast/ToastContainer';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import AnimatedBackground from './components/AnimatedBackground/AnimatedBackground';
import { useGlobal } from './context/GlobalProvider';

// ✅ Inner App Component (has access to ProductsContext + GlobalProvider)
function AppContent() {
  const { cart, addToCart, getCartCount, loading } = useProducts();
  const { theme, toggleTheme, language, toggleLanguage, t } = useGlobal();
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('');

  // ✅ Pure React - No more Vanilla JS event listeners needed

  const cartItemsCount = getCartCount();

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  return (
    <>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Page Content */}
      <div className="relative z-10 min-h-screen">
        {/* ✅ Header Component - Clean & Modular */}
        <Header
          onOpenSidebar={() => setShowSidebar(true)}
          onOpenCart={() => setShowCart(true)}
          onToggleTheme={toggleTheme}
          onToggleLanguage={toggleLanguage}
          theme={theme}
          language={language}
          cartCount={cartItemsCount}
        />

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

        {/* ✅ Footer Component - Complete footer with all info */}
        <Footer />

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

        {/* Orders Badge - ✅ NEW: Floating badge for active orders */}
        <OrdersBadge onClick={() => setShowMyOrders(true)} />

        {/* My Orders Modal - ✅ NEW: Order history */}
        <MyOrdersModal
          isOpen={showMyOrders}
          onClose={() => setShowMyOrders(false)}
          onTrackOrder={(orderId) => {
            setTrackingOrderId(orderId);
            setShowTracking(true);
          }}
        />

        {/* Tracking Modal - ✅ NEW: Track order status */}
        <TrackingModal
          isOpen={showTracking}
          onClose={() => {
            setShowTracking(false);
            setTrackingOrderId('');
          }}
          initialOrderId={trackingOrderId}
        />
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
