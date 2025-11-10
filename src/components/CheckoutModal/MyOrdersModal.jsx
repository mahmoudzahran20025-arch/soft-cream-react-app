import React, { useState, useEffect } from 'react';
import { useProductsData } from '../../context/ProductsDataContext';
import { X, Package, Clock, CheckCircle, XCircle, Truck, MapPin } from 'lucide-react';
import { storage } from '../../services/storage';

/**
 * MyOrdersModal Component
 * Displays user's order history from localStorage
 */
const MyOrdersModal = ({ isOpen, onClose, onTrackOrder }) => {
  const { t, currentLang } = useProductsData();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

  const loadOrders = () => {
    const allOrders = storage.getOrders();
    setOrders(allOrders);
    console.log('📦 Loaded orders:', allOrders.length);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'preparing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'out_for_delivery':
      case 'ready':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      ar: {
        pending: 'قيد الانتظار',
        confirmed: 'تم التأكيد',
        preparing: 'قيد التحضير',
        ready: 'جاهز للاستلام',
        out_for_delivery: 'في الطريق',
        delivered: 'تم التوصيل',
        cancelled: 'ملغي'
      },
      en: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        preparing: 'Preparing',
        ready: 'Ready',
        out_for_delivery: 'Out for Delivery',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      }
    };
    return statusMap[currentLang]?.[status] || status;
  };

  const formatDate = (dateString) => {
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
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-[700px] w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
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
            {currentLang === 'ar' ? 'طلباتي' : 'My Orders'}
          </h3>
          <p className="text-base text-gray-600 dark:text-gray-400">
            {currentLang === 'ar' ? 'تاريخ طلباتك السابقة' : 'Your order history'}
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {currentLang === 'ar' ? 'لا توجد طلبات سابقة' : 'No previous orders'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="font-bold text-gray-800 dark:text-gray-100">
                      {currentLang === 'ar' ? 'طلب رقم' : 'Order'} #{order.id}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Order Details */}
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  
                  {order.deliveryMethod === 'delivery' && order.customer?.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{order.customer.address}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-300 dark:border-gray-500">
                    <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                      {currentLang === 'ar' ? 'المنتجات:' : 'Items:'}
                    </div>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="font-bold">{item.total?.toFixed(2)} ج.م</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-300 dark:border-gray-500 flex justify-between font-bold text-base text-gray-800 dark:text-gray-100">
                    <span>{currentLang === 'ar' ? 'الإجمالي:' : 'Total:'}</span>
                    <span className="text-primary">{order.totals?.total?.toFixed(2)} ج.م</span>
                  </div>
                </div>

                {/* Track Button */}
                {['confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(order.status) && (
                  <button
                    className="mt-4 w-full py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all"
                    onClick={() => {
                      onClose();
                      onTrackOrder(order.id);
                    }}
                  >
                    {currentLang === 'ar' ? 'تتبع الطلب' : 'Track Order'}
                  </button>
                )}
              </div>
            ))}
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

export default MyOrdersModal;
