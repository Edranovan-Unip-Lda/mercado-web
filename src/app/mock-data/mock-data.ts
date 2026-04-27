import { AuditLog, Market, MasterDataItem, Stall, User, Vendor, VendorStatus } from '../core/models';
import {
  administrativePosts,
  businessCategories,
  goodsCategories,
  infrastructureNeeds,
  marketSectionNames,
  municipalities,
  roles
} from './reference-data';

const firstNames = [
  'Maria',
  'Joao',
  'Ana',
  'Domingos',
  'Teresa',
  'Manuel',
  'Filomena',
  'Jose',
  'Rosa',
  'Francisco',
  'Natalia',
  'Agostinho',
  'Lucia',
  'Antonio',
  'Beatriz',
  'Luis',
  'Madalena',
  'Pedro',
  'Helena',
  'Mateus'
];

const surnames = [
  'da Costa',
  'Soares',
  'Pereira',
  'Ximenes',
  'Guterres',
  'Belo',
  'Martins',
  'Freitas',
  'Fernandes',
  'Amaral',
  'Santos',
  'Alves',
  'Carvalho',
  'Lopes',
  'Correia'
];

export const markets: Market[] = [
  {
    id: 'mkt-taibesi',
    name: 'Mercado Taibesi',
    municipality: 'Dili',
    administrativePost: 'Cristo Rei',
    address: 'Taibesi, Dili',
    manager: 'Helder Soares',
    numberOfSections: 9,
    numberOfStalls: 28,
    active: true
  },
  {
    id: 'mkt-comoro',
    name: 'Mercado Comoro',
    municipality: 'Dili',
    administrativePost: 'Dom Aleixo',
    address: 'Comoro, Dili',
    manager: 'Maria Pinto',
    numberOfSections: 8,
    numberOfStalls: 22,
    active: true
  },
  {
    id: 'mkt-manleuana',
    name: 'Mercado Manleuana',
    municipality: 'Dili',
    administrativePost: 'Dom Aleixo',
    address: 'Manleuana, Dili',
    manager: 'Carlos Belo',
    numberOfSections: 8,
    numberOfStalls: 20,
    active: true
  },
  {
    id: 'mkt-baucau',
    name: 'Mercado Baucau',
    municipality: 'Baucau',
    administrativePost: 'Baucau',
    address: 'Vila Antiga, Baucau',
    manager: 'Domingas Freitas',
    numberOfSections: 7,
    numberOfStalls: 18,
    active: true
  },
  {
    id: 'mkt-maliana',
    name: 'Mercado Maliana',
    municipality: 'Bobonaro',
    administrativePost: 'Maliana',
    address: 'Centro Maliana',
    manager: 'Afonso Martins',
    numberOfSections: 7,
    numberOfStalls: 16,
    active: true
  },
  {
    id: 'mkt-suai',
    name: 'Mercado Suai',
    municipality: 'Cova Lima',
    administrativePost: 'Suai',
    address: 'Suai Loro, Cova Lima',
    manager: 'Celestina Guterres',
    numberOfSections: 7,
    numberOfStalls: 15,
    active: true
  },
  {
    id: 'mkt-same',
    name: 'Mercado Same',
    municipality: 'Manufahi',
    administrativePost: 'Same',
    address: 'Same Vila',
    manager: 'Rui Amaral',
    numberOfSections: 7,
    numberOfStalls: 14,
    active: true
  },
  {
    id: 'mkt-lospalos',
    name: 'Mercado Lospalos',
    municipality: 'Lautem',
    administrativePost: 'Lospalos',
    address: 'Lospalos Centro',
    manager: 'Isabel Correia',
    numberOfSections: 7,
    numberOfStalls: 14,
    active: true
  },
  {
    id: 'mkt-viqueque',
    name: 'Mercado Viqueque',
    municipality: 'Viqueque',
    administrativePost: 'Viqueque',
    address: 'Viqueque Vila',
    manager: 'Julio Pereira',
    numberOfSections: 7,
    numberOfStalls: 13,
    active: true
  }
];

export function buildStalls(): Stall[] {
  const stalls: Stall[] = [];
  markets.forEach((market) => {
    for (let i = 1; i <= market.numberOfStalls; i += 1) {
      const section = marketSectionNames[(i - 1) % marketSectionNames.length];
      const code = `${market.name.split(' ')[1]?.slice(0, 3).toUpperCase() ?? 'MKT'}-${String(i).padStart(3, '0')}`;
      const mod = i % 17;
      const status = mod === 0 ? 'Under Repair' : mod === 7 ? 'Reserved' : mod === 11 ? 'Inactive' : 'Available';
      stalls.push({
        id: `${market.id}-stall-${i}`,
        marketId: market.id,
        section,
        number: code,
        status,
        history: []
      });
    }
  });
  return stalls;
}

