import React, { useState, useEffect } from 'react';
import { Property, PropertyType, Status, UnitType, Finishing, LandUse } from '../types';
import { CITIES } from '../constants';
import { ArrowRight, CheckCircle } from '../components/Icon';

interface AddPropertyProps {
  initialType: PropertyType;
  onSave: (property: Property) => void;
  onCancel: () => void;
}

export const AddProperty: React.FC<AddPropertyProps> = ({ initialType, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Property>>({
    type: initialType,
    city: 'الرياض',
    district: '',
    developer: '',
    // Defaults to avoid nulls
    rooms: 0,
    bathrooms: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-calculation for Land
  useEffect(() => {
    if (formData.type === PropertyType.Land) {
      if (formData.landArea && formData.pricePerMeter) {
        setFormData(prev => ({ ...prev, totalPrice: (prev.landArea || 0) * (prev.pricePerMeter || 0) }));
      }
    }
  }, [formData.landArea, formData.pricePerMeter, formData.type]);

  // Sync total price to main price for display
  useEffect(() => {
    if (formData.type === PropertyType.Land && formData.totalPrice) {
       setFormData(prev => ({...prev, price: prev.totalPrice}));
    }
  }, [formData.totalPrice, formData.type]);


  const handleChange = (field: keyof Property, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.city) newErrors.city = 'المدينة مطلوبة';
    if (!formData.district) newErrors.district = 'الحي مطلوب';
    if (!formData.developer) newErrors.developer = 'المطور مطلوب';

    if (formData.type === PropertyType.Residential) {
      if (!formData.projectName) newErrors.projectName = 'اسم المشروع مطلوب';
      if (!formData.status) newErrors.status = 'حالة المشروع مطلوبة';
      if (!formData.price || formData.price <= 0) newErrors.price = 'السعر مطلوب ويجب أن يكون أكبر من 0';
      if (!formData.area || formData.area <= 0) newErrors.area = 'المساحة مطلوبة';
    } else {
       if (!formData.landArea || formData.landArea <= 0) newErrors.landArea = 'مساحة الأرض مطلوبة';
       // We can allow manual entry or calculated.
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const newProperty = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      } as Property;
      onSave(newProperty);
    }
  };

  const isLand = formData.type === PropertyType.Land;

  return (
    <div className="p-4 md:p-8 md:pr-72 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onCancel} className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowRight size={24} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {isLand ? 'إضافة أرض جديدة' : 'إضافة وحدة سكنية جديدة'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">
          
          {/* Section 1: Basic Info */}
          <section>
            <h3 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">البيانات الأساسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المدينة <span className="text-red-500">*</span></label>
                <select
                  value={formData.city}
                  onChange={e => handleChange('city', e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحي <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.district || ''}
                  onChange={e => handleChange('district', e.target.value)}
                  className={`w-full p-3 rounded-lg border ${errors.district ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary-500`}
                />
                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المطور العقاري <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.developer || ''}
                  onChange={e => handleChange('developer', e.target.value)}
                  className={`w-full p-3 rounded-lg border ${errors.developer ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary-500`}
                />
                {errors.developer && <p className="text-red-500 text-xs mt-1">{errors.developer}</p>}
              </div>

               {!isLand && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم المشروع <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.projectName || ''}
                    onChange={e => handleChange('projectName', e.target.value)}
                    className={`w-full p-3 rounded-lg border ${errors.projectName ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary-500`}
                  />
                  {errors.projectName && <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>}
                </div>
              )}
            </div>
          </section>

          {/* Section 2: Specific Details */}
          <section>
            <h3 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
               {isLand ? 'تفاصيل الأرض' : 'تفاصيل الوحدة'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLand ? (
                // LAND FIELDS
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المساحة (م²) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={formData.landArea || ''}
                      onChange={e => handleChange('landArea', Number(e.target.value))}
                      className={`w-full p-3 rounded-lg border ${errors.landArea ? 'border-red-500' : 'border-gray-200'}`}
                    />
                     {errors.landArea && <p className="text-red-500 text-xs mt-1">{errors.landArea}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">سعر المتر</label>
                    <input
                      type="number"
                      value={formData.pricePerMeter || ''}
                      onChange={e => handleChange('pricePerMeter', Number(e.target.value))}
                      className="w-full p-3 rounded-lg border border-gray-200"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">استخدام الأرض</label>
                    <select
                      value={formData.landUse}
                      onChange={e => handleChange('landUse', e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 bg-white"
                    >
                      <option value="">اختر...</option>
                      {Object.values(LandUse).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">عرض الشارع (م)</label>
                    <input
                      type="number"
                      value={formData.streetWidth || ''}
                      onChange={e => handleChange('streetWidth', Number(e.target.value))}
                      className="w-full p-3 rounded-lg border border-gray-200"
                    />
                  </div>
                   <div className="flex items-center gap-3 pt-8">
                     <input 
                        type="checkbox" 
                        id="isCorner"
                        checked={formData.isCorner || false}
                        onChange={e => handleChange('isCorner', e.target.checked)}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                     />
                     <label htmlFor="isCorner" className="text-sm font-medium text-gray-700">أرض زاوية؟</label>
                   </div>
                   <div className="flex items-center gap-3 pt-8">
                     <input 
                        type="checkbox" 
                        id="investmentAllowed"
                        checked={formData.investmentAllowed || false}
                        onChange={e => handleChange('investmentAllowed', e.target.checked)}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                     />
                     <label htmlFor="investmentAllowed" className="text-sm font-medium text-gray-700">قابل للاستثمار؟</label>
                   </div>
                </>
              ) : (
                // RESIDENTIAL FIELDS
                <>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نوع الوحدة</label>
                    <select
                      value={formData.unitType}
                      onChange={e => handleChange('unitType', e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 bg-white"
                    >
                      <option value="">اختر...</option>
                      {Object.values(UnitType).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المساحة (م²) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={formData.area || ''}
                      onChange={e => handleChange('area', Number(e.target.value))}
                      className={`w-full p-3 rounded-lg border ${errors.area ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الحالة <span className="text-red-500">*</span></label>
                    <select
                      value={formData.status}
                      onChange={e => handleChange('status', e.target.value)}
                      className={`w-full p-3 rounded-lg border ${errors.status ? 'border-red-500' : 'border-gray-200'} bg-white`}
                    >
                      <option value="">اختر...</option>
                      {Object.values(Status).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                     {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">عدد الغرف</label>
                    <input
                      type="number"
                      value={formData.rooms || ''}
                      onChange={e => handleChange('rooms', Number(e.target.value))}
                      className="w-full p-3 rounded-lg border border-gray-200"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">عدد دورات المياه</label>
                    <input
                      type="number"
                      value={formData.bathrooms || ''}
                      onChange={e => handleChange('bathrooms', Number(e.target.value))}
                      className="w-full p-3 rounded-lg border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">سنة البناء</label>
                    <input
                      type="number"
                      value={formData.yearBuilt || ''}
                      onChange={e => handleChange('yearBuilt', Number(e.target.value))}
                      className="w-full p-3 rounded-lg border border-gray-200"
                    />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Section 3: Pricing & Notes */}
          <section>
             <h3 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">السعر والملاحظات</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     {isLand ? 'السعر الإجمالي' : 'السعر'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={isLand ? (formData.totalPrice || '') : (formData.price || '')}
                    onChange={e => {
                        const val = Number(e.target.value);
                        if(isLand) handleChange('totalPrice', val);
                        else handleChange('price', val);
                    }}
                    className={`w-full p-3 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-200'} text-lg font-bold text-primary-700`}
                    // If land, and calculated, maybe make it read-only or editable? Prompt said formula.
                    // Typically editable but calculated by default.
                  />
                   {isLand && <p className="text-xs text-gray-500 mt-1">يتم حسابه تلقائياً عند إدخال المساحة وسعر المتر</p>}
                </div>
                
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رابط الموقع (Google Maps)</label>
                    <input
                      type="url"
                      value={formData.googleMapUrl || ''}
                      onChange={e => handleChange('googleMapUrl', e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200 text-left" // URL is LTR
                      dir="ltr"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>

                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات إضافية</label>
                    <textarea
                      rows={3}
                      value={isLand ? formData.landNotes : formData.notes}
                      onChange={e => handleChange(isLand ? 'landNotes' : 'notes', e.target.value)}
                      className="w-full p-3 rounded-lg border border-gray-200"
                    ></textarea>
                  </div>
             </div>
          </section>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle size={20} />
              حفظ العرض
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};