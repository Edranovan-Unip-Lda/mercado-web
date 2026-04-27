import { NgClass } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { Stall } from '../../core/models';
import { AuthMockService } from '../../core/services/auth-mock.service';
import { MarketMockService } from '../../core/services/market-mock.service';
import { StallMockService } from '../../core/services/stall-mock.service';
import { VendorMockService } from '../../core/services/vendor-mock.service';
import { marketSectionNames } from '../../mock-data/reference-data';
import { stallStatusClass } from '../../shared/ui-utils';

@Component({
  selector: 'app-stall-assignment',
  standalone: true,
  imports: [NgClass, FormsModule, ButtonModule, CardModule, DialogModule, SelectModule, TagModule],
  template: `
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="page-title">Market Sections and Stall Assignment</h1>
        <p class="text-sm text-slate-500">Select a market, inspect stall availability, and assign approved vendors to open spaces.</p>
      </div>
      <p-select [options]="markets.markets()" optionLabel="name" optionValue="id" [(ngModel)]="selectedMarketId" class="w-80"></p-select>
    </div>

    <section class="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      @for (item of statusSummary(); track item.status) {
        <div class="app-card p-4">
          <div class="text-sm font-semibold text-slate-500">{{ item.status }}</div>
          <div class="mt-1 text-2xl font-bold">{{ item.count }}</div>
        </div>
      }
    </section>

    <p-card>
      @for (section of sections; track section) {
        <section class="mb-6">
          <h2 class="mb-3 text-lg font-bold text-slate-950">{{ section }}</h2>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
            @for (stall of stallsBySection(section); track stall.id) {
              <button
                type="button"
                class="min-h-24 rounded-md border p-3 text-left transition hover:shadow-sm"
                [ngClass]="stallClass(stall.status)"
                (click)="open(stall)"
              >
                <div class="font-bold">{{ stall.number }}</div>
                <div class="text-xs">{{ stall.status }}</div>
                @if (stall.assignedVendorName) {
                  <div class="mt-2 truncate text-xs font-semibold">{{ stall.assignedVendorName }}</div>
                }
              </button>
            }
          </div>
        </section>
      }
    </p-card>

    <p-dialog header="Stall / Selling Space Detail" [(visible)]="dialogOpen" [modal]="true" [style]="{ width: 'min(640px, 96vw)' }">
      @if (selected(); as stall) {
        <div class="space-y-4">
          <div class="grid gap-3 md:grid-cols-2">
            <div><span class="field-label">Stall number</span><strong>{{ stall.number }}</strong></div>
            <div><span class="field-label">Section</span><strong>{{ stall.section }}</strong></div>
            <div><span class="field-label">Status</span><p-tag [value]="stall.status"></p-tag></div>
            <div><span class="field-label">Assigned vendor</span><strong>{{ stall.assignedVendorName || 'Not assigned' }}</strong></div>
            <div><span class="field-label">Assignment start date</span><strong>{{ stall.assignmentStartDate || 'Not assigned' }}</strong></div>
          </div>
          @if (stall.status !== 'Occupied') {
            <div>
              <label class="field-label">Assign approved vendor</label>
              <p-select [options]="approvedVendorOptions()" optionLabel="fullName" optionValue="id" [(ngModel)]="selectedVendorId" class="w-full"></p-select>
            </div>
            <button pButton type="button" label="Assign Stall" icon="pi pi-check" [disabled]="!selectedVendorId || !auth.canApprove()" (click)="assign(stall)"></button>
          } @else {
            <div class="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
              This occupied stall must be released before it can be assigned to another vendor.
            </div>
            <button pButton type="button" label="Release Stall" icon="pi pi-lock-open" severity="secondary" [disabled]="!auth.canApprove()" (click)="release(stall)"></button>
          }
          <div>
            <h3 class="mb-2 font-bold">Assignment history</h3>
            <div class="space-y-2">
              @for (entry of stall.history; track entry.startDate + entry.vendorId) {
                <div class="rounded-md border border-slate-200 p-3 text-sm">
                  <strong>{{ entry.vendorName }}</strong> assigned by {{ entry.assignedBy }} on {{ entry.startDate }}
                </div>
              } @empty {
                <div class="text-sm text-slate-500">No assignment history recorded for this space.</div>
              }
            </div>
          </div>
        </div>
      }
    </p-dialog>
  `
})
export class StallAssignmentComponent {
  selectedMarketId = '';
  selectedVendorId = '';
  readonly sections = marketSectionNames;
  readonly selected = signal<Stall | null>(null);
  readonly dialogOpen = signal(false);
  readonly statusSummary = computed(() => {
    const statuses = ['Available', 'Occupied', 'Reserved', 'Under Repair', 'Inactive'];
    const stalls = this.currentStalls();
    return statuses.map((status) => ({ status, count: stalls.filter((stall) => stall.status === status).length }));
  });

  constructor(
    readonly markets: MarketMockService,
    private readonly stalls: StallMockService,
    private readonly vendors: VendorMockService,
    readonly auth: AuthMockService,
    private readonly messages: MessageService
  ) {
    this.selectedMarketId = this.markets.markets()[0]?.id ?? '';
  }

  currentStalls(): Stall[] {
    return this.stalls.byMarket(this.selectedMarketId);
  }

  stallsBySection(section: string): Stall[] {
    return this.currentStalls().filter((stall) => stall.section === section);
  }

  stallClass(status: Stall['status']): string {
    return stallStatusClass(status);
  }

  open(stall: Stall): void {
    this.selected.set(stall);
    this.selectedVendorId = '';
    this.dialogOpen.set(true);
  }

  approvedVendorOptions() {
    return this.vendors.vendors().filter((vendor) => vendor.status === 'Approved' && !vendor.verification.assignedStallId);
  }

  assign(stall: Stall): void {
    const vendor = this.vendors.getById(this.selectedVendorId);
    if (!vendor) {
      return;
    }
    const ok = this.stalls.assign(stall.id, vendor.id, vendor.fullName, this.auth.currentUser()?.fullName ?? 'Market Manager');
    if (!ok) {
      this.messages.add({ severity: 'error', summary: 'Cannot assign', detail: 'Occupied stalls must be released first.' });
      return;
    }
    this.messages.add({ severity: 'success', summary: 'Stall assigned', detail: `${stall.number} assigned to ${vendor.fullName}.` });
    this.selected.set(this.stalls.getById(stall.id) ?? null);
  }

  release(stall: Stall): void {
    this.stalls.release(stall.id);
    this.messages.add({ severity: 'info', summary: 'Stall released', detail: `${stall.number} is now available.` });
    this.selected.set(this.stalls.getById(stall.id) ?? null);
  }
}