export function buildVendors(stalls: Stall[]): Vendor[] {
  const statuses: VendorStatus[] = [
    'Draft',
    'Submitted',
    'Pending Verification',
    'Approved',
    'Rejected',
    'Needs Correction',
    'Inactive'
  ];
  const vendors: Vendor[] = [];
  for (let i = 0; i < 60; i += 1) {
    const market = markets[i % markets.length];
    const post = administrativePosts[market.municipality][i % administrativePosts[market.municipality].length];
    const status = statuses[i % statuses.length];
    const approved = status === 'Approved';
    const gender = i % 3 === 0 ? 'Male' : 'Female';
    const stall = approved ? stalls.find((item) => item.marketId === market.id && item.status === 'Available') : undefined;
    const id = `vendor-${String(i + 1).padStart(3, '0')}`;
    const fullName = `${firstNames[i % firstNames.length]} ${surnames[i % surnames.length]}`;
    if (stall) {
      stall.status = 'Occupied';
      stall.assignedVendorId = id;
      stall.assignedVendorName = fullName;
      stall.assignmentStartDate = `2025-${String((i % 12) + 1).padStart(2, '0')}-05`;
      stall.history.push({
        vendorId: id,
        vendorName: fullName,
        startDate: stall.assignmentStartDate,
        assignedBy: market.manager
      });
    }
    vendors.push({
      id,
      registrationNumber: approved ? `MCI-TL-2025-${String(i + 1).padStart(5, '0')}` : undefined,
      fullName,
      documentType: i % 2 === 0 ? 'Electoral Card' : 'National ID',
      documentNumber: `TL-${String(900000 + i * 37)}`,
      gender,
      age: 22 + (i % 38),
      dateOfBirth: `${1986 + (i % 20)}-${String((i % 12) + 1).padStart(2, '0')}-14`,
      phone: `77${String(100000 + i * 291).slice(0, 6)}`,
      municipality: market.municipality,
      administrativePost: post,
      suco: `Suco ${post}`,
      aldeia: `Aldeia ${String.fromCharCode(65 + (i % 5))}`,
      address: `${market.municipality}, ${post}, near ${market.name}`,
      status,
      active: status !== 'Inactive',
      business: {
        category: businessCategories[i % businessCategories.length],
        goodsSold: goodsCategories[i % goodsCategories.length],
        previousParticipation: i % 4 !== 0,
        startedInMarket: `${2018 + (i % 7)}-03-01`,
        previousSellingLocation: i % 3 === 0 ? 'Roadside selling area' : market.name,
        estimatedDailySales: i % 3 === 0 ? 'Less than $100' : i % 3 === 1 ? '$100-$300' : 'More than $300',
        infrastructureNeeds: infrastructureNeeds.filter((_, index) => (index + i) % 3 === 0).slice(0, 4),
        remarks: i % 5 === 0 ? 'Needs improved drainage during rainy season.' : ''
      },
      documents: [
        { id: `${id}-photo`, type: 'Photo', fileName: `${id}-photo.jpg`, uploadedAt: '2025-01-12' },
        { id: `${id}-doc`, type: 'Identity Document', fileName: `${id}-identity.pdf`, uploadedAt: '2025-01-12' }
      ],
      declaration: {
        informationTrue: true,
        followRules: true,
        noTransfer: true,
        signatureFileName: `${id}-signature.png`,
        registrationDate: `2025-${String((i % 12) + 1).padStart(2, '0')}-10`
      },
      verification: {
        reviewingOfficerName: approved ? market.manager : i % 2 === 0 ? 'Pending assignment' : 'Lidia Soares',
        officerPosition: approved ? 'Market Manager' : 'Registration Officer',
        verificationStatus: approved ? 'Verified' : status === 'Rejected' ? 'Failed' : 'In Review',
        approvalStatus: status,
        assignedMunicipality: market.municipality,
        assignedMarketId: approved ? market.id : undefined,
        assignedMarketSection: approved ? stall?.section : undefined,
        assignedStallId: approved ? stall?.id : undefined,
        comments: status === 'Rejected' ? 'Identity document did not match application record.' : '',
        approvalDate: approved ? `2025-${String((i % 12) + 1).padStart(2, '0')}-16` : undefined
      },
      statusHistory: [
        { date: `2025-${String((i % 12) + 1).padStart(2, '0')}-10`, status: 'Draft', actor: 'Registration Officer', notes: 'Vendor draft created.' },
        { date: `2025-${String((i % 12) + 1).padStart(2, '0')}-12`, status: status === 'Draft' ? 'Draft' : 'Submitted', actor: 'Registration Officer', notes: 'Application submitted for review.' },
        { date: `2025-${String((i % 12) + 1).padStart(2, '0')}-16`, status, actor: approved ? market.manager : 'Municipal Administrator', notes: `Current status is ${status}.` }
      ],
      createdAt: `2025-${String((i % 12) + 1).padStart(2, '0')}-10`,
      updatedAt: `2025-${String((i % 12) + 1).padStart(2, '0')}-16`
    });
  }
  return vendors;
}

