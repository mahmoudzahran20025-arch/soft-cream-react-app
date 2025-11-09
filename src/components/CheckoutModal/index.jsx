import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductsContext';
import { X, ShoppingCart, Loader2 } from 'lucide-react';
import DeliveryOptions from './DeliveryOptions';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import { api } from '../../services/api';
import { validateCheckoutForm, validateEgyptianPhone } from './validation';
import { storage } from '../../services/storage';

/**
 * CheckoutModal - Main Container
 * Orchestrates the checkout flow
 */
const CheckoutModal = ({ isOpen, onClose, cart = [], onCheckoutSuccess }) => {
  const { t, currentLang, clearCart, productsMap } = useProducts();

  // ================================================================
  // State Management
  // ================================================================
  const [deliveryMethod, setDeliveryMethod] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', notes: '', couponCode: ''
  });
  
  const [errors, setErrors] = useState({});
  const [couponStatus, setCouponStatus] = useState(null);
  const [couponData, setCouponData] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  
  const [prices, setPrices] = useState(null);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [pricesError, setPricesError] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  // Products now come from ProductsContext via productsMap
  // const [products, setProducts] = useState({});
  // const [productsLoading, setProductsLoading] = useState(true);

  // ================================================================
  // Load Initial Data
  // ================================================================
  useEffect(() => {
    if (isOpen && cart.length > 0) {
      loadInitialData();
    }
  }, [isOpen, cart]);

  const loadInitialData = async () => {
    // Reset state
    setDeliveryMethod(null);
    setSelectedBranch(null);
    setUserLocation(null);
    setPrices(null);
    setCouponStatus(null);
    setCouponData(null);
    setErrors({});
    setSubmitError(null);
    
    // Load branches only (products come from ProductsContext)
    setBranchesLoading(true);
    try {
      const branchesData = await api.getBranches();
      setBranches(branchesData);
    } catch (error) {
      console.error('Failed to load branches:', error);
    } finally {
      setBranchesLoading(false);
    }
  };

  // ================================================================
  // Price Calculation Effect
  // ================================================================
  useEffect(() => {
    if (!isOpen || !deliveryMethod || cart.length === 0) {
      return;
    }

    const recalculatePrices = async () => {
      console.log('🔄 Recalculating prices...');
      setPricesLoading(true);
      setPricesError(null);

      try {
        const pricesData = await api.calculateOrderPrices(
          cart.map(item => ({
            productId: item.productId || item.id,
            quantity: item.quantity
          })),
          (couponStatus === 'valid' && formData.couponCode) ? formData.couponCode.trim() : null,
          deliveryMethod,
          formData.phone.replace(/\D/g, '') || null,
          userLocation,
          getAddressInputType()
        );

        setPrices(pricesData);
        console.log('✅ Prices calculated:', pricesData);
      } catch (error) {
        console.error('❌ Price calculation failed:', error);
        setPricesError(error.message);
        
        // Fallback to local calculation
        const fallbackPrices = calculateFallbackPrices();
        setPrices(fallbackPrices);
      } finally {
        setPricesLoading(false);
      }
    };

    // Debounce recalculation
    const timer = setTimeout(recalculatePrices, 300);
    return () => clearTimeout(timer);
  }, [isOpen, deliveryMethod, selectedBranch, userLocation,  couponStatus]);
  //formData.phone,  

  // ================================================================
  // Helper Functions
  // ================================================================
  const getAddressInputType = () => {
    if (deliveryMethod !== 'delivery') return null;
    if (userLocation?.lat && userLocation?.lng) return 'gps';
    if (formData.address.trim()) return 'manual';
    return null;
  };

  const calculateFallbackPrices = () => {
    const subtotal = cart.reduce((sum, item) => {
      const product = productsMap[item.productId];
      return sum + ((product?.price || 0) * item.quantity);
    }, 0);
    
    const deliveryFee = deliveryMethod === 'delivery' ? 20 : 0;
    const discount = couponData?.discountAmount || 0;
    
    return {
      subtotal,
      deliveryFee,
      discount,
      total: subtotal + deliveryFee - discount,
      isOffline: true,
      deliveryInfo: { isEstimated: true }
    };
  };

  // ================================================================
  // Form Handlers
  // ================================================================
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleDeliveryMethodChange = (method) => {
    setDeliveryMethod(method);
    if (method === 'pickup') {
      setUserLocation(null);
      setLocationError(null);
    } else {
      setSelectedBranch(null);
    }
    if (errors.deliveryMethod) {
      setErrors(prev => ({ ...prev, deliveryMethod: null }));
    }
  };

  const handleBranchSelect = (branchId) => {
    setSelectedBranch(branchId);
    if (errors.branch) {
      setErrors(prev => ({ ...prev, branch: null }));
    }
  };

  // ================================================================
  // Location Handler
  // ================================================================
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t('errorGeolocationNotSupported') || 'Geolocation not supported');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };

        console.log('✅ GPS Location obtained:', location);
        setUserLocation(location);
        
        // Auto-fill address
        const coords = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;
        const accuracy = Math.round(position.coords.accuracy);
        handleInputChange('address', 
          currentLang === 'ar' 
            ? `الموقع الحالي (${coords}) - الدقة: ${accuracy}م`
            : `Current location (${coords}) - Accuracy: ${accuracy}m`
        );
        
        setLocationLoading(false);
      },
      (error) => {
        console.error('❌ GPS error:', error);
        const errorMessages = {
          1: currentLang === 'ar' ? 'تم رفض إذن الموقع' : 'Permission denied',
          2: currentLang === 'ar' ? 'الموقع غير متاح' : 'Unavailable',
          3: currentLang === 'ar' ? 'انتهت المهلة' : 'Timeout'
        };
        setLocationError(errorMessages[error.code] || (currentLang === 'ar' ? 'خطأ في الموقع' : 'Location error'));
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  // ================================================================
  // Coupon Handlers
  // ================================================================
  const handleApplyCoupon = async () => {
    const code = formData.couponCode.trim().toUpperCase();
    if (!code) return;

    setCouponLoading(true);
    setCouponStatus(null);

    try {
      const result = await api.validateCoupon(
        code,
        formData.phone.replace(/\D/g, '') || '0000000000',
        prices?.subtotal || calculateFallbackPrices().subtotal
      );

      if (result.valid) {
        setCouponStatus('valid');
        setCouponData(result.coupon);
        console.log('✅ Coupon valid:', result.coupon);
      } else {
        setCouponStatus('error');
        setCouponData({ error: result.message || 'Invalid coupon' });
      }
    } catch (error) {
      console.error('❌ Coupon validation failed:', error);
      setCouponStatus('error');
      setCouponData({ error: error.message });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    handleInputChange('couponCode', '');
    setCouponStatus(null);
    setCouponData(null);
  };

  // ================================================================
  // Order Submission
  // ================================================================
  const handleSubmitOrder = async () => {
    // Validate form
    const validation = validateCheckoutForm({
      formData,
      deliveryMethod,
      selectedBranch
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const orderData = {
        items: cart.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity
        })),
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.replace(/\D/g, ''),
          ...(deliveryMethod === 'delivery' && { address: formData.address.trim() }),
          ...(formData.notes && { notes: formData.notes.trim() })
        },
        customerPhone: formData.phone.replace(/\D/g, ''),
        deliveryMethod,
        ...(deliveryMethod === 'pickup' && { branch: selectedBranch }),
        ...(userLocation && { location: userLocation }),
        ...(getAddressInputType() && { addressInputType: getAddressInputType() }),
        ...(formData.address.trim() && deliveryMethod === 'delivery' && { 
          deliveryAddress: formData.address.trim() 
        }),
        ...(formData.couponCode && couponStatus === 'valid' && { 
          couponCode: formData.couponCode.trim() 
        })
      };

      console.log('📤 Submitting order:', orderData);
      
      const result = await api.submitOrder(orderData);
      
      console.log('✅ Order submitted successfully:', result);
      
      // ✅ حفظ الطلب في localStorage (كما في checkout-core.js)
      const serverPrices = result.calculatedPrices || prices;
      const orderId = result.orderId || result.id;
      const eta = result.eta || result.etaAr || (currentLang === 'ar' ? '30-45 دقيقة' : '30-45 minutes');
      
      const orderToSave = {
        id: orderId,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        items: (serverPrices?.items || cart).map(item => {
          const product = productsMap[item.productId];
          return {
            productId: item.productId || item.id,
            name: product ? (currentLang === 'ar' ? product.name : product.nameEn) : `Product ${item.productId}`,
            quantity: item.quantity,
            price: item.price || product?.price || 0,
            total: item.total || ((item.price || product?.price || 0) * item.quantity)
          };
        }),
        totals: {
          subtotal: serverPrices?.subtotal || prices?.subtotal || 0,
          deliveryFee: serverPrices?.deliveryFee || prices?.deliveryFee || 0,
          discount: serverPrices?.discount || prices?.discount || 0,
          total: serverPrices?.total || prices?.total || 0
        },
        deliveryMethod: deliveryMethod,
        branch: selectedBranch,
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.replace(/\D/g, ''),
          address: formData.address.trim() || null
        },
        eta: eta,
        couponCode: formData.couponCode || null,
        deliveryInfo: serverPrices?.deliveryInfo || prices?.deliveryInfo || {}
      };
      
      const saveSuccess = storage.addOrder(orderToSave);
      if (saveSuccess) {
        console.log('✅ Order saved locally:', orderId);
        // ✅ Dispatch event to update orders badge
        window.dispatchEvent(new CustomEvent('ordersUpdated', { 
          detail: { orderId, action: 'added' } 
        }));
      } else {
        console.warn('⚠️ Failed to save order locally (non-critical)');
      }
      
      // Clear cart
      clearCart();
      
      // ✅ إبلاغ App.jsx بنجاح الطلب
      if (onCheckoutSuccess) {
        onCheckoutSuccess(orderId);
      }
      
      resetForm();
    } catch (error) {
      console.error('❌ Order submission failed:', error);
      setSubmitError(error.message || 'Failed to submit order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', address: '', notes: '', couponCode: '' });
    setDeliveryMethod(null);
    setSelectedBranch(null);
    setUserLocation(null);
    setPrices(null);
    setErrors({});
    setCouponStatus(null);
    setCouponData(null);
  };

  // ================================================================
  // Render
  // ================================================================
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-[9100] flex items-center justify-center p-5 overflow-y-auto"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-[650px] w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-7">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h3 className="text-[26px] font-black text-gray-800 dark:text-gray-100 mb-2">
            {t('checkoutTitle') || 'تأكيد الطلب'}
          </h3>
          <p className="text-base text-gray-600 dark:text-gray-400">
            {t('checkoutSubtitle') || 'اختر طريقة الاستلام وأكمل بياناتك'}
          </p>
        </div>

        {/* Delivery Options */}
        <DeliveryOptions
          deliveryMethod={deliveryMethod}
          selectedBranch={selectedBranch}
          branches={branches}
          branchesLoading={branchesLoading}
          errors={errors}
          onDeliveryMethodChange={handleDeliveryMethodChange}
          onBranchSelect={handleBranchSelect}
        />

        {/* Checkout Form */}
        <CheckoutForm
          formData={formData}
          deliveryMethod={deliveryMethod}
          errors={errors}
          userLocation={userLocation}
          locationLoading={locationLoading}
          locationError={locationError}
          couponStatus={couponStatus}
          couponData={couponData}
          couponLoading={couponLoading}
          onInputChange={handleInputChange}
          onRequestLocation={handleRequestLocation}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
        />

        {/* Order Summary */}
        {deliveryMethod && (
          <OrderSummary
            cart={cart}
            products={productsMap}
            productsLoading={false}
            prices={prices}
            pricesLoading={pricesLoading}
            pricesError={pricesError}
            deliveryMethod={deliveryMethod}
          />
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            className="py-4 px-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('cancel') || 'إلغاء'}
          </button>
          <button
            className="flex-1 py-4 px-6 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmitOrder}
            disabled={isSubmitting || !deliveryMethod || (deliveryMethod === 'pickup' && !selectedBranch)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{currentLang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}</span>
              </>
            ) : (
              <span>{t('confirmOrder') || 'تأكيد الطلب'}</span>
            )}
          </button>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-500 rounded-xl text-red-600 text-sm">
            <div className="font-bold mb-1">
              {currentLang === 'ar' ? 'فشل إرسال الطلب' : 'Order Failed'}
            </div>
            <div>{submitError}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;