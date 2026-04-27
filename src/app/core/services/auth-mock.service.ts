import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RoleName, User } from '../models';
import { mockUsers } from '../../mock-data/mock-data';

@Injectable({ providedIn: 'root' })
export class AuthMockService {
  private readonly storageKey = 'sim-merkadu-current-user';
  readonly users = signal<User[]>(mockUsers);
  readonly currentUser = signal<User | null>(this.loadUser());

  constructor(private readonly router: Router) {}

  login(username: string, role: RoleName): void {
    const template = this.users().find((user) => user.role === role) ?? this.users()[0];
    const user: User = {
      ...template,
      username: username || template.username,
      lastLogin: new Date().toLocaleString()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.currentUser.set(user);
    void this.router.navigateByUrl('/dashboard');
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUser.set(null);
    void this.router.navigateByUrl('/login');
  }

  switchRole(role: RoleName): void {
    const username = this.currentUser()?.username ?? role.toLowerCase().replaceAll(' ', '.');
    this.login(username, role);
  }

  canEditVendor(): boolean {
    const role = this.currentUser()?.role;
    return role === 'System Administrator' || role === 'Market Officer / Data Entry Officer' || role === 'Market Manager';
  }

  canApprove(): boolean {
    const role = this.currentUser()?.role;
    return role === 'System Administrator' || role === 'Municipal Administrator' || role === 'Market Manager';
  }

  canAdminister(): boolean {
    const role = this.currentUser()?.role;
    return role === 'System Administrator' || role === 'MCI National Administrator';
  }

  isReadOnly(): boolean {
    return this.currentUser()?.role === 'Viewer / Auditor';
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? (JSON.parse(raw) as User) : null;
  }
}
