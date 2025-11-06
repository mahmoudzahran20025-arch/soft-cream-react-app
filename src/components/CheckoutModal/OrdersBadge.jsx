import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { storage } from '../../services/storage';

/**
 * OrdersBadge Component
 * Displays active orders count badge
 * Listens to 'ordersUpdated' event for real-time updates
 */
const OrdersBadge = ({ onClick }) => {
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    // Initial load
    updateCount();

    // Listen for orders updates
    const handleOrdersUpdated = () => {
      updateCount();
    };

    window.addEventListener('ordersUpdated', handleOrdersUpdated);

    return () => {
      window.removeEventListener('ordersUpdated', handleOrdersUpdated);
    };
  }, []);

  const updateCount = () => {
    const count = storage.getActiveOrdersCount();
    setActiveCount(count);
  };

  if (activeCount === 0) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[9000] bg-gradient-to-r from-primary to-primary-dark text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all hover:scale-110 active:scale-95"
      aria-label={`${activeCount} active orders`}
    >
      <div className="relative">
        <ShoppingBag className="w-6 h-6" />
        {activeCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {activeCount > 9 ? '9+' : activeCount}
          </span>
        )}
      </div>
    </button>
  );
};

export default OrdersBadge;
