import { Injectable, computed, signal } from '@angular/core';
import { Vendor, VendorStatus } from '../models';
import { buildVendors } from '../../mock-data/mock-data';
import { StallMockService } from './stall-mock.service';

@Injectable({ providedIn: 'root' })
export class VendorMockService {
  readonly vendors = signal<Vendor[]>([]);
  readonly approvalQueue = computed(() =>
    this.vendors().filter((vendor) => ['Submitted', 'Pending Verification', 'Needs Correction'].includes(vendor.status))
  );

  constructor(private readonly stalls: StallMockService) {
    this.vendors.set(buildVendors(this.stalls.stalls()));
  }

  getById(id: string): Vendor | undefined {
    return this.vendors().find((vendor) => vendor.id === id);
  }

  saveDraft(vendor: Vendor): Vendor {
    const now = new Date().toISOString().slice(0, 10);
    const draft: Vendor = {
      ...vendor,
      id: vendor.id || `vendor-${Date.now()}`,
      status: vendor.status || 'Draft',
      createdAt: vendor.createdAt || now,
      updatedAt: now
    };
    this.upsert(draft);
    return draft;
  }

  submit(vendorId: string, actor = 'Registration Officer'): void {
    this.changeStatus(vendorId, 'Submitted', actor, 'Application submitted for review.');
  }

  markNeedsCorrection(vendorId: string, notes: string, actor = 'Municipal Administrator'): void {
    this.changeStatus(vendorId, 'Needs Correction', actor, notes);
  }

  reject(vendorId: string, notes: string, actor = 'Municipal Administrator'): void {
    this.changeStatus(vendorId, 'Rejected', actor, notes);
  }

  inactive(vendorId: string, actor = 'Market Manager'): void {
    this.changeStatus(vendorId, 'Inactive', actor, 'Vendor marked inactive.');
  }

  approve(vendorId: string, marketId: string, section: string, stallId: string, actor = 'Municipal Administrator'): boolean {
    const vendor = this.getById(vendorId);
    if (!vendor) {
      return false;
    }
    const assigned = this.stalls.assign(stallId, vendor.id, vendor.fullName, actor);
    if (!assigned) {
      return false;
    }
    const registrationNumber = vendor.registrationNumber ?? `MCI-TL-${new Date().getFullYear()}-${String(this.vendors().length + 1).padStart(5, '0')}`;
    this.vendors.update((items) =>
      items.map((item) =>
        item.id === vendorId
          ? {
              ...item,
              registrationNumber,
              status: 'Approved',
              active: true,
              verification: {
                ...item.verification,
                reviewingOfficerName: actor,
                officerPosition: 'Approving Officer',
                verificationStatus: 'Verified',
                approvalStatus: 'Approved',
                assignedMunicipality: item.municipality,
                assignedMarketId: marketId,
                assignedMarketSection: section,
                assignedStallId: stallId,
                comments: 'Approved and assigned to market selling space.',
                approvalDate: new Date().toISOString().slice(0, 10)
              },
              statusHistory: [
                {
                  date: new Date().toLocaleString(),
                  status: 'Approved',
                  actor,
                  notes: 'Registration approved. Vendor ID information generated.'
                },
                ...item.statusHistory
              ],
              updatedAt: new Date().toISOString().slice(0, 10)
            }
          : item
      )
    );
    return true;
  }

  private upsert(vendor: Vendor): void {
    this.vendors.update((items) => {
      const exists = items.some((item) => item.id === vendor.id);
      return exists ? items.map((item) => (item.id === vendor.id ? vendor : item)) : [vendor, ...items];
    });
  }

  private changeStatus(vendorId: string, status: VendorStatus, actor: string, notes: string): void {
    this.vendors.update((items) =>
      items.map((item) =>
        item.id === vendorId
          ? {
              ...item,
              status,
              active: status !== 'Inactive',
              verification: { ...item.verification, approvalStatus: status, comments: notes },
              statusHistory: [{ date: new Date().toLocaleString(), status, actor, notes }, ...item.statusHistory],
              updatedAt: new Date().toISOString().slice(0, 10)
            }
          : item
      )
    );
  }
}
