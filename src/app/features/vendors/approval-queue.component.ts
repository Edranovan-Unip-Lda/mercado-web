import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TimelineModule } from 'primeng/timeline';
import { Vendor } from '../../core/models';
import { AuditLogMockService } from '../../core/services/audit-log-mock.service';
import { AuthMockService } from '../../core/services/auth-mock.service';
import { MarketMockService } from '../../core/services/market-mock.service';
import { StallMockService } from '../../core/services/stall-mock.service';
import { VendorMockService } from '../../core/services/vendor-mock.service';
import { marketSectionNames } from '../../mock-data/reference-data';
import { statusSeverity } from '../../shared/ui-utils';

@Component({
  selector: 'app-approval-queue',
  standalone: true,
  imports: [FormsModule, ButtonModule, CardModule, ConfirmDialogModule, DialogModule, SelectModule, TableModule, TagModule, TextareaModule, TimelineModule],
  template: `
    <div class="mb-6">
      <h1 class="page-title">Approval Queue</h1>
      <p class="text-sm text-slate-500">Review submitted records, assign selling spaces, approve, reject, or request corrections.</p>
    </div>

    <p-card>
      <p-table [value]="queue()" [paginator]="true" [rows]="10" responsiveLayout="scroll">
        <ng-template pTemplate="header">
          <tr>
            <th>Vendor</th>
            <th>Municipality</th>
            <th>Business</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-vendor>
          <tr>
            <td class="font-semibold">{{ vendor.fullName }}</td>
            <td>{{ vendor.municipality }}</td>
            <td>{{ vendor.business.category }}</td>
            <td><p-tag [value]="vendor.status" [severity]="severity(vendor.status)"></p-tag></td>
            <td>{{ vendor.updatedAt }}</td>
            <td>
              <div class="flex flex-wrap gap-2">
                <button pButton type="button" label="Quick View" icon="pi pi-eye" size="small" outlined (click)="open(vendor)"></button>
                <button pButton type="button" label="Approve" icon="pi pi-check" size="small" severity="success" [disabled]="!auth.canApprove()" (click)="open(vendor)"></button>
                <button pButton type="button" label="Needs Correction" icon="pi pi-exclamation-triangle" size="small" severity="warn" outlined [disabled]="!auth.canApprove()" (click)="needsCorrection(vendor)"></button>
                <button pButton type="button" label="Reject" icon="pi pi-times" size="small" severity="danger" outlined [disabled]="!auth.canApprove()" (click)="reject(vendor)"></button>
              </div>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="6" class="py-10 text-center text-slate-500">No submitted or pending records are waiting for review.</td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>

    <p-dialog
      header="Review Vendor Application"
      [(visible)]="dialogOpen"
      [modal]="true"
      [style]="{ width: 'min(920px, 96vw)' }"
      [draggable]="false"
    >
      @if (selected(); as vendor) {
        <div class="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          <div class="space-y-4">
            <div class="rounded-md border border-slate-200 p-4">
              <div class="mb-2 flex items-start justify-between gap-3">
                <div>
                  <h2 class="text-xl font-bold text-slate-950">{{ vendor.fullName }}</h2>
                  <p class="text-sm text-slate-500">{{ vendor.documentType }} · {{ vendor.documentNumber }}</p>
                </div>
                <p-tag [value]="vendor.status" [severity]="severity(vendor.status)"></p-tag>
              </div>
              <div class="grid gap-3 text-sm md:grid-cols-2">
                <div><strong>Municipality:</strong> {{ vendor.municipality }}</div>
                <div><strong>Phone:</strong> {{ vendor.phone }}</div>
                <div><strong>Business:</strong> {{ vendor.business.category }}</div>
                <div><strong>Goods:</strong> {{ vendor.business.goodsSold }}</div>
              </div>
            </div>
            <div class="grid gap-3 md:grid-cols-2">
              <div>
                <label class="field-label required">Assign reviewer</label>
                <input class="w-full rounded-md border border-slate-300 p-2" [(ngModel)]="reviewer" />
              </div>
              <div>
                <label class="field-label required">Assigned market</label>
                <p-select [options]="marketOptions()" optionLabel="name" optionValue="id" [(ngModel)]="selectedMarketId" class="w-full"></p-select>
              </div>
              <div>
                <label class="field-label required">Assigned section</label>
                <p-select [options]="sectionOptions" [(ngModel)]="selectedSection" class="w-full"></p-select>
              </div>
              <div>
                <label class="field-label required">Assigned stall/space</label>
                <p-select [options]="availableStalls()" optionLabel="number" optionValue="id" [(ngModel)]="selectedStallId" class="w-full"></p-select>
              </div>
              <div class="md:col-span-2">
                <label class="field-label">Decision notes</label>
                <textarea pTextarea rows="3" [(ngModel)]="decisionNotes" class="w-full"></textarea>
              </div>
            </div>
          </div>
          <div class="rounded-md border border-slate-200 p-4">
            <h3 class="mb-3 font-bold">Status History</h3>
            <p-timeline [value]="vendor.statusHistory">
              <ng-template pTemplate="content" let-item>
                <div class="font-semibold">{{ item.status }}</div>
                <div class="text-xs text-slate-500">{{ item.actor }} · {{ item.date }}</div>
                <p class="text-sm">{{ item.notes }}</p>
              </ng-template>
            </p-timeline>
          </div>
        </div>
      }
      <ng-template pTemplate="footer">
        <button pButton type="button" label="Cancel" severity="secondary" outlined (click)="dialogOpen.set(false)"></button>
        <button pButton type="button" label="Approve Registration" icon="pi pi-check" severity="success" [disabled]="!selectedMarketId || !selectedSection || !selectedStallId" (click)="approve()"></button>
      </ng-template>
    </p-dialog>
  `
})
export class ApprovalQueueComponent {
  readonly queue = computed(() => this.vendors.approvalQueue());
  readonly selected = signal<Vendor | null>(null);
  readonly dialogOpen = signal(false);
  readonly marketOptions = computed(() => this.markets.markets());
  readonly sectionOptions = marketSectionNames;
  readonly severity = statusSeverity;

