import React from 'react';
import { useProductsData } from '../../context/ProductsDataContext';
import { Store, Truck, CheckCircle, MapPin, Loader2, AlertCircle } from 'lucide-react';

/**
 * DeliveryOptions Component
 * Handles delivery method selection and branch selection
 */
const DeliveryOptions = ({
  deliveryMethod,
  selectedBranch,
  branches,
  branchesLoading,
  errors,
  onDeliveryMethodChange,
  onBranchSelect
}) => {
  const { t, currentLang } = useProductsData();

  return (
    <div className="mb-6 space-y-3">
      {/* Error Message */}
      {errors.deliveryMethod && (
        <div className="p-3 bg-red-50 border-2 border-red-500 rounded-xl text-red-600 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errors.deliveryMethod}</span>
        </div>
      )}

      {/* Pickup Option */}
      <div
        className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
          deliveryMethod === 'pickup' 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-300 hover:border-primary'
        }`}
        onClick={() => onDeliveryMethodChange('pickup')}
      >
        <Store className="w-6 h-6 text-primary" />
        <div className="flex-1">
          <div className="font-bold">{t('pickupOption') || 'الاستلام من الفرع'}</div>
          <div className="text-sm text-gray-600">{t('pickupDesc') || 'مجاناً - 15 دقيقة'}</div>
        </div>
        <CheckCircle className={`w-6 h-6 ${deliveryMethod === 'pickup' ? 'text-primary' : 'text-gray-300'}`} />
      </div>

      {/* Branch Selection (Pickup Mode) */}
      {deliveryMethod === 'pickup' && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-5 border-2 border-gray-200 dark:border-gray-600">
          <label className="flex items-center gap-2 font-bold mb-4 text-gray-800 dark:text-gray-100">
            <MapPin className="w-5 h-5 text-primary" />
            <span>{t('selectBranch') || 'اختر الفرع'}:</span>
          </label>
          
          {branchesLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-gray-600">
                {currentLang === 'ar' ? 'جاري التحميل...' : 'Loading...'}
              </span>
            </div>
          ) : branches.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              {currentLang === 'ar' ? 'لا توجد فروع متاحة' : 'No branches available'}
            </div>
          ) : (
            <div className="space-y-3">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedBranch === branch.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-300 hover:border-primary'
                  }`}
                  onClick={() => onBranchSelect(branch.id)}
                >
                  <div className="font-bold text-gray-800 dark:text-gray-100">
                    {currentLang === 'ar' ? branch.name : branch.nameEn}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {currentLang === 'ar' ? branch.address : branch.addressEn}
                  </div>
                  {branch.phone && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      📞 {branch.phone}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {errors.branch && (
            <div className="text-red-500 text-sm mt-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.branch}</span>
            </div>
          )}
        </div>
      )}

      {/* Delivery Option */}
      <div
        className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${
          deliveryMethod === 'delivery' 
            ? 'border-primary bg-primary/10' 
            : 'border-gray-300 hover:border-primary'
        }`}
        onClick={() => onDeliveryMethodChange('delivery')}
      >
        <Truck className="w-6 h-6 text-primary" />
        <div className="flex-1">
          <div className="font-bold">{t('deliveryOption') || 'التوصيل'}</div>
          <div className="text-sm text-gray-600">{t('deliveryDesc') || 'حسب الموقع - 30 دقيقة'}</div>
        </div>
        <CheckCircle className={`w-6 h-6 ${deliveryMethod === 'delivery' ? 'text-primary' : 'text-gray-300'}`} />
      </div>
    </div>
  );
};

export default DeliveryOptions;