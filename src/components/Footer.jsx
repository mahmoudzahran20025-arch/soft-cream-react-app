import React from 'react';
import { useGlobal } from '../context/GlobalProvider';
import { Sparkles, Clock, Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';

/**
 * Footer Component
 * Complete footer with health info, hours, contact, and social links
 */
const Footer = () => {
  const { t } = useGlobal();

  return (
    <footer className="bg-gradient-to-t from-pink-50 to-white dark:from-gray-900 dark:to-gray-800 border-t border-pink-100 dark:border-gray-700 pt-16 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* معلوماتنا الصحية */}
          <div className="footer-widget" id="footer-health-info">
            <div className="footer-title flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold uppercase tracking-wider text-primary">
                {t('footerNavHealthy')}
              </span>
            </div>
            <div className="footer-card bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-pink-100 dark:border-gray-600 shadow-sm">
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                {t('footerHealthyDesc')}
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-primary text-sm mt-0.5">✓</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                    {t('footerFeatureEnergy')}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary text-sm mt-0.5">✓</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                    {t('footerFeatureFocus')}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary text-sm mt-0.5">✓</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                    {t('footerFeatureNatural')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* ساعات العمل */}
          <div className="footer-widget" id="footer-hours">
            <div className="footer-title flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold uppercase tracking-wider text-primary">
                {t('footerNavHours')}
              </span>
            </div>
            <div className="footer-card bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-green-100 dark:border-gray-600 shadow-sm">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {t('footerWeekDays')}
                  </span>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                    {t('footerWeekHours')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {t('footerFriday')}
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-lg">
                    {t('footerFridayHours')}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-green-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">
                    {t('footerOpenNow')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* تواصل معنا */}
          <div className="footer-widget" id="footer-contact">
            <div className="footer-title flex items-center gap-2 mb-4">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold uppercase tracking-wider text-primary">
                {t('footerNavContact')}
              </span>
            </div>
            <div className="footer-card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-blue-100 dark:border-gray-600 shadow-sm space-y-3">
              
              {/* Phone */}
              <a 
                href="tel:+201234567890" 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                    {t('footerPhoneLabel')}
                  </div>
                  <div className="text-xs font-bold text-gray-800 dark:text-gray-100 direction-ltr">
                    +20 123 456 7890
                  </div>
                </div>
              </a>
              
              {/* Email */}
              <a 
                href="mailto:info@softcream.com" 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                    {t('footerEmailLabel')}
                  </div>
                  <div className="text-xs font-bold text-gray-800 dark:text-gray-100">
                    info@softcream.com
                  </div>
                </div>
              </a>
              
              {/* Address */}
              <div className="flex items-start gap-3 p-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-sm flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mb-1">
                    {t('footerAddressLabel')}
                  </div>
                  <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t('footerAddressText')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom: Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-pink-100 dark:border-gray-700 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Facebook */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link w-10 h-10 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:from-primary hover:to-secondary hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-200 border border-pink-100 dark:border-gray-600" 
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            
            {/* Instagram */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link w-10 h-10 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:from-primary hover:to-secondary hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-200 border border-pink-100 dark:border-gray-600" 
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            
            {/* WhatsApp */}
            <a 
              href="https://wa.me/201234567890" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link w-10 h-10 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:from-primary hover:to-secondary hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-200 border border-pink-100 dark:border-gray-600" 
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
          
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {t('footerCopyright')}
          </span>
          <span className="block text-xs text-gray-500 dark:text-gray-500 mt-2">
            {t('footerMadeWith')}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
