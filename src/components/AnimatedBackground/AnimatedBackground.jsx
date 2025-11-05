import React from 'react';
import styles from './AnimatedBackground.module.css';

/**
 * AnimatedBackground Component - Pure React Background
 * 
 * ✅ Replaces: .animated-background in components.css
 * ✅ Features: Gradient background with dark mode support
 * ✅ Performance: Fixed position, no layout shifts
 */

const AnimatedBackground = () => {
  return (
    <div 
      className={styles.animatedBackground}
      aria-hidden="true"
    />
  );
};

export default AnimatedBackground;
