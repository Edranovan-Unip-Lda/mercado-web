import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';
import { LoginComponent } from './features/auth/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'vendors',
        loadComponent: () => import('./features/vendors/vendor-list.component').then((m) => m.VendorListComponent)
      },
      {
        path: 'vendors/new',
        loadComponent: () => import('./features/vendors/vendor-form.component').then((m) => m.VendorFormComponent)
      },
      {
        path: 'vendors/:id',
        loadComponent: () => import('./features/vendors/vendor-detail.component').then((m) => m.VendorDetailComponent)
      },
      {
        path: 'vendors/:id/edit',
        loadComponent: () => import('./features/vendors/vendor-form.component').then((m) => m.VendorFormComponent)
      },
      {
        path: 'vendors/:id/id-card',
        loadComponent: () => import('./features/vendors/vendor-id-card.component').then((m) => m.VendorIdCardComponent)
      },
      {
        path: 'approval-queue',
        loadComponent: () => import('./features/vendors/approval-queue.component').then((m) => m.ApprovalQueueComponent)
      },
      {
        path: 'markets',
        loadComponent: () => import('./features/markets/market-list.component').then((m) => m.MarketListComponent)
      },
      {
        path: 'markets/stalls',
        loadComponent: () => import('./features/markets/stall-assignment.component').then((m) => m.StallAssignmentComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then((m) => m.ReportsComponent)
      },
      {
        path: 'admin/master-data',
        loadComponent: () => import('./features/admin/master-data.component').then((m) => m.MasterDataComponent)
      },
      {
        path: 'admin/users',
        loadComponent: () => import('./features/admin/user-management.component').then((m) => m.UserManagementComponent)
      },
      {
        path: 'admin/audit-log',
        loadComponent: () => import('./features/admin/audit-log.component').then((m) => m.AuditLogComponent)
      },
      {
        path: 'admin/settings',
        loadComponent: () => import('./features/admin/settings.component').then((m) => m.SettingsComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
