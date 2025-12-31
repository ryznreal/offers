
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
  ShieldCheck
} from '../components/Icon';

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
              className="p-3 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowRight size={24} className="text-gray-600" />
            </button>
            <div>
              <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <Users className="text-orange-600" size={32} />
                {selectedProject ? selectedProject.name : 'بوابة مدير التسويق'}
              </h2>
              <p className="text-gray-500 text-sm font-bold mt-1 uppercase tracking-wider">
                {selectedProject ? `المطور: ${selectedProject.developer}` : 'إدارة حجوزات ومبيعات المشاريع السكنية'}
              </p>
            </div>
          </div>

          {selectedProjectId && (
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 animate-in slide-in-from-left-4">
              <span className="text-xs font-black text-gray-400 px-3 uppercase border-l border-gray-100 ml-2">أدوات التحكم السريع:</span>
              
              <button 
                onClick={() => setActiveTool('detail')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black transition-all ${activeTool === 'detail' ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <UserCheck size={18} /> الوضع التفصيلي
              </button>

              <div className="w-px h-8 bg-gray-100 mx-1"></div>

              <button 
                onClick={() => setActiveTool(UnitAvailability.Available)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black transition-all ${activeTool === UnitAvailability.Available ? 'bg-green-600 text-white shadow-lg' : 'text-green-600 hover:bg-green-50'}`}
              >
                <CheckCircle size={18} /> إتاحة سريعة
              </button>

              <button 
                onClick={() => setActiveTool(UnitAvailability.Reserved)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black transition-all ${activeTool === UnitAvailability.Reserved ? 'bg-sky-500 text-white shadow-lg' : 'text-sky-600 hover:bg-sky-50'}`}
              >
                <Zap size={18} /> حجز سريع
              </button>

              <button 
                onClick={() => setActiveTool(UnitAvailability.Sold)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black transition-all ${activeTool === UnitAvailability.Sold ? 'bg-red-600 text-white shadow-lg' : 'text-red-600 hover:bg-red-50'}`}
              >
                <Zap size={18} /> بيع سريع
              </button>
            </div>
          )}
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
                    <div className="p-6 bg-orange-50 text-orange-600 rounded-3xl group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                       <Building2 size={36} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-orange-700">{proj.name}</h3>
                  <div className="flex items-center text-sm text-gray-400 font-bold mb-8">
                    <MapPin size={18} className="ml-2 text-red-400" />
                    {proj.city} • {proj.district}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-2xl text-center">
                       <span className="text-xs font-black text-green-700 block mb-1">متاح</span>
                       <span className="text-lg font-black text-green-800">{availableCount}</span>
                    </div>
                    <div className="bg-sky-50 p-4 rounded-2xl text-center">
                       <span className="text-xs font-black text-sky-700 block mb-1">محجوز</span>
                       <span className="text-lg font-black text-sky-800">{reservedCount}</span>
                    </div>
                    <div className="bg-red-50 p-4 rounded-2xl text-center">
                       <span className="text-xs font-black text-red-700 block mb-1">مباع</span>
                       <span className="text-lg font-black text-red-800">{soldCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
             <div className="lg:col-span-8">
                {activeTool !== 'detail' && (
                  <div className="mb-6 bg-orange-50 border border-orange-100 p-5 rounded-3xl flex items-center gap-4 animate-pulse">
                    <Zap className="text-orange-600" size={24} />
                    <span className="text-base font-black text-orange-800">
                      أداة التحديث السريع نشطة: انقر على أي وحدة لتحويلها إلى {
                        activeTool === UnitAvailability.Available ? 'متاحة' : 
                        activeTool === UnitAvailability.Reserved ? 'محجوزة' : 'مباعة'
                      } فوراً.
                    </span>
                  </div>
                )}
                <div className="bg-gray-100 p-10 rounded-[4rem] border border-gray-200 shadow-inner flex flex-col items-center min-h-[700px] justify-center relative overflow-hidden">
                   <div className="bg-white p-12 rounded-[4rem] shadow-2xl border-b-[20px] border-gray-400 relative w-full max-w-3xl">
                      
                      {/* Legend Bar */}
                      <div className="flex justify-center gap-8 mb-12 border-b border-gray-50 pb-8">
                         <div className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-green-600"></div><span className="text-xs font-black text-gray-500 uppercase">متاح</span></div>
                         <div className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-sky-400"></div><span className="text-xs font-black text-gray-500 uppercase">محجوز</span></div>
                         <div className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-red-600"></div><span className="text-xs font-black text-gray-500 uppercase">مباع</span></div>
                      </div>

                      {/* Annexes */}
                      {selectedProject.annexCount! > 0 && (
                        <div className="flex justify-center gap-6 mb-12">
                          {Array.from({ length: selectedProject.annexCount! }).map((_, i) => {
                            const key = `annex-${i+1}`;
                            if (!selectedProject.unitMapping[key]) return null;
                            const status = selectedProject.unitStatus[key] || UnitAvailability.Available;
                            return (
                              <div key={key} onClick={() => handleUnitClick(key)} className={`w-24 h-24 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 ${getStatusColor(status)} shadow-lg`}>
                                 <Home size={28} />
                                 <span className="text-xs font-black mt-1">M{i+1}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Floors */}
                      <div className="space-y-6">
                        {Array.from({ length: selectedProject.floorsCount! }).map((_, fIdx) => {
                          const floorNum = selectedProject.floorsCount! - fIdx;
                          const hasMappedUnits = Array.from({ length: selectedProject.unitsPerFloor! }).some((_, uIdx) => 
                            selectedProject.unitMapping[`floor-${floorNum}-${uIdx+1}`]
                          );

                          if (!hasMappedUnits) return null;

                          return (
                            <div key={floorNum} className="flex items-center gap-8 md:gap-12">
                               <div className="w-12 text-left"><span className="text-sm font-black text-gray-300">F{floorNum}</span></div>
                               <div className="flex-1 flex justify-center gap-4 md:gap-6">
                                  {Array.from({ length: selectedProject.unitsPerFloor! }).map((_, uIdx) => {
                                    const key = `floor-${floorNum}-${uIdx+1}`;
                                    const modelId = selectedProject.unitMapping[key];
                                    if (!modelId) return <div key={key} className="flex-1 h-16 opacity-0 pointer-events-none"></div>;
                                    
                                    const status = selectedProject.unitStatus[key] || UnitAvailability.Available;
                                    return (
                                      <div key={key} onClick={() => handleUnitClick(key)} className={`flex-1 h-16 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 ${getStatusColor(status)} shadow-md hover:scale-105 active:scale-95`}>
                                         <span className="text-sm font-black">{floorNum}0{uIdx+1}</span>
                                      </div>
                                    );
                                  })}
                               </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-14 text-center">
                         <span className="text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-10 py-4 rounded-full border border-gray-100">طابق الخدمات والمواقف</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-8">
                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                   <div className="flex items-center gap-4 mb-8">
                      <LayoutList size={28} className="text-orange-500" />
                      <h3 className="text-xl font-black text-gray-800">سجل الحجوزات والمبيعات</h3>
                   </div>
                   <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                      {Object.values(selectedProject.unitBookings).length === 0 ? (
                        <p className="text-center py-12 text-base text-gray-400 font-bold">لا يوجد حجوزات نشطة حالياً</p>
                      ) : (
                        (Object.values(selectedProject.unitBookings) as BookingDetails[]).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(booking => {
                          const unitModelId = selectedProject.unitMapping[booking.unitKey];
                          const model = selectedProject.models.find(m => m.id === unitModelId);
                          
                          return (
                            <div key={booking.unitKey} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4">
                               <div className="flex justify-between items-center">
                                  <span className="text-sm font-black text-gray-900 uppercase">وحدة {booking.unitNumber}</span>
                                  <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase ${booking.type === UnitAvailability.Reserved ? 'bg-sky-100 text-sky-600' : 'bg-red-100 text-red-600'}`}>
                                     {booking.type === UnitAvailability.Reserved ? 'محجوزة' : 'مباعة'}
                                  </span>
                               </div>

                               {model && (
                                 <div className="flex items-center gap-6 bg-white/50 p-3 rounded-2xl border border-gray-100 mb-2">
                                    <div className="flex items-center gap-2">
                                       <Ruler size={16} className="text-primary-500" />
                                       <span className="text-xs font-black text-gray-600">{model.area} م²</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <Bed size={16} className="text-primary-500" />
                                       <span className="text-xs font-black text-gray-600">{model.rooms} غرف</span>
                                    </div>
                                    <div className="flex items-center gap-2 mr-auto">
                                       <span className="text-xs font-black text-primary-700">{formatPrice(model.price)}</span>
                                    </div>
                                 </div>
                               )}

                               <div className="grid grid-cols-2 gap-4">
                                  <div>
                                     <p className="text-[10px] text-gray-400 font-black uppercase mb-1">المسوق ({booking.isExternalMarketer ? 'خارجي' : 'داخلي'})</p>
                                     <p className="text-sm font-bold text-gray-700 truncate">{booking.marketerName}</p>
                                  </div>
                                  <div>
                                     <p className="text-[10px] text-gray-400 font-black uppercase mb-1">العميل</p>
                                     <p className="text-sm font-bold text-gray-700 truncate">{booking.customerName}</p>
                                  </div>
                               </div>

                               {(booking.brokerageFee > 0 || booking.marketerPercentage > 0) && (
                                 <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                                    <div>
                                       <p className="text-[10px] text-gray-400 font-black uppercase mb-1">السعي</p>
                                       <p className="text-sm font-bold text-gray-700">{formatPrice(booking.brokerageFee)}</p>
                                    </div>
                                    <div>
                                       <p className="text-[10px] text-gray-400 font-black uppercase mb-1">العمولة</p>
                                       <p className="text-sm font-bold text-gray-700">{booking.marketerPercentage}%</p>
                                    </div>
                                 </div>
                               )}

                               <div className="pt-3 flex justify-between items-center border-t border-gray-200">
                                  <span className="text-xs text-gray-400">{new Date(booking.timestamp).toLocaleDateString('ar-SA')}</span>
                                  <div className="flex gap-2">
                                     <a href={`tel:${booking.customerPhone}`} className="p-2 bg-white text-primary-600 rounded-xl shadow-sm hover:scale-110 transition-transform"><Phone size={16} /></a>
                                     <a href={`tel:${booking.marketerPhone}`} className="p-2 bg-white text-orange-600 rounded-xl shadow-sm hover:scale-110 transition-transform"><Users size={16} /></a>
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
             <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-right h-[90vh] flex flex-col" dir="rtl">
                <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-sky-50/30">
                   <div>
                      <h3 className="text-3xl font-black text-gray-900">حجز وحدة {selectedUnitKey.includes('floor') ? selectedUnitKey.split('-').slice(1).join('') : selectedUnitKey}</h3>
                      <p className="text-sm font-bold text-sky-600 mt-2 uppercase">إدخال بيانات الحجز التفصيلية والمالية</p>
                   </div>
                   <button onClick={() => setShowBookingForm(false)} className="p-3 hover:bg-white rounded-full transition-colors text-gray-400">
                      <XCircle size={32} />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 pt-8 space-y-10 custom-scrollbar">
                   {/* UNIT SPECS CARD */}
                   {selectedModel && (
                     <div className="bg-gray-50 border border-gray-100 p-8 rounded-[3rem] grid grid-cols-3 gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-2 h-full bg-sky-600"></div>
                        <div className="text-center">
                           <div className="flex items-center justify-center gap-2 mb-2">
                              <Ruler size={18} className="text-sky-500" />
                              <span className="text-xs font-black text-gray-400 uppercase">المساحة</span>
                           </div>
                           <p className="text-xl font-black text-gray-800">{selectedModel.area} م²</p>
                        </div>
                        <div className="text-center border-x border-gray-200">
                           <div className="flex items-center justify-center gap-2 mb-2">
                              <Bed size={18} className="text-sky-500" />
                              <span className="text-xs font-black text-gray-400 uppercase">الغرف</span>
                           </div>
                           <p className="text-xl font-black text-gray-800">{selectedModel.rooms} غرف</p>
                        </div>
                        <div className="text-center">
                           <div className="flex items-center justify-center gap-2 mb-2">
                              <DollarSign size={18} className="text-sky-500" />
                              <span className="text-xs font-black text-gray-400 uppercase">السعر</span>
                           </div>
                           <p className="text-xl font-black text-sky-600">{formatPrice(selectedModel.price)}</p>
                        </div>
                     </div>
                   )}

                   <form id="booking-form" onSubmit={(e) => {
                     e.preventDefault();
                     if (!selectedProject || !selectedUnitKey) return;
                     const updatedProject = { ...selectedProject };
                     
                     if (bookingType === UnitAvailability.Available) {
                       updatedProject.unitStatus[selectedUnitKey] = UnitAvailability.Available;
                       delete updatedProject.unitBookings[selectedUnitKey];
                     } else {
                       updatedProject.unitStatus[selectedUnitKey] = bookingType;
                       updatedProject.unitBookings[selectedUnitKey] = {
                         unitKey: selectedUnitKey,
                         unitNumber: selectedUnitKey.includes('floor') ? selectedUnitKey.split('-').slice(1).join('') : selectedUnitKey,
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
                   }} className="space-y-10">
                      
                      {/* Status Selection */}
                      <div className="grid grid-cols-3 gap-5">
                         <button type="button" onClick={() => setBookingType(UnitAvailability.Available)} className={`p-6 rounded-[2rem] border-2 transition-all font-black text-sm flex flex-col items-center gap-3 ${bookingType === UnitAvailability.Available ? 'border-green-500 bg-green-50 text-green-700 shadow-lg' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
                            <CheckCircle size={28} /> متاحة
                         </button>
                         <button type="button" onClick={() => setBookingType(UnitAvailability.Reserved)} className={`p-6 rounded-[2rem] border-2 transition-all font-black text-sm flex flex-col items-center gap-3 ${bookingType === UnitAvailability.Reserved ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-lg' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
                            <Users size={28} /> حجز
                         </button>
                         <button type="button" onClick={() => setBookingType(UnitAvailability.Sold)} className={`p-6 rounded-[2rem] border-2 transition-all font-black text-sm flex flex-col items-center gap-3 ${bookingType === UnitAvailability.Sold ? 'border-red-500 bg-red-50 text-red-700 shadow-lg' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
                            <DollarSign size={28} /> بيع
                         </button>
                      </div>

                      {bookingType !== UnitAvailability.Available && (
                        <div className="space-y-10 animate-in slide-in-from-bottom-4">
                           {/* Marketer Info */}
                           <div className="space-y-6 bg-white border border-gray-100 p-8 rounded-[3rem] shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest block flex items-center gap-2">
                                    <UserCheck size={16} /> بيانات المسوق
                                 </label>
                                 <div className="flex bg-gray-100 p-1 rounded-xl">
                                    <button 
                                       type="button" 
                                       onClick={() => setBookingData({...bookingData, isExternalMarketer: false})}
                                       className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${!bookingData.isExternalMarketer ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-400'}`}
                                    >
                                       تابع للشركة
                                    </button>
                                    <button 
                                       type="button" 
                                       onClick={() => setBookingData({...bookingData, isExternalMarketer: true})}
                                       className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${bookingData.isExternalMarketer ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400'}`}
                                    >
                                       خارجي
                                    </button>
                                 </div>
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                 <input required type="text" placeholder="اسم المسوق" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-base outline-none focus:ring-2 focus:ring-sky-500 text-right shadow-inner" value={bookingData.marketerName} onChange={e => setBookingData({...bookingData, marketerName: e.target.value})} />
                                 <input required type="tel" placeholder="رقم الجوال" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-base outline-none focus:ring-2 focus:ring-sky-500 text-right shadow-inner" value={bookingData.marketerPhone} onChange={e => setBookingData({...bookingData, marketerPhone: e.target.value})} />
                              </div>
                           </div>

                           {/* Financial Info */}
                           <div className="space-y-6 bg-sky-50/50 border border-sky-100 p-8 rounded-[3rem] shadow-sm">
                              <label className="text-xs font-black text-sky-600 uppercase tracking-widest block flex items-center gap-2">
                                 <DollarSign size={16} /> بيانات السعي والعمولة
                              </label>
                              <div className="grid grid-cols-2 gap-6">
                                 <div className="relative">
                                    <input type="number" placeholder="قيمة السعي (ريال)" className="w-full bg-white border border-sky-100 rounded-2xl px-6 py-4 font-bold text-base outline-none focus:ring-2 focus:ring-sky-500 text-right shadow-sm" value={bookingData.brokerageFee || ''} onChange={e => setBookingData({...bookingData, brokerageFee: Number(e.target.value)})} />
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-black text-gray-300">SAR</span>
                                 </div>
                                 <div className="relative">
                                    <input type="number" placeholder="نسبة المسوق (%)" className="w-full bg-white border border-sky-100 rounded-2xl px-6 py-4 font-bold text-base outline-none focus:ring-2 focus:ring-sky-500 text-right shadow-sm" value={bookingData.marketerPercentage || ''} onChange={e => setBookingData({...bookingData, marketerPercentage: Number(e.target.value)})} />
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-black text-gray-300">%</span>
                                 </div>
                              </div>
                           </div>

                           {/* Customer Info */}
                           <div className="space-y-6 bg-white border border-gray-100 p-8 rounded-[3rem] shadow-sm">
                              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block flex items-center gap-2">
                                 <Users size={16} /> بيانات العميل
                              </label>
                              <div className="grid grid-cols-2 gap-6">
                                 <input required type="text" placeholder="اسم العميل" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-base outline-none focus:ring-2 focus:ring-sky-500 text-right shadow-inner" value={bookingData.customerName} onChange={e => setBookingData({...bookingData, customerName: e.target.value})} />
                                 <input required type="tel" placeholder="رقم الجوال" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-bold text-base outline-none focus:ring-2 focus:ring-sky-500 text-right shadow-inner" value={bookingData.customerPhone} onChange={e => setBookingData({...bookingData, customerPhone: e.target.value})} />
                              </div>
                           </div>
                        </div>
                      )}
                   </form>
                </div>

                <div className="p-10 border-t border-gray-100 bg-gray-50 flex gap-4 shrink-0">
                   <button form="booking-form" type="submit" className="flex-1 bg-sky-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-sky-100 hover:bg-sky-700 transition-all active:scale-95">
                      اعتماد وحفظ البيانات
                   </button>
                   <button type="button" onClick={() => setShowBookingForm(false)} className="px-10 py-5 rounded-[2rem] border border-gray-200 font-black text-base text-gray-400 hover:bg-white transition-all">إلغاء</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
