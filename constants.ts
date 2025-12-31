
import { Property, PropertyType, Status, UnitType, Finishing, LandUse, User, UserRole, Project, ProjectModel, UnitAvailability } from './types';

// Programmatic Generator for 150 Demo Properties
const generateMockProperties = (): Property[] => {
  const properties: Property[] = [];
  const cities = ['الرياض', 'جدة', 'الدمام', 'الخبر', 'مكة المكرمة', 'المدينة المنورة'];
  const districts = ['الملقا', 'النرجس', 'الياسمين', 'حطين', 'الشاطئ', 'الروضة', 'العزيزية', 'الفيحاء', 'النسيم', 'الرحاب'];
  const developers = ['شركة التطوير الأولى', 'مجموعة الراجحي العقارية', 'بنيان العربية', 'شركة دار الأركان', 'ماجد الفطيم العقارية', 'الأهلي كابيتال العقارية'];

  for (let i = 1; i <= 75; i++) {
    const isLand = i > 40; 
    const city = cities[i % cities.length];
    const district = districts[i % districts.length];
    const developer = developers[i % developers.length];
    
    if (isLand) {
      const landArea = 350 + (i * 8);
      const pricePerMeter = 1800 + (i * 15);
      const totalPrice = landArea * pricePerMeter;
      
      properties.push({
        id: `L-${i}`,
        type: PropertyType.Land,
        city,
        district,
        developer,
        price: totalPrice,
        landArea,
        pricePerMeter,
        totalPrice,
        landUse: i % 3 === 0 ? LandUse.Commercial : (i % 3 === 1 ? LandUse.Residential : LandUse.Investment),
        streetWidth: 15 + (i % 25),
        isCorner: i % 4 === 0,
        investmentAllowed: i % 5 !== 0,
        landNotes: `أرض مميزة بموقع استراتيجي في ${district}.`,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      });
    } else {
      const unitTypes = [UnitType.Apartment, UnitType.Villa, UnitType.Duplex, UnitType.Floor, UnitType.Annex];
      const unitType = unitTypes[i % unitTypes.length];
      const price = 450000 + (i * 25000);
      
      properties.push({
        id: `R-${i}`,
        type: PropertyType.Residential,
        city,
        district,
        developer,
        projectName: `كمبوند ${district} السكني ${i}`,
        price: price,
        status: i % 2 === 0 ? Status.Ready : Status.UnderConstruction,
        unitType,
        rooms: 2 + (i % 5),
        bathrooms: 2 + (i % 3),
        area: 110 + (i * 3),
        floor: String((i % 5) + 1),
        finishing: i % 3 === 0 ? Finishing.Luxury : (i % 3 === 1 ? Finishing.Medium : Finishing.Economic),
        yearBuilt: 2020 + (i % 5),
        notes: `وحدة سكنية بتصميم عصري في حي ${district}.`,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      });
    }
  }
  return properties;
};

export const MOCK_PROPERTIES: Property[] = generateMockProperties();

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'سدير ريزيدنس الفاخر',
    developer: 'بنيان العربية العقارية',
    city: 'الرياض',
    district: 'الملقا',
    googleMapUrl: 'https://maps.google.com/?q=24.8136,46.6153',
    status: Status.Ready,
    floorsCount: 6,
    unitsPerFloor: 4,
    annexCount: 2,
    basementCount: 1,
    models: [
      { id: 'm1', name: 'جناح ملكي (A)', color: 'bg-blue-600', area: 210, price: 1850000, rooms: 5, bathrooms: 4, halls: 2, finishing: Finishing.Luxury, features: ['نظام ذكي كامل', 'موقف قبو خاص', 'بلكونة إطلالة شمالية'] },
      { id: 'm2', name: 'مودرن لايف (B)', color: 'bg-emerald-500', area: 155, price: 1100000, rooms: 3, bathrooms: 3, halls: 1, finishing: Finishing.Medium, features: ['دخول ذكي', 'تكييف مركزي'] }
    ],
    unitMapping: {
      'floor-1-1': 'm1', 'floor-1-2': 'm2', 'floor-1-3': 'm2', 'floor-1-4': 'm1',
      'floor-2-1': 'm1', 'floor-2-2': 'm2', 'floor-2-3': 'm2', 'floor-2-4': 'm1',
      'floor-3-1': 'm1', 'floor-3-2': 'm2', 'floor-3-3': 'm2', 'floor-3-4': 'm1',
      'annex-1': 'm1', 'annex-2': 'm1'
    },
    unitStatus: {
      'floor-1-1': UnitAvailability.Sold, 
      'floor-1-2': UnitAvailability.Available,
      'floor-1-3': UnitAvailability.Available,
      'floor-2-1': UnitAvailability.Reserved,
      'annex-1': UnitAvailability.Available
    },
    unitBookings: {
      'floor-1-1': {
        unitKey: 'floor-1-1', unitNumber: '101', marketerName: 'فهد المسوق', marketerPhone: '0500000001', customerName: 'خالد العميل', customerPhone: '0599999991', type: UnitAvailability.Sold, timestamp: new Date().toISOString(), brokerageFee: 25000, marketerPercentage: 2.5, isExternalMarketer: false
      },
      'floor-2-1': {
        unitKey: 'floor-2-1', unitNumber: '201', marketerName: 'سارة المسوقة', marketerPhone: '0500000002', customerName: 'نورة العميلة', customerPhone: '0599999992', type: UnitAvailability.Reserved, timestamp: new Date().toISOString(), brokerageFee: 15000, marketerPercentage: 1.5, isExternalMarketer: true
      }
    },
    createdAt: new Date().toISOString()
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'U1',
    name: 'admin',
    email: 'admin@alwaseet.com',
    password: '1234', 
    role: UserRole.Admin,
    lastLogin: new Date().toISOString(),
    permissions: {
      canAdd: true, canEdit: true, canDelete: true, canExport: true, canManageUsers: true
    }
  },
  {
    id: 'U2',
    name: 'سارة الوسيطة',
    email: 'sara@alwaseet.com',
    password: 'password',
    role: UserRole.Agent,
    lastLogin: new Date().toISOString(),
    permissions: {
      canAdd: true, canEdit: true, canDelete: false, canExport: true, canManageUsers: false
    }
  }
];

export const CITIES = ['الرياض', 'جدة', 'الدمام', 'الخبر', 'مكة المكرمة', 'المدينة المنورة'];
