import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

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
        className="featured-swiper-container w-full"
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
    
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    
    pagination: {
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
      className="featured-swiper-container w-full"
      dir="ltr"
    >
      <Swiper
        {...swiperConfig}
        ref={swiperRef}
        className="featured-swiper swiper-ready"
        style={{
          '--swiper-navigation-color': '#ff6b9d',
          '--swiper-pagination-color': '#ff6b9d',
          '--swiper-pagination-bullet-inactive-color': '#ff6b9d',
          '--swiper-pagination-bullet-inactive-opacity': '0.25',
        }}
      >
        {SLIDES_DATA.map((slide) => {
          const isLoaded = loadedImages.has(slide.id);
          
          return (
            <SwiperSlide 
              key={slide.id}
              className="elementor-repeater-item-c8a489e"
            >
              {/* Wrapper for padding-top hack */}
              <div style={{ 
                display: 'block',
                position: 'relative',
                width: '100%', 
                paddingTop: '75%',  // 4:3 aspect ratio
              }}>
                <div 
                  className="swiper-slide-inner"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
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
                    <div
                      className="skeleton-shimmer"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                      }}
                    />
                  )}
                  
                  <div className="swiper-slide-contents" />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .featured-swiper {
          width: 100%;
          display: block;
        }

        .featured-swiper .swiper-slide {
          height: auto !important;  /* Override Swiper's height: 100% */
          border-radius: 1rem;
          transition: all 0.3s ease;
        }

        /* Navigation Buttons */
        .featured-swiper :global(.swiper-button-prev),
        .featured-swiper :global(.swiper-button-next) {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .featured-swiper :global(.swiper-button-prev):hover,
        .featured-swiper :global(.swiper-button-next):hover {
          opacity: 1;
          transform: scale(1.1);
        }

        .featured-swiper :global(.swiper-button-prev)::after,
        .featured-swiper :global(.swiper-button-next)::after {
          font-size: 20px;
          font-weight: bold;
        }

        /* Pagination */
        .featured-swiper :global(.swiper-pagination) {
          position: relative !important;
          bottom: auto !important;
          margin-top: 1rem;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .featured-swiper :global(.swiper-pagination-bullet) {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .featured-swiper :global(.swiper-pagination-bullet-active) {
          width: 12px;
          height: 12px;
          transform: scale(2);
        }

        /* Mobile Specific */
        @media (max-width: 767px) {
          .featured-swiper :global(.swiper-pagination) {
            margin-top: 0.5rem;
            height: 24px;
            padding: 4px 8px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            gap: 2px;
          }

          .featured-swiper :global(.swiper-pagination-bullet) {
            width: 8px;
            height: 8px;
            margin: 0 1px;
          }

          .featured-swiper :global(.swiper-pagination-bullet-active) {
            width: 10px;
            height: 10px;
            transform: scale(1.2);
          }
        }

        /* Desktop Hover Effects */
        @media (min-width: 768px) {
          .featured-swiper-container:hover :global(.swiper-button-prev),
          .featured-swiper-container:hover :global(.swiper-button-next) {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default FeaturedSwiper;