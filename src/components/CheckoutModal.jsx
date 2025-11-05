import React, { useState, useEffect, useCallback } from 'react';
import { useProducts } from '../context/ProductsContext';
import {
  X, ShoppingCart, Store, Truck, User, Phone, MapPin,
  MessageSquare, Tag, CheckCircle2, CheckCircle, Navigation,
  Receipt, AlertCircle, Loader2, Info, XCircle
} from 'lucide-react';

/**
 * CheckoutModal - Complete React Checkout System
 * ✅ Includes ALL logic from vanilla JS modules
 * ✅ Dynamic pricing from API
 * ✅ GPS location support
 * ✅ Coupon validation
 * ✅ Full validation
 */

const API_BASE_URL = 'https://softcream-api.mahmoud-zahran20025.workers.dev';

const CheckoutModal = ({ isOpen, onClose, cart = [] }) => {
  const { t, currentLang, clearCart } = useProducts();

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
  
  // 🆕 Location State
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  
  // 🆕 Dynamic Pricing State
  const [prices, setPrices] = useState(null);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [pricesError, setPricesError] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const [products, setProducts] = useState({});
  const [productsLoading, setProductsLoading] = useState(true);

  // ================================================================
  // 🆕 Task 1: Dynamic Pricing System
  // ================================================================
  const recalculatePrices = useCallback(async () => {
    if (!deliveryMethod || cart.length === 0) {
      setPrices(null);
      return;
    }

    console.log('🔄 Recalculating prices...');
    setPricesLoading(true);
    setPricesError(null);

    try {
      // Prepare items (IDs only)
      const items = cart.map(item => ({
        productId: item.productId || item.id,
        quantity: item.quantity
      }));

      // Determine addressInputType
      let addressInputType = null;
      if (deliveryMethod === 'delivery') {
        if (userLocation?.lat && userLocation?.lng) {
          addressInputType = 'gps';
        } else if (formData.address.trim()) {
          addressInputType = 'manual';
        }
      }

      const requestBody = {
        items,
        deliveryMethod,
        customerPhone: formData.phone.replace(/\D/g, '') || null,
        ...(formData.couponCode && couponStatus === 'valid' && { 
          couponCode: formData.couponCode.trim() 
        }),
        ...(userLocation && { location: userLocation }),
        ...(addressInputType && { addressInputType }),
        ...(deliveryMethod === 'pickup' && selectedBranch && { branch: selectedBranch })
      };

      console.log('📤 Calculating prices:', requestBody);

      const response = await fetch(`${API_BASE_URL}?path=/orders/calculate-prices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (result.success && result.data) {
        console.log('✅ Prices received:', result.data);
        setPrices(result.data);
      } else {
        throw new Error(result.message || 'Failed to calculate prices');
      }
    } catch (error) {
      console.error('❌ Price calculation failed:', error);
      setPricesError(error.message);
      
      // Fallback: Calculate locally
      const subtotal = cart.reduce((sum, item) => {
        const product = products[item.productId];
        return sum + ((product?.price || 0) * item.quantity);
      }, 0);
      
      const deliveryFee = deliveryMethod === 'delivery' ? 20 : 0;
      const discount = couponData?.discountAmount || 0;
      
      setPrices({
        subtotal,
        deliveryFee,
        discount,
        total: subtotal + deliveryFee - discount,
        isOffline: true,
        deliveryInfo: { isEstimated: true }
      });
    } finally {
      setPricesLoading(false);
    }
  }, [deliveryMethod, selectedBranch, cart, formData.phone, formData.couponCode, 
      couponStatus, userLocation, products, couponData]);

  // ================================================================
  // 🆕 Task 2: GPS Location Logic
  // ================================================================
  const handleRequestLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError(t('errorGeolocationNotSupported') || 'Geolocation not supported');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };

        console.log('✅ GPS Location obtained:', location);
        setUserLocation(location);
        
        // Auto-fill address field
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
        let errorMsg = '';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = currentLang === 'ar' ? 'تم رفض إذن الموقع' : 'Permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = currentLang === 'ar' ? 'الموقع غير متاح' : 'Unavailable';
            break;
          case error.TIMEOUT:
            errorMsg = currentLang === 'ar' ? 'انتهت المهلة' : 'Timeout';
            break;
          default:
            errorMsg = currentLang === 'ar' ? 'خطأ في الموقع' : 'Location error';
        }
        
        setLocationError(errorMsg);
        setLocationLoading(false);
      },
      options
    );
  };

  // ================================================================
  // Effect: Recalculate prices when dependencies change
  // ================================================================
  useEffect(() => {
    if (isOpen && deliveryMethod) {
      recalculatePrices();
    }
  }, [isOpen, deliveryMethod, selectedBranch, couponStatus, userLocation, recalculatePrices]);

  // ================================================================
  // Fetch branches and product details on open
  // ================================================================
  useEffect(() => {
    if (isOpen) {
      fetchBranches();
      fetchProductDetails();
      // Reset state
      setDeliveryMethod(null);
      setSelectedBranch(null);
      setUserLocation(null);
      setPrices(null);
      setCouponStatus(null);
      setCouponData(null);
    }
  }, [isOpen]);

  const fetchProductDetails = async () => {
    if (cart.length === 0) {
      setProductsLoading(false);
      return;
    }

    setProductsLoading(true);
    try {
      const productIds = cart.map(item => item.productId);
      const uniqueIds = [...new Set(productIds)];
      
      const productPromises = uniqueIds.map(async (id) => {
        const response = await fetch(`${API_BASE_URL}?path=/products/${id}`);
        const result = await response.json();
        return { id, data: result.data };
      });

      const productResults = await Promise.all(productPromises);
      const productsMap = {};
      productResults.forEach(({ id, data }) => {
        productsMap[id] = data;
      });

      setProducts(productsMap);
      console.log('✅ Product details loaded');
    } catch (error) {
      console.error('❌ Failed to fetch product details:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchBranches = async () => {
    setBranchesLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}?path=/branches`);
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setBranches(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    } finally {
      setBranchesLoading(false);
    }
  };

  // ================================================================
  // 🆕 Coupon Validation
  // ================================================================
  const handleApplyCoupon = async () => {
    const code = formData.couponCode.trim().toUpperCase();
    
    if (!code) {
      setCouponStatus('error');
      return;
    }

    setCouponLoading(true);
    setCouponStatus(null);

    try {
      const subtotal = prices?.subtotal || cart.reduce((sum, item) => {
        const product = products[item.productId];
        return sum + ((product?.price || 0) * item.quantity);
      }, 0);

      const response = await fetch(`${API_BASE_URL}?path=/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          customerPhone: formData.phone.replace(/\D/g, '') || '0000000000',
          subtotal
        })
      });

      const result = await response.json();

      if (result.success && result.data?.valid) {
        setCouponStatus('valid');
        setCouponData(result.data.coupon);
        console.log('✅ Coupon valid:', result.data.coupon);
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
  // Form Handlers
  // ================================================================
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateEgyptianPhone = (phone) => {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\D/g, '');
    return /^(010|011|012|015)\d{8}$/.test(cleanPhone);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!deliveryMethod) {
      newErrors.deliveryMethod = t('errorSelectMethod') || 'Please select delivery method';
    }
    
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = t('errorNameRequired') || 'Name is required (2-50 characters)';
    }
    
    if (!validateEgyptianPhone(formData.phone)) {
      newErrors.phone = t('errorPhoneInvalid') || 'Invalid phone (example: 01012345678)';
    }
    
    if (deliveryMethod === 'pickup' && !selectedBranch) {
      newErrors.branch = t('errorBranchRequired') || 'Please select a branch';
    }
    
    if (deliveryMethod === 'delivery' && (!formData.address.trim() || formData.address.trim().length < 10)) {
      newErrors.address = t('errorAddressRequired') || 'Address required (10-200 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================================================================
  // 🆕 Task 3: Enhanced Order Submission
  // ================================================================
  const handleSubmitOrder = async () => {
    if (!validateForm() || !cart || cart.length === 0) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare order data (matches checkout-core.js logic)
      let addressInputType = null;
      if (deliveryMethod === 'delivery') {
        if (userLocation?.lat && userLocation?.lng) {
          addressInputType = 'gps';
        } else if (formData.address.trim()) {
          addressInputType = 'manual';
        }
      }

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
        ...(addressInputType && { addressInputType }),
        ...(formData.address.trim() && deliveryMethod === 'delivery' && { 
          deliveryAddress: formData.address.trim() 
        }),
        ...(formData.couponCode && couponStatus === 'valid' && { 
          couponCode: formData.couponCode.trim() 
        })
      };

      console.log('📤 Submitting order:', orderData);
      
      const response = await fetch(`${API_BASE_URL}?path=/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Order submitted successfully:', result.data);
        
        // Clear cart via context
        clearCart();
        
        // Show success message
        alert(
          t('orderSuccessMessage', { orderId: result.data.orderId }) || 
          `تم إرسال الطلب بنجاح! 🎉\nرقم الطلب: ${result.data.orderId}`
        );
        
        // Close modal and reset
        onClose();
        resetForm();
      } else {
        throw new Error(result.message || 'Order submission failed');
      }
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
  // Render Guards
  // ================================================================
  if (!isOpen) return null;

  const displayTotal = prices?.total || 0;
  const displaySubtotal = prices?.subtotal || 0;
  const displayDeliveryFee = prices?.deliveryFee || 0;
  const displayDiscount = prices?.discount || 0;

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
        <div className="mb-6 space-y-3">
          {errors.deliveryMethod && (
            <div className="p-3 bg-red-50 border-2 border-red-500 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.deliveryMethod}</span>
            </div>
          )}

          {/* Pickup */}
          <div
            className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
              deliveryMethod === 'pickup' ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
            }`}
            onClick={() => {
              setDeliveryMethod('pickup');
              setUserLocation(null);
              if (errors.deliveryMethod) {
                setErrors(prev => ({ ...prev, deliveryMethod: null }));
              }
            }}
          >
            <Store className="w-6 h-6 text-primary" />
            <div className="flex-1">
              <div className="font-bold">{t('pickupOption') || 'الاستلام من الفرع'}</div>
              <div className="text-sm text-gray-600">{t('pickupDesc') || 'مجاناً - 15 دقيقة'}</div>
            </div>
            <CheckCircle className={`w-6 h-6 ${deliveryMethod === 'pickup' ? 'text-primary' : 'text-gray-300'}`} />
          </div>

          {/* Branch Selection */}
          {deliveryMethod === 'pickup' && (
            <div className="bg-gray-50 rounded-2xl p-5 border-2">
              <label className="flex items-center gap-2 font-bold mb-4">
                <MapPin className="w-5 h-5" />
                <span>{t('selectBranch') || 'اختر الفرع'}:</span>
              </label>
              {branchesLoading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                <div className="space-y-3">
                  {branches.map((branch) => (
                    <div
                      key={branch.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedBranch === branch.id ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
                      }`}
                      onClick={() => {
                        setSelectedBranch(branch.id);
                        if (errors.branch) {
                          setErrors(prev => ({ ...prev, branch: null }));
                        }
                      }}
                    >
                      <div className="font-bold">{currentLang === 'ar' ? branch.name : branch.nameEn}</div>
                      <div className="text-sm text-gray-600">{currentLang === 'ar' ? branch.address : branch.addressEn}</div>
                    </div>
                  ))}
                </div>
              )}
              {errors.branch && <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.branch}</span>
              </div>}
            </div>
          )}

          {/* Delivery */}
          <div
            className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
              deliveryMethod === 'delivery' ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
            }`}
            onClick={() => {
              setDeliveryMethod('delivery');
              setSelectedBranch(null);
              if (errors.deliveryMethod) {
                setErrors(prev => ({ ...prev, deliveryMethod: null }));
              }
            }}
          >
            <Truck className="w-6 h-6 text-primary" />
            <div className="flex-1">
              <div className="font-bold">{t('deliveryOption') || 'التوصيل'}</div>
              <div className="text-sm text-gray-600">{t('deliveryDesc') || 'حسب الموقع - 30 دقيقة'}</div>
            </div>
            <CheckCircle className={`w-6 h-6 ${deliveryMethod === 'delivery' ? 'text-primary' : 'text-gray-300'}`} />
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-2">
              <User className="w-4 h-4 text-primary" />
              <span>{t('fullName') || 'الاسم الكامل'} *</span>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 border-2 rounded-xl ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder={t('enterFullName') || 'أدخل اسمك'}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            {errors.name && <div className="text-red-500 text-sm mt-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.name}</span>
            </div>}
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>{t('phoneNumber') || 'رقم الهاتف'} *</span>
            </label>
            <input
              type="tel"
              className={`w-full px-4 py-3 border-2 rounded-xl ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="01234567890"
              dir="ltr"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').substring(0, 11))}
            />
            {errors.phone && <div className="text-red-500 text-sm mt-1 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.phone}</span>
            </div>}
          </div>

          {/* Address + GPS (delivery only) */}
          {deliveryMethod === 'delivery' && (
            <>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{t('detailedAddress') || 'العنوان التفصيلي'} *</span>
                </label>
                
                {/* GPS Button */}
                <button
                  type="button"
                  className={`w-full mb-3 px-4 py-3 border-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    userLocation 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                  onClick={handleRequestLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : userLocation ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Navigation className="w-5 h-5" />
                  )}
                  <span className="font-bold">
                    {locationLoading 
                      ? (currentLang === 'ar' ? 'جاري التحديد...' : 'Getting location...') 
                      : userLocation 
                      ? (currentLang === 'ar' ? 'تم تحديد الموقع ✓' : 'Location Set ✓')
                      : (currentLang === 'ar' ? 'استخدام الموقع الحالي' : 'Use Current Location')
                    }
                  </span>
                </button>

                {locationError && (
                  <div className="mb-3 p-3 bg-red-50 border-2 border-red-500 rounded-xl text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{locationError}</span>
                  </div>
                )}

                <textarea
                  className={`w-full px-4 py-3 border-2 rounded-xl min-h-[80px] ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder={t('addressPlaceholder') || 'الشارع، المنطقة...'}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
                {errors.address && <div className="text-red-500 text-sm mt-1 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.address}</span>
                </div>}
              </div>
            </>
          )}

          {/* Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span>{t('additionalNotes') || 'ملاحظات إضافية'}</span>
            </label>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl min-h-[60px]"
              placeholder={t('notesPlaceholder') || 'أي طلبات خاصة (اختياري)'}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value.substring(0, 300))}
            />
          </div>

          {/* Coupon Code */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold mb-2">
              <Tag className="w-4 h-4 text-primary" />
              <span>{t('couponCode') || 'كود الخصم'}</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl uppercase"
                placeholder={currentLang === 'ar' ? 'أدخل الكود' : 'Enter code'}
                value={formData.couponCode}
                onChange={(e) => handleInputChange('couponCode', e.target.value.toUpperCase())}
                disabled={couponStatus === 'valid'}
              />
              {couponStatus !== 'valid' ? (
                <button
                  type="button"
                  className="px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !formData.couponCode.trim()}
                >
                  {couponLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    currentLang === 'ar' ? 'تطبيق' : 'Apply'
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                  onClick={handleRemoveCoupon}
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {couponStatus === 'valid' && couponData && (
              <div className="mt-2 p-3 bg-green-50 border-2 border-green-500 rounded-xl text-green-700 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="font-bold">
                  {couponData.messageAr || couponData.message || (currentLang === 'ar' ? 'تم تطبيق الكوبون بنجاح' : 'Coupon applied successfully')}
                </span>
              </div>
            )}
            
            {couponStatus === 'error' && couponData?.error && (
              <div className="mt-2 p-3 bg-red-50 border-2 border-red-500 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{couponData.error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        {deliveryMethod && (
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-5 mb-6 border-2 border-pink-100 dark:border-gray-600 shadow-sm">
            <div className="flex items-center gap-2.5 text-base font-bold mb-4 pb-3 border-b-2 border-pink-200 dark:border-gray-500">
              <Receipt className="w-5 h-5 text-primary" />
              <span className="text-gray-800 dark:text-gray-100">{t('orderSummary') || 'ملخص الطلب'}</span>
            </div>
            
            {pricesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-gray-600">
                  {currentLang === 'ar' ? 'جاري حساب الأسعار...' : 'Calculating prices...'}
                </span>
              </div>
            ) : pricesError && !prices ? (
              <div className="p-4 bg-red-50 border-2 border-red-500 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{pricesError}</span>
              </div>
            ) : prices ? (
              <>
                <div className="space-y-2.5 mb-4">
                  {cart.map((item, index) => {
                    const product = products[item.productId];
                    if (!product) return null;
                    const productName = currentLang === 'ar' ? product.name : product.nameEn;
                    const priceItem = prices.items?.find(p => p.productId === item.productId);
                    const itemPrice = priceItem?.price || product.price;
                    const itemTotal = priceItem?.subtotal || (itemPrice * item.quantity);
                    
                    return (
                      <div key={index} className="flex justify-between items-center text-sm bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <img 
                            src={product.image} 
                            alt={productName} 
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-semibold text-gray-800 dark:text-gray-100">{productName}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {itemPrice.toFixed(2)} ج.م × {item.quantity}
                            </div>
                          </div>
                        </div>
                        <span className="font-bold text-primary">{itemTotal.toFixed(2)} ج.م</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Totals */}
                <div className="border-t-2 border-pink-200 dark:border-gray-500 pt-3 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>{t('subtotal') || 'المجموع الفرعي'}:</span>
                    <span className="font-semibold">{displaySubtotal.toFixed(2)} ج.م</span>
                  </div>
                  
                  {deliveryMethod === 'delivery' && (
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <span>{t('deliveryFee') || 'رسوم التوصيل'}:</span>
                        {prices.deliveryInfo?.isEstimated && (
                          <span className="inline-flex items-center bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-bold">
                            {currentLang === 'ar' ? 'تقديري' : 'Est.'}
                          </span>
                        )}
                      </div>
                      <span className="font-semibold">
                        {displayDeliveryFee > 0 ? `${displayDeliveryFee.toFixed(2)} ج.م` : (currentLang === 'ar' ? 'مجاني' : 'FREE')}
                      </span>
                    </div>
                  )}
                  
                  {displayDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>{t('discount') || 'الخصم'}:</span>
                      <span className="font-semibold">-{displayDiscount.toFixed(2)} ج.م</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-lg font-bold text-gray-800 dark:text-gray-100 pt-2 border-t border-pink-200 dark:border-gray-500">
                    <span>{t('total') || 'الإجمالي'}:</span>
                    <span className="text-primary text-xl">{displayTotal.toFixed(2)} ج.م</span>
                  </div>
                </div>

                {/* Estimated Notice */}
                {prices.deliveryInfo?.isEstimated && deliveryMethod === 'delivery' && (
                  <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed">
                        <div className="font-bold text-yellow-800 mb-1">
                          {currentLang === 'ar' ? 'ملاحظة هامة' : 'Important Note'}
                        </div>
                        <div className="text-yellow-700">
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
                  <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed">
                        <div className="font-bold text-yellow-800 mb-1">
                          {currentLang === 'ar' ? '⚠️ وضع عدم الاتصال' : '⚠️ Offline Mode'}
                        </div>
                        <div className="text-yellow-700">
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
              <div className="text-center py-4 text-gray-500 text-sm">
                {currentLang === 'ar' ? 'اختر طريقة التوصيل لعرض الأسعار' : 'Select delivery method to see prices'}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
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
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>{t('confirmOrder') || 'تأكيد الطلب'}</span>
              </>
            )}
          </button>
        </div>

        {submitError && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-500 rounded-xl text-red-600 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold mb-1">
                {currentLang === 'ar' ? 'فشل إرسال الطلب' : 'Order Failed'}
              </div>
              <div className="text-sm">{submitError}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal