import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductsContext';
import { X, ShoppingCart, Calculator, ShieldCheck, Truck, CheckCircle2, Minus, Plus, Trash2, Flame, Droplets, Wheat, Activity, Brain, Zap } from 'lucide-react';

/**
 * CartModal Component - Pure React Cart Implementation
 * 
 * ✅ Replaces: js/cart.js
 * ✅ Uses: ProductsContext for cart state (reactive)
 * ✅ Real-time updates - No stale state
 * ✅ Fully integrated with React ecosystem
 */
const CartModal = ({ isOpen, onClose, onCheckout }) => {
  // ✅ استخدام Context بدلاً من useState المحلي
  const { 
    t, 
    currentLang,
    cart,                    // ✅ من Context
    products,                // ✅ من Context
    updateCartQuantity,      // ✅ من Context
    removeFromCart,          // ✅ من Context
    clearCart,               // ✅ من Context
    getCartCount,            // ✅ من Context
    getCartTotal             // ✅ من Context
  } = useProducts();
  
  const [nutritionData, setNutritionData] = useState(null);
  const [nutritionLoading, setNutritionLoading] = useState(false);

  // ✅ Fetch nutrition summary from backend
  useEffect(() => {
    if (cart.length === 0) {
      setNutritionData(null);
      return;
    }

    const fetchNutrition = async () => {
      setNutritionLoading(true);
      try {
        const productIds = cart.map(item => item.productId);
        const response = await fetch(
          'https://softcream-api.mahmoud-zahran20025.workers.dev?path=/products/nutrition-summary',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productIds })
          }
        );
        const result = await response.json();
        if (result.success && result.data) {
          setNutritionData(result.data);
          console.log('✅ Nutrition data loaded:', result.data);
        }
      } catch (error) {
        console.error('❌ Failed to fetch nutrition:', error);
      } finally {
        setNutritionLoading(false);
      }
    };

    fetchNutrition();
  }, [cart]);

  // ✅ جميع العمليات من Context - لا حاجة لدوال محلية

  // ========================================
  // Render Helpers
  // ========================================

  const formatPrice = (price) => {
    return currentLang === 'ar' ? `${price} ج.م` : `${price} EGP`;
  };

  const getProductName = (product) => {
    if (!product) return '';
    return currentLang === 'ar' ? product.name : product.nameEn;
  };

  // ========================================
  // Event Handlers
  // ========================================

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (onCheckout) {
      onCheckout();
    }
  };

  const handleClose = (e) => {
    if (e) e.stopPropagation();
    onClose();
  };

  // ========================================
  // Render
  // ========================================

  if (!isOpen) return null;

  const totalItems = getCartCount();
  const total = getCartTotal(products);
  const isEmpty = cart.length === 0;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-[9999] flex items-end md:items-center justify-center md:p-6"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-3xl max-w-[750px] w-full max-h-[92vh] md:max-h-[85vh] overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-pink-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center shadow-sm">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100" id="cart-title">
              {t('cartTitle') || 'سلة الطلبات'}
            </span>
            <span className="min-w-[28px] h-6 px-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-bold flex items-center justify-center shadow-lg">
              {totalItems}
            </span>
          </div>
          <button
            className="w-11 h-11 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-500 hover:text-white flex items-center justify-center transition-[transform,background-color] hover:rotate-90 duration-300 hover:shadow-lg active:scale-95 border-2 border-transparent hover:border-red-500"
            onClick={handleClose}
            aria-label={t('closeCart') || 'إغلاق السلة'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-5 min-h-[350px] max-h-[calc(92vh-240px)] md:max-h-[calc(85vh-280px)] overflow-y-auto">
          {isEmpty ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mb-5 animate-pulse">
                <ShoppingCart className="w-12 h-12 text-pink-300 dark:text-gray-500" />
              </div>
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                {t('cartEmptyTitle') || 'سلتك فارغة حالياً'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('cartEmptySubtitle') || 'أضف بعض الآيس كريم اللذيذ! 🍦'}
              </p>
            </div>
          ) : (
            // Cart Items List
            <div className="space-y-4">
              {cart.map((item) => {
                const product = products[item.productId];
                if (!product) {
                  return (
                    <div key={item.productId} className="p-4 bg-gray-100 rounded-lg animate-pulse">
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-4 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <img
                      src={product.image}
                      alt={getProductName(product)}
                      className="w-20 h-20 object-cover rounded-xl"
                      loading="lazy"
                    />

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate">
                        {getProductName(product)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {formatPrice(product.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-gray-800 dark:text-gray-100 min-w-[30px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="ml-auto w-8 h-8 rounded-full bg-red-100 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">
                        {formatPrice(product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ✅ Nutrition Summary - داخل scroll div */}
          {!isEmpty && nutritionData && (
          <div className="px-5 py-4 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 border-y border-orange-100 dark:border-gray-600">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              {currentLang === 'ar' ? 'ملخص التغذية' : 'Nutrition Summary'}
            </h3>
            
            {/* Macros Grid */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
                <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {nutritionData.totalCalories || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {currentLang === 'ar' ? 'سعرات' : 'calories'}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
                <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {(nutritionData.totalProtein || 0).toFixed(1)}g
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {currentLang === 'ar' ? 'بروتين' : 'protein'}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
                <Wheat className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {(nutritionData.totalCarbs || 0).toFixed(1)}g
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {currentLang === 'ar' ? 'كربوهيدرات' : 'carbs'}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm">
                <Activity className="w-5 h-5 text-red-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {(nutritionData.totalFat || 0).toFixed(1)}g
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {currentLang === 'ar' ? 'دهون' : 'fat'}
                </div>
              </div>
            </div>

            {/* Energy Breakdown */}
            {(nutritionData.mentalEnergy > 0 || nutritionData.physicalEnergy > 0 || nutritionData.balancedEnergy > 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 space-y-2 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  {currentLang === 'ar' ? 'توزيع الطاقة' : 'Energy Distribution'}
                </h4>
                {nutritionData.mentalEnergy > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {currentLang === 'ar' ? 'ذهنية' : 'Mental'}
                      </span>
                    </div>
                    <span className="font-bold text-purple-600">{nutritionData.mentalEnergy}</span>
                  </div>
                )}
                {nutritionData.physicalEnergy > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-orange-600" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {currentLang === 'ar' ? 'بدنية' : 'Physical'}
                      </span>
                    </div>
                    <span className="font-bold text-orange-600">{nutritionData.physicalEnergy}</span>
                  </div>
                )}
                {nutritionData.balancedEnergy > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {currentLang === 'ar' ? 'متوازنة' : 'Balanced'}
                      </span>
                    </div>
                    <span className="font-bold text-green-600">{nutritionData.balancedEnergy}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          )}
        </div>

        {/* Footer (Total & Checkout) - ✅ خارج scroll div */}
        {!isEmpty && (
          <div className="p-5 border-t border-pink-100 dark:border-gray-700 space-y-4 sticky bottom-0 bg-white dark:bg-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-10">
            {/* Total */}
            <div className="flex justify-between items-center bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 shadow-sm border border-pink-100 dark:border-gray-600">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                  {t('cartTotal') || 'الإجمالي:'}
                </span>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {formatPrice(total)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-glow active:scale-95 relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <CheckCircle2 className="w-6 h-6 relative z-10" />
              <span className="relative z-10">
                {t('checkoutButton') || 'إتمام الطلب'}
              </span>
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-pink-100 dark:border-gray-700">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span>{t('securePayment') || 'دفع آمن'}</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-500" />
                <span>{t('fastDelivery') || 'توصيل سريع'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
