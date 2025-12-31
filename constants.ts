
import { Property, PropertyType, Status, UnitType, Finishing, LandUse, User, UserRole, Project, ProjectModel, UnitAvailability } from './types';

// 1. مصفوفة المطورين (لإنشاء البيانات)
const DEV_COMPANIES = [
  { id: 'dev-1', name: 'إعمار نجد العقارية', key: 'EMAR10', city: 'الرياض' },
  { id: 'dev-2', name: 'شركة رافال للتطوير', key: 'RAFAL20', city: 'الرياض' },
  { id: 'dev-3', name: 'مجموعة الماجدية', key: 'MAJED30', city: 'جدة' },
  { id: 'dev-4', name: 'صروح العمرانية', key: 'SOROUH40', city: 'الدمام' },
  { id: 'dev-5', name: 'دار الأركان', key: 'DAR50', city: 'مكة المكرمة' },
  { id: 'dev-6', name: 'شركة رتال للاستثمار', key: 'RETAL60', city: 'الخبر' },
];

// 2. توليد المستخدمين (مدراء تسويق ومسوقين لكل مطور)
const generateMockUsers = (): User[] => {
  const users: User[] = [
    {
      id: 'admin-0',
      name: 'admin',
      email: 'admin@system.com',
      role: UserRole.Admin,
      lastLogin: new Date().toISOString(),
      permissions: { canAdd: true, canEdit: true, canDelete: true, canExport: true, canManageUsers: true, canManageTeam: true }
    }
  ];

  DEV_COMPANIES.forEach((dev) => {
    // إضافة المطور نفسه
    users.push({
      id: dev.id,
      name: dev.name,
      email: `ceo@${dev.id}.com`,
      role: UserRole.Developer,
      developerId: dev.id,
      developerKey: dev.key,
      lastLogin: new Date().toISOString(),
      permissions: { canAdd: true, canEdit: true, canDelete: true, canExport: true, canManageUsers: false, canManageTeam: true }
    });

    // إضافة مدير تسويق لكل مطور
    users.push({
      id: `mkt-${dev.id}`,
      name: `مدير تسويق ${dev.name}`,
      email: `mkt@${dev.id}.com`,
      role: UserRole.Marketing,
      developerId: dev.id,
      parentId: dev.id,
      lastLogin: new Date().toISOString(),
      permissions: { canAdd: true, canEdit: true, canDelete: false, canExport: true, canManageUsers: false, canManageTeam: true }
    });

    // إضافة مسوقين (٢ لكل مطور)
    for (let i = 1; i <= 2; i++) {
      users.push({
        id: `agent-${dev.id}-${i}`,
        name: `مسوق ${dev.name} ${i}`,
        email: `agent${i}@${dev.id}.com`,
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

// 3. توليد المشاريع
const generateMockProjects = (): Project[] => {
  const projects: Project[] = [];
  
  DEV_COMPANIES.forEach((dev, idx) => {
    // مشروعين لكل مطور
    for (let i = 1; i <= 2; i++) {
      const projId = `p-${dev.id}-${i}`;
      projects.push({
        id: projId,
        name: `مشروع ${dev.name} رقم ${i}`,
        developer: dev.name,
        developerId: dev.id,
        city: dev.city,
        district: ['النرجس', 'الياسمين', 'الشاطئ', 'الروضة'][idx % 4],
        status: i % 2 === 0 ? Status.Ready : Status.UnderConstruction,
        floorsCount: 4 + i,
        unitsPerFloor: 3 + i,
        annexCount: 1,
        basementCount: 1,
        createdAt: new Date().toISOString(),
        unitMapping: {},
        unitStatus: {},
        unitBookings: {},
        models: [
          { id: `${projId}-m1`, name: 'نموذج بريميوم', color: 'bg-blue-600', area: 180, price: 950000 + (idx * 50000), rooms: 4, bathrooms: 3, halls: 1, finishing: Finishing.Luxury, features: ['بلكونة', 'نظام ذكي'] },
          { id: `${projId}-m2`, name: 'نموذج كلاسيك', color: 'bg-emerald-600', area: 140, price: 750000 + (idx * 50000), rooms: 3, bathrooms: 2, halls: 1, finishing: Finishing.Medium, features: ['دخول ذكي'] }
        ]
      });

      // ملء بعض الوحدات للمعاينة
      const lastProj = projects[projects.length - 1];
      lastProj.unitMapping['floor-1-1'] = `${projId}-m1`;
      lastProj.unitMapping['floor-1-2'] = `${projId}-m2`;
      lastProj.unitStatus['floor-1-1'] = UnitAvailability.Available;
      lastProj.unitStatus['floor-1-2'] = UnitAvailability.Reserved;
    }
  });

  return projects;
};

export const MOCK_USERS = generateMockUsers();
export const MOCK_PROJECTS = generateMockProjects();
export const MOCK_PROPERTIES: Property[] = []; // سيبدأ فارغاً ويعبأ من قبل المستخدم أو الاستيراد
export const CITIES = ['الرياض', 'جدة', 'الدمام', 'الخبر', 'مكة المكرمة', 'المدينة المنورة'];
