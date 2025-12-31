
import React from 'react';
import { Property, PropertyType } from '../types';
// Added 'Bath' to the imports to resolve the "Cannot find name 'Bath'" error on line 162.
import { ArrowRight, MapPin, Ruler, DollarSign, Building2, Map, Calendar, FileText, CheckCircle, XCircle, Share2, Download, Bed, Bath } from '../components/Icon';

interface ViewPropertyProps {
  property: Property;
  onBack: () => void;
}

export const ViewProperty: React.FC<ViewPropertyProps> = ({ property, onBack }) => {
  const isLand = property.type === PropertyType.Land;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(price);
  };

  const handleWhatsAppShare = () => {
    const title = property.projectName || (isLand ? `أرض في حي ${property.district}` : `وحدة سكنية في حي ${property.district}`);
    const price = formatPrice(property.price || property.totalPrice || 0);
    const location = `${property.city} - ${property.district}`;
    const area = isLand ? `${property.landArea} م²` : `${property.area} م²`;
    
    let message = `*مرحباً، أود مشاركة هذا العرض العقاري معك:*\n\n`;
    message += `🏠 *${title}*\n`;
    message += `📍 ${location}\n`;
    message += `💰 *السعر:* ${price}\n`;
    message += `📐 *المساحة:* ${area}\n`;
    
    if (property.googleMapUrl) {
      message += `🗺️ *الموقع على الخريطة:* ${property.googleMapUrl}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleDownloadBrochure = () => {
    if (!property.projectBrochureUrl) return;
    const link = document.createElement('a');
    link.href = property.projectBrochureUrl;
    link.download = `Project_Brochure_${property.projectName || property.id}.pdf`;
    link.click();
  };

  const InfoItem = ({ icon: Icon, label, value, highlight = false }: { icon: any, label: string, value: any, highlight?: boolean }) => (
    <div className={`flex items-start gap-3 p-4 rounded-xl transition-all ${highlight ? 'bg-primary-50 border border-primary-100' : 'bg-gray-50 border border-transparent'}`}>
      <div className={`p-2 rounded-lg shadow-sm ${highlight ? 'bg-primary-600 text-white' : 'bg-white text-primary-600'}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className={`font-bold ${highlight ? 'text-primary-800 text-lg' : 'text-gray-800'}`}>{value || '-'}</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 md:pr-72 min-h-screen bg-gray-50 pb-20 text-right" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors group">
            <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-primary-50">
              <ArrowRight size={20} />
            </div>
            <span className="font-bold">العودة للعروض</span>
          </button>
          
          <div className="flex gap-3">
             {property.projectBrochureUrl && (
                <button 
                  onClick={handleDownloadBrochure}
                  className="flex items-center gap-2 bg-primary-50 text-primary-600 px-5 py-2.5 rounded-2xl font-bold hover:bg-primary-100 transition-all border border-primary-100"
                >
                  <Download size={20} />
                  <span>تحميل البروفايل</span>
                </button>
             )}
             <button 
                onClick={handleWhatsAppShare}
                className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-green-100"
              >
                <Share2 size={20} />
                <span>مشاركة</span>
             </button>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="relative">
            <div className={`h-32 md:h-48 w-full ${isLand ? 'bg-secondary-600' : 'bg-primary-600'} opacity-10 absolute top-0`}></div>
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${isLand ? 'bg-secondary-600 text-white shadow-lg' : 'bg-primary-600 text-white shadow-lg'}`}>
                      {isLand ? 'أرض للبيع' : 'وحدة سكنية'}
                    </span>
                    {property.status && (
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black bg-white text-gray-600 border border-gray-200 uppercase tracking-wider">
                        {property.status}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
                    {property.projectName || (isLand ? `أرض مميزة في حي ${property.district}` : `وحدة سكنية في ${property.district}`)}
                  </h1>
                  <div className="flex items-center text-gray-500 font-black text-lg">
                    <MapPin size={24} className="ml-2 text-red-500" />
                    {property.city} - {property.district}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-50 text-center min-w-[220px] w-full md:w-auto">
                  <p className="text-[10px] text-gray-400 font-black mb-1 uppercase tracking-[0.2em]">القيمة الإجمالية</p>
                  <p className="text-3xl font-black text-primary-600">
                    {formatPrice(property.price || property.totalPrice || 0)}
                  </p>
                  {isLand && property.pricePerMeter && (
                    <p className="text-[11px] text-secondary-600 mt-2 font-black border-t pt-2 border-gray-50">
                      {property.pricePerMeter} ريال / م²
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            
            {/* Project Description (NEW) */}
            {property.projectDescription && (
              <section className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                 <div className="flex items-center gap-3 mb-4">
                    <FileText size={22} className="text-primary-600" />
                    <h3 className="text-xl font-black text-gray-800">عن المشروع</h3>
                 </div>
                 <p className="text-gray-600 font-bold leading-relaxed text-lg italic">
                    {property.projectDescription}
                 </p>
              </section>
            )}

            <section>
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-1.5 h-8 bg-primary-600 rounded-full"></div>
                 <h3 className="text-2xl font-black text-gray-800">بيانات العرض الفنية</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoItem icon={Building2} label="المطور" value={property.developer} />
                {isLand ? (
                  <>
                    <InfoItem icon={Ruler} label="المساحة" value={`${property.landArea} م²`} highlight />
                    <InfoItem icon={Map} label="الاستخدام" value={property.landUse} />
                    <InfoItem icon={Ruler} label="الشارع" value={`${property.streetWidth || '-'} م`} />
                  </>
                ) : (
                  <>
                    <InfoItem icon={Ruler} label="المساحة" value={`${property.area} م²`} highlight />
                    <InfoItem icon={Bed} label="عدد الغرف" value={property.rooms} highlight />
                    <InfoItem icon={Building2} label="نوع الوحدة" value={property.unitType} />
                    <InfoItem icon={Bath} label="دورات المياه" value={property.bathrooms} />
                    <InfoItem icon={Calendar} label="سنة البناء" value={property.yearBuilt} />
                  </>
                )}
              </div>
            </section>

            {property.googleMapUrl && (
              <section className="pt-4">
                <a 
                  href={property.googleMapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-4 bg-gray-900 text-white px-8 py-5 rounded-[2rem] font-black text-lg hover:bg-primary-600 transition-all shadow-2xl shadow-gray-200"
                >
                  <MapPin size={24} className="text-red-500" />
                  عرض موقع المشروع على الخريطة (Google Maps)
                </a>
              </section>
            )}
            
            <button 
              onClick={() => window.print()} 
              className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 rounded-2xl font-black text-xs hover:bg-gray-50 transition-all uppercase tracking-widest no-print"
            >
              طباعة أو حفظ العرض كملف PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
