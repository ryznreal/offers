
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
import { Plus, Building2, Map, ShieldCheck, Share2 } from './components/Icon';

// مفاتيح التخزين المحلي
const STORAGE_KEYS = {
  PROPERTIES: 'realestate_base_properties',
  PROJECTS: 'realestate_projects',
  USERS: 'realestate_users',
  AUTH: 'realestate_auth_user'
};

function App() {
  const [view, setView] = useState<string>('list'); 

  // تحميل البيانات من LocalStorage أو استخدام Mock البيانات كخيار احتياطي
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

  const [properties, setProperties] = useState<Property[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [filter, setFilter] = useState<FilterState>({
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

  // مزامنة البيانات مع التخزين المحلي عند أي تغيير
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(baseProperties));
  }, [baseProperties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  }, [currentUser]);

  const refreshDisplayProperties = useCallback(() => {
    const projectGeneratedProperties: Property[] = [];

    projects.forEach(project => {
      project.models.forEach(model => {
        const assignedUnitsKeys = Object.entries(project.unitMapping)
          .filter(([_, modelId]) => modelId === model.id)
          .map(([key]) => key);

        const hasAvailableUnits = assignedUnitsKeys.some(key => 
          project.unitStatus[key] === UnitAvailability.Available
        );

        if (hasAvailableUnits) {
          projectGeneratedProperties.push({
            id: `SAMPLE-${project.id}-${model.id}`,
            projectId: project.id,
            modelId: model.id,
            type: PropertyType.Residential,
            city: project.city,
            district: project.district,
            developer: project.developer,
            projectName: `${project.name} - ${model.name}`,
            projectDescription: project.description,
            projectBrochureUrl: project.brochureUrl,
            price: model.price,
            unitType: UnitType.Apartment,
            status: project.status,
            rooms: model.rooms,
            bathrooms: model.bathrooms,
            area: model.area,
            finishing: model.finishing,
            createdAt: project.createdAt,
            googleMapUrl: project.googleMapUrl,
            notes: `نموذج ${model.name} بمواصفات خاصة. متوفر حالياً ضمن مشروع ${project.name}.`
          });
        }
      });
    });

    setProperties([...projectGeneratedProperties, ...baseProperties]);
  }, [projects, baseProperties]);

  useEffect(() => {
    refreshDisplayProperties();
  }, [refreshDisplayProperties]);

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

  const handleImportProperties = (newProperties: Property[]) => {
    setBaseProperties(prev => [...newProperties, ...prev]);
    setView('list');
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setView('detail');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleAddUser = (newUser: User) => setUsers(prev => [newUser, ...prev]);
  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) setCurrentUser(updatedUser);
  };
  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('list');
  };

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // إذا لم يكن هناك مستخدم مسجل، اعرض صفحة الدخول
  if (!currentUser) {
    return <Login users={users} onLogin={setCurrentUser} />;
  }

  const renderContent = () => {
    switch (view) {
      case 'list':
        return (
          <ListProperties 
            properties={properties} 
            onSelectProperty={handleSelectProperty}
            filter={filter}
            setFilter={setFilter}
            onOpenFilters={toggleMobileMenu}
          />
        );
      
      case 'admin':
        return (
          <AdminPanel 
            users={users}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onImportProperties={handleImportProperties}
            onBack={() => setView('list')}
          />
        );
      
      case 'projects':
        return (
          <DeveloperProjects 
            projects={projects}
            onSaveProject={handleSaveProject}
            onBack={() => setView('list')}
          />
        );

      case 'marketing':
        return (
          <MarketingPortal 
            projects={projects}
            onUpdateProject={handleSaveProject}
            onBack={() => setView('list')}
          />
        );

      case 'select-type':
        if (!currentUser.permissions.canAdd) {
          alert('ليس لديك صلاحية لإضافة عروض');
          setView('list');
          return null;
        }
        return (
          <div className="flex items-center justify-center min-h-screen p-4 md:pr-[288px] bg-gray-50">
            <div className="max-w-4xl w-full">
              <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">بوابة الإضافة</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button 
                  onClick={() => setView('add-residential')}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 group text-right"
                >
                  <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
                    <Building2 size={32} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">وحدة سكنية</h3>
                  <p className="text-gray-400 text-sm font-bold">إضافة شقة أو فيلا واحدة فقط</p>
                </button>

                <button 
                  onClick={() => setView('projects')}
                  className="bg-primary-600 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border border-primary-700 group text-right text-white"
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                    <Plus size={32} />
                  </div>
                  <h3 className="text-xl font-black mb-2">مشروع مطور</h3>
                  <p className="text-primary-100 text-sm font-bold">إدارة عمارة كاملة بحالات الوحدات</p>
                </button>

                <button 
                  onClick={() => setView('add-land')}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 group text-right"
                >
                  <div className="w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center text-secondary-600 mb-6 group-hover:scale-110 transition-transform">
                    <Map size={32} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">أرض فضاء</h3>
                  <p className="text-gray-400 text-sm font-bold">إضافة عرض أرض للبيع</p>
                </button>
              </div>
              <div className="text-center mt-12">
                <button 
                  onClick={() => setView('list')}
                  className="text-gray-400 font-bold hover:text-gray-600 underline underline-offset-8"
                >
                  رجوع للقائمة
                </button>
              </div>
            </div>
          </div>
        );

      case 'add-residential':
        return (
          <AddProperty 
            initialType={PropertyType.Residential} 
            onSave={handleSaveProperty}
            onCancel={() => setView('list')}
          />
        );

      case 'add-land':
        return (
          <AddProperty 
            initialType={PropertyType.Land} 
            onSave={handleSaveProperty}
            onCancel={() => setView('list')}
          />
        );

      case 'detail':
        if (!selectedProperty) return null;
        return (
          <ViewProperty 
            property={selectedProperty}
            onBack={() => setView('list')}
          />
        );

      default:
        return <div>Not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navigation 
        currentView={view} 
        setView={setView} 
        filter={filter}
        setFilter={setFilter}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        user={currentUser}
        onLogout={handleLogout}
      />
      
      <div className="md:hidden bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-40 border-b border-gray-100 no-print">
        <h1 className="text-lg font-black text-primary-700 flex items-center gap-2">
           <Building2 size={20} />
           الوسيط العقاري
        </h1>
        <div className="flex gap-2">
          {currentUser.permissions.canManageUsers && (
            <button onClick={() => setView('admin')} className="p-2 bg-gray-50 rounded-xl text-primary-600">
              <ShieldCheck size={18} />
            </button>
          )}
          <button 
            onClick={() => setView('marketing')}
            className="p-2 bg-orange-50 rounded-xl text-orange-600"
            title="بوابة التسويق"
          >
            <Share2 size={18} />
          </button>
          <button 
            onClick={() => setView('select-type')}
            className="p-2 bg-primary-600 rounded-xl text-white active:scale-90 transition-transform"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <main className="min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
