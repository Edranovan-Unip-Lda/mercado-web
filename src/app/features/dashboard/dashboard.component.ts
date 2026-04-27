import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DashboardMockService } from '../../core/services/dashboard-mock.service';
import { MarketMockService } from '../../core/services/market-mock.service';
import { ReportMockService } from '../../core/services/report-mock.service';
import { StallMockService } from '../../core/services/stall-mock.service';
import { VendorMockService } from '../../core/services/vendor-mock.service';
import { statusSeverity } from '../../shared/ui-utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, BadgeModule, ButtonModule, CardModule, ChartModule, ProgressBarModule, TableModule, TagModule],
  template: `
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="page-title">National Dashboard</h1>
        <p class="text-sm text-slate-500">Phase 1 overview for market vendor registration and selling space availability.</p>
      </div>
      <a pButton routerLink="/vendors/new" label="New Registration" icon="pi pi-user-plus"></a>
    </div>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      @for (metric of dashboard.metrics(); track metric.label) {
        <p-card styleClass="h-full">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-sm font-semibold text-slate-500">{{ metric.label }}</div>
              <div class="mt-2 text-3xl font-bold text-slate-950">{{ metric.value }}</div>
            </div>
            <i [class]="metric.icon + ' text-2xl ' + metric.tone"></i>
          </div>
        </p-card>
      }
    </section>

    <section class="mt-6 grid gap-4 xl:grid-cols-2">
      <p-card header="Vendors by Municipality">
        <p-chart type="bar" [data]="municipalityChart()" [options]="barOptions" height="320"></p-chart>
      </p-card>
      <p-card header="Monthly Registration Trend">
        <p-chart type="line" [data]="monthlyChart()" [options]="barOptions" height="320"></p-chart>
      </p-card>
      <p-card header="Vendors by Business Category">
        <p-chart type="doughnut" [data]="businessChart()" height="320"></p-chart>
      </p-card>
      <p-card header="Application Status Distribution">
        <p-chart type="pie" [data]="statusChart()" height="320"></p-chart>
      </p-card>
    </section>

    <section class="mt-6 grid gap-4 xl:grid-cols-[1fr_0.8fr]">
      <p-card header="Recent Vendor Records">
        <p-table [value]="recentVendors()" [rows]="6" responsiveLayout="scroll">
          <ng-template pTemplate="header">
            <tr>
              <th>Vendor</th>
              <th>Municipality</th>
              <th>Business</th>
              <th>Status</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-vendor>
            <tr>
              <td class="font-semibold">{{ vendor.fullName }}</td>
              <td>{{ vendor.municipality }}</td>
              <td>{{ vendor.business.category }}</td>
              <td><p-tag [value]="vendor.status" [severity]="severity(vendor.status)"></p-tag></td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
      <p-card header="Market Occupancy Snapshot">
        <div class="space-y-4">
          @for (market of marketRows(); track market.name) {
            <div>
              <div class="mb-1 flex justify-between text-sm">
                <span class="font-semibold">{{ market.name }}</span>
                <span>{{ market.occupied }}/{{ market.total }}</span>
              </div>
              <p-progressBar [value]="market.percent" [showValue]="false" styleClass="h-2"></p-progressBar>
            </div>
          }
        </div>
      </p-card>
    </section>
  `
})
export class DashboardComponent {
  readonly severity = statusSeverity;
  readonly recentVendors = computed(() => this.vendors.vendors().slice(0, 8));
  readonly municipalityChart = computed(() => this.chartFromRows(this.reports.groupBy(this.vendors.vendors(), 'municipality'), 'Vendors'));
  readonly businessChart = computed(() => this.chartFromRows(this.reports.groupByBusiness(this.vendors.vendors()), 'Vendors'));
  readonly statusChart = computed(() => this.chartFromRows(this.reports.groupBy(this.vendors.vendors(), 'status'), 'Applications'));
  readonly monthlyChart = computed(() => {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = labels.map((_, index) => this.vendors.vendors().filter((vendor) => new Date(vendor.createdAt).getMonth() === index).length);
    return { labels, datasets: [{ label: 'Registrations', data: counts, borderColor: '#176f63', backgroundColor: 'rgba(31, 138, 120, 0.16)', tension: 0.3, fill: true }] };
  });
  readonly marketRows = computed(() =>
    this.markets.markets().map((market) => {
      const stalls = this.stalls.byMarket(market.id);
      const occupied = stalls.filter((stall) => stall.status === 'Occupied').length;
      return { name: market.name, occupied, total: market.numberOfStalls, percent: Math.round((occupied / market.numberOfStalls) * 100) };
    })
  );
  readonly barOptions = {
    plugins: { legend: { labels: { color: '#374151' } } },
    scales: { x: { ticks: { color: '#6b7280' } }, y: { ticks: { color: '#6b7280' } } }
  };

  constructor(
    readonly dashboard: DashboardMockService,
    private readonly vendors: VendorMockService,
    private readonly markets: MarketMockService,
    private readonly stalls: StallMockService,
    private readonly reports: ReportMockService
  ) {}

  private chartFromRows(rows: { label: string; value: number }[], label: string) {
    return {
      labels: rows.map((row) => row.label),
      datasets: [
        {
          label,
          data: rows.map((row) => row.value),
          backgroundColor: ['#176f63', '#c99a2e', '#2563eb', '#b42318', '#7c3aed', '#0f766e', '#ea580c', '#475569', '#059669', '#be123c', '#0891b2']
        }
      ]
    };
  }
}
