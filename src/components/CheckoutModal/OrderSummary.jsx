import React from 'react';
import { useProducts } from '../../context/ProductsContext';
import { Receipt, Loader2, AlertCircle, Info } from 'lucide-react';

/**
 * OrderSummary Component
 * Displays order items and price breakdown
 */
const OrderSummary = ({
  cart,
  products,
  productsLoading,
  prices,
  pricesLoading,
  pricesError,
  deliveryMethod
}) => {
  const { t, currentLang } = useProducts();

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-5 mb-6 border-2 border-pink-100 dark:border-gray-600 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2.5 text-base font-bold mb-4 pb-3 border-b-2 border-pink-200 dark:border-gray-500">
        <Receipt className="w-5 h-5 text-primary" />
        <span className="text-gray-800 dark:text-gray-100">
          {t('orderSummary') || 'ملخص الطلب'}
        </span>
      </div>

      {/* Loading State */}
      {pricesLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-gray-600">
            {currentLang === 'ar' ? 'جاري حساب الأسعار...' : 'Calculating prices...'}
          </span>
        </div>
      ) : pricesError && !prices ? (
        // Error State (without prices)
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{pricesError}</span>
        </div>
      ) : prices ? (
        // Success State (with prices)
        <>
          {/* Cart Items */}
          <div className="space-y-2.5 mb-4">
            {cart.map((item, index) => {
              const product = products[item.productId];
              if (!product) return null;
              
              const productName = currentLang === 'ar' ? product.name : product.nameEn;
              const priceItem = prices.items?.find(p => p.productId === item.productId);
              const itemPrice = priceItem?.price || product.price;
              const itemTotal = priceItem?.subtotal || (itemPrice * item.quantity);
              
              return (
                <div 
                  key={index} 
                  className="flex justify-between items-center text-sm bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src={product.image} 
                      alt={productName} 
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-gray-100">
                        {productName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {itemPrice.toFixed(2)} ج.م × {item.quantity}
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-primary">
                    {itemTotal.toFixed(2)} ج.م
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Price Breakdown */}
          <div className="border-t-2 border-pink-200 dark:border-gray-500 pt-3 space-y-2">
            {/* Subtotal */}
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>{t('subtotal') || 'المجموع الفرعي'}:</span>
              <span className="font-semibold">{prices.subtotal.toFixed(2)} ج.م</span>
            </div>
            
            {/* Delivery Fee */}
            {deliveryMethod === 'delivery' && (
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <span>{t('deliveryFee') || 'رسوم التوصيل'}:</span>
                  {prices.deliveryInfo?.isEstimated && (
                    <span className="inline-flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-0.5 rounded-full text-xs font-bold">
                      {currentLang === 'ar' ? 'تقديري' : 'Est.'}
                    </span>
                  )}
                </div>
                <span className="font-semibold">
                  {prices.deliveryFee > 0 
                    ? `${prices.deliveryFee.toFixed(2)} ج.م` 
                    : (currentLang === 'ar' ? 'مجاني' : 'FREE')
                  }
                </span>
              </div>
            )}
            
            {/* Discount */}
            {prices.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                <span>{t('discount') || 'الخصم'}:</span>
                <span className="font-semibold">-{prices.discount.toFixed(2)} ج.م</span>
              </div>
            )}
            
            {/* Total */}
            <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-gray-100 pt-2 border-t border-pink-200 dark:border-gray-500">
              <span>{t('total') || 'الإجمالي'}:</span>
              <span className="text-primary text-xl">{prices.total.toFixed(2)} ج.م</span>
            </div>
          </div>

          {/* Estimated Delivery Notice */}
          {prices.deliveryInfo?.isEstimated && deliveryMethod === 'delivery' && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <div className="font-bold text-yellow-800 dark:text-yellow-400 mb-1">
                    {currentLang === 'ar' ? 'ملاحظة هامة' : 'Important Note'}
                  </div>
                  <div className="text-yellow-700 dark:text-yellow-500">
                    {prices.deliveryInfo.estimatedMessage?.[currentLang] || 
                     (currentLang === 'ar' 
                       ? 'رسوم التوصيل تقديرية. سيتم التواصل معك لتأكيد الموقع وحساب الرسوم الفعلية.'
                       : 'Delivery fee is estimated. We will contact you to confirm location and calculate actual fee.'
                     )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Offline Notice */}
          {prices.isOffline && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <div className="font-bold text-yellow-800 dark:text-yellow-400 mb-1">
                    {currentLang === 'ar' ? '⚠️ وضع عدم الاتصال' : '⚠️ Offline Mode'}
                  </div>
                  <div className="text-yellow-700 dark:text-yellow-500">
                    {currentLang === 'ar' 
                      ? 'الأسعار تقديرية - سيتم التأكيد عند الاتصال'
                      : 'Prices are estimated - will be confirmed when online'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        // No Prices Yet
        <div className="text-center py-6 text-gray-500 text-sm">
          {currentLang === 'ar' ? 'اختر طريقة التوصيل لعرض الأسعار' : 'Select delivery method to see prices'}
        </div>
      )}
    </div>
  );
};

export default OrderSummary;