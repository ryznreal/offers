
import { Property, PropertyType, Status, UnitType, Finishing, LandUse, User, UserRole, Project, ProjectModel, UnitAvailability } from './types';

const DEVELOPER_TEMPLATES = [
  { id: 'dev-1', name: 'شركة إعمار العقارية', username: 'emaar', key: 'EMAR-100', city: 'الرياض' },
  { id: 'dev-2', name: 'مجموعة الراجحي الاستثمارية', username: 'rajhi', key: 'RAJ-200', city: 'جدة' },
  { id: 'dev-3', name: 'شركة دار الأركان', username: 'arkan', key: 'DAR-300', city: 'مكة المكرمة' },
];

const generateMockUsers = (): User[] => {
  const users: User[] = [
    {
      id: 'admin-0',
      username: 'admin',
      name: 'مدير النظام',
      email: 'admin@system.com',
      role: UserRole.Admin,
      lastLogin: new Date().toISOString(),
      permissions: { canAdd: true, canEdit: true, canDelete: true, canExport: true, canManageUsers: true, canManageTeam: true }
    }
  ];

  DEVELOPER_TEMPLATES.forEach((dev) => {
    // المطور الأساسي
    users.push({
      id: dev.id,
      username: dev.username,
      name: dev.name,
      email: `ceo@${dev.username}.com`,
      role: UserRole.Developer,
      developerId: dev.id,
      developerKey: dev.key,
      lastLogin: new Date().toISOString(),
      permissions: { canAdd: true, canEdit: true, canDelete: true, canExport: true, canManageUsers: false, canManageTeam: true }
    });

    // مدير تسويق
    users.push({
      id: `mkt-${dev.id}`,
      username: `mkt_${dev.username}`,
      name: `مدير تسويق ${dev.name}`,
      email: `marketing@${dev.username}.com`,
      role: UserRole.Marketing,
      developerId: dev.id,
      parentId: dev.id,
      lastLogin: new Date().toISOString(),
      permissions: { canAdd: true, canEdit: true, canDelete: false, canExport: true, canManageUsers: false, canManageTeam: true }
    });

    // مسوقين
    for (let i = 1; i <= 2; i++) {
      users.push({
        id: `agent-${dev.id}-${i}`,
        username: `agent_${i}_${dev.username}`,
        name: `مسوق ${i} - ${dev.name}`,
        email: `agent${i}@${dev.username}.com`,
        role: UserRole.Agent,
        developerId: dev.id,
        parentId: `mkt-${dev.id}`,
        lastLogin: new Date().toISOString(),
        permissions: { canAdd: true, canEdit: true, canDelete: false, canExport: true, canManageUsers: false, canManageTeam: false }
      });
    }
  });

  return users;
};

const generateMockProjects = (): Project[] => {
  const projects: Project[] = [];
  DEVELOPER_TEMPLATES.forEach((dev, devIdx) => {
    for (let pIdx = 1; pIdx <= 2; pIdx++) {
      const projId = `proj-${dev.id}-${pIdx}`;
      projects.push({
        id: projId,
        name: `مشروع ${dev.name} ${pIdx}`,
        developer: dev.name,
        developerId: dev.id,
        description: `مشروع سكني فاخر في مدينة ${dev.city}.`,
        city: dev.city,
        district: ['النرجس', 'الياسمين', 'الملقا'][devIdx % 3],
        status: pIdx === 1 ? Status.Ready : Status.UnderConstruction,
        floorsCount: 4,
        unitsPerFloor: 4,
        annexCount: 1,
        basementCount: 1,
        createdAt: new Date().toISOString(),
        models: [
          { id: `${projId}-m1`, name: 'نموذج رويال', color: 'bg-blue-600', area: 210, price: 1200000, rooms: 5, bathrooms: 4, halls: 2, finishing: Finishing.Luxury, features: ['نظام ذكي'] }
        ],
        unitMapping: { 'floor-1-1': `${projId}-m1` },
        unitStatus: { 'floor-1-1': UnitAvailability.Available },
        unitBookings: {}
      });
    }
  });
  return projects;
};

export const MOCK_USERS = generateMockUsers();
export const MOCK_PROJECTS = generateMockProjects();
export const MOCK_PROPERTIES: Property[] = [];
export const CITIES = ['الرياض', 'جدة', 'الدمام', 'الخبر', 'مكة المكرمة', 'المدينة المنورة'];
