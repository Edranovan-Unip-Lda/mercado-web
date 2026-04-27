import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Vendor, VendorStatus } from '../../core/models';
import { AuthMockService } from '../../core/services/auth-mock.service';
import { MarketMockService } from '../../core/services/market-mock.service';
import { VendorMockService } from '../../core/services/vendor-mock.service';
import { businessCategories, municipalities } from '../../mock-data/reference-data';
import { statusSeverity } from '../../shared/ui-utils';

@Component({
  selector: 'app-vendor-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TagModule,
    TooltipModule
  ],
  template: `
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="page-title">Vendor List</h1>
        <p class="text-sm text-slate-500">Search, filter, review, and process market vendor records.</p>
      </div>
      <button pButton type="button" routerLink="/vendors/new" label="New Registration" icon="pi pi-user-plus" [disabled]="auth.isReadOnly()"></button>
    </div>

    <p-card>
      <div class="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <p-iconField iconPosition="left" class="xl:col-span-2">
          <p-inputIcon styleClass="pi pi-search"></p-inputIcon>
          <input pInputText placeholder="Global search" class="w-full" (input)="filterGlobal($event, dt)" />
        </p-iconField>
        <p-select [options]="municipalityOptions" placeholder="Municipality" [showClear]="true" (ngModelChange)="dt.filter($event, 'municipality', 'equals')" ngModel></p-select>
        <p-select [options]="marketOptions()" optionLabel="name" optionValue="name" placeholder="Market" [showClear]="true" (ngModelChange)="filterMarket($event)" ngModel></p-select>
        <p-select [options]="genderOptions" placeholder="Gender" [showClear]="true" (ngModelChange)="dt.filter($event, 'gender', 'equals')" ngModel></p-select>
        <p-select [options]="statusOptions" placeholder="Status" [showClear]="true" (ngModelChange)="dt.filter($event, 'status', 'equals')" ngModel></p-select>
      </div>
      <div class="mb-4">
        <p-select [options]="businessOptions" placeholder="Business category" [showClear]="true" class="w-full md:w-80" (ngModelChange)="filterBusiness($event)" ngModel></p-select>
      </div>

      <p-table
        #dt
        [value]="vendorRows()"
        dataKey="id"
        [paginator]="true"
        [rows]="10"
        [rowsPerPageOptions]="[10, 20, 50]"
        [globalFilterFields]="['fullName', 'registrationNumber', 'documentNumber', 'municipality', 'business.category', 'status']"
        responsiveLayout="scroll"
      >
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="fullName">Vendor <p-sortIcon field="fullName"></p-sortIcon></th>
            <th>Registration No.</th>
            <th pSortableColumn="municipality">Municipality <p-sortIcon field="municipality"></p-sortIcon></th>
            <th>Business</th>
            <th>Status</th>
            <th class="w-72">Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-vendor>
          <tr>
            <td>
              <div class="font-semibold text-slate-950">{{ vendor.fullName }}</div>
              <div class="text-xs text-slate-500">{{ vendor.gender }} · {{ vendor.phone }}</div>
            </td>
            <td>{{ vendor.registrationNumber || 'Not generated' }}</td>
            <td>{{ vendor.municipality }}</td>
            <td>{{ vendor.business.category }}</td>
            <td><p-tag [value]="vendor.status" [severity]="severity(vendor.status)"></p-tag></td>
            <td>
              <div class="flex flex-wrap gap-2">
                <a pButton [routerLink]="['/vendors', vendor.id]" icon="pi pi-eye" label="View" size="small" outlined></a>
                <button pButton type="button" [routerLink]="['/vendors', vendor.id, 'edit']" icon="pi pi-pencil" label="Edit" size="small" severity="secondary" outlined [disabled]="!canEdit(vendor)"></button>
                <button pButton type="button" icon="pi pi-send" label="Submit" size="small" severity="info" outlined [disabled]="vendor.status !== 'Draft' || !auth.canEditVendor()" (click)="submit(vendor)"></button>
                <button pButton type="button" icon="pi pi-check" label="Approve" size="small" severity="success" outlined [disabled]="!auth.canApprove() || vendor.status === 'Approved'" (click)="approveQuick(vendor)"></button>
                <button pButton type="button" icon="pi pi-id-card" label="ID" size="small" severity="help" outlined [routerLink]="['/vendors', vendor.id, 'id-card']" [disabled]="vendor.status !== 'Approved'"></button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6" class="py-8 text-center text-slate-500">No vendors match the current filters.</td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `
})
export class VendorListComponent {
  readonly municipalityOptions = municipalities;
  readonly businessOptions = businessCategories;
  readonly genderOptions = ['Female', 'Male', 'Other'];
  readonly statusOptions: VendorStatus[] = ['Draft', 'Submitted', 'Pending Verification', 'Approved', 'Rejected', 'Needs Correction', 'Inactive'];
  readonly selectedMarket = signal<string | null>(null);
  readonly selectedBusiness = signal<string | null>(null);
  readonly marketOptions = computed(() => this.markets.markets().map((market) => ({ name: market.name, id: market.id })));
  readonly vendorRows = computed(() => {
    const marketName = this.selectedMarket();
    const market = this.markets.markets().find((item) => item.name === marketName);
    return this.vendors.vendors().filter((vendor) => {
      const businessMatch = !this.selectedBusiness() || vendor.business.category === this.selectedBusiness();
      const marketMatch = !market || vendor.verification.assignedMarketId === market.id || vendor.municipality === market.municipality;
      return businessMatch && marketMatch;
    });
  });
  readonly severity = statusSeverity;

  constructor(
    readonly auth: AuthMockService,
    private readonly vendors: VendorMockService,
    private readonly markets: MarketMockService,
    private readonly messages: MessageService,
    private readonly confirmations: ConfirmationService
  ) {}

  filterGlobal(event: Event, table: Table): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  filterMarket(marketName: string | null): void {
    this.selectedMarket.set(marketName);
  }

  filterBusiness(category: string | null): void {
    this.selectedBusiness.set(category);
  }

  canEdit(vendor: Vendor): boolean {
    return this.auth.canEditVendor() && !['Approved', 'Inactive'].includes(vendor.status);
  }

  submit(vendor: Vendor): void {
    this.vendors.submit(vendor.id, this.auth.currentUser()?.fullName);
    this.messages.add({ severity: 'success', summary: 'Submitted', detail: `${vendor.fullName} is now in the approval queue.` });
  }

  approveQuick(vendor: Vendor): void {
    this.confirmations.confirm({
      header: 'Quick approve vendor',
      message: 'This will approve using the first available stall in the vendor municipality. For full assignment use Approval Queue.',
      acceptLabel: 'Approve',
      accept: () => {
        const market = this.markets.markets().find((item) => item.municipality === vendor.municipality) ?? this.markets.markets()[0];
        this.messages.add({ severity: 'info', summary: 'Use Approval Queue', detail: `Open Approval Queue to assign a specific stall in ${market.name}.` });
      }
    });
  }
}
