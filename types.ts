
export enum PropertyType {
  Residential = 'Residential',
  Land = 'Land'
}

export enum Status {
  Ready = 'جاهز',
  UnderConstruction = 'تحت الإنشاء',
  UnderFinishing = 'تحت التشطيب'
}

export enum UnitAvailability {
  Available = 'available',
  Reserved = 'reserved',
  Sold = 'sold'
}

export enum UnitType {
  Apartment = 'شقة',
  Floor = 'دور',
  Annex = 'ملحق',
  Duplex = 'دبلكس',
  Villa = 'فيلا'
}

export enum Finishing {
  Economic = 'اقتصادي',
  Medium = 'متوسط',
  Luxury = 'فاخر'
}

export enum LandUse {
  Residential = 'سكني',
  Commercial = 'تجاري',
  Investment = 'استثماري',
  Mixed = 'مختلط'
}

export interface BookingDetails {
  unitKey: string;
  unitNumber: string;
  marketerName: string;
  marketerPhone: string;
  customerName: string;
  customerPhone: string;
  type: UnitAvailability;
  timestamp: string;
  // الحقول الجديدة
  brokerageFee: number; // قيمة السعي
  marketerPercentage: number; // نسبة المسوق
  isExternalMarketer: boolean; // خارجي أم تابع للشركة
}

export interface Property {
  id: string;
  type: PropertyType;
  city: string;
  district: string;
  developer: string;
  projectName?: string;
  price: number;
  googleMapUrl?: string;
  createdAt: string;
  
  // Project linking
  projectId?: string;
  modelId?: string;
  projectDescription?: string;
  projectBrochureUrl?: string;

  // Residential Specific
  status?: Status;
  unitType?: UnitType;
  rooms?: number;
  bathrooms?: number;
  area?: number; // m2
  floor?: string;
  finishing?: Finishing;
  yearBuilt?: number;
  notes?: string;
  unitNumber?: string;

  // Land Specific
  landArea?: number;
  pricePerMeter?: number;
  totalPrice?: number;
  landWidth?: number;
  landDepth?: number;
  streetWidth?: number;
  isCorner?: boolean;
  landUse?: LandUse;
  investmentAllowed?: boolean;
  landNotes?: string;
}

export interface ProjectModel {
  id: string;
  name: string;
  color: string;
  area: number;
  price: number;
  rooms: number;
  bathrooms: number;
  halls: number;
  finishing: Finishing;
  features: string[];
}

export interface Project {
  id: string;
  name: string;
  developer: string;
  description?: string; // New
  city: string;
  district: string;
  googleMapUrl?: string; // New
  brochureUrl?: string; // New (Data URI or URL)
  status: Status;
  floorsCount: number;
  unitsPerFloor: number;
  annexCount: number;
  basementCount: number;
  
  models: ProjectModel[];
  unitMapping: Record<string, string>;
  unitStatus: Record<string, UnitAvailability>;
  unitBookings: Record<string, BookingDetails>;
  
  createdAt: string;
}

export type SortOrder = 'none' | 'asc' | 'desc';

export interface FilterState {
  search: string;
  type: PropertyType | 'All';
  status: Status | 'All';
  unitType: UnitType | 'All';
  rooms: number | 'All';
  minPrice: number | '';
  maxPrice: number | '';
  city: string;
  sortOrder: SortOrder;
  landUse: LandUse | 'All';
  isCorner: boolean | 'All';
  investmentAllowed: boolean | 'All';
}

export enum UserRole {
  Admin = 'مدير نظام',
  Agent = 'وسيط عقاري',
  Marketing = 'مدير تسويق',
  Viewer = 'مشاهد'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: {
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canExport: boolean;
    canManageUsers: boolean;
  };
  lastLogin: string;
}
