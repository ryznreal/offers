
import React, { useState, useEffect, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { ListProperties } from './views/ListProperties';
import { AddProperty } from './views/AddProperty';
import { ViewProperty } from './views/ViewProperty';
import { AdminPanel } from './views/AdminPanel';
import { DeveloperProjects } from './views/DeveloperProjects';
import { MarketingPortal } from './views/MarketingPortal'; 
import { Login } from './views/Login';
import { Property, PropertyType, FilterState, Status, User, UserRole, Project, UnitType, Finishing, UnitAvailability } from './types';
import { MOCK_PROPERTIES, MOCK_USERS, MOCK_PROJECTS } from './constants';
import { Plus, Building2, Map, ShieldCheck, Share2, LogOut } from './components/Icon';

const STORAGE_KEYS = {
  PROPERTIES: 'realestate_base_properties',
  PROJECTS: 'realestate_projects',
  USERS: 'realestate_users',
  AUTH: 'realestate_auth_user',
  VIEW: 'realestate_current_view',
  SELECTED_PROP: 'realestate_selected_prop',
  SELECTED_PROJ_ID: 'realestate_selected_proj_id'
};

function App() {
  // حالة العرض الحالي - تقرأ من التخزين المحلي لضمان عدم العودة للرئيسية
  const [view, setView] = useState<string>(() => localStorage.getItem(STORAGE_KEYS.VIEW) || 'list'); 

  const [baseProperties, setBaseProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    return saved ? JSON.parse(saved) : MOCK_PROPERTIES;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved ? JSON.parse(saved) : null;
  });

  // حالة العنصر المختار (عقار أو مشروع) - مستمرة عبر التحديث
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_PROP);
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() => 
    localStorage.getItem(STORAGE_KEYS.SELECTED_PROJ_ID)
  );

  const [properties, setProperties] = useState<Property[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [filter, setFilter] = useState<FilterState>({
    search: '', type: 'All', status: 'All', unitType: 'All', rooms: 'All',
    minPrice: '', maxPrice: '', city: '', sortOrder: 'none',
    landUse: 'All', isCorner: 'All', investmentAllowed: 'All'
  });

  // مزامنة البيانات الأساسية
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(baseProperties)); }, [baseProperties]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)); }, [users]);
  
  // مزامنة حالة العرض والتنقل
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.VIEW, view); }, [view]);
  useEffect(() => { 
    if (selectedProperty) localStorage.setItem(STORAGE_KEYS.SELECTED_PROP, JSON.stringify(selectedProperty));
    else localStorage.removeItem(STORAGE_KEYS.SELECTED_PROP);
  }, [selectedProperty]);
  useEffect(() => {
    if (selectedProjectId) localStorage.setItem(STORAGE_KEYS.SELECTED_PROJ_ID, selectedProjectId);
    else localStorage.removeItem(STORAGE_KEYS.SELECTED_PROJ_ID);
  }, [selectedProjectId]);

  useEffect(() => {
    if (currentUser) localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(currentUser));
    else localStorage.removeItem(STORAGE_KEYS.AUTH);
  }, [currentUser]);

  const refreshDisplayProperties = useCallback(() => {
    const projectGeneratedProperties: Property[] = [];
    projects.forEach(project => {
      project.models.forEach(model => {
        const assignedUnitsKeys = Object.entries(project.unitMapping).filter(([_, modelId]) => modelId === model.id).map(([key]) => key);
        const hasAvailableUnits = assignedUnitsKeys.some(key => project.unitStatus[key] === UnitAvailability.Available);

        if (hasAvailableUnits) {
          projectGeneratedProperties.push({
            id: `SAMPLE-${project.id}-${model.id}`,
            projectId: project.id, modelId: model.id, type: PropertyType.Residential,
            city: project.city, district: project.district, developer: project.developer,
            projectName: `${project.name} - ${model.name}`, projectDescription: project.description,
            projectBrochureUrl: project.brochureUrl, price: model.price, unitType: UnitType.Apartment,
            status: project.status, rooms: model.rooms, bathrooms: model.bathrooms,
            area: model.area, finishing: model.finishing, createdAt: project.createdAt,
            googleMapUrl: project.googleMapUrl, notes: `نموذج ${model.name}.`
          });
        }
      });
    });
    setProperties([...projectGeneratedProperties, ...baseProperties]);
  }, [projects, baseProperties]);

  useEffect(() => { refreshDisplayProperties(); }, [refreshDisplayProperties]);

  const handleSaveProject = (project: Project) => {
    setProjects(prev => {
      const existingIndex = prev.findIndex(p => p.id === project.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = project;
        return updated;
      }
      return [project, ...prev];
    });
  };

  const handleSaveProperty = (newProperty: Property) => {
    setBaseProperties(prev => [newProperty, ...prev]);
    setView('list');
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setView('detail');
  };

  if (!currentUser) {
    return <Login users={users} onLogin={setCurrentUser} />;
  }

  const uniqueDevelopers = Array.from(new Set(projects.map(p => p.developer)));

  const visibleProjects = currentUser.role === UserRole.Marketing && currentUser.assignedDeveloper
    ? projects.filter(p => p.developer === currentUser.assignedDeveloper)
    : projects;

  const renderContent = () => {
    switch (view) {
      case 'list':
        return <ListProperties properties={properties} onSelectProperty={handleSelectProperty} filter={filter} setFilter={setFilter} onOpenFilters={() => setIsMobileMenuOpen(true)} />;
      
      case 'admin':
        if (!currentUser.permissions.canManageUsers) { setView('list'); return null; }
        return <AdminPanel developers={uniqueDevelopers} users={users} onAddUser={u => setUsers(p => [u, ...p])} onUpdateUser={u => { setUsers(p => p.map(us => us.id === u.id ? u : us)); if(currentUser.id === u.id) setCurrentUser(u); }} onDeleteUser={id => setUsers(p => p.filter(u => u.id !== id))} onImportProperties={props => {setBaseProperties(p => [...props, ...p]); setView('list');}} onBack={() => setView('list')} />;
      
      case 'projects':
        if (currentUser.role === UserRole.Viewer) { setView('list'); return null; }
        return <DeveloperProjects projects={visibleProjects} onSaveProject={handleSaveProject} onBack={() => setView('list')} externalProjectId={selectedProjectId} onSetExternalProjectId={setSelectedProjectId} />;

      case 'marketing':
        if (currentUser.role === UserRole.Viewer) { setView('list'); return null; }
        return <MarketingPortal projects={visibleProjects} onUpdateProject={handleSaveProject} onBack={() => setView('list')} externalProjectId={selectedProjectId} onSetExternalProjectId={setSelectedProjectId} />;

      case 'select-type':
        if (!currentUser.permissions.canAdd) { setView('list'); return null; }
        return (
          <div className="flex items-center justify-center min-h-screen p-4 md:pr-[288px] bg-gray-50">
            <div className="max-w-4xl w-full">
              <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">إضافة عرض جديد</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onClick={() => setView('add-residential')} className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 group text-right">
                  <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform"><Building2 size={32} /></div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">وحدة سكنية</h3>
                </button>
                <button onClick={() => setView('projects')} className="bg-primary-600 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border border-primary-700 group text-right text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"><Plus size={32} /></div>
                  <h3 className="text-xl font-black mb-2">مشروع مطور</h3>
                </button>
                <button onClick={() => setView('add-land')} className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 group text-right">
                  <div className="w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center text-secondary-600 mb-6 group-hover:scale-110 transition-transform"><Map size={32} /></div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">أرض فضاء</h3>
                </button>
              </div>
            </div>
          </div>
        );

      case 'add-residential':
        return <AddProperty initialType={PropertyType.Residential} onSave={handleSaveProperty} onCancel={() => setView('list')} />;
      case 'add-land':
        return <AddProperty initialType={PropertyType.Land} onSave={handleSaveProperty} onCancel={() => setView('list')} />;
      case 'detail':
        if (!selectedProperty) return null;
        return <ViewProperty property={selectedProperty} onBack={() => { setSelectedProperty(null); setView('list'); }} />;
      default:
        return <div>Not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navigation currentView={view} setView={setView} filter={filter} setFilter={setFilter} isMobileOpen={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)} user={currentUser} onLogout={() => { localStorage.clear(); setCurrentUser(null); }} />
      <div className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-40 border-b border-gray-100">
        <h1 className="text-lg font-black text-primary-700 flex items-center gap-2"><Building2 size={20} />الوسيط</h1>
        <div className="flex gap-2">
          {currentUser.permissions.canManageUsers && (
            <button onClick={() => setView('admin')} className="p-2 bg-gray-50 rounded-xl text-primary-600"><ShieldCheck size={18} /></button>
          )}
          {currentUser.role !== UserRole.Viewer && (
            <button onClick={() => setView('marketing')} className="p-2 bg-orange-50 rounded-xl text-orange-600"><Share2 size={18} /></button>
          )}
          {currentUser.permissions.canAdd && (
            <button onClick={() => setView('select-type')} className="p-2 bg-primary-600 rounded-xl text-white"><Plus size={18} /></button>
          )}
          <button onClick={() => setCurrentUser(null)} className="p-2 bg-red-50 rounded-xl text-red-600"><LogOut size={18} /></button>
        </div>
      </div>
      <main className="min-h-screen">{renderContent()}</main>
    </div>
  );
}

export default App;
