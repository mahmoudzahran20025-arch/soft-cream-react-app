import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useGlobal } from '../../context/GlobalProvider';
import styles from './Toast.module.css';

/**
 * ToastContainer Component - Pure React Toast System
 * 
 * ✅ Replaces: #toastContainer in index.html + toast CSS in components.css
 * ✅ Features: Success, Error, Warning, Info toasts with auto-dismiss
 * ✅ Tailwind-first: Simple styles in JSX, complex animations in CSS Module
 */

const Toast = ({ id, type = 'info', title, message, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isHiding, setIsHiding] = React.useState(false);

  useEffect(() => {
    // Show toast after mount
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    // Auto-dismiss after duration
    const hideTimer = setTimeout(() => {
      setIsHiding(true);
      setTimeout(() => onClose(id), 300); // Wait for hide animation
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsHiding(true);
    setTimeout(() => onClose(id), 300);
  };

  // Icon mapping
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  // Icon colors (Tailwind)
  const iconColors = {
    success: 'text-green-600 dark:text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${isVisible && !isHiding ? styles.show : ''} ${isHiding ? styles.hide : ''} flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg backdrop-blur-md`}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 mt-0.5 ${iconColors[type]}`}>
        {icons[type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <div className="font-semibold text-sm text-gray-800 dark:text-gray-50 mb-0.5 leading-tight">
            {title}
          </div>
        )}
        {message && (
          <div className="text-sm text-gray-600 dark:text-gray-400 leading-normal mt-1">
            {message}
          </div>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-md text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 -mt-1"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      <div
        className={styles.toastProgress}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useGlobal();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={removeToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
