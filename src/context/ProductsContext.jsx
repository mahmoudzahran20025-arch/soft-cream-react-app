import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useGlobal } from './GlobalProvider';
import { api } from '../services/api';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: null,
    energyType: null,
    minCalories: null,
    maxCalories: null,
    searchQuery: ''
  });
  
  // ✅ Use GlobalProvider for language and translation
  const { language: currentLang, t: globalT } = useGlobal();

  // ✅ المرحلة 3: إضافة Cart State
  const [cart, setCart] = useState(() => {
    // Load cart from sessionStorage on init
    if (typeof window !== 'undefined') {
      try {
        const savedCart = sessionStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
      } catch (error) {
        console.error('Failed to load cart from sessionStorage:', error);
        return [];
      }
    }
    return [];
  });

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.getProducts();
      
      // Validate that data is an array
      if (Array.isArray(data)) {
        setProducts(data);
        setFilteredProducts(data);
        console.log('✅ Products loaded:', data.length);
      } else {
        console.warn('⚠️ Invalid API response format:', data);
        setProducts([]);
        setFilteredProducts([]);
        setError(api.getErrorMessage(new Error('Invalid data format'), currentLang));
      }
    } catch (err) {
      console.error('❌ Failed to fetch products:', err);
      setError(api.getErrorMessage(err, currentLang));
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentLang]);

  // Discover products with filters
  const discoverProducts = useCallback(async (filterParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await api.discoverProducts(filterParams);
      
      if (result?.products) {
        setFilteredProducts(result.products);
      }
    } catch (err) {
      console.error('Failed to discover products:', err);
      setError(api.getErrorMessage(err, currentLang));
    } finally {
      setLoading(false);
    }
  }, [currentLang]);

  // Search products
  const searchProducts = useCallback(async (query) => {
    if (!query || query.trim().length === 0) {
      setFilteredProducts(products);
      return;
    }

    try {
      setLoading(true);
      const data = await api.searchProducts(query);
      
      if (data) {
        setFilteredProducts(data);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError(api.getErrorMessage(err, currentLang));
    } finally {
      setLoading(false);
    }
  }, [products, currentLang]);

  // Get recommendations
  const getRecommendations = useCallback(async (productId, limit = 5) => {
    try {
      const response = await fetch(`${API_BASE_URL}?path=/products/recommendations/${productId}&limit=${limit}`);
      const result = await response.json();
      return result.data || [];
    } catch (err) {
      console.error('Failed to get recommendations:', err);
      return [];
    }
  }, []);

  // Apply filters
  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    
    // If search query exists, use search
    if (newFilters.searchQuery) {
      searchProducts(newFilters.searchQuery);
      return;
    }
    
    // Otherwise use discovery with filters
    const filterParams = {};
    if (newFilters.category) filterParams.category = newFilters.category;
    if (newFilters.energyType) filterParams.energyType = newFilters.energyType;
    if (newFilters.minCalories) filterParams.minCalories = newFilters.minCalories;
    if (newFilters.maxCalories) filterParams.maxCalories = newFilters.maxCalories;
    
    if (Object.keys(filterParams).length > 0) {
      discoverProducts(filterParams);
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchProducts, discoverProducts]);

  // Open product modal
  const openProduct = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  // Close product modal
  const closeProduct = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  // Language is now managed by GlobalProvider - no need for separate effect
  
  // ✅ Use translation function from GlobalProvider
  const t = globalT;

  // ✅ Save cart to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('cart', JSON.stringify(cart));
        
        // Dispatch event for Vanilla JS compatibility
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        window.dispatchEvent(new CustomEvent('react-cart-updated', {
          detail: { count: cartCount, cart }
        }));
        
        console.log('✅ Cart saved to sessionStorage:', cart);
      } catch (error) {
        console.error('Failed to save cart to sessionStorage:', error);
      }
    }
  }, [cart]);

  // ========================================
  // Cart Operations
  // ========================================

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.productId === product.id);
      
      const MAX_QUANTITY = 50;
      
      if (existing) {
        if (existing.quantity + quantity > MAX_QUANTITY) {
          alert(t('errorMaxQuantity', { max: MAX_QUANTITY }) || `Maximum ${MAX_QUANTITY} items`);
          return prevCart;
        }
        return prevCart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { productId: product.id, quantity }];
    });
    
    console.log('✅ Product added to cart:', product.name || product.nameEn);
  }, [t]);

  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    console.log('✅ Product removed from cart:', productId);
  }, []);

  const updateCartQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const MAX_QUANTITY = 50;
    if (quantity > MAX_QUANTITY) {
      alert(t('errorMaxQuantity', { max: MAX_QUANTITY }) || `Maximum ${MAX_QUANTITY} items`);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart, t]);

  const clearCart = useCallback(() => {
    setCart([]);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('cart');
    }
    console.log('✅ Cart cleared');
  }, []);

  const getCartCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const getCartTotal = useCallback((productsMap) => {
    return cart.reduce((total, item) => {
      const product = productsMap[item.productId];
      if (!product) return total;
      return total + (product.price * item.quantity);
    }, 0);
  }, [cart]);

  // ✅ إنشاء productsMap لتسهيل الوصول في CartModal
  const productsMap = useMemo(() => {
    const map = {};
    products.forEach(product => {
      if (product && product.id) {
        map[product.id] = product;
      }
    });
    return map;
  }, [products]);

  const value = {
    products,
    productsMap, // ✅ خريطة المنتجات
    filteredProducts,
    selectedProduct,
    loading, // ✅ لتجنب race condition
    error,
    filters,
    currentLang, // ✅ تمرير اللغة الحالية
    t, // ✅ تمرير دالة الترجمة
    cart, // ✅ Cart state
    fetchProducts,
    discoverProducts,
    searchProducts,
    getRecommendations,
    applyFilters,
    openProduct,
    closeProduct,
    // ✅ Cart operations
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartCount,
    getCartTotal
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
