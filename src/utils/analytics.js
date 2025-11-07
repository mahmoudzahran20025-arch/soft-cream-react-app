/**
 * Analytics & Tracking Utilities
 * 
 * TODO: Integration Steps
 * ========================
 * 
 * 1. Choose your analytics provider:
 *    - Google Analytics 4 (GA4)
 *    - Facebook Pixel
 *    - Custom Analytics API
 * 
 * 2. Install dependencies:
 *    npm install react-ga4
 *    OR
 *    npm install react-facebook-pixel
 * 
 * 3. Initialize in App.jsx:
 *    import { initAnalytics } from './utils/analytics';
 *    useEffect(() => {
 *      initAnalytics();
 *    }, []);
 * 
 * 4. Uncomment tracking calls in components:
 *    - FeaturedSwiper.jsx (lines 8, 180, 198, 283)
 *    - ProductsGrid.jsx (TODO: add tracking)
 */

// ============================================
// CONFIGURATION
// ============================================

const ANALYTICS_CONFIG = {
  // TODO: Add your tracking IDs
  GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX', // Replace with your GA4 ID
  FB_PIXEL_ID: 'XXXXXXXXXX', // Replace with your Facebook Pixel ID
  
  // Enable/disable tracking
  enabled: false, // Set to true when ready
  debug: true, // Set to false in production
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize analytics tracking
 * Call this once in App.jsx useEffect
 */
export const initAnalytics = () => {
  if (!ANALYTICS_CONFIG.enabled) {
    console.log('📊 Analytics disabled - set ANALYTICS_CONFIG.enabled = true to enable');
    return;
  }

  // TODO: Initialize Google Analytics 4
  // import ReactGA from 'react-ga4';
  // ReactGA.initialize(ANALYTICS_CONFIG.GA4_MEASUREMENT_ID);
  
  // TODO: Initialize Facebook Pixel
  // import ReactPixel from 'react-facebook-pixel';
  // ReactPixel.init(ANALYTICS_CONFIG.FB_PIXEL_ID);
  
  if (ANALYTICS_CONFIG.debug) {
    console.log('✅ Analytics initialized');
  }
};

// ============================================
// EVENT TRACKING
// ============================================

/**
 * Track custom events
 * @param {string} eventName - Name of the event
 * @param {object} eventParams - Additional parameters
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (!ANALYTICS_CONFIG.enabled) {
    if (ANALYTICS_CONFIG.debug) {
      console.log('📊 [Analytics Debug]', eventName, eventParams);
    }
    return;
  }

  // TODO: Send to Google Analytics
  // import ReactGA from 'react-ga4';
  // ReactGA.event({
  //   category: eventParams.category || 'User Interaction',
  //   action: eventName,
  //   label: eventParams.label,
  //   value: eventParams.value,
  // });

  // TODO: Send to Facebook Pixel
  // import ReactPixel from 'react-facebook-pixel';
  // ReactPixel.track(eventName, eventParams);

  if (ANALYTICS_CONFIG.debug) {
    console.log('✅ Event tracked:', eventName, eventParams);
  }
};

// ============================================
// PAGE VIEW TRACKING
// ============================================

/**
 * Track page views
 * @param {string} path - Page path
 */
export const trackPageView = (path) => {
  if (!ANALYTICS_CONFIG.enabled) return;

  // TODO: Send to Google Analytics
  // import ReactGA from 'react-ga4';
  // ReactGA.send({ hitType: 'pageview', page: path });

  if (ANALYTICS_CONFIG.debug) {
    console.log('✅ Page view tracked:', path);
  }
};

// ============================================
// E-COMMERCE TRACKING
// ============================================

/**
 * Track product views
 * @param {object} product - Product data
 */
export const trackProductView = (product) => {
  trackEvent('view_item', {
    category: 'E-commerce',
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    price: product.price,
  });
};

/**
 * Track add to cart
 * @param {object} product - Product data
 * @param {number} quantity - Quantity added
 */
export const trackAddToCart = (product, quantity = 1) => {
  trackEvent('add_to_cart', {
    category: 'E-commerce',
    item_id: product.id,
    item_name: product.name,
    item_category: product.category,
    price: product.price,
    quantity: quantity,
    value: product.price * quantity,
  });
};

/**
 * Track purchase
 * @param {array} items - Cart items
 * @param {number} total - Total amount
 * @param {string} orderId - Order ID
 */
export const trackPurchase = (items, total, orderId) => {
  trackEvent('purchase', {
    category: 'E-commerce',
    transaction_id: orderId,
    value: total,
    currency: 'EGP',
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

// ============================================
// HERO SWIPER TRACKING
// ============================================

/**
 * Track hero swiper initialization
 * @param {number} slidesCount - Number of slides
 */
export const trackHeroSwiperInit = (slidesCount) => {
  trackEvent('hero_swiper_init', {
    category: 'Hero Swiper',
    slides_count: slidesCount,
  });
};

/**
 * Track hero slide view
 * @param {object} slideData - Slide data
 */
export const trackHeroSlideView = (slideData) => {
  trackEvent('hero_slide_view', {
    category: 'Hero Swiper',
    slide_id: slideData.id,
    slide_title: slideData.headline,
  });
};

/**
 * Track hero CTA click
 * @param {object} slideData - Slide data
 */
export const trackHeroCTAClick = (slideData) => {
  trackEvent('hero_cta_click', {
    category: 'Hero Swiper',
    slide_id: slideData.id,
    cta_text: slideData.ctaText,
    cta_link: slideData.ctaLink,
    category_filter: slideData.category,
  });
};

// ============================================
// PRODUCTS GRID TRACKING
// ============================================

/**
 * Track products swiper interaction
 * @param {string} category - Product category
 * @param {number} slideIndex - Current slide index
 */
export const trackProductsSwiperInteraction = (category, slideIndex) => {
  trackEvent('products_swiper_interaction', {
    category: 'Products Grid',
    product_category: category,
    slide_index: slideIndex,
  });
};

// ============================================
// SCROLL TRACKING
// ============================================

/**
 * Track scroll to section
 * @param {string} sectionId - Section ID
 * @param {string} source - Source of scroll (e.g., 'hero_cta', 'nav_link')
 */
export const trackScrollToSection = (sectionId, source) => {
  trackEvent('scroll_to_section', {
    category: 'Navigation',
    section_id: sectionId,
    source: source,
  });
};

// ============================================
// USAGE EXAMPLES
// ============================================

/*
// In FeaturedSwiper.jsx:
import { trackHeroSwiperInit, trackHeroSlideView, trackHeroCTAClick } from '../utils/analytics';

onInit: (swiper) => {
  trackHeroSwiperInit(swiper.slides.length);
},

onSlideChange: (swiper) => {
  const slideData = SLIDES_DATA[swiper.realIndex];
  trackHeroSlideView(slideData);
},

onClick: () => {
  trackHeroCTAClick(slide);
}

// In ProductCard.jsx:
import { trackProductView, trackAddToCart } from '../utils/analytics';

onProductClick: () => {
  trackProductView(product);
}

onAddToCart: () => {
  trackAddToCart(product, quantity);
}

// In CheckoutModal.jsx:
import { trackPurchase } from '../utils/analytics';

onCheckoutSuccess: (orderId) => {
  trackPurchase(cartItems, total, orderId);
}
*/

// ============================================
// INTEGRATION CHECKLIST
// ============================================

/*
TODO: Integration Checklist
============================

□ 1. Install analytics library:
   npm install react-ga4
   OR
   npm install react-facebook-pixel

□ 2. Add tracking IDs in ANALYTICS_CONFIG above

□ 3. Set ANALYTICS_CONFIG.enabled = true

□ 4. Initialize in App.jsx:
   import { initAnalytics } from './utils/analytics';
   useEffect(() => {
     initAnalytics();
   }, []);

□ 5. Uncomment tracking calls in:
   - FeaturedSwiper.jsx (lines 8, 180, 198, 283)
   - ProductCard.jsx (add trackProductView, trackAddToCart)
   - CheckoutModal.jsx (add trackPurchase)

□ 6. Test in development (ANALYTICS_CONFIG.debug = true)

□ 7. Deploy and verify in analytics dashboard

□ 8. Set ANALYTICS_CONFIG.debug = false in production
*/

export default {
  initAnalytics,
  trackEvent,
  trackPageView,
  trackProductView,
  trackAddToCart,
  trackPurchase,
  trackHeroSwiperInit,
  trackHeroSlideView,
  trackHeroCTAClick,
  trackProductsSwiperInteraction,
  trackScrollToSection,
};
