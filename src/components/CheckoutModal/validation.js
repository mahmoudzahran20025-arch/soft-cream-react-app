/**
 * CheckoutModal/validation.js
 * Form validation utilities
 */

/**
 * Validate Egyptian phone number
 */
export function validateEgyptianPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Egyptian mobile patterns: 010xxxxxxxx, 011xxxxxxxx, 012xxxxxxxx, 015xxxxxxxx
  const patterns = [
    /^(010|011|012|015)\d{8}$/,           // 11 digits
    /^20(10|11|12|15)\d{8}$/,             // 13 digits with country code
    /^(\+20|0020)(10|11|12|15)\d{8}$/     // With + or 00 prefix
  ];
  
  return patterns.some(pattern => pattern.test(cleanPhone));
}

/**
 * Validate length of text
 */
export function isValidLength(value, min = 0, max = Infinity) {
  if (typeof value !== 'string') {
    return false;
  }
  
  const length = value.trim().length;
  return length >= min && length <= max;
}

/**
 * Main checkout form validation
 */
export function validateCheckoutForm({ formData, deliveryMethod, selectedBranch }) {
  const errors = {};
  
  // Delivery method validation
  if (!deliveryMethod) {
    errors.deliveryMethod = 'الرجاء اختيار طريقة الاستلام';
  }
  
  // Name validation
  if (!formData.name.trim() || !isValidLength(formData.name, 2, 50)) {
    errors.name = 'الاسم مطلوب (2-50 حرف)';
  }
  
  // Phone validation
  if (!validateEgyptianPhone(formData.phone)) {
    errors.phone = 'رقم الهاتف غير صحيح (مثال: 01012345678)';
  }
  
  // Branch validation for pickup
  if (deliveryMethod === 'pickup' && !selectedBranch) {
    errors.branch = 'الرجاء اختيار الفرع للاستلام';
  }
  
  // Address validation for delivery
  if (deliveryMethod === 'delivery' && (!formData.address.trim() || !isValidLength(formData.address, 10, 200))) {
    errors.address = 'العنوان مطلوب (10-200 حرف)';
  }
  
  // Notes validation (optional but check length)
  if (formData.notes && !isValidLength(formData.notes, 0, 300)) {
    errors.notes = 'الملاحظات يجب ألا تزيد عن 300 حرف';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}