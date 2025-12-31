
import React, { useState, useRef, useEffect } from 'react';
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
  ChevronUp,
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
  externalProjectId: string | null;
  onSetExternalProjectId: (id: string | null) => void;
}

const MODEL_COLORS = [
  'bg-blue-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 
  'bg-indigo-600', 'bg-purple-600', 'bg-cyan-600', 'bg-orange-600'
];

const NumberStepper = ({ label, value, onChange, min = 0 }: { label: string, value: any, onChange: (val: any) => void, min?: number }) => {
  const numValue = parseArabicNumber(value);
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">{label}</label>
      <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-sm focus-within:border-primary-300 transition-colors">
        <button type="button" onClick={() => onChange(Math.max(min, numValue - 1))} className="p-3 hover:bg-gray-100 text-gray-400 hover:text-primary-600 transition-colors border-l border-gray-100"><ChevronDown size={16} /></button>
        <input type="text" inputMode="numeric" className="w-full bg-transparent border-none text-center font-black text-sm focus:ring-0 text-gray-800" value={value} onChange={e => onChange(e.target.value)} />
        <button type="button" onClick={() => onChange(numValue + 1)} className="p-3 hover:bg-gray-100 text-gray-400 hover:text-primary-600 transition-colors border-r border-gray-100"><ChevronUp size={16} /></button>
      </div>
    </div>
  );
};

