import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useGlobal } from './GlobalProvider';

/**
 * CartContext - Isolated Cart State Management
 * 
 * ✅ Separated from ProductsContext to prevent unnecessary re-renders
 * ✅ Only cart-related operations
 * ✅ Components using cart will re-render only when cart changes
 */

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { t } = useGlobal();
  
  // ✅ Cart State - loaded from sessionStorage
  const [cart, setCart] = useState(() => {
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

  // ✅ Save cart to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('cart', JSON.stringify(cart));
        
        // Dispatch event for compatibility
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

  // ✅ Memoized value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartCount,
    getCartTotal
  }), [cart, addToCart, removeFromCart, updateCartQuantity, clearCart, getCartCount, getCartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
