import React, { useState } from 'react';
import { Property, PropertyType, Status, UnitType } from '../types';
import { MapPin, Bed, Ruler, ArrowRight, Bath, Layers, Calendar, ChevronDown, ChevronUp, Share2, Building2, Map } from './Icon';

interface PropertyCardProps {
  property: Property;
  onClick: (property: Property) => void;
  isListView?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, isListView = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLand = property.type === PropertyType.Land;
  const isAnnex = property.unitType === UnitType.Annex;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', { 
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1 
    }).format(price) + ' ريال';
  };

  const getVisualStyles = () => {
    if (isLand) return { 
      borderColor: 'border-secondary-500',
      bgColor: 'bg-secondary-50/40',
      accentColor: 'text-secondary-600',
      priceColor: 'text-secondary-700',
      tagColor: 'bg-secondary-600 text-white',
      btnColor: 'bg-secondary-600',
      label: 'أرض فضاء'
    };

    if (isAnnex) {
      if (property.status === Status.UnderConstruction) {
        return {
          borderColor: 'border-pink-400',
          bgColor: 'bg-pink-50/40',
          accentColor: 'text-pink-600',
          priceColor: 'text-pink-700',
          tagColor: 'bg-pink-600 text-white',
          btnColor: 'bg-pink-600',
          label: 'ملحق (تحت الإنشاء)'
        };
      }
      return {
        borderColor: 'border-purple-400',
        bgColor: 'bg-purple-50/40',
        accentColor: 'text-purple-600',
        priceColor: 'text-purple-700',
        tagColor: 'bg-purple-600 text-white',
        btnColor: 'bg-purple-600',
        label: 'ملحق / روف'
      };
    }

    if (property.status === Status.Ready) {
      return { 
        borderColor: 'border-green-500',
        bgColor: 'bg-green-50/40',
        accentColor: 'text-green-600',
        priceColor: 'text-green-700',
        tagColor: 'bg-green-600 text-white',
        btnColor: 'bg-green-600',
        label: property.unitType || 'شقة'
      };
    }

    return { 
      borderColor: 'border-red-400',
      bgColor: 'bg-red-50/40',
      accentColor: 'text-red-600',
      priceColor: 'text-red-700',
      tagColor: 'bg-red-600 text-white',
      btnColor: 'bg-red-600',
      label: property.unitType || 'شقة'
    };
  };

  const styles = getVisualStyles();

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (isListView) {
      onClick(property);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const title = property.projectName || (isLand ? `أرض في حي ${property.district}` : `${styles.label} في حي ${property.district}`);
    const priceValue = property.price || property.totalPrice || 0;
    const price = new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(priceValue);
    const message = `*عرض عقاري جديد:*\n🏠 ${title}\n📍 ${property.city} - ${property.district}\n💰 ${price}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  // --- LIST VIEW (HORIZONTAL) ---
  if (isListView) {
    return (
      <div 
        onClick={() => onClick(property)}
        className={`bg-white rounded-2xl border transition-all hover:shadow-md cursor-pointer flex overflow-hidden group ${styles.borderColor}`}
      >
        <div className={`w-2 h-full shrink-0 ${styles.tagColor.split(' ')[0]}`}></div>
        <div className="flex-1 p-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
             <div className={`p-2 rounded-xl ${styles.bgColor} ${styles.accentColor} shrink-0`}>
                {isLand ? <Map size={20} /> : <Building2 size={20} />}
             </div>
             <div>
                <h3 className="font-black text-gray-900 text-xs line-clamp-1">{property.projectName || styles.label}</h3>
                <div className="flex items-center text-gray-400 text-[9px] font-bold mt-0.5">
                  <MapPin size={10} className="ml-1 text-red-400" />
                  {property.city} • {property.district}
                </div>
             </div>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar md:justify-end">
             <div className="shrink-0 text-center px-4 border-l border-gray-50">
                <span className="text-[8px] text-gray-400 block font-bold">المساحة</span>
                <span className="text-[11px] font-black text-gray-700">{isLand ? property.landArea : property.area} م²</span>
             </div>
             {!isLand && (
               <div className="shrink-0 text-center px-4 border-l border-gray-50">
                  <span className="text-[8px] text-gray-400 block font-bold">الغرف</span>
                  <span className="text-[11px] font-black text-gray-700">{property.rooms}</span>
               </div>
             )}
             <div className="shrink-0 text-left px-4">
                <span className="text-[8px] text-gray-400 block font-bold">السعر</span>
                <span className={`text-xs font-black ${styles.priceColor}`}>{formatPrice(property.price || property.totalPrice || 0)}</span>
             </div>
             <button 
                onClick={handleWhatsAppShare}
                className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all"
             >
                <Share2 size={16} />
             </button>
          </div>
        </div>
      </div>
    );
  }

  // --- GRID VIEW (CARDS) ---
  return (
    <div 
      onClick={handleCardClick}
      className={`relative bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-col h-fit cursor-pointer select-none shadow-sm hover:shadow-lg ${styles.borderColor} ${isExpanded ? 'ring-2 ring-gray-100' : ''}`}
    >
      <div className={`absolute top-0 right-0 px-2 py-0.5 rounded-bl-lg text-[8px] font-black z-10 ${styles.tagColor}`}>
        {styles.label}
      </div>

      <div className={`p-3 pt-6 flex-1 flex flex-col ${styles.bgColor}`}>
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-black text-gray-900 text-[10px] md:text-xs leading-tight line-clamp-1 flex-1">
            {property.projectName || styles.label}
          </h3>
          <span className={`text-[10px] md:text-xs font-black ${styles.priceColor} shrink-0`}>
            {formatPrice(property.price || property.totalPrice || 0)}
          </span>
        </div>

        <div className="flex items-center text-gray-500 text-[8px] mb-3 font-bold">
          <MapPin size={8} className="ml-0.5 shrink-0 text-red-500" />
          <span className="truncate">{property.city} • {property.district}</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex items-center gap-1 bg-white/70 p-1.5 rounded-lg border border-white/40 shadow-sm">
            <Ruler size={10} className={styles.accentColor} />
            <span className="text-[9px] font-black text-gray-700">{isLand ? property.landArea : property.area} م²</span>
          </div>
          
          <div className="flex items-center gap-1 bg-white/70 p-1.5 rounded-lg border border-white/40 shadow-sm">
            {isLand ? (
               <>
                 <Map size={10} className="text-secondary-600" />
                 <span className="text-[8px] font-black text-gray-600 truncate">{property.landUse || 'سكني'}</span>
               </>
            ) : (
              <>
                <Building2 size={10} className="text-primary-600" />
                <span className="text-[9px] font-black text-gray-700">{property.rooms} غرف</span>
              </>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-dashed border-gray-200 animate-in fade-in duration-300">
            <button 
              onClick={(e) => { e.stopPropagation(); onClick(property); }}
              className={`w-full py-2 rounded-lg text-[9px] font-black transition-all flex items-center justify-center gap-1.5 text-white ${styles.btnColor}`}
            >
              عرض كامل التفاصيل
              <ArrowRight size={10} className="rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};