export const DeveloperProjects: React.FC<DeveloperProjectsProps> = ({ 
  projects, 
  onSaveProject, 
  onBack,
  externalProjectId,
  onSetExternalProjectId
}) => {
  const [showAddForm, setShowAddForm] = useState(externalProjectId !== null);
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const initialFormState: Partial<Project> = {
    id: '', name: '', developer: '', description: '', city: 'جدة', district: '', googleMapUrl: '', brochureUrl: '',
    status: Status.UnderConstruction, floorsCount: 4, unitsPerFloor: 3, annexCount: 1, basementCount: 0,
    models: [{ id: 'm1', name: 'نموذج أ', color: MODEL_COLORS[0], area: 150, price: 850000, rooms: 4, bathrooms: 3, halls: 1, finishing: Finishing.Medium, features: [] }],
    unitMapping: {}, unitStatus: {}, unitBookings: {}
  };

  const [formData, setFormData] = useState<Partial<Project>>(() => {
    if (externalProjectId) {
      const proj = projects.find(p => p.id === externalProjectId);
      if (proj) return { ...proj };
    }
    return initialFormState;
  });

  // مزامنة حالة النموذج مع المشروع المختار خارجياً (عند التحديث)
  useEffect(() => {
    if (externalProjectId) {
      const proj = projects.find(p => p.id === externalProjectId);
      if (proj) {
        setFormData({ ...proj });
        setShowAddForm(true);
      }
    }
  }, [externalProjectId, projects]);

  const handleSelectProjectToEdit = (proj: Project) => {
    setFormData({ ...proj });
    onSetExternalProjectId(proj.id);
    setShowAddForm(true);
  };

  const addModel = () => {
    const newId = `m${Date.now()}`;
    const newModel: ProjectModel = {
      id: newId, name: `نموذج جديد`, color: MODEL_COLORS[(formData.models?.length || 0) % MODEL_COLORS.length], area: 120, price: 600000, rooms: 3, bathrooms: 2, halls: 1, finishing: Finishing.Medium, features: []
    };
    setFormData(prev => ({ ...prev, models: [...(prev.models || []), newModel] }));
    setActiveModelId(newId);
  };

  const updateModel = (id: string, updates: Partial<ProjectModel>) => {
    setFormData(prev => ({ ...prev, models: prev.models?.map(m => m.id === id ? { ...m, ...updates } : m) }));
  };

  const removeModel = (id: string) => {
    if ((formData.models?.length || 0) <= 1) return;
    setFormData(prev => ({
      ...prev, models: prev.models?.filter(m => m.id !== id),
      unitMapping: Object.fromEntries(Object.entries(prev.unitMapping || {}).filter(([_, mId]) => mId !== id))
    }));
  };

  const handleUnitClick = (key: string) => {
    if (!activeModelId) { alert('الرجاء اختيار نموذج من القائمة الجانبية أولاً'); return; }
    setFormData(prev => {
      const isRemoving = prev.unitMapping?.[key] === activeModelId;
      const newMapping = { ...prev.unitMapping };
      if (isRemoving) delete newMapping[key]; else newMapping[key] = activeModelId;
      return { ...prev, unitMapping: newMapping, unitStatus: { ...prev.unitStatus, [key]: prev.unitStatus?.[key] || UnitAvailability.Available } };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.developer) { alert('بيانات ناقصة'); return; }
    const projectToSave: Project = { ...initialFormState, ...formData, id: formData.id || `P-${Math.random().toString(36).substr(2, 9)}`, createdAt: formData.createdAt || new Date().toISOString() } as Project;
    onSaveProject(projectToSave);
    alert('تم الحفظ');
    onSetExternalProjectId(null);
    setShowAddForm(false);
  };

  const renderUnit = (key: string, label: string) => {
    const modelId = formData.unitMapping?.[key];
    const model = formData.models?.find(m => m.id === modelId);
    return (
      <div key={key} onClick={() => handleUnitClick(key)} className={`flex-1 h-16 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 relative group ${model ? model.color + ' text-white border-transparent' : 'bg-blue-50/10 border-blue-50 text-blue-100'}`}>
        <span className="text-[10px] font-black">{label}</span>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 md:pr-[288px] bg-gray-50 min-h-screen pb-20 text-right" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => { setShowAddForm(false); onSetExternalProjectId(null); onBack(); }} className="p-2 bg-white rounded-full"><ArrowRight size={20} /></button>
            <h2 className="text-2xl font-black">{showAddForm ? 'تعديل مشروع' : 'مشاريع المطورين'}</h2>
          </div>
          {!showAddForm && <button onClick={() => { setFormData(initialFormState); onSetExternalProjectId(null); setShowAddForm(true); }} className="bg-primary-600 text-white px-6 py-3 rounded-2xl font-black">إضافة مشروع</button>}
        </div>

        {showAddForm ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-[2.5rem] border space-y-4">
                <input type="text" className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="اسم المشروع" />
                <input type="text" className="w-full bg-gray-50 rounded-xl px-4 py-3 font-bold text-sm" value={formData.developer} onChange={e => setFormData({...formData, developer: e.target.value})} placeholder="المطور" />
                <div className="grid grid-cols-2 gap-4">
                  <NumberStepper label="الأدوار" value={formData.floorsCount} onChange={val => setFormData({...formData, floorsCount: val})} />
                  <NumberStepper label="وحدات/دور" value={formData.unitsPerFloor} onChange={val => setFormData({...formData, unitsPerFloor: val})} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] border">
                <div className="flex justify-between mb-4"><span>النماذج</span><button type="button" onClick={addModel}><Plus size={16}/></button></div>
                {formData.models?.map(m => (
                  <div key={m.id} onClick={() => setActiveModelId(m.id)} className={`p-4 rounded-2xl border-2 mb-2 ${activeModelId === m.id ? 'border-primary-500' : 'border-gray-50'}`}>
                    <input className="bg-transparent font-black text-xs w-full" value={m.name} onChange={e => updateModel(m.id, {name: e.target.value})} />
                  </div>
                ))}
              </div>
              <button type="submit" className="w-full bg-primary-600 text-white py-4 rounded-2xl font-black">حفظ المشروع</button>
            </div>
            <div className="lg:col-span-7 bg-white p-10 rounded-[4rem] border min-h-[600px] flex flex-col items-center">
              {Array.from({ length: parseArabicNumber(formData.floorsCount || 0) }).map((_, fIdx) => {
                const floorNum = (parseArabicNumber(formData.floorsCount || 0)) - fIdx;
                return (
                  <div key={floorNum} className="flex gap-4 mb-4 w-full">
                    {Array.from({ length: parseArabicNumber(formData.unitsPerFloor || 0) }).map((_, uIdx) => renderUnit(`floor-${floorNum}-${uIdx+1}`, `${floorNum}0${uIdx+1}`))}
                  </div>
                );
              })}
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map(proj => (
              <div key={proj.id} onClick={() => handleSelectProjectToEdit(proj)} className="bg-white p-6 rounded-[2.5rem] border shadow-sm cursor-pointer hover:shadow-md">
                <h3 className="text-xl font-black">{proj.name}</h3>
                <p className="text-gray-400 text-xs mt-1">{proj.developer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
