import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import styles from './FeaturedSwiper.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * FeaturedSwiper Component - FIXED: Height Issue
 * ✅ Removed aspect-ratio (causes height calculation bug)
 * ✅ Using padding-top hack for 4:3 ratio
 */

const SLIDES_DATA = [
  {
    id: 1,
    image: 'https://i.ibb.co/LzP97qhB/481279444-627854640201713-219907065737357117-n-min.webp',
    priority: 'high',
  },
  {
    id: 2,
    image: 'https://i.ibb.co/4nNL0KR6/Gemini-Generated-Image-7z63p77z63p77z63.png',
    priority: 'high',
  },
  {
    id: 3,
    image: 'https://i.ibb.co/xq6xwTq2/484012205-623030934031341-1808374385255644063-n.jpg',
  },
  {
    id: 4,
    image: 'https://i.ibb.co/67cV4CJc/484157834-622859394048495-6880924063204865717-n-min.webp',
  },
  {
    id: 5,
    image: 'https://i.ibb.co/8gQ15nZ7/558984721-791054437228989-7733276430689348371-n-min.jpg',
  },
  {
    id: 6,
    image: 'https://i.ibb.co/35fbWCYY/495226124-663623663305401-7196241149356063471-n-min.jpg',
  },
  {
    id: 7,
    image: 'https://i.ibb.co/Q7BshLpx/514410102-708973618770405-257295013446953510-n.jpg',
  },
  {
    id: 8,
    image: 'https://i.ibb.co/LzhzfnGY/484032829-621596114174823-1720175782820299419-n.jpg',
  },
];

const FeaturedSwiper = () => {
  const swiperRef = useRef(null);
  const paginationRef = useRef(null); // ✅ Custom pagination element
  const [isMounted, setIsMounted] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set([1, 2]));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const loadRemainingImages = () => {
      SLIDES_DATA.slice(2).forEach((slide) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => {
            const updated = new Set(prev);
            updated.add(slide.id);
            console.log(`✅ Image ${slide.id} loaded`);
            return updated;
          });
        };
        img.onerror = () => {
          console.warn(`⚠️ Failed to load image ${slide.id}`);
        };
        img.src = slide.image;
      });
    };

    const timer = setTimeout(loadRemainingImages, 100);
    return () => clearTimeout(timer);
  }, [isMounted]);

  useEffect(() => {
    if (swiperRef.current?.swiper && loadedImages.size > 2) {
      console.log(`🔄 Updating Swiper (${loadedImages.size}/8 images loaded)`);
      swiperRef.current.swiper.update();
    }
  }, [loadedImages]);

  if (!isMounted) {
    return (
      <div 
        className={`${styles.featuredSwiperContainer} w-full`}
        style={{ minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div className="animate-pulse text-gray-400">Loading slides...</div>
      </div>
    );
  }

  const swiperConfig = {
    modules: [Navigation, Pagination, Autoplay],
    loop: true,
    speed: 600,
    watchSlidesProgress: true,
    centeredSlides: true,
    direction: 'ltr',
    autoHeight: false, // ✅ CRITICAL: Don't auto-calculate height
    
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    
    pagination: {
      el: '.featured-pagination-dots', // ✅ Use unique selector (ref is null at config creation)
      type: 'bullets', // ✅ CRITICAL: Specify bullets type (prevents vertical)
      clickable: true,
      dynamicBullets: false,
    },
    
    navigation: true,
    
    slidesPerView: 1.3,
    slidesPerGroup: 1,
    spaceBetween: 16,
    
    breakpoints: {
      480: {
        slidesPerView: 1.4,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 2.3,
        slidesPerGroup: 1,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 2.6,
        slidesPerGroup: 1,
        spaceBetween: 24,
      },
      1440: {
        slidesPerView: 3.3,
        slidesPerGroup: 1,
        spaceBetween: 28,
      },
      1920: {
        slidesPerView: 3.4,
        slidesPerGroup: 1,
        spaceBetween: 32,
      },
    },
    
    onInit: (swiper) => {
      console.log('✅ Featured Swiper initialized:', swiper.slides.length, 'slides');
      
      swiper.slides.forEach((slide, index) => {
        if (index !== swiper.activeIndex) {
          slide.style.opacity = '0.35';
        } else {
          slide.style.opacity = '1';
        }
      });
    },
    
    onSlideChange: (swiper) => {
      swiper.slides.forEach((slide, index) => {
        if (index === swiper.activeIndex) {
          slide.style.opacity = '1';
        } else {
          slide.style.opacity = '0.35';
        }
      });
    },
    
    onProgress: (swiper) => {
      swiper.slides.forEach((slide) => {
        const progress = Math.abs(slide.progress);
        
        if (window.innerWidth >= 1024) {
          if (progress === 0) {
            slide.style.opacity = '1';
            slide.style.transform = 'scale(1)';
            slide.style.filter = 'grayscale(0%)';
          } else if (progress <= 1) {
            slide.style.opacity = '0.75';
            slide.style.transform = 'scale(0.98)';
            slide.style.filter = 'grayscale(0%)';
          } else {
            const opacity = Math.max(0.2, 1 - (progress - 1) * 0.4);
            slide.style.opacity = opacity;
            slide.style.transform = `scale(${Math.max(0.92, 1 - (progress - 1) * 0.04)})`;
            slide.style.filter = `grayscale(${Math.min(30, (progress - 1) * 20)}%)`;
          }
        } else {
          const opacity = Math.max(0.2, 1 - progress * 0.6);
          const scale = Math.max(0.95, 1 - progress * 0.05);
          
          slide.style.opacity = opacity;
          slide.style.transform = `scale(${scale})`;
          slide.style.filter = `grayscale(${Math.min(20, progress * 20)}%)`;
        }
      });
    },
  };

  return (
    <div 
      className={`${styles.featuredSwiperContainer} w-full`}
      dir="ltr"
    >
      <Swiper
        {...swiperConfig}
        ref={swiperRef}
        className={`${styles.featuredSwiper} swiper-ready`}
        style={{
          '--swiper-navigation-color': '#ff6b9d',
          '--swiper-pagination-color': '#ff6b9d',
          '--swiper-pagination-bullet-inactive-color': '#ff6b9d',
          '--swiper-pagination-bullet-inactive-opacity': '0.25',
          height: '100%', // ✅ Take full container height
        }}
      >
        {SLIDES_DATA.map((slide) => {
          const isLoaded = loadedImages.has(slide.id);
          
          return (
            <SwiperSlide 
              key={slide.id}
              className="elementor-repeater-item-c8a489e"
              style={{
                aspectRatio: '4 / 3',  // ✅ Modern CSS - cleaner than padding hack
                width: '100%',
              }}
            >
              <div 
                className="swiper-slide-inner"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                }}
              >
                  {isLoaded ? (
                    <>
                      <div
                        className="swiper-slide-bg"
                        style={{
                          backgroundImage: `url(${slide.image})`,
                          backgroundColor: '#FFF5EE',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                        }}
                      />
                      {slide.priority === 'high' && (
                        <link
                          rel="preload"
                          as="image"
                          href={slide.image}
                          fetchpriority="high"
                        />
                      )}
                    </>
                  ) : (
                    <div className={styles.skeletonShimmer} />
                  )}
                  
                  <div className="swiper-slide-contents" />
                </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* ✅ Custom Pagination Element - Outside Swiper */}
      <div 
        className={`${styles.customPagination} featured-pagination-dots`}
        ref={paginationRef}
      ></div>
    </div>
  );
};

export default FeaturedSwiper;