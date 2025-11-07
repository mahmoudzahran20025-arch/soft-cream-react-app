import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import styles from './FeaturedSwiper.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * Hero Marketing Swiper - Premium Modern Design
 * ✅ Full-screen hero slides with text overlays
 * ✅ Advanced animations (fade + scale + parallax)
 * ✅ CTA buttons with smooth transitions
 * ✅ Mobile-first responsive design
 */

const SLIDES_DATA = [
  {
    id: 1,
    image: 'https://i.ibb.co/LzP97qhB/481279444-627854640201713-219907065737357117-n-min.webp',
    priority: 'high',
    headline: 'تجربة مميزة',
    subline: 'اكتشف عالماً من النكهات الفريدة',
    ctaText: 'تسوق الآن',
    ctaLink: '#shop',
    theme: 'light', // light or dark text
  },
  {
    id: 2,
    image: 'https://i.ibb.co/4nNL0KR6/Gemini-Generated-Image-7z63p77z63p77z63.png',
    priority: 'high',
    headline: 'جودة استثنائية',
    subline: 'منتجات طازجة يومياً من أجود المكونات',
    ctaText: 'اكتشف المزيد',
    ctaLink: '#discover',
    theme: 'dark',
  },
  {
    id: 3,
    image: 'https://i.ibb.co/xq6xwTq2/484012205-623030934031341-1808374385255644063-n.jpg',
    headline: 'عروض حصرية',
    subline: 'خصومات تصل إلى 30% على مجموعة مختارة',
    ctaText: 'استفد الآن',
    ctaLink: '#offers',
    theme: 'light',
  },
  {
    id: 4,
    image: 'https://i.ibb.co/67cV4CJc/484157834-622859394048495-6880924063204865717-n-min.webp',
    headline: 'إبداع لا حدود له',
    subline: 'تشكيلة واسعة تناسب جميع الأذواق',
    ctaText: 'شاهد الكل',
    ctaLink: '#all',
    theme: 'dark',
  },
  {
    id: 5,
    image: 'https://i.ibb.co/8gQ15nZ7/558984721-791054437228989-7733276430689348371-n-min.jpg',
    headline: 'طعم الأصالة',
    subline: 'وصفات تقليدية بلمسة عصرية',
    ctaText: 'جرّب الآن',
    ctaLink: '#try',
    theme: 'light',
  },
  {
    id: 6,
    image: 'https://i.ibb.co/35fbWCYY/495226124-663623663305401-7196241149356063471-n-min.jpg',
    headline: 'لحظات سعيدة',
    subline: 'اصنع ذكريات لا تُنسى مع أحبائك',
    ctaText: 'اطلب الآن',
    ctaLink: '#order',
    theme: 'dark',
  },
  {
    id: 7,
    image: 'https://i.ibb.co/Q7BshLpx/514410102-708973618770405-257295013446953510-n.jpg',
    headline: 'تميّز دائماً',
    subline: 'منتجات فاخرة لكل المناسبات الخاصة',
    ctaText: 'استكشف',
    ctaLink: '#explore',
    theme: 'light',
  },
  {
    id: 8,
    image: 'https://i.ibb.co/LzhzfnGY/484032829-621596114174823-1720175782820299419-n.jpg',
    headline: 'نكهة استثنائية',
    subline: 'تجربة فريدة في كل قضمة',
    ctaText: 'اطلب الآن',
    ctaLink: '#order-now',
    theme: 'dark',
  },
];

const FeaturedSwiper = () => {
  const swiperRef = useRef(null);
  const paginationRef = useRef(null); // ✅ Custom pagination element
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div 
        className={`${styles.heroSwiperContainer} w-full`}
        style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="animate-pulse text-gray-400">Loading slides...</div>
      </div>
    );
  }

  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay],
    loop: true,
    speed: 800,
    direction: 'horizontal',
    watchSlidesProgress: true,
    allowTouchMove: true,
    
    autoplay: {
      delay: 5000, // 5 seconds per slide
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    
    pagination: {
      el: '.featured-pagination-dots',
      type: 'bullets',
      clickable: true,
      dynamicBullets: false,
    },
    
    navigation: true,
    
    slidesPerView: 1, // Full-width hero slides on mobile
    slidesPerGroup: 1,
    spaceBetween: 0,
    centeredSlides: true,
    
    breakpoints: {
      768: {
        slidesPerView: 1.15, // Slight peek on tablet
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 1.3, // Peek style on desktop
        spaceBetween: 24,
      },
      1440: {
        slidesPerView: 1.4,
        spaceBetween: 32,
      },
    },
    
    onInit: (swiper) => {
      console.log('✅ Hero Swiper initialized:', swiper.slides.length, 'slides');
    },
  };

  return (
    <div 
      className={`${styles.heroSwiperContainer} w-full`}
      dir="ltr"
    >
      <Swiper
        {...swiperConfig}
        ref={swiperRef}
        className={`${styles.heroSwiper} swiper-ready`}
        style={{
          '--swiper-navigation-color': '#ffffff',
          '--swiper-pagination-color': '#ff6b9d',
          '--swiper-pagination-bullet-inactive-color': '#ffffff',
          '--swiper-pagination-bullet-inactive-opacity': '0.5',
          height: '100%',
        }}
      >
        {SLIDES_DATA.map((slide) => (
          <SwiperSlide key={slide.id} style={{ height: '100%' }}>
            <div className={styles.slideWrapper}>
              {/* Background Image */}
              <div 
                className={styles.slideBackground}
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                {/* Gradient Overlay */}
                <div className={styles.gradientOverlay} />
              </div>

              {/* Preload for priority images */}
              {slide.priority === 'high' && (
                <link
                  rel="preload"
                  as="image"
                  href={slide.image}
                  fetchpriority="high"
                />
              )}

              {/* Content Overlay */}
              <div className={styles.slideContent}>
                <div className={styles.contentInner}>
                  {/* Headline */}
                  <h2 
                    className={`${styles.headline} ${slide.theme === 'light' ? styles.textLight : styles.textDark}`}
                  >
                    {slide.headline}
                  </h2>

                  {/* Subline */}
                  <p 
                    className={`${styles.subline} ${slide.theme === 'light' ? styles.textLight : styles.textDark}`}
                  >
                    {slide.subline}
                  </p>

                  {/* CTA Button */}
                  <a 
                    href={slide.ctaLink}
                    className={styles.ctaButton}
                  >
                    {slide.ctaText}
                    <svg 
                      className={styles.ctaIcon} 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination */}
      <div 
        className={`${styles.customPagination} featured-pagination-dots`}
        ref={paginationRef}
      ></div>
    </div>
  );
};

export default FeaturedSwiper;