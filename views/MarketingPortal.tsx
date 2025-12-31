
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
  Zap
} from '../components/Icon';

interface MarketingPortalProps {
  projects: Project[];
  onUpdateProject: (project: Project) => void;
  onBack: () => void;
}

export const MarketingPortal: React.FC<MarketingPortalProps> = ({ projects, onUpdateProject, onBack }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedUnitKey, setSelectedUnitKey] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingType, setBookingType] = useState<UnitAvailability>(UnitAvailability.Available);
  const [isQuickMode, setIsQuickMode] = useState(true); // الوضع السريع افتراضي
  
  const [bookingData, setBookingData] = useState<Partial<BookingDetails>>({
    marketerName: '',
    marketerPhone: '',
    customerName: '',
    customerPhone: ''
  });

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const selectedUnitModelId = selectedUnitKey && selectedProject ? selectedProject.unitMapping[selectedUnitKey] : null;
  const selectedModel = selectedProject?.models.find(m => m.id === selectedUnitModelId);

  const handleUnitClick = (key: string) => {
    const currentStatus = selectedProject?.unitStatus[key] || UnitAvailability.Available;
    setSelectedUnitKey(key);
    
    // إذا كانت الوحدة محجوزة أو مباعة مسبقاً، نظهر البيانات الحالية ونقترح الوضع التفصيلي
    if (currentStatus !== UnitAvailability.Available) {
       setBookingType(currentStatus);
       const existing = selectedProject?.unitBookings[key];
       if (existing) {
         setBookingData(existing);
         setIsQuickMode(false);
       } else {
         setBookingData({ marketerName: '', marketerPhone: '', customerName: '', customerPhone: '' });
         setIsQuickMode(true);
       }
    } else {
       setBookingType(UnitAvailability.Available);
       setBookingData({ marketerName: '', marketerPhone: '', customerName: '', customerPhone: '' });
       setIsQuickMode(true);
    }
    setShowBookingForm(true);
  };

  const handleSaveBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !selectedUnitKey) return;

    const updatedProject = { ...selectedProject };
    
    if (bookingType === UnitAvailability.Available) {
       updatedProject.unitStatus[selectedUnitKey] = UnitAvailability.Available;
       delete updatedProject.unitBookings[selectedUnitKey];
    } else {
       updatedProject.unitStatus[selectedUnitKey] = bookingType;
       
       // في الوضع السريع نقوم بتصفير البيانات أو الاحتفاظ بالقديمة إذا وجدت
       if (isQuickMode) {
          // إذا كان هناك حجز قديم، نحتفظ به أو ننشئ هيكل فارغ
          const existing = selectedProject.unitBookings[selectedUnitKey];
          updatedProject.unitBookings[selectedUnitKey] = existing || {
            unitKey: selectedUnitKey,
            unitNumber: selectedUnitKey.includes('floor') ? selectedUnitKey.split('-').slice(1).join('') : selectedUnitKey,
            marketerName: 'تحديث سريع',
            marketerPhone: '-',
            customerName: 'تحديث سريع',
            customerPhone: '-',
            type: bookingType,
            timestamp: new Date().toISOString()
          };
       } else {
          updatedProject.unitBookings[selectedUnitKey] = {
            unitKey: selectedUnitKey,
            unitNumber: selectedUnitKey.includes('floor') ? selectedUnitKey.split('-').slice(1).join('') : selectedUnitKey,
            marketerName: bookingData.marketerName || '',
            marketerPhone: bookingData.marketerPhone || '',
            customerName: bookingData.customerName || '',
            customerPhone: bookingData.customerPhone || '',
            type: bookingType,
            timestamp: new Date().toISOString()
          };
       }
    }

    onUpdateProject(updatedProject);
    setShowBookingForm(false);
    setSelectedUnitKey(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(price);
  };

  const getStatusColor = (status: UnitAvailability | undefined) => {
    switch(status) {
      case UnitAvailability.Available: return 'bg-white border-gray-100 text-gray-300 hover:bg-primary-50';
      case UnitAvailability.Reserved: return 'bg-orange-500 border-transparent text-white shadow-lg scale-105';
      case UnitAvailability.Sold: return 'bg-red-500 border-transparent text-white shadow-lg scale-105';
      default: return 'bg-white border-gray-100';
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
              className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowRight size={20} className="text-gray-600" />
            </button>
            <div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Users className="text-orange-600" size={28} />
                {selectedProject ? selectedProject.name : 'بوابة مدير التسويق'}
              </h2>
              <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-wider">
                {selectedProject ? `المطور: ${selectedProject.developer}` : 'إدارة حجوزات ومبيعات المشاريع السكنية'}
              </p>
            </div>
          </div>
        </div>

        {!selectedProjectId ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <div 
                  key={proj.id} 
                  onClick={() => setSelectedProjectId(proj.id)}
                  className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-5 bg-orange-50 text-orange-600 rounded-3xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                       <Building2 size={28} />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-1 group-hover:text-orange-700">{proj.name}</h3>
                  <div className="flex items-center text-xs text-gray-400 font-bold mb-8">
                    <MapPin size={14} className="ml-1.5 text-red-400" />
                    {proj.city} • {proj.district}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-green-50 p-3 rounded-2xl text-center">
                       <span className="text-[10px] font-black text-green-700 block mb-1">متاح</span>
                       <span className="text-sm font-black text-green-800">{availableCount}</span>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-2xl text-center">
                       <span className="text-[10px] font-black text-orange-700 block mb-1">محجوز</span>
                       <span className="text-sm font-black text-orange-800">{reservedCount}</span>
                    </div>
                    <div className="bg-red-50 p-3 rounded-2xl text-center">
                       <span className="text-[10px] font-black text-red-700 block mb-1">مباع</span>
                       <span className="text-sm font-black text-red-800">{soldCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
             <div className="lg:col-span-8">
                <div className="bg-gray-100 p-8 rounded-[4rem] border border-gray-200 shadow-inner flex flex-col items-center min-h-[700px] justify-center relative overflow-hidden">
                   <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-b-[20px] border-gray-400 relative w-full max-w-2xl">
                      
                      {/* Legend Bar */}
                      <div className="flex justify-center gap-6 mb-10 border-b border-gray-50 pb-6">
                         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-white border border-gray-200"></div><span className="text-[10px] font-black text-gray-400 uppercase">متاح</span></div>
                         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div><span className="text-[10px] font-black text-gray-400 uppercase">محجوز</span></div>
                         <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-[10px] font-black text-gray-400 uppercase">مباع</span></div>
                      </div>

                      {/* Annexes */}
                      {selectedProject.annexCount! > 0 && (
                        <div className="flex justify-center gap-4 mb-10">
                          {Array.from({ length: selectedProject.annexCount! }).map((_, i) => {
                            const key = `annex-${i+1}`;
                            if (!selectedProject.unitMapping[key]) return null;
                            const status = selectedProject.unitStatus[key] || UnitAvailability.Available;
                            return (
                              <div key={key} onClick={() => handleUnitClick(key)} className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 ${getStatusColor(status)}`}>
                                 <Home size={18} />
                                 <span className="text-[10px] font-black">M{i+1}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Floors */}
                      <div className="space-y-4">
                        {Array.from({ length: selectedProject.floorsCount! }).map((_, fIdx) => {
                          const floorNum = selectedProject.floorsCount! - fIdx;
                          const hasMappedUnits = Array.from({ length: selectedProject.unitsPerFloor! }).some((_, uIdx) => 
                            selectedProject.unitMapping[`floor-${floorNum}-${uIdx+1}`]
                          );

                          if (!hasMappedUnits) return null;

                          return (
                            <div key={floorNum} className="flex items-center gap-6">
                               <div className="w-8 text-left"><span className="text-[10px] font-black text-gray-300">F{floorNum}</span></div>
                               <div className="flex-1 flex justify-center gap-3">
                                  {Array.from({ length: selectedProject.unitsPerFloor! }).map((_, uIdx) => {
                                    const key = `floor-${floorNum}-${uIdx+1}`;
                                    const modelId = selectedProject.unitMapping[key];
                                    if (!modelId) return <div key={key} className="flex-1 h-14 opacity-0 pointer-events-none"></div>;
                                    
                                    const status = selectedProject.unitStatus[key] || UnitAvailability.Available;
                                    return (
                                      <div key={key} onClick={() => handleUnitClick(key)} className={`flex-1 h-14 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 ${getStatusColor(status)} shadow-sm hover:scale-105 active:scale-95`}>
                                         <span className="text-[10px] font-black">{floorNum}0{uIdx+1}</span>
                                      </div>
                                    );
                                  })}
                               </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-12 text-center">
                         <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-6 py-2 rounded-full border border-gray-100">طابق الخدمات والمواقف</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                   <div className="flex items-center gap-3 mb-6">
                      <LayoutList size={20} className="text-orange-500" />
                      <h3 className="text-base font-black text-gray-800">سجل الحجوزات والمبيعات</h3>
                   </div>
                   <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {Object.values(selectedProject.unitBookings).length === 0 ? (
                        <p className="text-center py-10 text-xs text-gray-400 font-bold">لا يوجد حجوزات نشطة حالياً</p>
                      ) : (
                        (Object.values(selectedProject.unitBookings) as BookingDetails[]).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(booking => {
                          const unitModelId = selectedProject.unitMapping[booking.unitKey];
                          const model = selectedProject.models.find(m => m.id === unitModelId);
                          
                          return (
                            <div key={booking.unitKey} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                               <div className="flex justify-between items-center">
                                  <span className="text-[11px] font-black text-gray-900">وحدة {booking.unitNumber}</span>
                                  <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${booking.type === UnitAvailability.Reserved ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                                     {booking.type === UnitAvailability.Reserved ? 'محجوزة' : 'مباعة'}
                                  </span>
                               </div>

                               {/* Unit Specs in History */}
                               {model && (
                                 <div className="flex items-center gap-4 bg-white/50 p-2 rounded-xl border border-gray-100 mb-2">
                                    <div className="flex items-center gap-1">
                                       <Ruler size={10} className="text-primary-500" />
                                       <span className="text-[9px] font-black text-gray-600">{model.area} م²</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                       <Bed size={10} className="text-primary-500" />
                                       <span className="text-[9px] font-black text-gray-600">{model.rooms} غرف</span>
                                    </div>
                                    <div className="flex items-center gap-1 mr-auto">
                                       <span className="text-[9px] font-black text-primary-700">{formatPrice(model.price)}</span>
                                    </div>
                                 </div>
                               )}

                               <div className="grid grid-cols-2 gap-3">
                                  <div>
                                     <p className="text-[8px] text-gray-400 font-black uppercase">المسوق</p>
                                     <p className="text-[10px] font-bold text-gray-700 truncate">{booking.marketerName}</p>
                                  </div>
                                  <div>
                                     <p className="text-[8px] text-gray-400 font-black uppercase">العميل</p>
                                     <p className="text-[10px] font-bold text-gray-700 truncate">{booking.customerName}</p>
                                  </div>
                               </div>
                               <div className="pt-2 flex justify-between items-center border-t border-gray-200">
                                  <span className="text-[8px] text-gray-400">{new Date(booking.timestamp).toLocaleDateString('ar-SA')}</span>
                                  <div className="flex gap-1.5">
                                     <a href={`tel:${booking.customerPhone}`} className="p-1.5 bg-white text-primary-600 rounded-lg shadow-sm"><Phone size={10} /></a>
                                     <a href={`tel:${booking.marketerPhone}`} className="p-1.5 bg-white text-orange-600 rounded-lg shadow-sm"><Users size={10} /></a>
                                  </div>
                               </div>
                            </div>
                          );
                        })
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && selectedUnitKey && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
             <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-right" dir="rtl">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-orange-50/30">
                   <div>
                      <h3 className="text-xl font-black text-gray-900">تحديث وحدة {selectedUnitKey.includes('floor') ? selectedUnitKey.split('-').slice(1).join('') : selectedUnitKey}</h3>
                      <p className="text-xs font-bold text-orange-600 mt-1 uppercase">إدارة حالات الحجز والمبيعات</p>
                   </div>
                   <button onClick={() => setShowBookingForm(false)} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400">
                      <XCircle size={24} />
                   </button>
                </div>

                <div className="px-8 pt-6">
                   {/* Mode Selector Toggle */}
                   <div className="flex bg-gray-100 p-1 rounded-2xl mb-6 shadow-inner">
                      <button 
                         type="button"
                         onClick={() => setIsQuickMode(true)}
                         className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs transition-all ${isQuickMode ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}
                      >
                         <Zap size={14} /> تحديث سريع
                      </button>
                      <button 
                         type="button"
                         onClick={() => setIsQuickMode(false)}
                         className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs transition-all ${!isQuickMode ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-400'}`}
                      >
                         <UserCheck size={14} /> إضافة بيانات
                      </button>
                   </div>

                   {/* UNIT SPECS CARD */}
                   {selectedModel && (
                     <div className="bg-gray-50 border border-gray-100 p-5 rounded-[2rem] grid grid-cols-3 gap-4 mb-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1.5 h-full bg-primary-600"></div>
                        <div className="text-center">
                           <div className="flex items-center justify-center gap-1.5 mb-1">
                              <Ruler size={14} className="text-primary-500" />
                              <span className="text-[10px] font-black text-gray-400 uppercase">المساحة</span>
                           </div>
                           <p className="text-base font-black text-gray-800">{selectedModel.area} م²</p>
                        </div>
                        <div className="text-center border-x border-gray-200">
                           <div className="flex items-center justify-center gap-1.5 mb-1">
                              <Bed size={14} className="text-primary-500" />
                              <span className="text-[10px] font-black text-gray-400 uppercase">الغرف</span>
                           </div>
                           <p className="text-base font-black text-gray-800">{selectedModel.rooms} غرف</p>
                        </div>
                        <div className="text-center">
                           <div className="flex items-center justify-center gap-1.5 mb-1">
                              <DollarSign size={14} className="text-primary-500" />
                              <span className="text-[10px] font-black text-gray-400 uppercase">السعر</span>
                           </div>
                           <p className="text-base font-black text-primary-600">{formatPrice(selectedModel.price)}</p>
                        </div>
                     </div>
                   )}
                </div>

                <form onSubmit={handleSaveBooking} className="p-8 pt-0 space-y-6">
                   <div className="grid grid-cols-3 gap-3">
                      <button type="button" onClick={() => setBookingType(UnitAvailability.Available)} className={`p-4 rounded-2xl border-2 transition-all font-black text-xs flex flex-col items-center gap-2 ${bookingType === UnitAvailability.Available ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
                         <CheckCircle size={20} /> متاحة
                      </button>
                      <button type="button" onClick={() => setBookingType(UnitAvailability.Reserved)} className={`p-4 rounded-2xl border-2 transition-all font-black text-xs flex flex-col items-center gap-2 ${bookingType === UnitAvailability.Reserved ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
                         <Users size={20} /> حجز
                      </button>
                      <button type="button" onClick={() => setBookingType(UnitAvailability.Sold)} className={`p-4 rounded-2xl border-2 transition-all font-black text-xs flex flex-col items-center gap-2 ${bookingType === UnitAvailability.Sold ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
                         <DollarSign size={20} /> بيع
                      </button>
                   </div>

                   {(!isQuickMode && bookingType !== UnitAvailability.Available) && (
                     <div className="space-y-6 animate-in slide-in-from-bottom-2">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">بيانات المسوق</label>
                           <div className="grid grid-cols-2 gap-4">
                              <input required type="text" placeholder="اسم المسوق" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500 text-right" value={bookingData.marketerName} onChange={e => setBookingData({...bookingData, marketerName: e.target.value})} />
                              <input required type="tel" placeholder="رقم الجوال" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500 text-right" value={bookingData.marketerPhone} onChange={e => setBookingData({...bookingData, marketerPhone: e.target.value})} />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">بيانات العميل</label>
                           <div className="grid grid-cols-2 gap-4">
                              <input required type="text" placeholder="اسم العميل" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500 text-right" value={bookingData.customerName} onChange={e => setBookingData({...bookingData, customerName: e.target.value})} />
                              <input required type="tel" placeholder="رقم الجوال" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500 text-right" value={bookingData.customerPhone} onChange={e => setBookingData({...bookingData, customerPhone: e.target.value})} />
                           </div>
                        </div>
                     </div>
                   )}

                   {isQuickMode && bookingType !== UnitAvailability.Available && (
                     <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-center animate-in fade-in">
                        <p className="text-[11px] font-black text-orange-700 flex items-center justify-center gap-2">
                           <Zap size={14} /> سيتم تحديث حالة الوحدة فوراً دون تغيير بيانات الحجز الحالية.
                        </p>
                     </div>
                   )}

                   <div className="pt-6 flex gap-3">
                      <button type="submit" className="flex-1 bg-orange-600 text-white py-4 rounded-3xl font-black shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all">
                         حفظ التغييرات
                      </button>
                      <button type="button" onClick={() => setShowBookingForm(false)} className="px-8 py-4 rounded-3xl border border-gray-100 font-bold text-gray-400 hover:bg-gray-50">إلغاء</button>
                   </div>
                </form>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
