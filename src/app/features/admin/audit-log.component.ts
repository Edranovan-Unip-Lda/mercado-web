import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AuditLogMockService } from '../../core/services/audit-log-mock.service';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [FormsModule, CardModule, InputTextModule, SelectModule, TableModule, TagModule],
  template: `
    <div class="mb-6">
      <h1 class="page-title">Audit Log</h1>
      <p class="text-sm text-slate-500">Mock audit events for traceability across registration, approval, stall, and master-data changes.</p>
    </div>

    <p-card>
      <div class="mb-4 grid gap-3 md:grid-cols-3">
        <input pInputText placeholder="Search audit log" (input)="filterGlobal($event, dt)" />
        <p-select [options]="actions" placeholder="Action" [showClear]="true" (ngModelChange)="dt.filter($event, 'action', 'equals')" ngModel></p-select>
        <p-select [options]="entityTypes" placeholder="Entity type" [showClear]="true" (ngModelChange)="dt.filter($event, 'entityType', 'equals')" ngModel></p-select>
      </div>
      <p-table #dt [value]="audit.logs()" [paginator]="true" [rows]="12" [globalFilterFields]="['user', 'role', 'action', 'entityType', 'entityNameOrId', 'details']" responsiveLayout="scroll">
        <ng-template pTemplate="header">
          <tr><th>Date/time</th><th>User</th><th>Role</th><th>Action</th><th>Entity type</th><th>Entity name/ID</th><th>Details</th></tr>
        </ng-template>
        <ng-template pTemplate="body" let-log>
          <tr>
            <td>{{ log.dateTime }}</td>
            <td class="font-semibold">{{ log.user }}</td>
            <td>{{ log.role }}</td>
            <td><p-tag [value]="log.action" severity="info"></p-tag></td>
            <td>{{ log.entityType }}</td>
            <td>{{ log.entityNameOrId }}</td>
            <td>{{ log.details }}</td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `
})
export class AuditLogComponent {
  readonly actions = ['User login', 'Vendor created', 'Vendor edited', 'Vendor submitted', 'Vendor approved', 'Vendor rejected', 'Stall assigned', 'ID card generated', 'Master data changed'];
  readonly entityTypes = ['Vendor', 'Market Stall', 'Master Data'];

  constructor(readonly audit: AuditLogMockService) {}

  filterGlobal(event: Event, table: Table): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
