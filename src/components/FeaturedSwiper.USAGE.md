# كيفية استخدام Hero Marketing Swiper

## الاستخدام الأساسي

```jsx
import FeaturedSwiper from './components/FeaturedSwiper';

function App() {
  return (
    <div className="app">
      <FeaturedSwiper />
    </div>
  );
}
```

## تخصيص البيانات

### 1. تعديل محتوى السلايدات
افتح `FeaturedSwiper.jsx` وعدّل `SLIDES_DATA`:

```javascript
const SLIDES_DATA = [
  {
    id: 1,
    image: 'https://your-image-url.jpg',
    priority: 'high', // للصور المهمة فقط
    headline: 'عنوان جذاب',
    subline: 'وصف قصير ومقنع',
    ctaText: 'اطلب الآن',
    ctaLink: '#order',
    theme: 'light', // أو 'dark' حسب الصورة
  },
  // المزيد من السلايدات...
];
```

### 2. اختيار Theme المناسب
- **theme: 'light'**: نص أبيض - للصور الداكنة
- **theme: 'dark'**: نص داكن - للصور الفاتحة

### 3. تحسين الأداء
استخدم `priority: 'high'` للسلايدات الأولى فقط (2-3 سلايدات):

```javascript
{
  id: 1,
  priority: 'high', // ✅ السلايد الأول
  // ...
}
```

## تخصيص الإعدادات

### تغيير سرعة الانتقال
```javascript
const swiperConfig = {
  speed: 900, // غيّر هذا الرقم (بالميلي ثانية)
  // ...
};
```

### تغيير مدة عرض السلايد
```javascript
autoplay: {
  delay: 5000, // غيّر هذا الرقم (بالميلي ثانية)
  // ...
},
```

### تعطيل Autoplay
```javascript
// احذف أو علّق على هذا السطر:
// autoplay: { ... },
```

### تغيير عدد السلايدات المرئية
```javascript
breakpoints: {
  1024: {
    slidesPerView: 1.5, // غيّر هذا الرقم
    // ...
  },
},
```

## تخصيص الألوان

### في JSX
```javascript
style={{
  '--swiper-navigation-color': '#your-color',
  '--swiper-pagination-color': '#your-color',
}}
```

### في CSS
عدّل `FeaturedSwiper.module.css`:

```css
.ctaButton {
  background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
}

.gradientOverlay {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    transparent 100%
  );
}
```

## تخصيص الأبعاد

### تغيير ارتفاع السلايدر
في `FeaturedSwiper.module.css`:

```css
.heroSwiperContainer {
  height: 500px; /* Mobile */
}

@media (min-width: 768px) {
  .heroSwiperContainer {
    height: 600px; /* Tablet */
  }
}

@media (min-width: 1024px) {
  .heroSwiperContainer {
    height: 700px; /* Desktop */
  }
}
```

### تغيير حجم النصوص
```css
.headline {
  font-size: 2rem; /* Mobile */
}

@media (min-width: 1024px) {
  .headline {
    font-size: 4rem; /* Desktop */
  }
}
```

## تخصيص CTA Button

### تغيير الشكل
```css
.ctaButton {
  border-radius: 8px; /* مستطيل بزوايا دائرية */
  /* أو */
  border-radius: 50px; /* شكل حبة الدواء */
}
```

### إضافة حدود
```css
.ctaButton {
  border: 2px solid #ffffff;
}
```

### تغيير الحجم
```css
.ctaButton {
  padding: 1rem 3rem; /* أكبر */
  font-size: 1.25rem;
}
```

## أمثلة متقدمة

### 1. إضافة Badge/Tag
```jsx
<div className={styles.slideContent}>
  <div className={styles.contentInner}>
    {/* إضافة Badge */}
    <span className={styles.badge}>جديد</span>
    
    <h2 className={styles.headline}>
      {slide.headline}
    </h2>
    {/* ... */}
  </div>
</div>
```

```css
.badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #ff6b9d;
  color: white;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
```

### 2. إضافة Price/Discount
```jsx
<div className={styles.priceContainer}>
  <span className={styles.oldPrice}>100 ج.م</span>
  <span className={styles.newPrice}>70 ج.م</span>
  <span className={styles.discount}>-30%</span>
</div>
```

### 3. إضافة أيقونات
```jsx
import { Star, Heart, ShoppingCart } from 'lucide-react';

<div className={styles.iconRow}>
  <Star size={20} />
  <Heart size={20} />
  <ShoppingCart size={20} />
</div>
```

## نصائح للحصول على أفضل نتيجة

### 1. الصور
- ✅ استخدم صور عالية الجودة (1920x1080 أو أعلى)
- ✅ حجم الملف: 100-300 KB (استخدم WebP)
- ✅ تباين جيد بين الصورة والنص
- ✅ نقطة التركيز في وسط الصورة

### 2. النصوص
- ✅ العنوان: 3-5 كلمات
- ✅ الوصف: 8-12 كلمة
- ✅ CTA: 2-3 كلمات
- ✅ استخدم لغة تسويقية قوية

### 3. الألوان
- ✅ تأكد من تباين كافٍ (WCAG AA)
- ✅ اختبر على خلفيات مختلفة
- ✅ استخدم theme المناسب لكل صورة

### 4. الأداء
- ✅ ضغط الصور قبل الرفع
- ✅ استخدم CDN للصور
- ✅ لا تزيد عن 10 سلايدات
- ✅ اختبر على اتصال بطيء

### 5. التجربة
- ✅ اختبر على أجهزة حقيقية
- ✅ تأكد من سهولة القراءة
- ✅ تحقق من سرعة الانتقالات
- ✅ اختبر جميع الروابط

## استكشاف الأخطاء

### السلايدر لا يظهر
1. تأكد من استيراد CSS:
```javascript
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/parallax';
```

2. تحقق من وجود البيانات:
```javascript
console.log('Slides:', SLIDES_DATA.length);
```

### النصوص غير واضحة
- غيّر `theme` من 'light' إلى 'dark' أو العكس
- زد opacity الـ gradient overlay
- أضف text-shadow أقوى

### الأنيميشن بطيء/سريع
- عدّل `speed` في swiperConfig
- عدّل `delay` في autoplay
- عدّل transition duration في CSS

### مشاكل في الموبايل
- تحقق من responsive breakpoints
- اختبر على أجهزة حقيقية
- قلل حجم الصور

## دعم فني
للمساعدة أو الأسئلة، راجع:
- 📖 [Swiper Documentation](https://swiperjs.com/react)
- 📝 FeaturedSwiper.README.md
- 💬 فريق التطوير
