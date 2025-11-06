/**
 * CheckoutModal/checkoutApi.js
 * All API calls for checkout process
 * ✅ SECURITY: Never sends prices from frontend
 * ✅ Uses correct endpoints: /orders/submit, /orders/prices
 */

const API_BASE_URL = 'https://softcream-api.mahmoud-zahran20025.workers.dev';

/**
 * Get or generate device ID for security
 */
function getDeviceId() {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = 'dev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

/**
 * Fetch branches from API
 */
export async function fetchBranches() {
  try {
    const response = await fetch(`${API_BASE_URL}?path=/branches`);
    const result = await response.json();
    
    if (result.success && Array.isArray(result.data)) {
      return result.data;
    }
    
    throw new Error('Failed to fetch branches');
  } catch (error) {
    console.error('❌ fetchBranches error:', error);
    throw error;
  }
}

/**
 * Fetch product details for cart items
 */
export async function fetchProductDetails(cart) {
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

    return productsMap;
  } catch (error) {
    console.error('❌ fetchProductDetails error:', error);
    throw error;
  }
}

/**
 * Calculate order prices from API
 * ✅ Uses correct endpoint: /orders/prices
 * ✅ Includes deviceId for security
 * ✅ Determines addressInputType automatically
 */
export async function calculatePrices({ 
  items, 
  deliveryMethod, 
  selectedBranch, 
  userLocation, 
  customerPhone, 
  couponCode, 
  addressInputType 
}) {
  try {
    // Auto-determine addressInputType if not provided
    const inputType = addressInputType || (userLocation?.lat ? 'gps' : 'manual');

    const requestBody = {
      items,
      deliveryMethod,
      deviceId: getDeviceId(),
      ...(customerPhone && { customerPhone }),
      ...(couponCode && { couponCode }),
      ...(userLocation && { location: userLocation }),
      ...(inputType && { addressInputType: inputType }),
      ...(deliveryMethod === 'pickup' && selectedBranch && { branch: selectedBranch })
    };

    console.log('📤 Calculating prices:', {
      items: items?.length,
      deliveryMethod,
      addressType: inputType,
      hasLocation: !!userLocation?.lat
    });

    // ✅ Use correct endpoint: /orders/prices
    const response = await fetch(`${API_BASE_URL}?path=/orders/prices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();
    
    console.log('📥 Raw API response:', result);

    // Extract calculatedPrices from response
    const calculatedPrices = result.data?.calculatedPrices || result.data || result.calculatedPrices;
    
    if (!calculatedPrices) {
      console.error('❌ Unexpected response structure:', result);
      throw new Error('Invalid response structure from price calculation');
    }

    console.log('✅ Extracted calculatedPrices:', {
      subtotal: calculatedPrices.subtotal,
      deliveryFee: calculatedPrices.deliveryFee,
      total: calculatedPrices.total
    });

    return calculatedPrices;
  } catch (error) {
    console.error('❌ calculatePrices error:', error);
    throw error;
  }
}

/**
 * Validate coupon code
 */
export async function validateCoupon({ code, customerPhone, subtotal }) {
  try {
    const response = await fetch(`${API_BASE_URL}?path=/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        customerPhone,
        subtotal
      })
    });

    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    throw new Error(result.message || 'Invalid coupon code');
  } catch (error) {
    console.error('❌ validateCoupon error:', error);
    throw error;
  }
}

/**
 * Submit order to API
 * ✅ SECURITY: Validates no prices are sent from frontend
 * ✅ Uses correct endpoint: /orders/submit
 * ✅ Includes deviceId and addressInputType
 */
export async function submitOrder(orderData) {
  try {
    // ✅ Security validation: Check for prices
    if (orderData.items?.some(item => item.price || item.subtotal)) {
      console.error('❌ SECURITY WARNING: Frontend should not send prices!');
      throw new Error('Invalid order data: prices should not be sent from frontend');
    }
    if (orderData.subtotal || orderData.total || orderData.discount) {
      console.error('❌ SECURITY WARNING: Frontend should not send totals!');
      throw new Error('Invalid order data: totals should not be sent from frontend');
    }

    // ✅ Determine addressInputType
    const addressInputType = orderData.addressInputType || 
                            (orderData.location?.lat ? 'gps' : 'manual');

    // ✅ Clean order data (IDs and quantities only)
    const cleanOrderData = {
      items: orderData.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      customer: orderData.customer,
      deliveryMethod: orderData.deliveryMethod || 'delivery',
      branch: orderData.branch || null,
      location: orderData.location || null,
      addressInputType: addressInputType,
      deliveryAddress: orderData.deliveryAddress || orderData.customer?.address || null,
      customerPhone: orderData.customerPhone || orderData.customer?.phone || null,
      deviceId: getDeviceId(),
      couponCode: orderData.couponCode || null
    };

    console.log('📤 Submitting order:', {
      items: cleanOrderData.items.length,
      addressType: addressInputType,
      hasGPS: !!cleanOrderData.location?.lat,
      hasAddress: !!cleanOrderData.deliveryAddress
    });

    // ✅ Use correct endpoint: /orders/submit
    const response = await fetch(`${API_BASE_URL}?path=/orders/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanOrderData)
    });

    const result = await response.json();
    
    console.log('📥 Raw submit response:', result);

    const responseData = result.data || result;
    if (!responseData) {
      throw new Error('Empty response from order submission');
    }

    console.log('✅ Order submitted:', responseData.orderId || responseData.id);
    return responseData;
  } catch (error) {
    console.error('❌ submitOrder error:', error);
    throw error;
  }
}