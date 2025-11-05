import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductsContext';
import {
  X, ShoppingCart, Store, Truck, User, Phone, MapPin,
  MessageSquare, Tag, CheckCircle2, CheckCircle, Navigation,
  Receipt, AlertCircle, Loader2
} from 'lucide-react';

/**
 * CheckoutModal - Pure React Checkout System
 * Replaces: js/checkout.js + all checkout/*.js modules
 */

const API_BASE_URL = 'https://softcream-api.mahmoud-zahran20025.workers.dev';

const CheckoutModal = ({ isOpen, onClose, cart = [] }) => {
  const { t, currentLang, clearCart } = useProducts();

  // State
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', notes: '', couponCode: ''
  });
  const [errors, setErrors] = useState({});
  const [couponStatus, setCouponStatus] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showLocationPermission, setShowLocationPermission] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Fetch branches
  useEffect(() => {
    if (isOpen) {
      fetchBranches();
    }
  }, [isOpen]);

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

  // Handlers
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

  const handleSubmitOrder = async () => {
    if (!validateForm() || !cart || cart.length === 0) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const orderData = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.replace(/\D/g, ''),
          ...(deliveryMethod === 'delivery' && { address: formData.address.trim() }),
          ...(formData.notes && { notes: formData.notes.trim() })
        },
        deliveryMethod,
        ...(deliveryMethod === 'pickup' && { branchId: selectedBranch }),
        items: cart.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity
        })),
        ...(formData.couponCode && couponStatus === 'valid' && { couponCode: formData.couponCode.trim() })
      };
      
      const response = await fetch(`${API_BASE_URL}?path=/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        clearCart();
        alert(t('orderSuccessMessage', { orderId: result.data.orderId }) || `Order placed! ID: ${result.data.orderId}`);
        onClose();
        resetForm();
      } else {
        throw new Error(result.message || 'Order submission failed');
      }
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', address: '', notes: '', couponCode: '' });
    setDeliveryMethod('pickup');
    setSelectedBranch(null);
    setErrors({});
    setCouponStatus(null);
    setCouponDiscount(0);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = deliveryMethod === 'delivery' ? 15 : 0;
    return subtotal + deliveryFee - couponDiscount;
  };

  if (!isOpen) return null;

  const total = calculateTotal();

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

        {/* Order Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-5 mb-6 border-2 border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-2.5 text-base font-bold mb-4 pb-3 border-b-2">
            <Receipt className="w-5 h-5" />
            <span>{t('orderSummary') || 'ملخص الطلب'}</span>
          </div>
          <div className="space-y-2">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.name || `Product ${item.productId}`} × {item.quantity}</span>
                <span className="font-bold">{(item.price || 0) * item.quantity} ج.م</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>{t('total') || 'الإجمالي'}:</span>
                <span className="text-primary">{total} ج.م</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Options */}
        <div className="mb-6 space-y-3">
          {/* Pickup */}
          <div
            className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
              deliveryMethod === 'pickup' ? 'border-primary bg-primary-50' : 'border-gray-300 hover:border-primary'
            }`}
            onClick={() => setDeliveryMethod('pickup')}
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
                      className={`p-4 border-2 rounded-xl cursor-pointer ${
                        selectedBranch === branch.id ? 'border-primary bg-primary-50' : 'border-gray-300'
                      }`}
                      onClick={() => setSelectedBranch(branch.id)}
                    >
                      <div className="font-bold">{currentLang === 'ar' ? branch.name : branch.nameEn}</div>
                      <div className="text-sm text-gray-600">{currentLang === 'ar' ? branch.address : branch.addressEn}</div>
                    </div>
                  ))}
                </div>
              )}
              {errors.branch && <div className="text-red-500 text-sm mt-2">{errors.branch}</div>}
            </div>
          )}

          {/* Delivery */}
          <div
            className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
              deliveryMethod === 'delivery' ? 'border-primary bg-primary-50' : 'border-gray-300 hover:border-primary'
            }`}
            onClick={() => setDeliveryMethod('delivery')}
          >
            <Truck className="w-6 h-6 text-primary" />
            <div className="flex-1">
              <div className="font-bold">{t('deliveryOption') || 'التوصيل'}</div>
              <div className="text-sm text-gray-600">{t('deliveryDesc') || '15 ج.م - 30 دقيقة'}</div>
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
            {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
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
            {errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
          </div>

          {/* Address (delivery only) */}
          {deliveryMethod === 'delivery' && (
            <div>
              <label className="flex items-center gap-2 text-sm font-bold mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{t('detailedAddress') || 'العنوان التفصيلي'} *</span>
              </label>
              <textarea
                className={`w-full px-4 py-3 border-2 rounded-xl min-h-[80px] ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={t('addressPlaceholder') || 'الشارع، المنطقة...'}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
              {errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
            </div>
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
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="py-4 px-6 bg-gray-200 rounded-2xl font-bold hover:bg-gray-300 transition-all"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('cancel') || 'إلغاء'}
          </button>
          <button
            className="flex-1 py-4 px-6 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            <span>{isSubmitting ? (t('submitting') || 'جاري الإرسال...') : (t('confirmOrder') || 'تأكيد الطلب')}</span>
          </button>
        </div>

        {submitError && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-500 rounded-xl text-red-500 text-center">
            {submitError}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
