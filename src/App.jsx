import React, { useState, lazy, Suspense } from 'react';
import { ProductsDataProvider, useProductsData } from './context/ProductsDataContext';
import { CartProvider, useCart } from './context/CartContext';
import { GlobalProvider } from './context/GlobalProvider';
import ProductsGrid from './components/ProductsGrid';
import FilterBar from './components/FilterBar';
import Header from './components/Header';
import Footer from './components/Footer';
import TrustBanner from './components/TrustBanner';
import OrdersBadge from './components/CheckoutModal/OrdersBadge';
import FeaturedSwiper from './components/FeaturedSwiper';
import MarqueeSwiper from './components/MarqueeSwiper';
import ToastContainer from './components/Toast/ToastContainer';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import AnimatedBackground from './components/AnimatedBackground/AnimatedBackground';
import { useGlobal } from './context/GlobalProvider';

// ✅ Lazy Load Heavy Components (Code Splitting)
const ProductModal = lazy(() => import('./components/ProductModal'));
const CartModal = lazy(() => import('./components/CartModal'));
const CheckoutModal = lazy(() => import('./components/CheckoutModal'));
const MyOrdersModal = lazy(() => import('./components/CheckoutModal/MyOrdersModal'));
const TrackingModal = lazy(() => import('./components/CheckoutModal/TrackingModal'));
const Sidebar = lazy(() => import('./components/Sidebar'));

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal-base">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
  </div>
);

// ✅ Inner App Component (has access to all Contexts)
function AppContent() {
  const { selectedProduct } = useProductsData();
  const { addToCart, getCartCount } = useCart();
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

        {/* Marquee Swiper - ✅ Pure React Component (مباشرة تحت Header) */}
        <section className="w-full">
          <MarqueeSwiper />
        </section>

        {/* Trust Banner - ✅ Pure React Component (بعد Marquee) */}
        <section className="w-full">
          <TrustBanner />
        </section>

        {/* Featured Swiper - ✅ Pure React Component (بعد Trust Banner) */}
        <section className="container mx-auto px-4 py-8">
          <FeaturedSwiper />
        </section>

        {/* Filter Bar */}
        <FilterBar />

        {/* Main Content */}
        <main id="products" className="container mx-auto px-4 py-8">
          <ProductsGrid onAddToCart={addToCart} />
        </main>

        {/* ✅ Footer Component - Complete footer with all info */}
        <Footer />

        {/* Product Modal - Lazy Loaded */}
        {selectedProduct && (
          <Suspense fallback={<LoadingSpinner />}>
            <ProductModal onAddToCart={addToCart} />
          </Suspense>
        )}

        {/* Cart Modal - Lazy Loaded */}
        {showCart && (
          <Suspense fallback={<LoadingSpinner />}>
            <CartModal
              isOpen={showCart}
              onClose={() => setShowCart(false)}
              onCheckout={handleCheckout}
            />
          </Suspense>
        )}

        {/* Checkout Modal - Lazy Loaded */}
        {showCheckout && (
          <Suspense fallback={<LoadingSpinner />}>
            <CheckoutModal
              isOpen={showCheckout}
              onClose={() => setShowCheckout(false)}
              onCheckoutSuccess={(orderId) => {
                setShowCheckout(false);
                setTrackingOrderId(orderId);
                setShowTracking(true);
              }}
            />
          </Suspense>
        )}

        {/* Sidebar - Lazy Loaded */}
        {showSidebar && (
          <Suspense fallback={<LoadingSpinner />}>
            <Sidebar
              isOpen={showSidebar}
              onClose={() => setShowSidebar(false)}
            />
          </Suspense>
        )}

        {/* Toast Container */}
        <ToastContainer />

        {/* Orders Badge - ✅ NEW: Floating badge for active orders */}
        <OrdersBadge onClick={() => setShowMyOrders(true)} />

        {/* My Orders Modal - Lazy Loaded */}
        {showMyOrders && (
          <Suspense fallback={<LoadingSpinner />}>
            <MyOrdersModal
              isOpen={showMyOrders}
              onClose={() => setShowMyOrders(false)}
              onTrackOrder={(orderId) => {
                setTrackingOrderId(orderId);
                setShowTracking(true);
              }}
            />
          </Suspense>
        )}

        {/* Tracking Modal - Lazy Loaded */}
        {showTracking && (
          <Suspense fallback={<LoadingSpinner />}>
            <TrackingModal
              isOpen={showTracking}
              onClose={() => {
                setShowTracking(false);
                setTrackingOrderId('');
              }}
              initialOrderId={trackingOrderId}
            />
          </Suspense>
        )}
      </div>
    </>
  );
}

// ✅ Main App Component (wraps with all Providers)
function App() {
  return (
    <GlobalProvider>
      <ProductsDataProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ProductsDataProvider>
    </GlobalProvider>
  );
}

export default App;
