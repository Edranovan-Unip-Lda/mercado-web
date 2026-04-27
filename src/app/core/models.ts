export type RoleName =
  | 'System Administrator'
  | 'MCI National Administrator'
  | 'Municipal Administrator'
  | 'Market Manager'
  | 'Market Officer / Data Entry Officer'
  | 'Viewer / Auditor';

export type VendorStatus =
  | 'Draft'
  | 'Submitted'
  | 'Pending Verification'
  | 'Approved'
  | 'Rejected'
  | 'Needs Correction'
  | 'Inactive';

export type Gender = 'Female' | 'Male' | 'Other';
export type StallStatus = 'Available' | 'Occupied' | 'Reserved' | 'Under Repair' | 'Inactive';

export interface Role {
  name: RoleName;
  permissions: string[];
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  role: RoleName;
  municipality?: string;
  assignedMarket?: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export interface StatusHistoryItem {
  date: string;
  status: VendorStatus;
  actor: string;
  notes: string;
}

export interface VendorDocument {
  id: string;
  type: 'Photo' | 'Identity Document' | 'Signature' | 'Other';
  fileName: string;
  uploadedAt: string;
}

export interface VendorBusiness {
  category: string;
  goodsSold: string;
  otherBusinessType?: string;
  previousParticipation: boolean;
  startedInMarket: string;
  previousSellingLocation: string;
  estimatedDailySales: 'Less than $100' | '$100-$300' | 'More than $300';
  infrastructureNeeds: string[];
  remarks?: string;
}

export interface VendorDeclaration {
  informationTrue: boolean;
  followRules: boolean;
  noTransfer: boolean;
  signatureFileName?: string;
  registrationDate: string;
}

export interface VendorVerification {
  reviewingOfficerName?: string;
  officerPosition?: string;
  verificationStatus?: 'Not Started' | 'In Review' | 'Verified' | 'Failed';
  approvalStatus?: VendorStatus;
  assignedMunicipality?: string;
  assignedMarketId?: string;
  assignedMarketSection?: string;
  assignedStallId?: string;
  comments?: string;
  approvalDate?: string;
}

export interface Vendor {
  id: string;
  registrationNumber?: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  gender: Gender;
  age: number;
  dateOfBirth: string;
  phone: string;
  municipality: string;
  administrativePost: string;
  suco: string;
  aldeia: string;
  address: string;
  status: VendorStatus;
  active: boolean;
  business: VendorBusiness;
  documents: VendorDocument[];
  declaration: VendorDeclaration;
  verification: VendorVerification;
  statusHistory: StatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Market {
  id: string;
  name: string;
  municipality: string;
  administrativePost: string;
  address: string;
  manager: string;
  numberOfSections: number;
  numberOfStalls: number;
  active: boolean;
}

export interface MarketSection {
  id: string;
  name: string;
  marketId: string;
}

export interface StallAssignment {
  vendorId: string;
  vendorName: string;
  startDate: string;
  endDate?: string;
  assignedBy: string;
}

export interface Stall {
  id: string;
  marketId: string;
  section: string;
  number: string;
  status: StallStatus;
  assignedVendorId?: string;
  assignedVendorName?: string;
  assignmentStartDate?: string;
  history: StallAssignment[];
}

export interface AuditLog {
  id: string;
  dateTime: string;
  user: string;
  role: RoleName;
  action: string;
  entityType: string;
  entityNameOrId: string;
  details: string;
}

export interface DashboardMetric {
  label: string;
  value: number;
  icon: string;
  tone: string;
}

export interface ReportFilter {
  dateRange?: Date[];
  municipality?: string;
  marketId?: string;
  businessCategory?: string;
  status?: VendorStatus;
}

export interface MasterDataItem {
  id: string;
  name: string;
  code?: string;
  group?: string;
  active: boolean;
}

export interface AppSettings {
  systemName: string;
  registrationPrefix: string;
  defaultLanguage: 'English' | 'Tetum' | 'Portuguese';
  idExpiryPeriodMonths: number;
  enableFormVersioning: boolean;
  currentFormVersion: string;
  qrPublicInfo: string[];
}
