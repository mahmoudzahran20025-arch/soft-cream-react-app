# 🛒 CheckoutModal - Modular Architecture

## 📁 File Structure

```
react-app/src/components/CheckoutModal/
├── index.jsx                  # Main container (orchestration)
├── DeliveryOptions.jsx        # Delivery method & branch selection
├── CheckoutForm.jsx           # Customer info form
├── OrderSummary.jsx           # Price breakdown display
├── checkoutApi.js            # API calls (fetch branches, products, prices, submit)
├── validation.js             # Form validation utilities
└── README.md                 # This file
```

---

## 🎯 Component Responsibilities

### **1. index.jsx (Main Container)**
**الدور:** تنسيق العملية الكاملة + إدارة الـ State

**المهام:**
- ✅ إدارة كل الـ State (deliveryMethod, formData, prices, etc.)
- ✅ تحميل البيانات الأولية (branches, products)
- ✅ حساب الأسعار تلقائياً (useEffect)
- ✅ معالجة الأحداث (location, coupon, submit)
- ✅ توزيع الـ Props على المكونات الفرعية

**الحجم:** ~350 سطر

---

### **2. DeliveryOptions.jsx**
**الدور:** اختيار طريقة التوصيل + اختيار الفرع

**الـ Props:**
```javascript
{
  deliveryMethod,          // 'pickup' | 'delivery' | null
  selectedBranch,          // Branch ID
  branches,                // Array of branch objects
  branchesLoading,         // Boolean
  errors,                  // { deliveryMethod?, branch? }
  onDeliveryMethodChange,  // (method) => void
  onBranchSelect          // (branchId) => void
}
```

**الحجم:** ~100 سطر

---

### **3. CheckoutForm.jsx**
**الدور:** نموذج بيانات العميل (Name, Phone, Address, Notes, Coupon)

**الـ Props:**
```javascript
{
  formData,               // { name, phone, address, notes, couponCode }
  deliveryMethod,         // For conditional address field
  errors,                 // { name?, phone?, address?, notes? }
  userLocation,           // GPS coords
  locationLoading,        // Boolean
  locationError,          // String | null
  couponStatus,           // 'valid' | 'error' | null
  couponData,             // Coupon details or error
  couponLoading,          // Boolean
  onInputChange,          // (field, value) => void
  onRequestLocation,      // () => void
  onApplyCoupon,          // () => void
  onRemoveCoupon         // () => void
}
```

**الحجم:** ~170 سطر

---

### **4. OrderSummary.jsx**
**الدور:** عرض المنتجات + تفصيل الأسعار

**الـ Props:**
```javascript
{
  cart,                   // Array of cart items
  products,               // Map of product details
  productsLoading,        // Boolean
  prices,                 // { subtotal, deliveryFee, discount, total, deliveryInfo }
  pricesLoading,          // Boolean
  pricesError,            // String | null
  deliveryMethod         // For conditional delivery fee display
}
```

**الحجم:** ~140 سطر

---

### **5. checkoutApi.js (Utilities)**
**الدور:** كل استدعاءات الـ API

**الدوال:**
```javascript
async function fetchBranches()
async function fetchProductDetails(cart)
async function calculatePrices({ items, deliveryMethod, selectedBranch, userLocation, customerPhone, couponCode, addressInputType })
async function validateCoupon({ code, customerPhone, subtotal })
async function submitOrder(orderData)
```

**المميزات:**
- ✅ معالجة الأخطاء المتقدمة
- ✅ محاولة Endpoints بديلة (إذا فشل الأول)
- ✅ Logging تفصيلي

**الحجم:** ~120 سطر

---

### **6. validation.js (Utilities)**
**الدور:** التحقق من صحة النماذج

**الدوال:**
```javascript
function validateEgyptianPhone(phone)    // Boolean
function isValidLength(value, min, max)  // Boolean
function validateCheckoutForm({ formData, deliveryMethod, selectedBranch })  // { valid, errors }
```

