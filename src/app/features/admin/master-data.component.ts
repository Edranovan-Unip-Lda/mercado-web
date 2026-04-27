import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { MasterDataItem } from '../../core/models';
import { MasterDataMockService } from '../../core/services/master-data-mock.service';

@Component({
  selector: 'app-master-data',
  standalone: true,
  imports: [FormsModule, ButtonModule, CardModule, ConfirmDialogModule, DialogModule, InputTextModule, TableModule, TabsModule, TagModule],
  template: `
    <div class="mb-6 flex items-center justify-between gap-3">
      <div>
        <h1 class="page-title">Master Data</h1>
        <p class="text-sm text-slate-500">Manage reference data for municipalities, markets, categories, statuses, and roles.</p>
      </div>
    </div>

    <p-card>
      <p-tabs [value]="tabs[0]">
        <p-tablist>
          @for (tab of tabs; track tab) {
            <p-tab [value]="tab">{{ tab }}</p-tab>
          }
        </p-tablist>
        <p-tabpanels>
          @for (tab of tabs; track tab) {
            <p-tabpanel [value]="tab">
              <div class="mb-3 flex justify-end">
                <button pButton type="button" label="Add Item" icon="pi pi-plus" size="small" (click)="newItem(tab)"></button>
              </div>
              <p-table [value]="master.data()[tab]" [paginator]="true" [rows]="8" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                  <tr><th>Name</th><th>Code</th><th>Group</th><th>Status</th><th>Actions</th></tr>
                </ng-template>
                <ng-template pTemplate="body" let-item>
                  <tr>
                    <td class="font-semibold">{{ item.name }}</td>
                    <td>{{ item.code || '-' }}</td>
                    <td>{{ item.group || '-' }}</td>
                    <td><p-tag [value]="item.active ? 'Active' : 'Inactive'" [severity]="item.active ? 'success' : 'secondary'"></p-tag></td>
                    <td>
                      <div class="flex gap-2">
                        <button pButton type="button" label="Edit" icon="pi pi-pencil" size="small" outlined (click)="editItem(tab, item)"></button>
                        <button pButton type="button" label="Delete" icon="pi pi-trash" size="small" severity="danger" outlined (click)="deleteItem(tab, item)"></button>
                      </div>
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </p-tabpanel>
          }
        </p-tabpanels>
      </p-tabs>
    </p-card>

    <p-dialog header="Reference Data Item" [(visible)]="dialogOpen" [modal]="true" [style]="{ width: 'min(520px, 96vw)' }">
      @if (draft(); as item) {
        <div class="grid gap-4">
          <div><label class="field-label required">Name</label><input pInputText [(ngModel)]="item.name" class="w-full" /></div>
          <div><label class="field-label">Code</label><input pInputText [(ngModel)]="item.code" class="w-full" /></div>
          <div><label class="field-label">Group</label><input pInputText [(ngModel)]="item.group" class="w-full" /></div>
        </div>
      }
      <ng-template pTemplate="footer">
        <button pButton type="button" label="Cancel" severity="secondary" outlined (click)="dialogOpen.set(false)"></button>
        <button pButton type="button" label="Save" icon="pi pi-save" (click)="save()"></button>
      </ng-template>
    </p-dialog>
  `
})
export class MasterDataComponent {
  readonly master = inject(MasterDataMockService);
  private readonly messages = inject(MessageService);
  private readonly confirmations = inject(ConfirmationService);
  readonly tabs = Object.keys(this.master.data());
  readonly dialogOpen = signal(false);
  readonly draft = signal<MasterDataItem | null>(null);
  activeTab = this.tabs[0];

  newItem(tab: string): void {
    this.activeTab = tab;
    this.draft.set({ id: `${tab}-${Date.now()}`, name: '', active: true });
    this.dialogOpen.set(true);
  }

  editItem(tab: string, item: MasterDataItem): void {
    this.activeTab = tab;
    this.draft.set({ ...item });
    this.dialogOpen.set(true);
  }

  save(): void {
    const item = this.draft();
    if (!item?.name) {
      this.messages.add({ severity: 'warn', summary: 'Name required', detail: 'Please provide a name.' });
      return;
    }
    this.master.upsert(this.activeTab, item);
    this.messages.add({ severity: 'success', summary: 'Saved', detail: 'Master data item updated in memory.' });
    this.dialogOpen.set(false);
  }

  deleteItem(tab: string, item: MasterDataItem): void {
    this.confirmations.confirm({
      header: 'Delete item',
      message: `Delete ${item.name}?`,
      accept: () => {
        this.master.remove(tab, item.id);
        this.messages.add({ severity: 'info', summary: 'Deleted', detail: 'Item removed from frontend memory.' });
      }
    });
  }
}