export const mockUsers: User[] = [
  {
    id: 'user-admin',
    fullName: 'Marta da Silva',
    username: 'admin',
    role: 'System Administrator',
    municipality: 'Dili',
    status: 'Active',
    lastLogin: '2026-04-26 08:20'
  },
  {
    id: 'user-national',
    fullName: 'Rui Ximenes',
    username: 'mci.national',
    role: 'MCI National Administrator',
    status: 'Active',
    lastLogin: '2026-04-25 16:44'
  },
  {
    id: 'user-municipal',
    fullName: 'Ana Guterres',
    username: 'municipal.dili',
    role: 'Municipal Administrator',
    municipality: 'Dili',
    status: 'Active',
    lastLogin: '2026-04-24 11:05'
  },
  {
    id: 'user-manager',
    fullName: 'Helder Soares',
    username: 'manager.taibesi',
    role: 'Market Manager',
    municipality: 'Dili',
    assignedMarket: 'Mercado Taibesi',
    status: 'Active',
    lastLogin: '2026-04-26 09:12'
  },
  {
    id: 'user-officer',
    fullName: 'Lidia Soares',
    username: 'officer',
    role: 'Market Officer / Data Entry Officer',
    municipality: 'Dili',
    assignedMarket: 'Mercado Taibesi',
    status: 'Active',
    lastLogin: '2026-04-26 10:31'
  },
  {
    id: 'user-auditor',
    fullName: 'Jose Auditor',
    username: 'auditor',
    role: 'Viewer / Auditor',
    status: 'Active',
    lastLogin: '2026-04-20 14:52'
  }
];

export function buildAuditLogs(): AuditLog[] {
  const actions = [
    'User login',
    'Vendor created',
    'Vendor edited',
    'Vendor submitted',
    'Vendor approved',
    'Vendor rejected',
    'Stall assigned',
    'ID card generated',
    'Master data changed'
  ];
  return Array.from({ length: 80 }, (_, index) => {
    const user = mockUsers[index % mockUsers.length];
    return {
      id: `audit-${index + 1}`,
      dateTime: `2026-04-${String(1 + (index % 26)).padStart(2, '0')} ${String(8 + (index % 9)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}`,
      user: user.fullName,
      role: user.role,
      action: actions[index % actions.length],
      entityType: index % 3 === 0 ? 'Vendor' : index % 3 === 1 ? 'Market Stall' : 'Master Data',
      entityNameOrId: index % 3 === 0 ? `vendor-${String((index % 60) + 1).padStart(3, '0')}` : markets[index % markets.length].name,
      details: 'Mock event generated for Phase 1 audit traceability.'
    };
  });
}

export function buildMasterData(): Record<string, MasterDataItem[]> {
  return {
    Municipalities: municipalities.map((name, index) => ({ id: `mun-${index}`, name, code: name.slice(0, 3).toUpperCase(), active: true })),
    'Administrative Posts': Object.entries(administrativePosts).flatMap(([group, posts]) =>
      posts.map((name, index) => ({ id: `${group}-${index}`, name, group, active: true }))
    ),
    Sucos: municipalities.map((group, index) => ({ id: `suco-${index}`, name: `Central ${group}`, group, active: true })),
    Markets: markets.map((market) => ({ id: market.id, name: market.name, group: market.municipality, active: market.active })),
    'Market Sections': marketSectionNames.map((name, index) => ({ id: `section-${index}`, name, active: true })),
    'Business Categories': businessCategories.map((name, index) => ({ id: `business-${index}`, name, active: true })),
    'Goods Categories': goodsCategories.map((name, index) => ({ id: `goods-${index}`, name, active: true })),
    'Infrastructure Need Categories': infrastructureNeeds.map((name, index) => ({ id: `need-${index}`, name, active: true })),
    'Registration Statuses': ['Draft', 'Submitted', 'Pending Verification', 'Approved', 'Rejected', 'Needs Correction', 'Inactive'].map((name, index) => ({ id: `status-${index}`, name, active: true })),
    'User Roles': roles.map((role, index) => ({ id: `role-${index}`, name: role.name, active: true }))
  };
}
