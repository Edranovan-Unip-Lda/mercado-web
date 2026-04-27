import { Component, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { TabsModule } from 'primeng/tabs';
import { AuthMockService } from '../../core/services/auth-mock.service';
import { MarketMockService } from '../../core/services/market-mock.service';
import { StallMockService } from '../../core/services/stall-mock.service';
import { VendorMockService } from '../../core/services/vendor-mock.service';
import { statusSeverity } from '../../shared/ui-utils';

@Component({
  selector: 'app-vendor-detail',
  standalone: true,
  imports: [RouterLink, ButtonModule, CardModule, DividerModule, PanelModule, TagModule, TimelineModule, TabsModule],
  template: `
    @if (vendor(); as vendor) {
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="page-title">{{ vendor.fullName }}</h1>
          <p class="text-sm text-slate-500">{{ vendor.registrationNumber || 'Registration number not generated yet' }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <a pButton routerLink="/vendors" label="Back to List" icon="pi pi-arrow-left" severity="secondary" outlined></a>
          <button pButton type="button" [routerLink]="['/vendors', vendor.id, 'edit']" label="Edit" icon="pi pi-pencil" severity="secondary" [disabled]="!auth.canEditVendor() || vendor.status === 'Approved'"></button>
          <button pButton type="button" [routerLink]="['/vendors', vendor.id, 'id-card']" label="Generate ID Card" icon="pi pi-id-card" [disabled]="vendor.status !== 'Approved'"></button>
        </div>
      </div>

      <section class="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <p-card>
          <div class="flex flex-col items-center text-center">
            <div class="mb-4 flex h-32 w-32 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-4xl font-bold text-slate-400">
              {{ initials(vendor.fullName) }}
            </div>
            <h2 class="text-xl font-bold text-slate-950">{{ vendor.fullName }}</h2>
            <p class="text-sm text-slate-500">{{ vendor.business.category }}</p>
            <div class="mt-3"><p-tag [value]="vendor.status" [severity]="severity(vendor.status)"></p-tag></div>
          </div>
          <p-divider></p-divider>
          <div class="grid gap-3 text-sm">
            <div class="flex justify-between gap-3"><span class="text-slate-500">Municipality</span><strong>{{ vendor.municipality }}</strong></div>
            <div class="flex justify-between gap-3"><span class="text-slate-500">Market</span><strong>{{ marketName() }}</strong></div>
            <div class="flex justify-between gap-3"><span class="text-slate-500">Stall/space</span><strong>{{ stallNumber() }}</strong></div>
            <div class="flex justify-between gap-3"><span class="text-slate-500">Phone</span><strong>{{ vendor.phone }}</strong></div>
          </div>
          <div class="mt-5 rounded-md border border-dashed border-slate-300 p-4 text-center text-sm text-slate-500">
            QR code placeholder<br />
            <span class="font-semibold text-slate-700">{{ vendor.registrationNumber || vendor.id }}</span>
          </div>
        </p-card>

        <p-card>
          <p-tabs value="0">
            <p-tablist>
              <p-tab value="0">Vendor Information</p-tab>
              <p-tab value="1">Business</p-tab>
              <p-tab value="2">Documents</p-tab>
              <p-tab value="3">History</p-tab>
            </p-tablist>
            <p-tabpanels>
              <p-tabpanel value="0">
                <div class="grid gap-4 md:grid-cols-2">
                  <p-panel header="Identity">
                    <dl class="space-y-2 text-sm">
                      <div><dt class="font-semibold">Document</dt><dd>{{ vendor.documentType }} · {{ vendor.documentNumber }}</dd></div>
                      <div><dt class="font-semibold">Gender/Age</dt><dd>{{ vendor.gender }} · {{ vendor.age }}</dd></div>
                      <div><dt class="font-semibold">Date of birth</dt><dd>{{ vendor.dateOfBirth }}</dd></div>
                    </dl>
                  </p-panel>
                  <p-panel header="Address">
                    <dl class="space-y-2 text-sm">
                      <div><dt class="font-semibold">Administrative Post</dt><dd>{{ vendor.administrativePost }}</dd></div>
                      <div><dt class="font-semibold">Suco/Aldeia</dt><dd>{{ vendor.suco }} · {{ vendor.aldeia }}</dd></div>
                      <div><dt class="font-semibold">Full address</dt><dd>{{ vendor.address }}</dd></div>
                    </dl>
                  </p-panel>
                </div>
              </p-tabpanel>
              <p-tabpanel value="1">
                <div class="grid gap-4 md:grid-cols-2">
                  <p-panel header="Business Information">
                    <dl class="space-y-2 text-sm">
                      <div><dt class="font-semibold">Category</dt><dd>{{ vendor.business.category }}</dd></div>
                      <div><dt class="font-semibold">Goods sold</dt><dd>{{ vendor.business.goodsSold }}</dd></div>
                      <div><dt class="font-semibold">Daily sales</dt><dd>{{ vendor.business.estimatedDailySales }}</dd></div>
                      <div><dt class="font-semibold">Previous location</dt><dd>{{ vendor.business.previousSellingLocation }}</dd></div>
                    </dl>
                  </p-panel>
                  <p-panel header="Infrastructure Needs">
                    <div class="flex flex-wrap gap-2">
                      @for (need of vendor.business.infrastructureNeeds; track need) {
                        <p-tag [value]="need" severity="info"></p-tag>
                      }
                    </div>
                  </p-panel>
                </div>
              </p-tabpanel>
              <p-tabpanel value="2">
                <div class="grid gap-3 md:grid-cols-2">
                  @for (doc of vendor.documents; track doc.id) {
                    <div class="rounded-md border border-slate-200 p-4">
                      <div class="font-semibold">{{ doc.type }}</div>
                      <div class="text-sm text-slate-500">{{ doc.fileName }}</div>
                      <div class="mt-2 text-xs text-slate-400">Uploaded {{ doc.uploadedAt }}</div>
                    </div>
                  }
                </div>
              </p-tabpanel>
              <p-tabpanel value="3">
                <p-timeline [value]="vendor.statusHistory">
                  <ng-template pTemplate="content" let-item>
                    <div class="font-semibold">{{ item.status }}</div>
                    <div class="text-sm text-slate-500">{{ item.actor }} · {{ item.date }}</div>
                    <p class="text-sm">{{ item.notes }}</p>
                  </ng-template>
                </p-timeline>
              </p-tabpanel>
            </p-tabpanels>
          </p-tabs>
        </p-card>
      </section>
    } @else {
      <p-card>
        <div class="py-10 text-center text-slate-500">Vendor record was not found.</div>
      </p-card>
    }
  `
})
export class VendorDetailComponent {
  private readonly id: string;
  readonly vendor = computed(() => this.vendors.getById(this.id));
  readonly severity = statusSeverity;
  readonly marketName = computed(() => this.markets.getById(this.vendor()?.verification.assignedMarketId)?.name ?? 'Not assigned');
  readonly stallNumber = computed(() => this.stalls.getById(this.vendor()?.verification.assignedStallId)?.number ?? 'Not assigned');

  constructor(
    private readonly route: ActivatedRoute,
    private readonly vendors: VendorMockService,
    private readonly markets: MarketMockService,
    private readonly stalls: StallMockService,
    readonly auth: AuthMockService,
    messages: MessageService
  ) {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    void messages;
  }

  initials(name: string): string {
    return name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }
}
