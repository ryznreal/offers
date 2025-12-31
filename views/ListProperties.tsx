
import React, { useState } from 'react';
import { Property, PropertyType, FilterState, Status } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { Search, LayoutList, LayoutGrid, Filter, Building2, Map, Home, XCircle, ArrowRight, Bed, ArrowUpDown, CheckCircle, Zap } from '../components/Icon';

interface ListPropertiesProps {
  properties: Property[];
  onSelectProperty: (p: Property) => void;
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  onOpenFilters?: () => void;
}

export const ListProperties: React.FC<ListPropertiesProps> = ({ 
  properties, 
  onSelectProperty, 
  filter, 
  setFilter,
  onOpenFilters
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleSortToggle = () => {
    setFilter(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : (prev.sortOrder === 'desc' ? 'none' : 'asc')
    }));
  };

  const filteredAndSortedProperties = properties
    .filter(p => {
      // Basic Filters
      if (filter.type !== 'All' && p.type !== filter.type) return false;
      
      // Residential Specific Filters
      if (p.type === PropertyType.Residential) {
        if (filter.unitType !== 'All' && p.unitType !== filter.unitType) return false;
        if (filter.status !== 'All' && p.status !== filter.status) return false;
        if (filter.rooms !== 'All') {
          if (filter.rooms === 5) {
            if ((p.rooms || 0) < 5) return false;
          } else {
            if (p.rooms !== filter.rooms) return false;
          }
        }
      }

      // Land Specific Filters
      if (p.type === PropertyType.Land) {
        if (filter.landUse !== 'All' && p.landUse !== filter.landUse) return false;
        if (filter.isCorner !== 'All' && p.isCorner !== filter.isCorner) return false;
        if (filter.investmentAllowed !== 'All' && p.investmentAllowed !== filter.investmentAllowed) return false;
      }

      // Search Filter
      const searchLower = filter.search.toLowerCase();
      const matchSearch = 
        p.city.toLowerCase().includes(searchLower) || 
        p.district.toLowerCase().includes(searchLower) || 
        p.developer.toLowerCase().includes(searchLower) ||
        (p.projectName && p.projectName.toLowerCase().includes(searchLower));
      
      if (!matchSearch) return false;

      // Price Filter
      const price = p.price || p.totalPrice || 0;
      if (filter.minPrice !== '' && price < filter.minPrice) return false;
      if (filter.maxPrice !== '' && price > filter.maxPrice) return false;

      return true;
    })
    .sort((a, b) => {
      if (filter.sortOrder === 'none') return 0;
      const priceA = a.price || a.totalPrice || 0;
      const priceB = b.price || b.totalPrice || 0;
      return filter.sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

  const resetAllFilters = () => {
    setFilter({
      search: '',
      type: 'All',
      status: 'All',
      unitType: 'All',
      rooms: 'All',
      minPrice: '',
      maxPrice: '',
      city: '',
      sortOrder: 'none',
      landUse: 'All',
      isCorner: 'All',
      investmentAllowed: 'All'
    });
  };

  const handleRoomSelect = (rooms: number | 'All') => {
    setFilter(prev => ({ ...prev, rooms }));
  };

  const handleStatusSelect = (status: Status | 'All') => {
    setFilter(prev => ({ ...prev, status }));
  };

  return (
    <div className="p-4 md:p-8 md:pr-[288px]">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Compact Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl font-black text-gray-900">العروض المتاحة</h2>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{filteredAndSortedProperties.length} عقار</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleSortToggle}
              title="ترتيب السعر"
              className={`p-2 rounded-xl border transition-all shadow-sm ${
                filter.sortOrder !== 'none' 
                ? 'bg-primary-600 border-primary-700 text-white' 
                : 'bg-white border-gray-100 text-gray-400 hover:text-gray-600'
              }`}
            >
              <ArrowUpDown size={16} />
            </button>

            <div className="relative w-full md:w-64">
              <Search className="absolute right-3 top-2.5 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="بحث سريع..."
                className="w-full pl-4 pr-9 py-2 rounded-xl border border-gray-100 bg-white text-[11px] font-bold focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all"
                value={filter.search}
                onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner ml-1">
               <button 
                 onClick={() => setViewMode('grid')}
                 className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <LayoutGrid size={14} />
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 <LayoutList size={14} />
               </button>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 flex-wrap">
          {/* Property Type Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            <button 
              onClick={() => setFilter(prev => ({ ...prev, type: 'All', unitType: 'All' }))}
              className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border whitespace-nowrap ${
                filter.type === 'All' ? 'bg-gray-800 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-100'
              }`}
            >
              الكل
            </button>
            <button 
              onClick={() => setFilter(prev => ({ ...prev, type: PropertyType.Residential }))}
              className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border whitespace-nowrap ${
                filter.type === PropertyType.Residential ? 'bg-primary-600 text-white border-primary-700' : 'bg-white text-primary-600 border-primary-100'
              }`}
            >
              السكني
            </button>
            <button 
              onClick={() => setFilter(prev => ({ ...prev, type: PropertyType.Land }))}
              className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border whitespace-nowrap ${
                filter.type === PropertyType.Land ? 'bg-secondary-600 text-white border-secondary-700' : 'bg-white text-secondary-600 border-secondary-100'
              }`}
            >
              الأراضي
            </button>
          </div>

          {/* Status Quick Filters (New) */}
          {filter.type !== PropertyType.Land && (
            <div className="flex items-center gap-2 animate-in fade-in duration-500">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-r pr-3 border-gray-200">الحالة</span>
               <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStatusSelect(Status.Ready)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black transition-all border ${
                      filter.status === Status.Ready 
                      ? 'bg-green-600 text-white border-green-700 shadow-md' 
                      : 'bg-white text-green-600 border-green-100 hover:bg-green-50'
                    }`}
                  >
                    <CheckCircle size={12} />
                    جاهز
                  </button>
                  <button
                    onClick={() => handleStatusSelect(Status.UnderConstruction)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black transition-all border ${
                      filter.status === Status.UnderConstruction 
                      ? 'bg-red-600 text-white border-red-700 shadow-md' 
                      : 'bg-white text-red-600 border-red-100 hover:bg-red-50'
                    }`}
                  >
                    <Zap size={12} />
                    تحت الإنشاء
                  </button>
                  {filter.status !== 'All' && (
                    <button onClick={() => handleStatusSelect('All')} className="text-gray-300 hover:text-red-500 transition-colors">
                      <XCircle size={16} />
                    </button>
                  )}
               </div>
            </div>
          )}

          {/* Rooms Selector - Hidden for Land only */}
          {filter.type !== PropertyType.Land && (
            <div className="flex items-center gap-3 animate-in fade-in duration-500">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-r pr-3 border-gray-200">الغرف</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleRoomSelect(num)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black transition-all border ${
                      filter.rooms === num 
                      ? 'bg-primary-600 text-white border-primary-700 shadow-md scale-110' 
                      : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    {num === 5 ? '+5' : num}
                  </button>
                ))}
                <button
                  onClick={() => handleRoomSelect('All')}
                  className={`px-3 h-8 rounded-full text-[9px] font-black transition-all border ${
                    filter.rooms === 'All'
                    ? 'bg-gray-200 text-gray-700 border-gray-300'
                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                  }`}
                >
                  الكل
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Summary */}
        {(filter.unitType !== 'All' || filter.rooms !== 'All' || filter.landUse !== 'All' || filter.status !== 'All' || filter.sortOrder !== 'none' || filter.search) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[9px] font-bold text-gray-300 uppercase">النشط:</span>
            {filter.unitType !== 'All' && (
              <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded-md text-[8px] font-black border border-primary-100 flex items-center gap-1">
                {filter.unitType}
                <button onClick={() => setFilter(prev => ({ ...prev, unitType: 'All' }))}><XCircle size={10} /></button>
              </span>
            )}
            {filter.status !== 'All' && (
              <span className={`px-2 py-0.5 rounded-md text-[8px] font-black border flex items-center gap-1 ${
                filter.status === Status.Ready ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
              }`}>
                {filter.status}
                <button onClick={() => setFilter(prev => ({ ...prev, status: 'All' }))}><XCircle size={10} /></button>
              </span>
            )}
            {filter.rooms !== 'All' && (
              <span className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md text-[8px] font-black border border-slate-100 flex items-center gap-1">
                {filter.rooms === 5 ? '+5 غرف' : `${filter.rooms} غرف`}
                <button onClick={() => setFilter(prev => ({ ...prev, rooms: 'All' }))}><XCircle size={10} /></button>
              </span>
            )}
            {filter.landUse !== 'All' && (
              <span className="px-2 py-0.5 bg-secondary-50 text-secondary-600 rounded-md text-[8px] font-black border border-secondary-100 flex items-center gap-1">
                استخدام: {filter.landUse}
                <button onClick={() => setFilter(prev => ({ ...prev, landUse: 'All' }))}><XCircle size={10} /></button>
              </span>
            )}
            <button 
              onClick={resetAllFilters}
              className="text-[8px] font-black text-red-400 hover:text-red-600 transition-colors"
            >
              إعادة تعيين
            </button>
          </div>
        )}

        {filteredAndSortedProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm px-4">
            <Search size={32} className="text-gray-100 mx-auto mb-4" />
            <h3 className="text-lg font-black text-gray-900 mb-1">لا توجد نتائج</h3>
            <p className="text-gray-400 text-[10px] font-bold">جرب تغيير معايير البحث أو اختيار حالة عقار مختلفة</p>
          </div>
        ) : (
          <div className={`grid ${viewMode === 'list' ? 'grid-cols-1 gap-3' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'}`}>
            {filteredAndSortedProperties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onClick={onSelectProperty} 
                isListView={viewMode === 'list'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
