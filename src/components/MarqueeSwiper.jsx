import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import { useGlobal } from '../context/GlobalProvider';
import styles from './MarqueeSwiper.module.css';

// Import Swiper styles
import 'swiper/css';

/**
 * MarqueeSwiper Component - Pure React Marquee
 * 
 * ✅ Replaces: js/swiper-marquee.js
 * ✅ Features: Auto-scrolling text marquee with i18n support
 * ✅ CSS Module: Isolated styling
 */

const MarqueeSwiper = () => {
  const { t, language } = useGlobal();
  const swiperRef = useRef(null);

  // Marquee messages
  const messages = [
    {
      id: 1,
      icon: '🎁',
      titleKey: 'marqueeCaramelOfferTitle',
      textKey: 'marqueeCaramelOfferText',
      defaultTitle: 'عرض الكراميل:',
      defaultText: 'اطلب آيس كريم فانيليا واحصل على صوص كراميل مجاناً'
    },
    {
      id: 2,
      icon: '🌿',
      titleKey: 'marqueeNaturalTitle',
      textKey: 'marqueeNaturalText',
      defaultTitle: 'مكونات طبيعية:',
      defaultText: 'جميع منتجاتنا من مكونات طبيعية 100%'
    },
    {
      id: 3,
      icon: '🚚',
      titleKey: 'marqueeDeliveryTitle',
      textKey: 'marqueeDeliveryText',
      defaultTitle: 'توصيل سريع:',
      defaultText: 'نوصل لك خلال 30 دقيقة في جميع أنحاء المدينة'
    },
    {
      id: 4,
      icon: '⚡',
      titleKey: 'marqueeEnergyTitle',
      textKey: 'marqueeEnergyText',
      defaultTitle: 'طاقة ذكية:',
      defaultText: 'آيس كريم بروتين عالي للرياضيين'
    }
  ];

  // Update swiper on language change
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.update();
    }
  }, [language]);

  return (
    <div 
      className={styles.marqueeContainer}
      dir="ltr" // Always LTR for smooth scrolling
    >
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, FreeMode]}
        loop={true}
        speed={12000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        freeMode={{
          enabled: true,
          momentum: false,
        }}
        slidesPerView="auto"
        spaceBetween={0}
        centeredSlides={false}
        allowTouchMove={false}
        simulateTouch={false}
        className={styles.marqueeSwiper}
      >
        {messages.map((message) => (
          <SwiperSlide key={message.id} className="!w-auto">
            <div className="flex items-center gap-3 px-6 h-[52px]">
              <span className="text-2xl" role="img" aria-label={message.defaultTitle}>
                {message.icon}
              </span>
              <span className="font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                {t(message.titleKey) || message.defaultTitle}
              </span>
              <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {t(message.textKey) || message.defaultText}
              </span>
            </div>
          </SwiperSlide>
        ))}
        
        {/* Duplicate messages for seamless loop */}
        {messages.map((message) => (
          <SwiperSlide key={`dup-${message.id}`} className="!w-auto">
            <div className="flex items-center gap-3 px-6 h-[52px]">
              <span className="text-2xl" role="img" aria-label={message.defaultTitle}>
                {message.icon}
              </span>
              <span className="font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                {t(message.titleKey) || message.defaultTitle}
              </span>
              <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {t(message.textKey) || message.defaultText}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MarqueeSwiper;
