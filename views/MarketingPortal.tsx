
import React, { useState, useEffect } from 'react';
import { Project, UnitAvailability, BookingDetails, UserRole, Finishing, ProjectModel } from '../types';
import { 
  Building2, 
  ArrowRight, 
  MapPin, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Users, 
  UserCheck, 
  Phone, 
  Calendar,
  Layers,
  Home,
  DollarSign,
  Search,
  LayoutList,
  ChevronDown,
  Ruler,
  Bed,
  Bath,
  Zap,
  MoreVertical,
  Globe,
  ShieldCheck,
  Percent
} from '../components/Icon';
import { toEnglishDigits, parseArabicNumber } from '../utils/helpers';

interface MarketingPortalProps {
  projects: Project[];
  onUpdateProject: (project: Project) => void;
  onBack: () => void;
  externalProjectId: string | null;
  onSetExternalProjectId: (id: string | null) => void;
}

type QuickActionTool = 'detail' | UnitAvailability;

export const MarketingPortal: React.FC<MarketingPortalProps> = ({ 
  projects, 
  onUpdateProject, 
  onBack,
  externalProjectId,
  onSetExternalProjectId
}) => {
  const [selectedUnitKey, setSelectedUnitKey] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTool, setActiveTool] = useState<QuickActionTool>('detail');
  const [bookingType, setBookingType] = useState<UnitAvailability>(UnitAvailability.Available);
  
  const [bookingData, setBookingData] = useState<Partial<BookingDetails>>({
    marketerName: '', marketerPhone: '', customerName: '', customerPhone: '', brokerageFee: 0, marketerPercentage: 0, isExternalMarketer: false
  });

  const selectedProject = projects.find(p => p.id === externalProjectId);
  const selectedUnitModelId = selectedUnitKey && selectedProject ? selectedProject.unitMapping[selectedUnitKey] : null;
  const selectedModel = selectedProject?.models.find(m => m.id === selectedUnitModelId);

  const handleUnitClick = (key: string) => {
    if (!selectedProject) return;
    if (activeTool === 'detail') {
      const currentStatus = selectedProject.unitStatus[key] || UnitAvailability.Available;
      setSelectedUnitKey(key);
      setBookingType(currentStatus);
      const existing = selectedProject.unitBookings[key];
      if (existing) setBookingData(existing); else setBookingData({ marketerName: '', marketerPhone: '', customerName: '', customerPhone: '', brokerageFee: 0, marketerPercentage: 0, isExternalMarketer: false });
      setShowBookingForm(true);
      return;
    }
    const updatedProject = { ...selectedProject };
    const targetStatus = activeTool as UnitAvailability;
    if (targetStatus === UnitAvailability.Available) {
      updatedProject.unitStatus[key] = UnitAvailability.Available;
      delete updatedProject.unitBookings[key];
    } else {
      updatedProject.unitStatus[key] = targetStatus;
    }
    onUpdateProject(updatedProject);
  };

  const getStatusColor = (status: UnitAvailability | undefined) => {
    switch(status) {
      case UnitAvailability.Available: return 'bg-green-600 text-white';
      case UnitAvailability.Reserved: return 'bg-sky-400 text-white';
      case UnitAvailability.Sold: return 'bg-red-600 text-white';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  return (
    <div className="p-4 md:p-8 md:pr-[288px] bg-gray-50 min-h-screen pb-24 text-right" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => externalProjectId ? onSetExternalProjectId(null) : onBack()} className="p-2.5 bg-white rounded-full shadow-sm"><ArrowRight size={22} /></button>
            <h2 className="text-2xl font-black">{selectedProject ? selectedProject.name : 'بوابة التسويق'}</h2>
          </div>
        </div>

        {!externalProjectId ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map(proj => (
              <div key={proj.id} onClick={() => onSetExternalProjectId(proj.id)} className="bg-white p-6 rounded-[2.5rem] border shadow-sm cursor-pointer">
                <h3 className="text-xl font-black">{proj.name}</h3>
                <p className="text-gray-400 text-xs mt-1">{proj.developer}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border min-h-[500px] flex flex-col items-center">
            <div className="flex gap-4 mb-10">
              <button onClick={() => setActiveTool('detail')} className={`px-4 py-2 rounded-xl font-bold text-xs ${activeTool === 'detail' ? 'bg-primary-600 text-white' : 'bg-gray-50 text-gray-400'}`}>عرض التفاصيل</button>
              <button onClick={() => setActiveTool(UnitAvailability.Reserved)} className={`px-4 py-2 rounded-xl font-bold text-xs ${activeTool === UnitAvailability.Reserved ? 'bg-sky-500 text-white' : 'bg-sky-50 text-sky-600'}`}>حجز سريع</button>
            </div>
            <div className="space-y-4 w-full max-w-2xl">
              {Array.from({ length: selectedProject.floorsCount! }).map((_, fIdx) => {
                const floorNum = selectedProject.floorsCount! - fIdx;
                return (
                  <div key={floorNum} className="flex gap-3">
                    {Array.from({ length: selectedProject.unitsPerFloor! }).map((_, uIdx) => {
                      const key = `floor-${floorNum}-${uIdx+1}`;
                      if (!selectedProject.unitMapping[key]) return null;
                      const status = selectedProject.unitStatus[key] || UnitAvailability.Available;
                      return (
                        <div key={key} onClick={() => handleUnitClick(key)} className={`flex-1 h-14 rounded-xl flex items-center justify-center cursor-pointer font-black text-xs ${getStatusColor(status)} shadow-sm`}>
                          {floorNum}0{uIdx+1}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showBookingForm && selectedUnitKey && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl">
                <h3 className="text-xl font-black mb-6">تحديث حالة الوحدة {selectedUnitKey}</h3>
                <div className="grid grid-cols-3 gap-4 mb-8">
                   <button onClick={() => setBookingType(UnitAvailability.Available)} className={`py-4 rounded-xl border-2 font-black ${bookingType === UnitAvailability.Available ? 'border-green-500 bg-green-50' : 'border-gray-50'}`}>متاحة</button>
                   <button onClick={() => setBookingType(UnitAvailability.Reserved)} className={`py-4 rounded-xl border-2 font-black ${bookingType === UnitAvailability.Reserved ? 'border-sky-500 bg-sky-50' : 'border-gray-50'}`}>محجوزة</button>
                   <button onClick={() => setBookingType(UnitAvailability.Sold)} className={`py-4 rounded-xl border-2 font-black ${bookingType === UnitAvailability.Sold ? 'border-red-500 bg-red-50' : 'border-gray-50'}`}>مباعة</button>
                </div>
                <button onClick={() => {
                  if (!selectedProject) return;
                  const updated = { ...selectedProject };
                  updated.unitStatus[selectedUnitKey] = bookingType;
                  onUpdateProject(updated);
                  setShowBookingForm(false);
                }} className="w-full bg-primary-600 text-white py-4 rounded-xl font-black">حفظ وإغلاق</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
