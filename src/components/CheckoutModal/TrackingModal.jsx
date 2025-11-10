import React, { useState, useEffect } from 'react';
import { useProductsData } from '../../context/ProductsDataContext';
import { X, Search, Loader2, Package, Clock, CheckCircle, Truck, MapPin, Phone } from 'lucide-react';

const API_BASE_URL = 'https://softcream-api.mahmoud-zahran20025.workers.dev';

/**
 * TrackingModal Component
 * Track order status by order ID
 */
const TrackingModal = ({ isOpen, onClose, initialOrderId = '' }) => {
  const { t, currentLang } = useProductsData();
  const [orderId, setOrderId] = useState(initialOrderId);
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && initialOrderId) {
      setOrderId(initialOrderId);
      handleTrack(initialOrderId);
    }
  }, [isOpen, initialOrderId]);

  const handleTrack = async (id = orderId) => {
    if (!id || !id.trim()) {
      setError(currentLang === 'ar' ? 'الرجاء إدخال رقم الطلب' : 'Please enter order ID');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const response = await fetch(`${API_BASE_URL}?path=/orders/track&orderId=${encodeURIComponent(id.trim())}`);
      const result = await response.json();

      if (result.success && result.data) {
        setOrderData(result.data);
        console.log('✅ Order tracked:', result.data);
      } else {
        throw new Error(result.message || 'Order not found');
      }
    } catch (err) {
      console.error('❌ Tracking failed:', err);
      setError(err.message || (currentLang === 'ar' ? 'فشل تتبع الطلب' : 'Failed to track order'));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'confirmed', icon: CheckCircle, labelAr: 'تم التأكيد', labelEn: 'Confirmed' },
      { key: 'preparing', icon: Package, labelAr: 'قيد التحضير', labelEn: 'Preparing' },
      { key: 'ready', icon: CheckCircle, labelAr: 'جاهز', labelEn: 'Ready' },
      { key: 'out_for_delivery', icon: Truck, labelAr: 'في الطريق', labelEn: 'Out for Delivery' },
      { key: 'delivered', icon: CheckCircle, labelAr: 'تم التوصيل', labelEn: 'Delivered' }
    ];

    const currentStatus = orderData?.status || 'confirmed';
    const statusIndex = steps.findIndex(s => s.key === currentStatus);

    return steps.map((step, idx) => ({
      ...step,
      isActive: idx <= statusIndex,
      isCurrent: idx === statusIndex
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[9200] flex items-center justify-center p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-[650px] w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-7">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-[26px] font-black text-gray-800 dark:text-gray-100 mb-2">
            {currentLang === 'ar' ? 'تتبع الطلب' : 'Track Order'}
          </h3>
          <p className="text-base text-gray-600 dark:text-gray-400">
            {currentLang === 'ar' ? 'أدخل رقم الطلب لتتبع حالته' : 'Enter order ID to track status'}
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary transition-all"
              placeholder={currentLang === 'ar' ? 'رقم الطلب (مثال: ORD-123456)' : 'Order ID (e.g., ORD-123456)'}
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
              dir="ltr"
            />
            <button
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              onClick={() => handleTrack()}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {currentLang === 'ar' ? 'بحث' : 'Search'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Order Details */}
        {orderData && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-5 border-2 border-pink-100 dark:border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLang === 'ar' ? 'رقم الطلب' : 'Order ID'}
                  </div>
                  <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    #{orderData.id}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLang === 'ar' ? 'التاريخ' : 'Date'}
                  </div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {formatDate(orderData.createdAt)}
                  </div>
                </div>
              </div>

              {orderData.customer && (
                <div className="space-y-2 text-sm">
                  {orderData.customer.phone && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Phone className="w-4 h-4" />
                      <span dir="ltr">{orderData.customer.phone}</span>
                    </div>
                  )}
                  {orderData.customer.address && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>{orderData.customer.address}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status Timeline */}
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600">
              <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-4">
                {currentLang === 'ar' ? 'حالة الطلب' : 'Order Status'}
              </h4>
              <div className="space-y-4">
                {getStatusSteps().map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                      } ${step.isCurrent ? 'ring-4 ring-primary/30' : ''}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${step.isActive ? 'text-gray-800 dark:text-gray-100' : 'text-gray-400'}`}>
                          {currentLang === 'ar' ? step.labelAr : step.labelEn}
                        </div>
                        {step.isCurrent && orderData.eta && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{orderData.eta}</span>
                          </div>
                        )}
                      </div>
                      {step.isActive && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            {orderData.items && orderData.items.length > 0 && (
              <div className="bg-white dark:bg-gray-700 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600">
                <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-4">
                  {currentLang === 'ar' ? 'المنتجات' : 'Items'}
                </h4>
                <div className="space-y-2">
                  {orderData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-bold text-gray-800 dark:text-gray-100">
                        {item.total?.toFixed(2)} ج.م
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-300 dark:border-gray-500 flex justify-between font-bold text-base">
                    <span className="text-gray-800 dark:text-gray-100">
                      {currentLang === 'ar' ? 'الإجمالي:' : 'Total:'}
                    </span>
                    <span className="text-primary">
                      {orderData.totals?.total?.toFixed(2)} ج.م
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Close Button */}
        <button
          className="mt-6 w-full py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          onClick={onClose}
        >
          {currentLang === 'ar' ? 'إغلاق' : 'Close'}
        </button>
      </div>
    </div>
  );
};

export default TrackingModal;
