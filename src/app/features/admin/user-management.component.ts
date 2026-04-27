import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { User } from '../../core/models';
import { AuthMockService } from '../../core/services/auth-mock.service';
import { MarketMockService } from '../../core/services/market-mock.service';
import { municipalities, roles } from '../../mock-data/reference-data';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [FormsModule, ButtonModule, CardModule, DialogModule, InputTextModule, SelectModule, TableModule, TagModule],
  template: `
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="page-title">User Management</h1>
        <p class="text-sm text-slate-500">Manage mock users and role assignments for the frontend MVP.</p>
      </div>
      <button pButton type="button" label="Create User" icon="pi pi-user-plus" (click)="newUser()"></button>
    </div>

    <section class="mb-4 grid gap-4 xl:grid-cols-[1fr_0.9fr]">
      <p-card header="Users">
        <div class="mb-3 flex flex-wrap gap-3">
          <p-select [options]="roleOptions" [(ngModel)]="roleFilter" placeholder="Role" [showClear]="true" class="w-72"></p-select>
          <p-select [options]="statusOptions" [(ngModel)]="statusFilter" placeholder="Status" [showClear]="true" class="w-48"></p-select>
        </div>
        <p-table [value]="filteredUsers()" [paginator]="true" [rows]="8" responsiveLayout="scroll">
          <ng-template pTemplate="header">
            <tr><th>Full name</th><th>Username</th><th>Role</th><th>Municipality</th><th>Status</th><th>Last login</th><th>Actions</th></tr>
          </ng-template>
          <ng-template pTemplate="body" let-user>
            <tr>
              <td class="font-semibold">{{ user.fullName }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.municipality || 'National' }}</td>
              <td><p-tag [value]="user.status" [severity]="user.status === 'Active' ? 'success' : 'secondary'"></p-tag></td>
              <td>{{ user.lastLogin }}</td>
              <td><button pButton type="button" label="Edit" icon="pi pi-pencil" size="small" outlined (click)="editUser(user)"></button></td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
      <p-card header="Role Permission Summary">
        <div class="space-y-3">
          @for (role of roles; track role.name) {
            <div class="rounded-md border border-slate-200 p-3">
              <div class="font-bold">{{ role.name }}</div>
              <div class="mt-2 flex flex-wrap gap-2">
                @for (permission of role.permissions; track permission) {
                  <p-tag [value]="permission" severity="info"></p-tag>
                }
              </div>
            </div>
          }
        </div>
      </p-card>
    </section>

    <p-dialog header="Mock User" [(visible)]="dialogOpen" [modal]="true" [style]="{ width: 'min(680px, 96vw)' }">
      @if (draft(); as user) {
        <div class="grid gap-4 md:grid-cols-2">
          <div><label class="field-label required">Full name</label><input pInputText [(ngModel)]="user.fullName" class="w-full" /></div>
          <div><label class="field-label required">Username</label><input pInputText [(ngModel)]="user.username" class="w-full" /></div>
          <div><label class="field-label required">Role</label><p-select [options]="roleOptions" [(ngModel)]="user.role" class="w-full"></p-select></div>
          <div><label class="field-label">Municipality</label><p-select [options]="municipalityOptions" [(ngModel)]="user.municipality" [showClear]="true" class="w-full"></p-select></div>
          <div><label class="field-label">Assigned market</label><p-select [options]="marketOptions" [(ngModel)]="user.assignedMarket" [showClear]="true" class="w-full"></p-select></div>
          <div><label class="field-label">Status</label><p-select [options]="statusOptions" [(ngModel)]="user.status" class="w-full"></p-select></div>
        </div>
      }
      <ng-template pTemplate="footer">
        <button pButton type="button" label="Cancel" severity="secondary" outlined (click)="dialogOpen.set(false)"></button>
        <button pButton type="button" label="Save User" icon="pi pi-save" (click)="save()"></button>
      </ng-template>
    </p-dialog>
  `
})
export class UserManagementComponent {
  readonly auth = inject(AuthMockService);
  private readonly markets = inject(MarketMockService);
  private readonly messages = inject(MessageService);
  readonly roles = roles;
  readonly roleOptions = roles.map((role) => role.name);
  readonly statusOptions = ['Active', 'Inactive'];
  readonly municipalityOptions = municipalities;
  readonly marketOptions = this.markets.markets().map((market) => market.name);
  roleFilter: string | undefined;
  statusFilter: string | undefined;
  readonly dialogOpen = signal(false);
  readonly draft = signal<User | null>(null);
  readonly filteredUsers = computed(() =>
    this.auth.users().filter((user) => (!this.roleFilter || user.role === this.roleFilter) && (!this.statusFilter || user.status === this.statusFilter))
  );

  newUser(): void {
    this.draft.set({
      id: `user-${Date.now()}`,
      fullName: '',
      username: '',
      role: 'Viewer / Auditor',
      status: 'Active',
      lastLogin: 'Never'
    });
    this.dialogOpen.set(true);
  }

  editUser(user: User): void {
    this.draft.set({ ...user });
    this.dialogOpen.set(true);
  }

  save(): void {
    const user = this.draft();
    if (!user?.fullName || !user.username) {
      this.messages.add({ severity: 'warn', summary: 'Required fields', detail: 'Full name and username are required.' });
      return;
    }
    this.auth.users.update((items) => (items.some((item) => item.id === user.id) ? items.map((item) => (item.id === user.id ? user : item)) : [user, ...items]));
    this.messages.add({ severity: 'success', summary: 'User saved', detail: 'Mock user updated in frontend memory.' });
    this.dialogOpen.set(false);
  }
}
