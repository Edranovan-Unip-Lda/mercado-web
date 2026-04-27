import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Market } from '../../core/models';
import { MarketMockService } from '../../core/services/market-mock.service';
import { municipalities } from '../../mock-data/reference-data';

@Component({
  selector: 'app-market-list',
  standalone: true,
  imports: [FormsModule, ButtonModule, CardModule, DialogModule, InputNumberModule, InputTextModule, SelectModule, TableModule, TagModule],
  template: `
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="page-title">Market List</h1>
        <p class="text-sm text-slate-500">Manage market master data for Phase 1 operations.</p>
      </div>
      <button pButton type="button" label="Add Market" icon="pi pi-plus" (click)="newMarket()"></button>
    </div>

    <p-card>
      <p-table [value]="markets.markets()" [paginator]="true" [rows]="10" responsiveLayout="scroll">
        <ng-template pTemplate="header">
          <tr>
            <th>Market name</th>
            <th>Municipality</th>
            <th>Administrative Post</th>
            <th>Manager</th>
            <th>Sections</th>
            <th>Stalls/Spaces</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-market>
          <tr>
            <td class="font-semibold">{{ market.name }}</td>
            <td>{{ market.municipality }}</td>
            <td>{{ market.administrativePost }}</td>
            <td>{{ market.manager }}</td>
            <td>{{ market.numberOfSections }}</td>
            <td>{{ market.numberOfStalls }}</td>
            <td><p-tag [value]="market.active ? 'Active' : 'Inactive'" [severity]="market.active ? 'success' : 'secondary'"></p-tag></td>
            <td><button pButton type="button" label="Edit" icon="pi pi-pencil" size="small" outlined (click)="edit(market)"></button></td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>

    <p-dialog header="Market Details" [(visible)]="dialogOpen" [modal]="true" [style]="{ width: 'min(720px, 96vw)' }">
      @if (draft(); as market) {
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="field-label required">Market name</label>
            <input pInputText [(ngModel)]="market.name" class="w-full" />
          </div>
          <div>
            <label class="field-label required">Municipality</label>
            <p-select [options]="municipalityOptions" [(ngModel)]="market.municipality" class="w-full"></p-select>
          </div>
          <div>
            <label class="field-label">Administrative Post</label>
            <input pInputText [(ngModel)]="market.administrativePost" class="w-full" />
          </div>
          <div>
            <label class="field-label">Market manager</label>
            <input pInputText [(ngModel)]="market.manager" class="w-full" />
          </div>
          <div>
            <label class="field-label">Number of sections</label>
            <p-inputNumber [(ngModel)]="market.numberOfSections" [min]="1" styleClass="w-full"></p-inputNumber>
          </div>
          <div>
            <label class="field-label">Number of stalls/spaces</label>
            <p-inputNumber [(ngModel)]="market.numberOfStalls" [min]="1" styleClass="w-full"></p-inputNumber>
          </div>
          <div class="md:col-span-2">
            <label class="field-label">Address</label>
            <input pInputText [(ngModel)]="market.address" class="w-full" />
          </div>
          <div>
            <label class="field-label">Status</label>
            <p-select [options]="statusOptions" optionLabel="label" optionValue="value" [(ngModel)]="market.active" class="w-full"></p-select>
          </div>
        </div>
      }
      <ng-template pTemplate="footer">
        <button pButton type="button" label="Cancel" severity="secondary" outlined (click)="dialogOpen.set(false)"></button>
        <button pButton type="button" label="Save Market" icon="pi pi-save" (click)="save()"></button>
      </ng-template>
    </p-dialog>
  `
})
export class MarketListComponent {
  readonly municipalityOptions = municipalities;
  readonly statusOptions = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];
  readonly dialogOpen = signal(false);
  readonly draft = signal<Market | null>(null);

  constructor(
    readonly markets: MarketMockService,
    private readonly messages: MessageService
  ) {}

  newMarket(): void {
    this.draft.set({
      id: `market-${Date.now()}`,
      name: '',
      municipality: 'Dili',
      administrativePost: '',
      address: '',
      manager: '',
      numberOfSections: 1,
      numberOfStalls: 1,
      active: true
    });
    this.dialogOpen.set(true);
  }

  edit(market: Market): void {
    this.draft.set({ ...market });
    this.dialogOpen.set(true);
  }

  save(): void {
    const market = this.draft();
    if (!market?.name) {
      this.messages.add({ severity: 'warn', summary: 'Market name required', detail: 'Please enter a market name.' });
      return;
    }
    this.markets.upsert(market);
    this.messages.add({ severity: 'success', summary: 'Market saved', detail: `${market.name} updated in frontend memory.` });
    this.dialogOpen.set(false);
  }
}
