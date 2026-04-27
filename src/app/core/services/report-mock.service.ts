import { Injectable } from '@angular/core';
import { Vendor } from '../models';

@Injectable({ providedIn: 'root' })
export class ReportMockService {
  groupBy(vendors: Vendor[], field: 'municipality' | 'gender' | 'status'): { label: string; value: number }[] {
    const counts = vendors.reduce<Record<string, number>>((acc, vendor) => {
      const key = vendor[field];
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }

  groupByBusiness(vendors: Vendor[]): { label: string; value: number }[] {
    const counts = vendors.reduce<Record<string, number>>((acc, vendor) => {
      acc[vendor.business.category] = (acc[vendor.business.category] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }
}
