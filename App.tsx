
import React, { useState, useEffect, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { ListProperties } from './views/ListProperties';
import { AddProperty } from './views/AddProperty';
import { ViewProperty } from './views/ViewProperty';
import { AdminPanel } from './views/AdminPanel';
import { DeveloperProjects } from './views/DeveloperProjects';
import { MarketingPortal } from './views/MarketingPortal'; 
import { Login } from './views/Login';
import { TeamManagement } from './views/TeamManagement';
import { Property, PropertyType, FilterState, User, UserRole, Project, UnitType, UnitAvailability } from './types';
import { MOCK_PROPERTIES, MOCK_USERS, MOCK_PROJECTS } from './constants';
import { Plus, Building2, Map, LogOut, Users } from './components/Icon';

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

  // مزامنة البيانات مع التخزين المحلي
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(baseProperties)); }, [baseProperties]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)); }, [users]);
  
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
            projectId: project.id, 
            modelId: model.id, 
            developerId: project.developerId,
            type: PropertyType.Residential,
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

  // دالة تسجيل الخروج المحسنة لضمان العودة لصفحة الدخول
  const handleLogout = () => {
    // ١. مسح الجلسة من التخزين المحلي
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    localStorage.removeItem(STORAGE_KEYS.VIEW);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_PROP);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_PROJ_ID);
    
    // ٢. تصفير الحالات فوراً في الـ React State
    setCurrentUser(null);
    setSelectedProperty(null);
    setSelectedProjectId(null);
    setView('list');
    
    // ٣. إعادة تحميل الصفحة لضمان نظافة البيئة والعودة لصفحة Login
    window.location.reload();
  };

  const handleSaveProject = (project: Project) => {
    const updatedProject = { ...project, developerId: currentUser?.developerId || project.developerId };
    setProjects(prev => {
      const existingIndex = prev.findIndex(p => p.id === project.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = updatedProject;
        return updated;
      }
      return [updatedProject, ...prev];
    });
  };

  const handleSaveProperty = (newProperty: Property) => {
    setBaseProperties(prev => [{ ...newProperty, developerId: currentUser?.developerId }, ...prev]);
    setView('list');
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setView('detail');
  };

  // المكون الأساسي: إذا لم يكن هناك مستخدم، عرض صفحة الدخول
  if (!currentUser) {
    return <Login users={users} onLogin={setCurrentUser} />;
  }

  const developerVisibleProjects = (currentUser.role === UserRole.Admin) 
    ? projects 
    : projects.filter(p => p.developerId === currentUser.developerId);

  const renderContent = () => {
    switch (view) {
      case 'list':
        return <ListProperties properties={properties} onSelectProperty={handleSelectProperty} filter={filter} setFilter={setFilter} onOpenFilters={() => setIsMobileMenuOpen(true)} />;
      case 'admin':
        if (!currentUser.permissions.canManageUsers) { setView('list'); return null; }
        return <AdminPanel developers={[]} users={users} onAddUser={u => setUsers(p => [u, ...p])} onUpdateUser={u => { setUsers(p => p.map(us => us.id === u.id ? u : us)); }} onDeleteUser={id => setUsers(p => p.filter(u => u.id !== id))} onImportProperties={() => {}} onBack={() => setView('list')} />;
      case 'team':
        if (!currentUser.permissions.canManageTeam) { setView('list'); return null; }
        return <TeamManagement currentUser={currentUser} allUsers={users} onAddMember={u => setUsers(p => [u, ...p])} onDeleteMember={id => setUsers(p => p.filter(u => u.id !== id))} onBack={() => setView('list')} />;
      case 'projects':
        if (currentUser.role === UserRole.Agent) { setView('list'); return null; }
        return <DeveloperProjects projects={developerVisibleProjects} onSaveProject={handleSaveProject} onBack={() => setView('list')} externalProjectId={selectedProjectId} onSetExternalProjectId={setSelectedProjectId} />;
      case 'marketing':
        return <MarketingPortal projects={developerVisibleProjects} onUpdateProject={handleSaveProject} onBack={() => setView('list')} externalProjectId={selectedProjectId} onSetExternalProjectId={setSelectedProjectId} />;
      case 'select-type':
        return (
          <div className="flex items-center justify-center min-h-screen p-4 md:pr-[288px] bg-gray-50 text-right">
            <div className="max-w-4xl w-full">
              <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">إضافة عرض جديد</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onClick={() => setView('add-residential')} className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                  <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform"><Building2 size={32} /></div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">وحدة سكنية</h3>
                </button>
                <button onClick={() => setView('projects')} className="bg-primary-600 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border border-primary-700 group text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform"><Plus size={32} /></div>
                  <h3 className="text-xl font-black mb-2">مشروع مطور</h3>
                </button>
                <button onClick={() => setView('add-land')} className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
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
      <Navigation currentView={view} setView={setView} filter={filter} setFilter={setFilter} isMobileOpen={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)} user={currentUser} onLogout={handleLogout} />
      <div className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-40 border-b border-gray-100">
        <h1 className="text-lg font-black text-primary-700 flex items-center gap-2"><Building2 size={20} />الوسيط</h1>
        <div className="flex gap-2">
          {currentUser.permissions.canManageTeam && <button onClick={() => setView('team')} className="p-2 bg-gray-50 rounded-xl text-primary-600"><Users size={18} /></button>}
          <button onClick={handleLogout} className="p-2 bg-red-50 rounded-xl text-red-600" title="تسجيل الخروج"><LogOut size={18} /></button>
        </div>
      </div>
      <main className="min-h-screen">{renderContent()}</main>
    </div>
  );
}

export default App;