**الحجم:** ~60 سطر

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────┐
│         index.jsx (Main)                │
│  ┌─────────────────────────────────┐   │
│  │  State Management               │   │
│  │  - deliveryMethod               │   │
│  │  - selectedBranch               │   │
│  │  - formData                     │   │
│  │  - userLocation                 │   │
│  │  - prices                       │   │
│  │  - couponStatus                 │   │
│  └─────────────────────────────────┘   │
│                 │                       │
│    ┌────────────┼────────────┐          │
│    ▼            ▼            ▼          │
│ ┌──────┐  ┌──────────┐  ┌──────────┐  │
│ │Deliv │  │ Checkout │  │  Order   │  │
│ │ery   │  │   Form   │  │ Summary  │  │
│ │Option│  └──────────┘  └──────────┘  │
│ └──────┘                                │
│                 │                       │
│                 ▼                       │
│         ┌───────────────┐              │
│         │  checkoutApi  │ ◄────► API   │
│         └───────────────┘              │
│                 │                       │
│                 ▼                       │
│         ┌───────────────┐              │
│         │  validation   │              │
│         └───────────────┘              │
└─────────────────────────────────────────┘
```

---

## 🚀 Usage Example

```jsx
import CheckoutModal from './components/CheckoutModal';

function App() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cart, setCart] = useState([
    { productId: 'prod_123', quantity: 2 }
  ]);

  return (
    <>
      <button onClick={() => setCheckoutOpen(true)}>
        Checkout
      </button>
      
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
      />
    </>
  );
}
```

---

## 🐛 Debugging Guide

### **حساب الأسعار يفشل (Price Calculation Fails)**
1. افتح `checkoutApi.js` → `calculatePrices()`
2. تحقق من الـ endpoint: `/calculate-prices` أو `/orders/calculate-prices`
3. راجع الـ console logs:
   - `📤 Calculating prices:` (request)
   - `📥 API Response:` (response)
4. تأكد من أن `items` يحتوي على `productId` و `quantity` فقط

### **الكوبون لا يعمل (Coupon Not Working)**
1. افتح `checkoutApi.js` → `validateCoupon()`
2. تحقق من الـ endpoint: `/coupons/validate`
3. تأكد من أن `customerPhone` و `subtotal` صحيحين

### **GPS لا يعمل (GPS Not Working)**
1. افتح `index.jsx` → `handleRequestLocation()`
2. تأكد من الأذونات (Permissions) في المتصفح
3. جرّب على HTTPS (GPS يحتاج HTTPS)

---

## 📦 Dependencies

```json
{
  "react": "^18.x",
  "lucide-react": "^0.x"
}
```

**Context Required:**
- `ProductsContext` (من `useProducts()`)
  - `t(key)` - Translation function
  - `currentLang` - 'ar' | 'en'
  - `clearCart()` - Clear cart after order

---

## ✅ Improvements Over Old Code

| **Feature** | **Old (Vanilla JS)** | **New (React)** |
|-------------|---------------------|----------------|
| **Structure** | 6 files × 500+ lines | 6 files × 100-350 lines |
| **Reusability** | ❌ Monolithic | ✅ Modular components |
| **Testing** | ❌ Hard to test | ✅ Easy to unit test |
| **Maintenance** | ❌ Complex | ✅ Simple & clear |
| **State Management** | ❌ Global variables | ✅ React state |
| **Error Handling** | ⚠️ Basic | ✅ Comprehensive |
| **Type Safety** | ❌ None | ⚠️ PropTypes ready |

---

## 🔮 Future Enhancements

- [ ] Add TypeScript types
- [ ] Add PropTypes validation
- [ ] Add unit tests (Jest + RTL)
- [ ] Add Storybook stories
- [ ] Extract API base URL to config
- [ ] Add retry logic for failed API calls
- [ ] Add loading skeletons
- [ ] Add animations (Framer Motion)

---

**Version:** 1.0.0  
**Last Updated:** 2024-01-XX  
**Maintainer:** Your Team