
import React, { useState } from 'react';
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
}

type QuickActionTool = 'detail' | UnitAvailability;

export const MarketingPortal: React.FC<MarketingPortalProps> = ({ projects, onUpdateProject, onBack }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedUnitKey, setSelectedUnitKey] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTool, setActiveTool] = useState<QuickActionTool>('detail');
  const [bookingType, setBookingType] = useState<UnitAvailability>(UnitAvailability.Available);
  
  const [bookingData, setBookingData] = useState<Partial<BookingDetails>>({
    marketerName: '',
    marketerPhone: '',
    customerName: '',
    customerPhone: '',
    brokerageFee: 0,
    marketerPercentage: 0,
    isExternalMarketer: false
  });

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const selectedUnitModelId = selectedUnitKey && selectedProject ? selectedProject.unitMapping[selectedUnitKey] : null;
  const selectedModel = selectedProject?.models.find(m => m.id === selectedUnitModelId);

  const handleUnitClick = (key: string) => {
    if (!selectedProject) return;

    if (activeTool === 'detail') {
      const currentStatus = selectedProject.unitStatus[key] || UnitAvailability.Available;
      setSelectedUnitKey(key);
      setBookingType(currentStatus);
      
      const existing = selectedProject.unitBookings[key];
      if (existing) {
        setBookingData(existing);
      } else {
        setBookingData({ 
          marketerName: '', 
          marketerPhone: '', 
          customerName: '', 
          customerPhone: '',
          brokerageFee: 0,
          marketerPercentage: 0,
          isExternalMarketer: false
        });
      }
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
      const existing = selectedProject.unitBookings[key];
      updatedProject.unitBookings[key] = existing || {
        unitKey: key,
        unitNumber: key.includes('floor') ? key.split('-').slice(1).join('') : key,
        marketerName: 'تحديث سريع',
        marketerPhone: '-',
        customerName: 'تحديث سريع',
        customerPhone: '-',
        type: targetStatus,
        timestamp: new Date().toISOString(),
        brokerageFee: 0,
        marketerPercentage: 0,
        isExternalMarketer: false
      };
    }

    onUpdateProject(updatedProject);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(price);
  };

  const getStatusColor = (status: UnitAvailability | undefined) => {
    switch(status) {
      case UnitAvailability.Available: 
        return 'bg-green-600 border-transparent text-white shadow-sm hover:bg-green-700';
      case UnitAvailability.Reserved: 
        return 'bg-sky-400 border-transparent text-white shadow-lg scale-105 hover:bg-sky-500';
      case UnitAvailability.Sold: 
        return 'bg-red-600 border-transparent text-white shadow-lg scale-105 hover:bg-red-700';
      default: 
        return 'bg-gray-100 border-gray-200 text-gray-400';
    }
  };

  return (
    <div className="p-4 md:p-8 md:pr-[288px] bg-gray-50 min-h-screen pb-24 text-right" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => selectedProjectId ? setSelectedProjectId(null) : onBack()} 
              className="p-2.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowRight size={22} className="text-gray-600" />
            </button>
            <div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <Users className="text-orange-600" size={28} />
                {selectedProject ? selectedProject.name : 'بوابة مدير التسويق'}
              </h2>
              <p className="text-gray-400 text-[10px] font-bold mt-0.5 uppercase tracking-wider">
                {selectedProject ? `المطور: ${selectedProject.developer}` : 'إدارة حجوزات ومبيعات المشاريع السكنية'}
              </p>
            </div>
          </div>

          {selectedProjectId && (
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 px-2 uppercase border-l border-gray-100 ml-1">الأدوات:</span>
              <button onClick={() => setActiveTool('detail')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${activeTool === 'detail' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><UserCheck size={14} /> التفصيلي</button>
              <button onClick={() => setActiveTool(UnitAvailability.Available)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${activeTool === UnitAvailability.Available ? 'bg-green-600 text-white shadow-md' : 'text-green-600 hover:bg-green-50'}`}><CheckCircle size={14} /> إتاحة</button>
              <button onClick={() => setActiveTool(UnitAvailability.Reserved)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${activeTool === UnitAvailability.Reserved ? 'bg-sky-500 text-white shadow-md' : 'text-sky-600 hover:bg-sky-50'}`}><Zap size={14} /> حجز</button>
              <button onClick={() => setActiveTool(UnitAvailability.Sold)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${activeTool === UnitAvailability.Sold ? 'bg-red-600 text-white shadow-md' : 'text-red-600 hover:bg-red-50'}`}><Zap size={14} /> بيع</button>
            </div>
          )}
        </div>

        {!selectedProjectId ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(proj => {
              const totalUnits = Object.keys(proj.unitMapping).length;
              const soldCount = Object.values(proj.unitStatus).filter((s, i) => {
                const key = Object.keys(proj.unitStatus)[i];
                return proj.unitMapping[key] && s === UnitAvailability.Sold;
              }).length;
              const reservedCount = Object.values(proj.unitStatus).filter((s, i) => {
                const key = Object.keys(proj.unitStatus)[i];
                return proj.unitMapping[key] && s === UnitAvailability.Reserved;
              }).length;
              const availableCount = totalUnits - soldCount - reservedCount;

              return (
                <div key={proj.id} onClick={() => setSelectedProjectId(proj.id)} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all">
                       <Building2 size={28} />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-1">{proj.name}</h3>
                  <div className="flex items-center text-xs text-gray-400 font-bold mb-6">
                    <MapPin size={14} className="ml-1.5 text-red-400" />
                    {proj.city} • {proj.district}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-green-50 p-3 rounded-2xl text-center"><span className="text-[10px] font-black text-green-700 block mb-1">متاح</span><span className="text-sm font-black text-green-800">{availableCount}</span></div>
                    <div className="bg-sky-50 p-3 rounded-2xl text-center"><span className="text-[10px] font-black text-sky-700 block mb-1">محجوز</span><span className="text-sm font-black text-sky-800">{reservedCount}</span></div>
                    <div className="bg-red-50 p-3 rounded-2xl text-center"><span className="text-[10px] font-black text-red-700 block mb-1">مباع</span><span className="text-sm font-black text-red-800">{soldCount}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <div className="lg:col-span-8">
                <div className="bg-gray-100 p-8 rounded-[3.5rem] border border-gray-200 shadow-inner flex flex-col items-center min-h-[600px] justify-center relative overflow-hidden">
                   <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-b-[16px] border-gray-400 relative w-full max-w-2xl">
                      
                      {/* Legend Bar */}
                      <div className="flex justify-center gap-6 mb-8 border-b border-gray-50 pb-6">
                         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-600"></div><span className="text-[10px] font-black text-gray-400 uppercase">متاح</span></div>
                         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-sky-400"></div><span className="text-[10px] font-black text-gray-400 uppercase">محجوز</span></div>
                         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-600"></div><span className="text-[10px] font-black text-gray-400 uppercase">مباع</span></div>
                      </div>

                      {/* --- ANNEXES (RESTORED) --- */}
                      {selectedProject.annexCount! > 0 && (
                        <div className="flex justify-center gap-3 mb-8 animate-in slide-in-from-top-2">
                          {Array.from({ length: selectedProject.annexCount! }).map((_, i) => {
                            const key = `annex-${i+1}`;
                            if (!selectedProject.unitMapping[key]) return null;
                            const status = selectedProject.unitStatus[key] || UnitAvailability.Available;
                            return (
                              <div key={key} onClick={() => handleUnitClick(key)} className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 ${getStatusColor(status)} shadow-sm hover:scale-105 active:scale-95`}>
                                 <Home size={16} />
                                 <span className="text-[9px] font-black mt-0.5">M{i+1}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="space-y-4">
                        {Array.from({ length: selectedProject.floorsCount! }).map((_, fIdx) => {
                          const floorNum = selectedProject.floorsCount! - fIdx;
                          const hasMappedUnits = Array.from({ length: selectedProject.unitsPerFloor! }).some((_, uIdx) => selectedProject.unitMapping[`floor-${floorNum}-${uIdx+1}`]);
                          if (!hasMappedUnits) return null;
                          return (
                            <div key={floorNum} className="flex items-center gap-4">
                               <div className="w-6 text-left"><span className="text-[10px] font-black text-gray-300">F{floorNum}</span></div>
                               <div className="flex-1 flex justify-center gap-3">
                                  {Array.from({ length: selectedProject.unitsPerFloor! }).map((_, uIdx) => {
                                    const key = `floor-${floorNum}-${uIdx+1}`;
                                    const modelId = selectedProject.unitMapping[key];
                                    if (!modelId) return <div key={key} className="flex-1 h-12 opacity-0"></div>;
                                    const status = selectedProject.unitStatus[key] || UnitAvailability.Available;
                                    return (
                                      <div key={key} onClick={() => handleUnitClick(key)} className={`flex-1 h-12 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 ${getStatusColor(status)} shadow-sm hover:scale-105 active:scale-95`}>
                                         <span className="text-xs font-black">{floorNum}0{uIdx+1}</span>
                                      </div>
                                    );
                                  })}
                               </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-10 text-center"><span className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-8 py-2 rounded-full border border-gray-100">طابق المدخل والخدمات</span></div>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-4">
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-8">
                   <div className="flex items-center gap-3 mb-6"><LayoutList size={22} className="text-orange-500" /><h3 className="text-lg font-black text-gray-800">آخر الحجوزات والمبيعات</h3></div>
                   <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                      {Object.values(selectedProject.unitBookings).length === 0 ? (
                        <p className="text-center py-12 text-sm text-gray-400 font-bold">لا توجد بيانات مسجلة حالياً</p>
                      ) : (
                        (Object.values(selectedProject.unitBookings) as BookingDetails[]).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(booking => (
                          <div key={booking.unitKey} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                             <div className="flex justify-between items-center">
                                <span className="text-xs font-black text-gray-900 uppercase">وحدة {booking.unitNumber}</span>
                                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${booking.type === UnitAvailability.Reserved ? 'bg-sky-100 text-sky-600' : 'bg-red-100 text-red-600'}`}>
                                   {booking.type === UnitAvailability.Reserved ? 'محجوزة' : 'مباعة'}
                                </span>
                             </div>
                             <div className="flex justify-between gap-2 text-[11px] font-bold text-gray-600">
                                <div className="truncate">المسوق: {booking.marketerName}</div>
                                <div className="truncate">العميل: {booking.customerName}</div>
                             </div>
                             <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                <span className="text-[9px] text-gray-400">{new Date(booking.timestamp).toLocaleDateString('ar-SA')}</span>
                                <div className="flex gap-1.5"><a href={`tel:${booking.customerPhone}`} className="p-1.5 bg-white text-primary-600 rounded-lg shadow-sm"><Phone size={12} /></a></div>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- Booking Form Modal --- */}
        {showBookingForm && selectedUnitKey && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-right h-fit max-h-[95vh] flex flex-col" dir="rtl">
                
                {/* Modal Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                   <div>
                      <h3 className="text-xl font-black text-gray-900">حجز وحدة {selectedUnitKey.includes('floor') ? selectedUnitKey.split('-').slice(1).join('') : (selectedUnitKey.includes('annex') ? 'ملحق ' + selectedUnitKey.split('-')[1] : selectedUnitKey)}</h3>
                      <p className="text-[11px] font-bold text-sky-600 mt-0.5">إدخال بيانات الحجز المالية والتفصيلية</p>
                   </div>
                   <button onClick={() => setShowBookingForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><XCircle size={28} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                   {/* Unit Mini Specs */}
                   {selectedModel && (
                     <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl grid grid-cols-3 gap-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1.5 h-full bg-sky-500"></div>
                        <div className="text-center">
                           <div className="flex items-center justify-center gap-1.5 mb-0.5 text-gray-400 uppercase text-[9px] font-black"><Ruler size={14} /> المساحة</div>
                           <p className="text-sm font-black text-gray-800">{selectedModel.area} م²</p>
                        </div>
                        <div className="text-center border-x border-gray-200 px-2">
                           <div className="flex items-center justify-center gap-1.5 mb-0.5 text-gray-400 uppercase text-[9px] font-black"><Bed size={14} /> الغرف</div>
                           <p className="text-sm font-black text-gray-800">{selectedModel.rooms} غرف</p>
                        </div>
                        <div className="text-center">
                           <div className="flex items-center justify-center gap-1.5 mb-0.5 text-gray-400 uppercase text-[9px] font-black"><DollarSign size={14} /> السعر</div>
                           <p className="text-sm font-black text-sky-600">{formatPrice(selectedModel.price)}</p>
                        </div>
                     </div>
                   )}

                   {/* Status Selector */}
                   <div className="grid grid-cols-3 gap-3">
                      <button onClick={() => setBookingType(UnitAvailability.Available)} type="button" className={`py-4 rounded-2xl border-2 transition-all font-black text-xs flex flex-col items-center gap-2 ${bookingType === UnitAvailability.Available ? 'border-green-500 bg-green-50 text-green-700 shadow-md' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
                         <CheckCircle size={20} /> متاحة
                      </button>
                      <button onClick={() => setBookingType(UnitAvailability.Reserved)} type="button" className={`py-4 rounded-2xl border-2 transition-all font-black text-xs flex flex-col items-center gap-2 ${bookingType === UnitAvailability.Reserved ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-md' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
                         <Users size={20} /> حجز
                      </button>
                      <button onClick={() => setBookingType(UnitAvailability.Sold)} type="button" className={`py-4 rounded-2xl border-2 transition-all font-black text-xs flex flex-col items-center gap-2 ${bookingType === UnitAvailability.Sold ? 'border-red-500 bg-red-50 text-red-700 shadow-md' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
                         <DollarSign size={20} /> بيع
                      </button>
                   </div>

                   {bookingType !== UnitAvailability.Available && (
                     <div className="space-y-6">
                        {/* Marketer & Financial */}
                        <div className="bg-white border border-gray-100 p-5 rounded-2xl space-y-4 shadow-sm">
                           <div className="flex justify-between items-center mb-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5"><UserCheck size={14} /> بيانات المسوق</label>
                              <div className="flex bg-gray-100 p-1 rounded-lg">
                                 <button onClick={() => setBookingData({...bookingData, isExternalMarketer: false})} type="button" className={`px-3 py-1 rounded-md text-[9px] font-black transition-all ${!bookingData.isExternalMarketer ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400'}`}>تابع للشركة</button>
                                 <button onClick={() => setBookingData({...bookingData, isExternalMarketer: true})} type="button" className={`px-3 py-1 rounded-md text-[9px] font-black transition-all ${bookingData.isExternalMarketer ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}>خارجي</button>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <input required type="text" placeholder="اسم المسوق" className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:ring-1 focus:ring-sky-500 text-right" value={bookingData.marketerName} onChange={e => setBookingData({...bookingData, marketerName: e.target.value})} />
                              <input required type="text" inputMode="numeric" placeholder="رقم الجوال" className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:ring-1 focus:ring-sky-500 text-right" value={bookingData.marketerPhone} onChange={e => setBookingData({...bookingData, marketerPhone: toEnglishDigits(e.target.value)})} />
                           </div>
                           <div className="grid grid-cols-2 gap-4 pt-2">
                              <div className="relative">
                                 <input type="text" inputMode="numeric" placeholder="قيمة السعي (ريال)" className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:ring-1 focus:ring-sky-500 text-right" value={bookingData.brokerageFee || ''} onChange={e => setBookingData({...bookingData, brokerageFee: parseArabicNumber(e.target.value)})} />
                                 <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                              </div>
                              <div className="relative">
                                 <input type="text" inputMode="numeric" placeholder="نسبة المسوق (%)" className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:ring-1 focus:ring-sky-500 text-right" value={bookingData.marketerPercentage || ''} onChange={e => setBookingData({...bookingData, marketerPercentage: parseArabicNumber(e.target.value)})} />
                                 <Percent size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                              </div>
                           </div>
                        </div>

                        {/* Customer */}
                        <div className="bg-white border border-gray-100 p-5 rounded-2xl space-y-4 shadow-sm">
                           <label className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5"><Users size={14} /> بيانات العميل</label>
                           <div className="grid grid-cols-2 gap-4">
                              <input required type="text" placeholder="اسم العميل" className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:ring-1 focus:ring-sky-500 text-right" value={bookingData.customerName} onChange={e => setBookingData({...bookingData, customerName: e.target.value})} />
                              <input required type="text" inputMode="numeric" placeholder="رقم الجوال" className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:ring-1 focus:ring-sky-500 text-right" value={bookingData.customerPhone} onChange={e => setBookingData({...bookingData, customerPhone: toEnglishDigits(e.target.value)})} />
                           </div>
                        </div>
                     </div>
                   )}
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex gap-3 shrink-0">
                   <button onClick={() => {
                     if (!selectedProject || !selectedUnitKey) return;
                     const updatedProject = { ...selectedProject };
                     if (bookingType === UnitAvailability.Available) {
                       updatedProject.unitStatus[selectedUnitKey] = UnitAvailability.Available;
                       delete updatedProject.unitBookings[selectedUnitKey];
                     } else {
                       updatedProject.unitStatus[selectedUnitKey] = bookingType;
                       updatedProject.unitBookings[selectedUnitKey] = {
                         unitKey: selectedUnitKey,
                         unitNumber: selectedUnitKey.includes('floor') ? selectedUnitKey.split('-').slice(1).join('') : (selectedUnitKey.includes('annex') ? 'M' + selectedUnitKey.split('-')[1] : selectedUnitKey),
                         marketerName: bookingData.marketerName || '',
                         marketerPhone: bookingData.marketerPhone || '',
                         customerName: bookingData.customerName || '',
                         customerPhone: bookingData.customerPhone || '',
                         brokerageFee: Number(bookingData.brokerageFee) || 0,
                         marketerPercentage: Number(bookingData.marketerPercentage) || 0,
                         isExternalMarketer: bookingData.isExternalMarketer || false,
                         type: bookingType,
                         timestamp: new Date().toISOString()
                       };
                     }
                     onUpdateProject(updatedProject);
                     setShowBookingForm(false);
                   }} className="flex-1 bg-sky-600 text-white py-3.5 rounded-2xl font-black text-base shadow-xl shadow-sky-100 hover:bg-sky-700 active:scale-95 transition-all">اعتماد وحفظ البيانات</button>
                   <button onClick={() => setShowBookingForm(false)} className="px-8 py-3.5 rounded-2xl border border-gray-200 font-black text-sm text-gray-400 hover:bg-white transition-all">إلغاء</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
