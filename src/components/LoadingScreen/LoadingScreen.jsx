import React from 'react';
import { useGlobal } from '../../context/GlobalProvider';
import styles from './LoadingScreen.module.css';

/**
 * LoadingScreen Component - Pure React Loading Overlay
 * 
 * ✅ Replaces: #carousel-loading in index.html
 * ✅ Features: Full-screen loading overlay with spinner
 * ✅ Tailwind-first: Simple styles in JSX, spinner animation in CSS Module
 */

const LoadingScreen = ({ isLoading, message }) => {
  const { t } = useGlobal();

  if (!isLoading) return null;

  return (
    <div
      className={`${styles.loadingScreen} fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center`}
      role="status"
      aria-live="polite"
      aria-label={message || t('loading') || 'Loading...'}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
        {/* Spinner */}
        <div className={`${styles.spinner} mx-auto`} />
        
        {/* Loading Text */}
        <p className="mt-4 text-gray-700 dark:text-gray-300 text-center font-medium">
          {message || t('loading') || 'جاري التحميل...'}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
