import { AppSettings, Role } from '../core/models';

export const municipalities = [
  'Aileu',
  'Ainaro',
  'Baucau',
  'Bobonaro',
  'Cova Lima',
  'Dili',
  'Ermera',
  'Lautem',
  'Liquica',
  'Manatuto',
  'Manufahi',
  'Oecusse',
  'Viqueque'
];

export const administrativePosts: Record<string, string[]> = {
  Aileu: ['Aileu Vila', 'Laulara', 'Lequidoe', 'Remexio'],
  Ainaro: ['Ainaro', 'Hato-Udo', 'Hatu-Builico', 'Maubisse'],
  Baucau: ['Baucau', 'Laga', 'Vemasse', 'Venilale'],
  Bobonaro: ['Maliana', 'Balibo', 'Atabae', 'Cailaco'],
  'Cova Lima': ['Suai', 'Tilomar', 'Fatululic', 'Fohorem'],
  Dili: ['Cristo Rei', 'Dom Aleixo', 'Nain Feto', 'Vera Cruz'],
  Ermera: ['Ermera', 'Gleno', 'Atsabe', 'Railaco'],
  Lautem: ['Lospalos', 'Lautem', 'Iliomar', 'Luro'],
  Liquica: ['Liquica', 'Bazartete', 'Maubara'],
  Manatuto: ['Manatuto', 'Laclubar', 'Laleia', 'Soibada'],
  Manufahi: ['Same', 'Alas', 'Fatuberliu', 'Turiscai'],
  Oecusse: ['Pante Macassar', 'Nitibe', 'Oesilo', 'Passabe'],
  Viqueque: ['Viqueque', 'Ossu', 'Uato-Lari', 'Watulari']
};

export const marketSectionNames = [
  'Vegetables',
  'Fruits',
  'Fish and Meat',
  'Prepared Food',
  'Clothes and Accessories',
  'Household Goods',
  'Electronics',
  'Kiosk',
  'Mobile Vendor Area'
];

export const businessCategories = [
  'Basic Products',
  'Vegetables and Fruits',
  'Meat, Chicken and Fish',
  'Clothes and Accessories',
  'Household Goods',
  'Prepared Food and Drinks',
  'Electronics',
  'Kiosk/Stall',
  'Mobile/Street Vendor',
  'Restaurant',
  'Other'
];

export const goodsCategories = [
  'Rice and cooking oil',
  'Leafy vegetables',
  'Tropical fruits',
  'Fresh fish',
  'Chicken and eggs',
  'Traditional food',
  'Textiles',
  'Household supplies',
  'Mobile accessories',
  'Coffee and snacks'
];

export const infrastructureNeeds = [
  'Water',
  'Electricity',
  'Drainage',
  'Storage',
  'Cold storage',
  'Waste collection',
  'Table/stall/kiosk',
  'Security',
  'Sanitation/toilet access'
];

export const roles: Role[] = [
  {
    name: 'System Administrator',
    permissions: ['Configure system settings', 'Manage all users', 'Manage master data', 'View audit logs']
  },
  {
    name: 'MCI National Administrator',
    permissions: ['View national dashboards', 'View all vendors', 'Approve national reports', 'Export reports']
  },
  {
    name: 'Municipal Administrator',
    permissions: ['Approve or reject registrations', 'Manage municipal users', 'Review municipal reports']
  },
  {
    name: 'Market Manager',
    permissions: ['Review applications', 'Assign stalls', 'Manage market spaces', 'Generate ID cards']
  },
  {
    name: 'Market Officer / Data Entry Officer',
    permissions: ['Create vendor drafts', 'Edit drafts', 'Submit applications', 'View assigned market data']
  },
  {
    name: 'Viewer / Auditor',
    permissions: ['Read-only access', 'View audit logs', 'View reports']
  }
];

export const defaultSettings: AppSettings = {
  systemName: 'SIM-Merkadu TL',
  registrationPrefix: 'MCI-TL',
  defaultLanguage: 'English',
  idExpiryPeriodMonths: 12,
  enableFormVersioning: true,
  currentFormVersion: 'Phase 1 Form v1.0',
  qrPublicInfo: ['Vendor name', 'Registration number', 'Market', 'Status']
};
