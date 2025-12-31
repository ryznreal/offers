
import React, { useState, useEffect } from 'react';
import { Property, PropertyType, Status, UnitType, Finishing, LandUse } from '../types';
import { CITIES } from '../constants';
import { ArrowRight, CheckCircle } from '../components/Icon';

interface AddPropertyProps {
  initialType: PropertyType;
  onSave: (property: Property) => void;
  onCancel: () => void;
}

const DRAFT_KEY = 'realestate_add_property_draft';

export const AddProperty: React.FC<AddPropertyProps> = ({ initialType, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Property>>(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.type === initialType) return parsed;
    }
    return {
      type: initialType,
      city: 'الرياض',
      district: '',
      developer: '',
      rooms: 0,
      bathrooms: 0,
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // حفظ المسودة تلقائياً عند أي تغيير
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (formData.type === PropertyType.Land) {
      if (formData.landArea && formData.pricePerMeter) {
        setFormData(prev => ({ ...prev, totalPrice: (prev.landArea || 0) * (prev.pricePerMeter || 0) }));
      }
    }
  }, [formData.landArea, formData.pricePerMeter, formData.type]);

  useEffect(() => {
    if (formData.type === PropertyType.Land && formData.totalPrice) {
       setFormData(prev => ({...prev, price: prev.totalPrice}));
    }
  }, [formData.totalPrice, formData.type]);

  const handleChange = (field: keyof Property, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      localStorage.removeItem(DRAFT_KEY); // مسح المسودة عند الحفظ بنجاح
      onSave(newProperty);
    }
  };

  const isLand = formData.type === PropertyType.Land;

  return (
    <div className="p-4 md:p-8 md:pr-72 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => { localStorage.removeItem(DRAFT_KEY); onCancel(); }} className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowRight size={24} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {isLand ? 'إضافة أرض جديدة' : 'إضافة وحدة سكنية جديدة'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">
          <section>
            <h3 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">البيانات الأساسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المدينة <span className="text-red-500">*</span></label>
                <select value={formData.city} onChange={e => handleChange('city', e.target.value)} className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 bg-white">
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحي <span className="text-red-500">*</span></label>
                <input type="text" value={formData.district || ''} onChange={e => handleChange('district', e.target.value)} className={`w-full p-3 rounded-lg border ${errors.district ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary-500`} />
                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المطور العقاري <span className="text-red-500">*</span></label>
                <input type="text" value={formData.developer || ''} onChange={e => handleChange('developer', e.target.value)} className={`w-full p-3 rounded-lg border ${errors.developer ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary-500`} />
                {errors.developer && <p className="text-red-500 text-xs mt-1">{errors.developer}</p>}
              </div>
               {!isLand && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم المشروع <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.projectName || ''} onChange={e => handleChange('projectName', e.target.value)} className={`w-full p-3 rounded-lg border ${errors.projectName ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary-500`} />
                  {errors.projectName && <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>}
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">{isLand ? 'تفاصيل الأرض' : 'تفاصيل الوحدة'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLand ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المساحة (م²) <span className="text-red-500">*</span></label>
                    <input type="number" value={formData.landArea || ''} onChange={e => handleChange('landArea', Number(e.target.value))} className={`w-full p-3 rounded-lg border ${errors.landArea ? 'border-red-500' : 'border-gray-200'}`} />
                     {errors.landArea && <p className="text-red-500 text-xs mt-1">{errors.landArea}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">سعر المتر</label>
                    <input type="number" value={formData.pricePerMeter || ''} onChange={e => handleChange('pricePerMeter', Number(e.target.value))} className="w-full p-3 rounded-lg border border-gray-200" />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">استخدام الأرض</label>
                    <select value={formData.landUse} onChange={e => handleChange('landUse', e.target.value)} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                      <option value="">اختر...</option>
                      {Object.values(LandUse).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </>
              ) : (
                <>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نوع الوحدة</label>
                    <select value={formData.unitType} onChange={e => handleChange('unitType', e.target.value)} className="w-full p-3 rounded-lg border border-gray-200 bg-white">
                      <option value="">اختر...</option>
                      {Object.values(UnitType).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المساحة (م²) <span className="text-red-500">*</span></label>
                    <input type="number" value={formData.area || ''} onChange={e => handleChange('area', Number(e.target.value))} className={`w-full p-3 rounded-lg border ${errors.area ? 'border-red-500' : 'border-gray-200'}`} />
                    {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الحالة <span className="text-red-500">*</span></label>
                    <select value={formData.status} onChange={e => handleChange('status', e.target.value)} className={`w-full p-3 rounded-lg border ${errors.status ? 'border-red-500' : 'border-gray-200'} bg-white`}>
                      <option value="">اختر...</option>
                      {Object.values(Status).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                     {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                  </div>
                </>
              )}
            </div>
          </section>

          <div className="flex justify-end gap-4 pt-6">
            <button type="button" onClick={() => { localStorage.removeItem(DRAFT_KEY); onCancel(); }} className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">إلغاء ومسح المسودة</button>
            <button type="submit" className="px-8 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors flex items-center gap-2">
              <CheckCircle size={20} /> حفظ العرض
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