  selectedMarketId = '';
  selectedSection = '';
  selectedStallId = '';
  reviewer = 'Approving Officer';
  decisionNotes = 'Reviewed and ready for approval.';

  constructor(
    private readonly vendors: VendorMockService,
    private readonly markets: MarketMockService,
    private readonly stalls: StallMockService,
    readonly auth: AuthMockService,
    private readonly messages: MessageService,
    private readonly confirmations: ConfirmationService,
    private readonly audit: AuditLogMockService
  ) {
    this.reviewer = this.auth.currentUser()?.fullName ?? 'Approving Officer';
  }

  open(vendor: Vendor): void {
    this.selected.set(vendor);
    const market = this.markets.markets().find((item) => item.municipality === vendor.municipality) ?? this.markets.markets()[0];
    this.selectedMarketId = market.id;
    this.selectedSection = vendor.business.category.includes('Fish') ? 'Fish and Meat' : marketSectionNames[0];
    this.selectedStallId = this.availableStalls()[0]?.id ?? '';
    this.dialogOpen.set(true);
  }

  availableStalls() {
    return this.selectedMarketId ? this.stalls.byMarket(this.selectedMarketId).filter((stall) => stall.status === 'Available') : [];
  }

  approve(): void {
    const vendor = this.selected();
    if (!vendor) {
      return;
    }
    const ok = this.vendors.approve(vendor.id, this.selectedMarketId, this.selectedSection, this.selectedStallId, this.reviewer);
    if (!ok) {
      this.messages.add({ severity: 'error', summary: 'Stall unavailable', detail: 'Selected stall is already occupied or unavailable.' });
      return;
    }
    this.audit.add('Vendor approved', 'Vendor', vendor.id, this.reviewer, this.auth.currentUser()?.role ?? 'Market Manager', this.decisionNotes);
    this.messages.add({ severity: 'success', summary: 'Vendor approved', detail: 'Registration number and ID card information were generated.' });
    this.dialogOpen.set(false);
  }

  needsCorrection(vendor: Vendor): void {
    this.confirmations.confirm({
      header: 'Request correction',
      message: `Mark ${vendor.fullName} as needing correction?`,
      acceptLabel: 'Mark Needs Correction',
      accept: () => {
        this.vendors.markNeedsCorrection(vendor.id, 'Correction requested by reviewer.', this.auth.currentUser()?.fullName);
        this.messages.add({ severity: 'warn', summary: 'Needs correction', detail: 'Record was returned for correction.' });
      }
    });
  }

  reject(vendor: Vendor): void {
    this.confirmations.confirm({
      header: 'Reject application',
      message: `Reject ${vendor.fullName}'s application?`,
      acceptLabel: 'Reject',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.vendors.reject(vendor.id, 'Application rejected after administrative review.', this.auth.currentUser()?.fullName);
        this.messages.add({ severity: 'error', summary: 'Rejected', detail: 'Application was rejected.' });
      }
    });
  }
}
