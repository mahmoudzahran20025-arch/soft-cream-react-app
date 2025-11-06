import React from 'react';
import { useGlobal } from '../context/GlobalProvider';
import styles from './TrustBanner.module.css';

/**
 * TrustBanner Component - Pure React Implementation
 * 
 * ✅ Replaces: HTML trust-banner section
 * ✅ Features: Health message, natural ingredients
 * ✅ i18n: Full translation support
 * ✅ Dark Mode: Full support
 */
const TrustBanner = () => {
  const { t } = useGlobal();

  return (
    <div className={styles.trustBanner}>
      <div className={styles.trustIcon}>
        🌿
      </div>
      
      <div className={styles.trustText}>
        <h3 className={styles.trustTitle}>
          {t('trustBannerTitle') || 'منتجات طبيعية معتمدة'}
        </h3>
        <p className={styles.trustDescription}>
          {t('trustBannerDescription') || 'جميع منتجاتنا خالية من المواد الحافظة والألوان الصناعية'}
        </p>
      </div>
    </div>
  );
};

export default TrustBanner;
