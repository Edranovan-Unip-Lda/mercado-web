import { NgClass } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { AuthMockService } from '../core/services/auth-mock.service';
import { RoleName } from '../core/models';
import { roles } from '../mock-data/reference-data';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule, ButtonModule, SelectModule, NgClass],
  template: `
    <div class="min-h-screen bg-slate-100">
      <aside
        class="no-print fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0"
        [ngClass]="{ '-translate-x-full': !menuOpen(), 'translate-x-0': menuOpen() }"
      >
        <div class="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <div class="flex h-10 w-10 items-center justify-center rounded-md bg-ministry-700 text-sm font-bold text-white">TL</div>
          <div>
            <div class="font-bold text-slate-950">SIM-Merkadu TL</div>
            <div class="text-xs text-slate-500">Market Vendor Registration</div>
          </div>
        </div>
        <nav class="h-[calc(100vh-4rem)] overflow-y-auto px-3 py-4">
          @for (item of menu; track item.label) {
            <div class="mb-2">
              @if (item.route) {
                <a
                  [routerLink]="item.route"
                  routerLinkActive="bg-ministry-50 text-ministry-700"
                  class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <i [class]="item.icon"></i>
                  <span>{{ item.label }}</span>
                </a>
              } @else {
                <div class="px-3 pb-1 pt-3 text-xs font-bold uppercase tracking-wide text-slate-400">{{ item.label }}</div>
                @for (child of item.children ?? []; track child.label) {
                  <a
                    [routerLink]="child.route"
                    routerLinkActive="bg-ministry-50 text-ministry-700"
                    class="ml-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <i [class]="child.icon"></i>
                    <span>{{ child.label }}</span>
                  </a>
                }
              }
            </div>
          }
        </nav>
      </aside>

      <div class="lg:pl-72">
        <header class="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div class="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-6">
            <div class="flex items-center gap-3">
              <button pButton type="button" icon="pi pi-bars" severity="secondary" text class="lg:hidden" (click)="menuOpen.set(!menuOpen())"></button>
              <div>
                <div class="text-sm font-semibold text-slate-500">Ministry of Commerce and Industry</div>
                <div class="font-bold text-slate-950">Phase 1 Digital Vendor Registration</div>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <p-select
                [options]="roleOptions"
                [ngModel]="auth.currentUser()?.role"
                (ngModelChange)="changeRole($event)"
                class="w-72"
                ariaLabel="Switch role"
              ></p-select>
              <div class="hidden text-right sm:block">
                <div class="text-sm font-semibold">{{ userName() }}</div>
                <div class="text-xs text-slate-500">{{ auth.currentUser()?.municipality || 'National access' }}</div>
              </div>
              <button pButton type="button" label="Logout" icon="pi pi-sign-out" severity="secondary" outlined (click)="auth.logout()"></button>
            </div>
          </div>
        </header>
        <main class="p-4 lg:p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class ShellComponent {
  readonly menuOpen = signal(false);
  readonly roleOptions = roles.map((role) => role.name);
  readonly userName = computed(() => this.auth.currentUser()?.fullName ?? 'Mock User');

  readonly menu: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    {
      label: 'Vendors',
      icon: 'pi pi-users',
      children: [
        { label: 'Vendor List', icon: 'pi pi-list', route: '/vendors' },
        { label: 'New Registration', icon: 'pi pi-user-plus', route: '/vendors/new' },
        { label: 'Approval Queue', icon: 'pi pi-check-circle', route: '/approval-queue' }
      ]
    },
    {
      label: 'Markets',
      icon: 'pi pi-building',
      children: [
        { label: 'Market List', icon: 'pi pi-map', route: '/markets' },
        { label: 'Stall Assignment', icon: 'pi pi-th-large', route: '/markets/stalls' }
      ]
    },
    { label: 'Reports', icon: 'pi pi-chart-bar', route: '/reports' },
    {
      label: 'Administration',
      icon: 'pi pi-cog',
      children: [
        { label: 'Master Data', icon: 'pi pi-database', route: '/admin/master-data' },
        { label: 'User Management', icon: 'pi pi-users', route: '/admin/users' },
        { label: 'Audit Log', icon: 'pi pi-history', route: '/admin/audit-log' },
        { label: 'Settings', icon: 'pi pi-sliders-h', route: '/admin/settings' }
      ]
    }
  ];

  constructor(
    readonly auth: AuthMockService,
    private readonly router: Router
  ) {
    if (!this.auth.currentUser()) {
      void this.router.navigateByUrl('/login');
    }
  }

  changeRole(role: RoleName): void {
    this.auth.switchRole(role);
  }
}
