
import React, { useState, useRef } from 'react';
import { Project, ProjectModel, Finishing, Status, UnitAvailability } from '../types';
import { 
  Building2, 
  Plus, 
  ArrowRight, 
  MapPin, 
  Layers, 
  CheckCircle, 
  Bed, 
  DollarSign, 
  XCircle,
  LayoutGrid,
  Info,
  Ruler,
  Bath,
  ArrowDownCircle,
  ArrowUpCircle,
  Home,
  Trash2,
  Settings,
  ChevronDown,
  FileText,
  Upload,
  Download
} from '../components/Icon';
import { CITIES } from '../constants';
import { parseArabicNumber, toEnglishDigits } from '../utils/helpers';

interface DeveloperProjectsProps {
  projects: Project[];
  onSaveProject: (project: Project) => void;
  onBack: () => void;
}

const MODEL_COLORS = [
  'bg-blue-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 
  'bg-indigo-600', 'bg-purple-600', 'bg-cyan-600', 'bg-orange-600'
];

export const DeveloperProjects: React.FC<DeveloperProjectsProps> = ({ 
  projects, 
  onSaveProject, 
  onBack 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const initialFormState: Partial<Project> = {
    id: '',
    name: '',
    developer: '',
    description: '',
    city: 'الرياض',
    district: '',
    googleMapUrl: '',
    brochureUrl: '',
    status: Status.UnderConstruction,
    floorsCount: 4,
    unitsPerFloor: 3,
    annexCount: 2,
    basementCount: 1,
    models: [
      {
        id: 'm1',
        name: 'نموذج أ',
        color: MODEL_COLORS[0],
        area: 150,
        price: 850000,
        rooms: 4,
        bathrooms: 3,
        halls: 1,
        finishing: Finishing.Medium,
        features: []
      }
    ],
    unitMapping: {},
    unitStatus: {},
    unitBookings: {}
  };

  const [formData, setFormData] = useState<Partial<Project>>(initialFormState);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, brochureUrl: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectProjectToEdit = (proj: Project) => {
    setFormData({ ...proj });
    setSelectedProjectId(proj.id);
    setShowAddForm(true);
  };

  const addModel = () => {
    const newId = `m${Date.now()}`;
    const newModel: ProjectModel = {
      id: newId,
      name: `نموذج جديد`,
      color: MODEL_COLORS[(formData.models?.length || 0) % MODEL_COLORS.length],
      area: 120,
      price: 600000,
      rooms: 3,
      bathrooms: 2,
      halls: 1,
      finishing: Finishing.Medium,
      features: []
    };
    setFormData(prev => ({ ...prev, models: [...(prev.models || []), newModel] }));
    setActiveModelId(newId);
  };

  const updateModel = (id: string, updates: Partial<ProjectModel>) => {
    setFormData(prev => ({
      ...prev,
      models: prev.models?.map(m => m.id === id ? { ...m, ...updates } : m)
    }));
  };

  const removeModel = (id: string) => {
    if ((formData.models?.length || 0) <= 1) return;
    setFormData(prev => ({
      ...prev,
      models: prev.models?.filter(m => m.id !== id),
      unitMapping: Object.fromEntries(
        Object.entries(prev.unitMapping || {}).filter(([_, mId]) => mId !== id)
      )
    }));
  };

  const handleUnitClick = (key: string) => {
    if (!activeModelId) { 
      alert('الرجاء اختيار نموذج من القائمة الجانبية أولاً لتعيينه للوحدة'); 
      return; 
    }
    
    setFormData(prev => {
      const isRemoving = prev.unitMapping?.[key] === activeModelId;
      const newMapping = { ...prev.unitMapping };
      
      if (isRemoving) {
        delete newMapping[key];
      } else {
        newMapping[key] = activeModelId;
      }

      return {
        ...prev,
        unitMapping: newMapping,
        unitStatus: { ...prev.unitStatus, [key]: prev.unitStatus?.[key] || UnitAvailability.Available }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.developer) { alert('الرجاء إكمال بيانات المشروع والمطور'); return; }
    if (Object.keys(formData.unitMapping || {}).length === 0) {
      alert('الرجاء تعيين نماذج للوحدات في المخطط ليتم احتسابها في المشروع');
      return;
    }

    // Clean data before save
    const projectToSave: Project = {
      ...initialFormState,
      ...formData,
      id: formData.id || `P-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: formData.createdAt || new Date().toISOString(),
      floorsCount: parseArabicNumber(formData.floorsCount || 0),
      unitsPerFloor: parseArabicNumber(formData.unitsPerFloor || 0),
      annexCount: parseArabicNumber(formData.annexCount || 0),
      basementCount: parseArabicNumber(formData.basementCount || 0),
    } as Project;

    onSaveProject(projectToSave);
    alert('تم حفظ المشروع بنجاح');
    setShowAddForm(false);
  };

  const renderUnit = (key: string, label: string) => {
    const modelId = formData.unitMapping?.[key];
    const model = formData.models?.find(m => m.id === modelId);

    return (
      <div 
        key={key} 
        onClick={() => handleUnitClick(key)} 
        className={`flex-1 h-16 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 relative group
          ${model ? model.color + ' text-white border-transparent shadow-lg scale-105' : 'bg-blue-50/10 border-blue-50 text-blue-100 hover:bg-blue-50 hover:border-blue-300 shadow-sm'}`}
      >
        <span className="text-[10px] font-black">{label}</span>
        {!model && <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Plus size={14} className="text-gray-400" /></div>}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 md:pr-[288px] bg-gray-50 min-h-screen pb-20 text-right" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setShowAddForm(false); setSelectedProjectId(null); onBack(); }} 
              className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowRight size={20} className="text-gray-600" />
            </button>
            <div>
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Building2 className="text-primary-600" size={28} />
                {showAddForm ? (formData.id ? `تعديل مشروع: ${formData.name}` : 'مشروع مطور جديد') : 'إدارة مشاريع المطورين'}
              </h2>
              <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-wider">
                بناء الهيكل الإنشائي ورفع الملفات التعريفية للمشاريع
              </p>
            </div>
          </div>
          {!showAddForm && (
            <button 
              onClick={() => {
                setFormData(initialFormState);
                setShowAddForm(true);
              }}
              className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-primary-100 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus size={20} /> إضافة مشروع جديد
            </button>
          )}
        </div>

        {showAddForm ? (
          <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between sticky top-4 z-40">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                    <Info size={18} />
                  </div>
                  <span className="text-xs font-black text-gray-600">يمكنك إدخال الأرقام باللغتين العربية والإنجليزية.</span>
               </div>
               <div className="flex items-center gap-4">
                 <button type="submit" className="bg-primary-600 text-white px-10 py-3 rounded-xl font-black text-sm shadow-xl shadow-primary-100 active:scale-95 transition-all">
                    حفظ واعتماد المشروع
                 </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Settings */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={18} className="text-primary-500" />
                    <h3 className="text-base font-black text-gray-800">بيانات المشروع والملفات</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">اسم المشروع</label>
                        <input type="text" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="واحة النرجس" />
                     </div>
                     <div className="col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">وصف المشروع</label>
                        <textarea rows={3} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="وصف تفصيلي للمشروع ومميزاته..." />
                     </div>
                     <div className="col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">موقع المشروع (جوجل ماب)</label>
                        <input type="url" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-sm text-left" dir="ltr" value={formData.googleMapUrl} onChange={e => setFormData({...formData, googleMapUrl: e.target.value})} placeholder="https://maps.google.com/..." />
                     </div>
                     <div className="col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">بروفايل المشروع (PDF/صورة)</label>
                        <div className="flex items-center gap-4">
                           <button 
                             type="button" 
                             onClick={() => fileInputRef.current?.click()}
                             className={`flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed transition-all font-bold text-xs ${formData.brochureUrl ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
                           >
                              {formData.brochureUrl ? <CheckCircle size={16} /> : <Upload size={16} />}
                              {formData.brochureUrl ? 'تم رفع الملف' : 'اختيار ملف البروفايل'}
                           </button>
                           {formData.brochureUrl && (
                             <button type="button" onClick={() => setFormData({...formData, brochureUrl: ''})} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                                <Trash2 size={16} />
                             </button>
                           )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,image/*" onChange={handleFileUpload} />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">المدينة</label>
                        <select className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-sm" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                           {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">الحي</label>
                        <input type="text" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-sm" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
                     </div>
                  </div>

                  {/* Structural Settings */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                     <div className="col-span-2 mb-2"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">تكوين الهيكل الإنشائي</span></div>
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">الأدوار المتكررة</label>
                        <input 
                          type="text" 
                          inputMode="numeric"
                          className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-sm" 
                          value={formData.floorsCount} 
                          onChange={e => setFormData({...formData, floorsCount: parseArabicNumber(e.target.value)})} 
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">وحدات في كل دور</label>
                        <input 
                          type="text" 
                          inputMode="numeric"
                          className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-sm" 
                          value={formData.unitsPerFloor} 
                          onChange={e => setFormData({...formData, unitsPerFloor: parseArabicNumber(e.target.value)})} 
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">عدد الملاحق (Annex)</label>
                        <input 
                          type="text" 
                          inputMode="numeric"
                          className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-sm" 
                          value={formData.annexCount} 
                          onChange={e => setFormData({...formData, annexCount: parseArabicNumber(e.target.value)})} 
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">عدد البدرومات (Basement)</label>
                        <input 
                          type="text" 
                          inputMode="numeric"
                          className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-sm" 
                          value={formData.basementCount} 
                          onChange={e => setFormData({...formData, basementCount: parseArabicNumber(e.target.value)})} 
                        />
                     </div>
                  </div>
                </div>

                {/* Model Settings */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Layers size={18} className="text-primary-500" />
                      <h3 className="text-base font-black text-gray-800">النماذج السكنية</h3>
                    </div>
                    <button type="button" onClick={addModel} className="p-2 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {formData.models?.map(m => (
                      <div 
                        key={m.id} 
                        onClick={() => setActiveModelId(m.id)}
                        className={`p-5 rounded-3xl border-2 transition-all relative cursor-pointer ${activeModelId === m.id ? 'border-primary-500 bg-primary-50/20' : 'border-gray-100 bg-gray-50/50'}`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                           <div className={`w-4 h-4 rounded-full shrink-0 ${m.color}`}></div>
                           <input className="bg-transparent border-none p-0 font-black text-sm w-full focus:ring-0" value={m.name} onChange={e => updateModel(m.id, {name: e.target.value})} />
                           <button type="button" onClick={(e) => { e.stopPropagation(); removeModel(m.id); }} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                           <div>
                              <label className="text-[9px] font-black text-gray-400 mb-1 block uppercase">المساحة</label>
                              <input type="text" inputMode="numeric" className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 font-bold text-xs" value={m.area} onChange={e => updateModel(m.id, {area: parseArabicNumber(e.target.value)})} />
                           </div>
                           <div>
                              <label className="text-[9px] font-black text-gray-400 mb-1 block uppercase">الغرف</label>
                              <input type="text" inputMode="numeric" className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 font-bold text-xs" value={m.rooms} onChange={e => updateModel(m.id, {rooms: parseArabicNumber(e.target.value)})} />
                           </div>
                           <div>
                              <label className="text-[9px] font-black text-gray-400 mb-1 block uppercase">السعر</label>
                              <input type="text" inputMode="numeric" className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 font-bold text-xs" value={m.price} onChange={e => updateModel(m.id, {price: parseArabicNumber(e.target.value)})} />
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Blueprint */}
              <div className="lg:col-span-7">
                <div className="bg-gray-200 p-8 rounded-[4rem] border border-gray-300 shadow-inner flex flex-col items-center min-h-[800px] justify-center relative overflow-hidden">
                  <div className="bg-white p-10 md:p-14 rounded-[4rem] shadow-2xl border-b-[24px] border-gray-400 relative w-full max-w-3xl overflow-y-auto max-h-[90vh] custom-scrollbar">
                    
                    <div className="text-center mb-10 sticky top-0 bg-white z-10 py-4 border-b border-gray-50">
                       <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-4">انقر على وحدة لتعيين النموذج المختار</p>
                       <div className="flex justify-center gap-3 flex-wrap">
                          {formData.models?.map(m => (
                            <div key={m.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${activeModelId === m.id ? 'bg-primary-100 border-primary-200 ring-2 ring-primary-50' : 'bg-gray-50 border-gray-100'}`}>
                               <div className={`w-2.5 h-2.5 rounded-full ${m.color}`}></div>
                               <span className="text-[9px] font-black text-gray-600">{m.name}</span>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-6">
                      {/* ANNEXES SECTION (TOP) */}
                      {parseArabicNumber(formData.annexCount || 0) > 0 && (
                        <div className="animate-in fade-in slide-in-from-top-4">
                           <div className="text-center mb-3">
                              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-50 px-4 py-1 rounded-full">الملاحق (Annex)</span>
                           </div>
                           <div className="flex justify-center gap-4">
                              {Array.from({ length: parseArabicNumber(formData.annexCount || 0) }).map((_, i) => renderUnit(`annex-${i+1}`, `M${i+1}`))}
                           </div>
                           <div className="w-full h-1 bg-gray-100 my-6 rounded-full"></div>
                        </div>
                      )}

                      {/* FLOORS SECTION (MIDDLE) */}
                      {Array.from({ length: parseArabicNumber(formData.floorsCount || 0) }).map((_, fIdx) => {
                        const floorNum = (parseArabicNumber(formData.floorsCount || 0)) - fIdx;
                        return (
                          <div key={floorNum} className="flex items-center gap-6 md:gap-10">
                            <div className="w-10 shrink-0 text-left border-l border-gray-100 pr-2">
                               <span className="text-sm font-black text-gray-400">F{floorNum}</span>
                            </div>
                            <div className="flex-1 flex justify-center gap-3 md:gap-5">
                              {Array.from({ length: parseArabicNumber(formData.unitsPerFloor || 0) }).map((_, uIdx) => 
                                renderUnit(`floor-${floorNum}-${uIdx+1}`, `${floorNum}0${uIdx+1}`)
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* BASEMENTS SECTION (BOTTOM) */}
                      {parseArabicNumber(formData.basementCount || 0) > 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 pt-4">
                           <div className="w-full h-1 bg-gray-100 mb-6 rounded-full"></div>
                           <div className="text-center mb-3">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-1 rounded-full">البدرومات (Basement)</span>
                           </div>
                           <div className="flex justify-center gap-4">
                              {Array.from({ length: parseArabicNumber(formData.basementCount || 0) }).map((_, i) => renderUnit(`basement-${i+1}`, `B${i+1}`))}
                           </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-12 text-center opacity-60">
                       <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-8 py-3 rounded-full border border-gray-100">طابق الخدمات والمدخل الرئيسي</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in duration-700">
            {projects.length === 0 ? (
              <div className="col-span-full py-48 bg-white rounded-[6rem] border-4 border-dashed border-gray-50 text-center flex flex-col items-center justify-center">
                <Building2 size={80} className="text-gray-100 mb-8" />
                <h3 className="text-2xl font-black text-gray-300 mb-4">لا توجد مشاريع حالياً</h3>
                <button onClick={() => setShowAddForm(true)} className="bg-primary-600 text-white px-12 py-4 rounded-3xl font-black shadow-xl shadow-primary-100">
                   تصميم أول مشروع الآن
                </button>
              </div>
            ) : (
              projects.map(proj => {
                const totalUnits = Object.keys(proj.unitMapping).length;
                return (
                  <div 
                    key={proj.id} 
                    onClick={() => handleSelectProjectToEdit(proj)}
                    className="bg-white p-10 rounded-[4.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group cursor-pointer relative"
                  >
                    <div className="flex justify-between items-start mb-10">
                      <div className="p-6 bg-primary-50 text-primary-600 rounded-[2rem] group-hover:bg-primary-600 group-hover:text-white transition-all">
                         <Building2 size={32} />
                      </div>
                      <div className="bg-gray-50 px-4 py-2 rounded-xl text-primary-600 font-black text-xs border border-gray-100">
                         {proj.status}
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-1">{proj.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-8">{proj.developer}</p>
                    <div className="flex items-center text-xs text-gray-500 font-bold mb-8">
                      <MapPin size={16} className="ml-2 text-red-500" />
                      {proj.city} • {proj.district}
                    </div>
                    <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{totalUnits} وحدة معروضة</span>
                      <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-[11px] font-black flex items-center gap-2 hover:bg-primary-600 transition-all">
                        تعديل المشروع
                        <ArrowRight size={14} className="rotate-180" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
