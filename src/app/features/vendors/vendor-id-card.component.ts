import { Component, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MarketMockService } from '../../core/services/market-mock.service';
import { StallMockService } from '../../core/services/stall-mock.service';
import { VendorMockService } from '../../core/services/vendor-mock.service';

@Component({
  selector: 'app-vendor-id-card',
  standalone: true,
  imports: [RouterLink, ButtonModule, CardModule],
  template: `
    @if (vendor(); as vendor) {
      <div class="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="page-title">Vendor ID Card Preview</h1>
          <p class="text-sm text-slate-500">Printable mock ID card for approved vendors.</p>
        </div>
        <div class="flex gap-2">
          <a pButton [routerLink]="['/vendors', vendor.id]" label="Back to Profile" icon="pi pi-arrow-left" severity="secondary" outlined></a>
          <button pButton type="button" label="Print" icon="pi pi-print" (click)="print()"></button>
          <button pButton type="button" label="Export PDF" icon="pi pi-file-pdf" severity="secondary" (click)="mockPdf()"></button>
        </div>
      </div>

      <div class="flex justify-center">
        <div class="w-full max-w-[420px] rounded-lg border border-slate-300 bg-white p-5 shadow-sm">
          <div class="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-md bg-ministry-700 font-bold text-white">TL</div>
              <div>
                <div class="text-xs font-semibold uppercase text-slate-500">Government / Ministry Placeholder</div>
                <div class="font-bold text-slate-950">SIM-Merkadu TL</div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-[112px_1fr] gap-4">
            <div class="flex h-32 w-28 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-3xl font-bold text-slate-400">
              {{ initials(vendor.fullName) }}
            </div>
            <div class="text-sm">
              <div class="text-xs font-semibold uppercase text-slate-500">Vendor Name</div>
              <div class="mb-2 text-lg font-bold text-slate-950">{{ vendor.fullName }}</div>
              <div class="text-xs font-semibold uppercase text-slate-500">Registration Number</div>
              <div class="mb-2 font-semibold">{{ vendor.registrationNumber }}</div>
              <div class="text-xs font-semibold uppercase text-slate-500">Business Category</div>
              <div>{{ vendor.business.category }}</div>
            </div>
          </div>
          <div class="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div><span class="block text-xs font-semibold uppercase text-slate-500">Market</span>{{ marketName() }}</div>
            <div><span class="block text-xs font-semibold uppercase text-slate-500">Stall/Space</span>{{ stallNumber() }}</div>
            <div><span class="block text-xs font-semibold uppercase text-slate-500">Issue Date</span>{{ issueDate }}</div>
            <div><span class="block text-xs font-semibold uppercase text-slate-500">Renewal Date</span>{{ expiryDate }}</div>
          </div>
          <div class="mt-5 grid grid-cols-[1fr_120px] items-center gap-4">
            <div class="text-xs text-slate-500">This frontend-only MVP displays a placeholder QR. A future backend can sign public verification payloads.</div>
            <div class="flex h-28 w-28 items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-center text-xs font-semibold text-slate-500">
              QR<br />{{ vendor.registrationNumber }}
            </div>
          </div>
        </div>
      </div>
    } @else {
      <p-card><div class="py-8 text-center text-slate-500">Approved vendor not found.</div></p-card>
    }
  `
})
export class VendorIdCardComponent {
  private readonly id: string;
  readonly vendor = computed(() => this.vendors.getById(this.id));
  readonly marketName = computed(() => this.markets.getById(this.vendor()?.verification.assignedMarketId)?.name ?? 'Not assigned');
  readonly stallNumber = computed(() => this.stalls.getById(this.vendor()?.verification.assignedStallId)?.number ?? 'Not assigned');
  readonly issueDate = new Date().toISOString().slice(0, 10);
  readonly expiryDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly vendors: VendorMockService,
    private readonly markets: MarketMockService,
    private readonly stalls: StallMockService,
    private readonly messages: MessageService
  ) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
  }

  print(): void {
    window.print();
  }

  mockPdf(): void {
    this.messages.add({ severity: 'info', summary: 'PDF export', detail: 'PDF export will be implemented later.' });
  }

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  }
}
