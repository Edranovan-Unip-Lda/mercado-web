import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MarketMockService } from '../../core/services/market-mock.service';
import { ReportMockService } from '../../core/services/report-mock.service';
import { VendorMockService } from '../../core/services/vendor-mock.service';
import { businessCategories, municipalities } from '../../mock-data/reference-data';
import { statusSeverity } from '../../shared/ui-utils';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule, ButtonModule, CardModule, ChartModule, DatePickerModule, SelectModule, TableModule, TagModule],
  template: `
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="page-title">Reports</h1>
        <p class="text-sm text-slate-500">Filter registration data and preview common Phase 1 report outputs.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button pButton type="button" label="Excel" icon="pi pi-file-excel" severity="success" outlined (click)="mockExport('Excel')"></button>
        <button pButton type="button" label="PDF" icon="pi pi-file-pdf" severity="danger" outlined (click)="mockExport('PDF')"></button>
        <button pButton type="button" label="CSV" icon="pi pi-file" severity="secondary" outlined (click)="mockExport('CSV')"></button>
      </div>
    </div>

    <p-card styleClass="mb-4">
      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <p-datepicker selectionMode="range" [(ngModel)]="dateRange" placeholder="Date range" class="w-full" inputStyleClass="w-full"></p-datepicker>
        <p-select [options]="municipalityOptions" [(ngModel)]="municipality" placeholder="Municipality" [showClear]="true" class="w-full"></p-select>
        <p-select [options]="markets.markets()" optionLabel="name" optionValue="id" [(ngModel)]="marketId" placeholder="Market" [showClear]="true" class="w-full"></p-select>
        <p-select [options]="businessOptions" [(ngModel)]="businessCategory" placeholder="Business category" [showClear]="true" class="w-full"></p-select>
        <p-select [options]="statusOptions" [(ngModel)]="status" placeholder="Status" [showClear]="true" class="w-full"></p-select>
      </div>
    </p-card>

    <section class="grid gap-4 xl:grid-cols-3">
      <p-card header="Vendors by Municipality"><p-chart type="bar" [data]="municipalityChart()" height="260"></p-chart></p-card>
      <p-card header="Vendors by Gender"><p-chart type="doughnut" [data]="genderChart()" height="260"></p-chart></p-card>
      <p-card header="Vendors by Business Category"><p-chart type="pie" [data]="businessChart()" height="260"></p-chart></p-card>
    </section>

    <p-card header="Registered Vendor Report" styleClass="mt-4">
      <p-table [value]="filteredVendors()" [paginator]="true" [rows]="12" responsiveLayout="scroll">
        <ng-template pTemplate="header">
          <tr>
            <th>Vendor</th>
            <th>Municipality</th>
            <th>Market</th>
            <th>Gender</th>
            <th>Business</th>
            <th>Status</th>
            <th>Registered</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-vendor>
          <tr>
            <td class="font-semibold">{{ vendor.fullName }}</td>
            <td>{{ vendor.municipality }}</td>
            <td>{{ marketName(vendor.verification.assignedMarketId) }}</td>
            <td>{{ vendor.gender }}</td>
            <td>{{ vendor.business.category }}</td>
            <td><p-tag [value]="vendor.status" [severity]="severity(vendor.status)"></p-tag></td>
            <td>{{ vendor.declaration.registrationDate }}</td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `
})
export class ReportsComponent {
  dateRange: Date[] | undefined;
  municipality: string | undefined;
  marketId: string | undefined;
  businessCategory: string | undefined;
  status: string | undefined;
  readonly municipalityOptions = municipalities;
  readonly businessOptions = businessCategories;
  readonly statusOptions = ['Draft', 'Submitted', 'Pending Verification', 'Approved', 'Rejected', 'Needs Correction', 'Inactive'];
  readonly severity = statusSeverity;
  readonly filteredVendors = computed(() =>
    this.vendors.vendors().filter((vendor) => {
      const marketMatch = !this.marketId || vendor.verification.assignedMarketId === this.marketId;
      return (
        (!this.municipality || vendor.municipality === this.municipality) &&
        marketMatch &&
        (!this.businessCategory || vendor.business.category === this.businessCategory) &&
        (!this.status || vendor.status === this.status)
      );
    })
  );
  readonly municipalityChart = computed(() => this.chart(this.reports.groupBy(this.filteredVendors(), 'municipality'), 'Vendors'));
  readonly genderChart = computed(() => this.chart(this.reports.groupBy(this.filteredVendors(), 'gender'), 'Vendors'));
  readonly businessChart = computed(() => this.chart(this.reports.groupByBusiness(this.filteredVendors()), 'Vendors'));

  constructor(
    private readonly vendors: VendorMockService,
    readonly markets: MarketMockService,
    private readonly reports: ReportMockService,
    private readonly messages: MessageService
  ) {}

  marketName(id?: string): string {
    return this.markets.getById(id)?.name ?? 'Not assigned';
  }

  mockExport(type: string): void {
    this.messages.add({ severity: 'info', summary: `${type} export`, detail: `${type} export is mocked for this frontend MVP.` });
  }

  private chart(rows: { label: string; value: number }[], label: string) {
    return {
      labels: rows.map((row) => row.label),
      datasets: [{ label, data: rows.map((row) => row.value), backgroundColor: ['#176f63', '#c99a2e', '#2563eb', '#b42318', '#7c3aed', '#0f766e', '#ea580c'] }]
    };
  }
}
