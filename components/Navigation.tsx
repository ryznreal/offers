
import React from 'react';
import { 
  Home, 
  Plus, 
  Building2, 
  XCircle as LogOutIcon,
  ShieldCheck,
  Share2
} from './Icon';
import { PropertyType, FilterState, User, UserRole } from '../types';

interface NavigationProps {
  currentView: string;
  setView: (view: string) => void;
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  user: User;
  onLogout?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  setView, 
  filter, 
  setFilter,
  isMobileOpen = false,
  onCloseMobile,
  user,
  onLogout
}) => {
  const handleLinkClick = (view: string) => {
    setView(view);
    if (onCloseMobile) onCloseMobile();
  };

  const isViewer = user.role === UserRole.Viewer;

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-[55] md:hidden backdrop-blur-sm" onClick={onCloseMobile} />
      )}

      <aside className={`fixed inset-y-0 right-0 w-72 bg-white shadow-xl border-l border-gray-100 z-[60] transition-transform duration-300 md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col no-print`}>
        <div className="p-6 border-b border-gray-100 shrink-0 text-right">
          <h1 className="text-2xl font-black text-primary-700 flex items-center gap-2 mb-4 justify-end">
            الوسيط العقاري
            <Building2 className="text-primary-500" />
          </h1>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl flex-row-reverse">
             <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-black">
                {user.name.charAt(0)}
             </div>
             <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-gray-900 truncate">{user.name}</p>
                <p className="text-[10px] text-primary-600 font-bold">{user.role}</p>
             </div>
             <button 
               onClick={onLogout} 
               title="تسجيل الخروج"
               className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
             >
               <LogOutIcon size={18} />
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-10 custom-scrollbar text-right">
          <section>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-2">القائمة</label>
            <div className="space-y-1">
              <button onClick={() => handleLinkClick('list')} className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl transition-all flex-row-reverse ${currentView === 'list' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-600'}`}>
                <Home size={18} />
                <span>العروض العامة</span>
              </button>

              {!isViewer && (
                <>
                  <button onClick={() => handleLinkClick('marketing')} className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl transition-all flex-row-reverse ${currentView === 'marketing' ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-600'}`}>
                    <Share2 size={18} />
                    <span>بوابة التسويق</span>
                  </button>

                  <button onClick={() => handleLinkClick('projects')} className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl transition-all flex-row-reverse ${currentView === 'projects' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-600'}`}>
                    <Building2 size={18} />
                    <span>إدارة المشاريع</span>
                  </button>
                </>
              )}
              
              {user.permissions.canManageUsers && (
                <button onClick={() => handleLinkClick('admin')} className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl transition-all flex-row-reverse ${currentView === 'admin' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-gray-600'}`}>
                  <ShieldCheck size={18} />
                  <span>إدارة النظام</span>
                </button>
              )}
            </div>
          </section>
        </div>

        {user.permissions.canAdd && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button onClick={() => handleLinkClick('select-type')} className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl shadow-lg bg-primary-600 text-white font-bold transition-all hover:scale-[1.02]">
              <Plus size={20} />
              <span>إضافة عرض جديد</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
