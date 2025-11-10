import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useGlobal } from './GlobalProvider';
import { api } from '../services/api';

/**
 * ProductsDataContext - Read-Only Products Data
 * 
 * ✅ Separated from cart logic to prevent re-renders
 * ✅ Only products, filters, and product operations
 * ✅ Components using products won't re-render when cart changes
 */

const ProductsDataContext = createContext();

export const useProductsData = () => {
  const context = useContext(ProductsDataContext);
  if (!context) {
    throw new Error('useProductsData must be used within ProductsDataProvider');
  }
  return context;
};

export const ProductsDataProvider = ({ children }) => {
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
  
  const { language: currentLang, t: globalT } = useGlobal();

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.getProducts();
      
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

  // Get recommendations
  const getRecommendations = useCallback(async (productId, limit = 5) => {
    try {
      const data = await api.getRecommendations(productId, limit);
      return data || [];
    } catch (err) {
      console.error('Failed to get recommendations:', err);
      return [];
    }
  }, []);

  // ✅ CLIENT-SIDE FILTERING: Apply all filters locally
  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    
    let filtered = [...products];
    
    // 1️⃣ Search filter
    if (newFilters.searchQuery && newFilters.searchQuery.trim()) {
      const query = newFilters.searchQuery.trim().toLowerCase();
      filtered = filtered.filter(product => {
        const name = (product.name || '').toLowerCase();
        const nameEn = (product.nameEn || '').toLowerCase();
        const tags = (product.tags || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        
        return name.includes(query) || 
               nameEn.includes(query) || 
               tags.includes(query) || 
               description.includes(query);
      });
    }
    
    // 2️⃣ Category filter
    if (newFilters.category) {
      filtered = filtered.filter(product => 
        product.category === newFilters.category || 
        product.categoryEn === newFilters.category
      );
    }
    
    // 3️⃣ Energy type filter
    if (newFilters.energyType) {
      filtered = filtered.filter(product => 
        product.energy_type === newFilters.energyType
      );
    }
    
    // 4️⃣ Calorie range filter
    if (newFilters.minCalories !== null && newFilters.minCalories !== undefined) {
      filtered = filtered.filter(product => 
        (product.calories || 0) >= newFilters.minCalories
      );
    }
    if (newFilters.maxCalories !== null && newFilters.maxCalories !== undefined) {
      filtered = filtered.filter(product => 
        (product.calories || 0) <= newFilters.maxCalories
      );
    }
    
    console.log(`🎯 Client-side filtering: ${products.length} → ${filtered.length} products`);
    setFilteredProducts(filtered);
  }, [products]);

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

  // ✅ Create productsMap for easy access
  const productsMap = useMemo(() => {
    const map = {};
    products.forEach(product => {
      if (product && product.id) {
        map[product.id] = product;
      }
    });
    return map;
  }, [products]);

  // ✅ Memoized value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    products,
    productsMap,
    filteredProducts,
    selectedProduct,
    loading,
    error,
    filters,
    currentLang,
    t: globalT,
    fetchProducts,
    getRecommendations,
    applyFilters,
    openProduct,
    closeProduct
  }), [
    products,
    productsMap,
    filteredProducts,
    selectedProduct,
    loading,
    error,
    filters,
    currentLang,
    globalT,
    fetchProducts,
    getRecommendations,
    applyFilters,
    openProduct,
    closeProduct
  ]);

  return (
    <ProductsDataContext.Provider value={value}>
      {children}
    </ProductsDataContext.Provider>
  );
};

export default ProductsDataProvider;
