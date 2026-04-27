import { Injectable, computed, signal } from '@angular/core';
import { Stall } from '../models';
import { buildStalls } from '../../mock-data/mock-data';

@Injectable({ providedIn: 'root' })
export class StallMockService {
  readonly stalls = signal<Stall[]>(buildStalls());
  readonly occupiedCount = computed(() => this.stalls().filter((stall) => stall.status === 'Occupied').length);
  readonly availableCount = computed(() => this.stalls().filter((stall) => stall.status === 'Available').length);

  getById(id?: string): Stall | undefined {
    return this.stalls().find((stall) => stall.id === id);
  }

  byMarket(marketId: string): Stall[] {
    return this.stalls().filter((stall) => stall.marketId === marketId);
  }

  assign(stallId: string, vendorId: string, vendorName: string, assignedBy: string): boolean {
    const stall = this.getById(stallId);
    if (!stall || stall.status === 'Occupied') {
      return false;
    }
    const startDate = new Date().toISOString().slice(0, 10);
    this.stalls.update((items) =>
      items.map((item) =>
        item.id === stallId
          ? {
              ...item,
              status: 'Occupied',
              assignedVendorId: vendorId,
              assignedVendorName: vendorName,
              assignmentStartDate: startDate,
              history: [{ vendorId, vendorName, startDate, assignedBy }, ...item.history]
            }
          : item
      )
    );
    return true;
  }

  release(stallId: string): void {
    this.stalls.update((items) =>
      items.map((item) =>
        item.id === stallId
          ? {
              ...item,
              status: 'Available',
              assignedVendorId: undefined,
              assignedVendorName: undefined,
              assignmentStartDate: undefined
            }
          : item
      )
    );
  }
}
