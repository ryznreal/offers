
import React from 'react';
import { 
  Home, 
  Plus, 
  Building2, 
  Map, 
  XCircle, 
  LayoutList, 
  Layers,
  ShieldCheck,
  Share2,
  Ruler,
  CheckCircle as Check
} from './Icon';
import { PropertyType, Status, UnitType, FilterState, User, LandUse } from '../types';

interface NavigationProps {
  currentView: string;
  setView: (view: string) => void;
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  user: User;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  setView, 
  filter, 
  setFilter,
  isMobileOpen = false,
  onCloseMobile,
  user
}) => {
  const isResidentialView = filter.type === PropertyType.Residential || filter.type === 'All';
  const isLandView = filter.type === PropertyType.Land;

  const resetFilters = () => {
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

  const handleLinkClick = (view: string) => {
    setView(view);
    if (onCloseMobile) onCloseMobile();
  };

  const unitTypeOptions = [
    { label: 'شقة', value: UnitType.Apartment, icon: Building2 },
    { label: 'ملحق', value: UnitType.Annex, icon: Layers },
    { label: 'فيلا', value: UnitType.Villa, icon: Home },
    { label: 'دور', value: UnitType.Floor, icon: LayoutList },
    { label: 'دبلكس', value: UnitType.Duplex, icon: Building2 }
  ];

  const landUseOptions = [
    { label: 'سكني', value: LandUse.Residential },
    { label: 'تجاري', value: LandUse.Commercial },
    { label: 'استثماري', value: LandUse.Investment },
    { label: 'مختلط', value: LandUse.Mixed }
  ];

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[55] md:hidden backdrop-blur-sm transition-opacity no-print"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`fixed inset-y-0 right-0 w-72 bg-white shadow-xl border-l border-gray-100 z-[60] transition-transform duration-300 md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col no-print`}>
        <div className="p-6 border-b border-gray-100 shrink-0">
          <h1 className="text-2xl font-black text-primary-700 flex items-center gap-2 mb-4">
            <Building2 className="text-primary-500" />
            الوسيط العقاري
          </h1>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
             <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-black">
                {user.name.charAt(0)}
             </div>
             <div>
                <p className="text-xs font-black text-gray-900">{user.name}</p>
                <p className="text-[10px] text-primary-600 font-bold">{user.role}</p>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-10 custom-scrollbar">
          {/* Main Navigation */}
          <section>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-2">القائمة الرئيسية</label>
            <div className="space-y-1">
              <button
                onClick={() => handleLinkClick('list')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  currentView === 'list' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Home size={18} />
                <span>الرئيسية</span>
              </button>

              <button
                onClick={() => handleLinkClick('marketing')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  currentView === 'marketing' ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Share2 size={18} />
                <span>بوابة مدير التسويق</span>
              </button>

              <button
                onClick={() => handleLinkClick('projects')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  currentView === 'projects' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Building2 size={18} />
                <span>مشاريع المطورين</span>
              </button>
              
              {user.permissions.canManageUsers && (
                <button
                  onClick={() => handleLinkClick('admin')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    currentView === 'admin' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ShieldCheck size={18} />
                  <span>إدارة النظام والبيانات</span>
                </button>
              )}
            </div>
          </section>

          {/* Conditional Filters: Residential */}
          {(isResidentialView && currentView === 'list') && (
            <>
              <section className="animate-in slide-in-from-right-4 duration-300">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-2">تصنيف الوحدات</label>
                <div className="grid grid-cols-3 gap-2 px-1">
                  {unitTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(prev => ({ ...prev, unitType: prev.unitType === option.value ? 'All' : option.value, type: PropertyType.Residential }))}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-bold border transition-all ${
                        filter.unitType === option.value 
                        ? 'bg-primary-600 text-white border-primary-700 shadow-md scale-105'
                        : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <option.icon size={16} className="mb-1" />
                      <span className="text-center truncate w-full">{option.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="animate-in slide-in-from-right-4 duration-300 delay-75">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-2">حالة المشروع</label>
                <div className="grid grid-cols-2 gap-2">
                  {[Status.Ready, Status.UnderConstruction].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilter(prev => ({ ...prev, status: prev.status === s ? 'All' : s }))}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-bold border transition-all ${
                        filter.status === s 
                        ? (s === Status.Ready ? 'bg-green-600 text-white border-green-700' : 'bg-red-600 text-white border-red-700')
                        : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* Conditional Filters: Land */}
          {(isLandView && currentView === 'list') && (
            <>
              <section className="animate-in slide-in-from-left-4 duration-300">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-2">غرض الاستخدام</label>
                <div className="grid grid-cols-2 gap-2">
                  {landUseOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(prev => ({ ...prev, landUse: prev.landUse === option.value ? 'All' : option.value }))}
                      className={`flex items-center justify-center p-3 rounded-xl text-[10px] font-black border transition-all ${
                        filter.landUse === option.value 
                        ? 'bg-secondary-600 text-white border-secondary-700 shadow-md'
                        : 'bg-white text-secondary-600 border-secondary-100 hover:bg-secondary-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="animate-in slide-in-from-left-4 duration-300 delay-75">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-2">خيارات إضافية</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setFilter(prev => ({ ...prev, isCorner: prev.isCorner === true ? 'All' : true }))}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-[11px] font-bold border transition-all ${
                      filter.isCorner === true ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-100 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Map size={14} />
                      <span>أرض زاوية</span>
                    </div>
                    {filter.isCorner === true && <Check size={14} />}
                  </button>

                  <button
                    onClick={() => setFilter(prev => ({ ...prev, investmentAllowed: prev.investmentAllowed === true ? 'All' : true }))}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-[11px] font-bold border transition-all ${
                      filter.investmentAllowed === true ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-100 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Ruler size={14} />
                      <span>قابلة للاستثمار</span>
                    </div>
                    {filter.investmentAllowed === true && <Check size={14} />}
                  </button>
                </div>
              </section>
            </>
          )}

          {currentView === 'list' && (
            <button 
              onClick={resetFilters}
              className="w-full py-3 text-[11px] font-black text-gray-400 hover:text-red-500 transition-colors flex items-center justify-center gap-2 border border-dashed border-gray-200 rounded-xl"
            >
              <XCircle size={14} />
              إعادة تعيين كافة الفلاتر
            </button>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button
            disabled={!user.permissions.canAdd}
            onClick={() => handleLinkClick('select-type')}
            className={`w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 ${
              user.permissions.canAdd ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Plus size={20} />
            <span className="font-bold">إضافة عرض جديد</span>
          </button>
        </div>
      </aside>
    </>
  );
};
