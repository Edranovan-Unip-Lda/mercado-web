import { Injectable, computed } from '@angular/core';
import { DashboardMetric } from '../models';
import { MarketMockService } from './market-mock.service';
import { StallMockService } from './stall-mock.service';
import { VendorMockService } from './vendor-mock.service';

@Injectable({ providedIn: 'root' })
export class DashboardMockService {
  readonly metrics = computed<DashboardMetric[]>(() => {
    const vendors = this.vendors.vendors();
    return [
      { label: 'Total Registered Vendors', value: vendors.length, icon: 'pi pi-users', tone: 'text-ministry-700' },
      { label: 'Approved Vendors', value: vendors.filter((item) => item.status === 'Approved').length, icon: 'pi pi-verified', tone: 'text-green-700' },
      { label: 'Pending Applications', value: vendors.filter((item) => ['Submitted', 'Pending Verification'].includes(item.status)).length, icon: 'pi pi-clock', tone: 'text-amber-700' },
      { label: 'Rejected Applications', value: vendors.filter((item) => item.status === 'Rejected').length, icon: 'pi pi-times-circle', tone: 'text-red-700' },
      { label: 'Active Vendors', value: vendors.filter((item) => item.active).length, icon: 'pi pi-id-card', tone: 'text-blue-700' },
      { label: 'Markets Registered', value: this.markets.markets().length, icon: 'pi pi-building-columns', tone: 'text-slate-700' },
      { label: 'Occupied Stalls', value: this.stalls.occupiedCount(), icon: 'pi pi-map-marker', tone: 'text-purple-700' },
      { label: 'Available Stalls', value: this.stalls.availableCount(), icon: 'pi pi-check-square', tone: 'text-emerald-700' }
    ];
  });

  constructor(
    private readonly vendors: VendorMockService,
    private readonly markets: MarketMockService,
    private readonly stalls: StallMockService
  ) {}
}
