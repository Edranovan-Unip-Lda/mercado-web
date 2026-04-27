import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { MasterDataMockService } from '../../core/services/master-data-mock.service';
import { AppSettings } from '../../core/models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, ButtonModule, CardModule, CheckboxModule, InputNumberModule, InputTextModule, MultiSelectModule, SelectModule],
  template: `
    <div class="mb-6">
      <h1 class="page-title">Settings</h1>
      <p class="text-sm text-slate-500">Frontend-only system configuration placeholders for future backend integration.</p>
    </div>

    <p-card>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div>
          <label class="field-label">System name</label>
          <input pInputText [(ngModel)]="settings.systemName" class="w-full" />
        </div>
        <div>
          <label class="field-label">Registration number prefix</label>
          <input pInputText [(ngModel)]="settings.registrationPrefix" class="w-full" />
        </div>
        <div>
          <label class="field-label">Default language</label>
          <p-select [options]="languages" [(ngModel)]="settings.defaultLanguage" class="w-full"></p-select>
        </div>
        <div>
          <label class="field-label">Vendor ID expiry period</label>
          <p-inputNumber [(ngModel)]="settings.idExpiryPeriodMonths" suffix=" months" [min]="1" styleClass="w-full"></p-inputNumber>
        </div>
        <div>
          <label class="field-label">Current form version</label>
          <input pInputText [(ngModel)]="settings.currentFormVersion" class="w-full" />
        </div>
        <div class="flex items-end gap-3 pb-2">
          <p-checkbox [(ngModel)]="settings.enableFormVersioning" [binary]="true"></p-checkbox>
          <span class="font-semibold">Enable form versioning</span>
        </div>
        <div class="md:col-span-2 xl:col-span-3">
          <label class="field-label">QR public information settings</label>
          <p-multiselect [options]="qrOptions" [(ngModel)]="settings.qrPublicInfo" display="chip" class="w-full"></p-multiselect>
        </div>
      </div>
      <div class="mt-6 flex justify-end">
        <button pButton type="button" label="Save Settings" icon="pi pi-save" (click)="save()"></button>
      </div>
    </p-card>
  `
})
export class SettingsComponent {
  readonly languages = ['English', 'Tetum', 'Portuguese'];
  readonly qrOptions = ['Vendor name', 'Registration number', 'Market', 'Stall number', 'Business category', 'Status', 'Issue date'];
  settings: AppSettings;

  constructor(
    readonly master: MasterDataMockService,
    private readonly messages: MessageService
  ) {
    this.settings = structuredClone(this.master.settings());
  }

  save(): void {
    this.master.settings.set({ ...this.settings });
    this.messages.add({ severity: 'success', summary: 'Settings saved', detail: 'Settings updated in frontend memory.' });
  }
}
