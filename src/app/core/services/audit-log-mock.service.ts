import { Injectable, signal } from '@angular/core';
import { AuditLog, RoleName } from '../models';
import { buildAuditLogs } from '../../mock-data/mock-data';

@Injectable({ providedIn: 'root' })
export class AuditLogMockService {
  readonly logs = signal<AuditLog[]>(buildAuditLogs());

  add(action: string, entityType: string, entityNameOrId: string, user: string, role: RoleName, details: string): void {
    const log: AuditLog = {
      id: `audit-${Date.now()}`,
      dateTime: new Date().toLocaleString(),
      user,
      role,
      action,
      entityType,
      entityNameOrId,
      details
    };
    this.logs.update((items) => [log, ...items]);
  }
}
