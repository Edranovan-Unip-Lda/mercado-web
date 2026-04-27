import { VendorStatus, StallStatus } from '../core/models';

export function statusSeverity(status: VendorStatus): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
  const map: Record<VendorStatus, 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast'> = {
    Draft: 'secondary',
    Submitted: 'info',
    'Pending Verification': 'warn',
    Approved: 'success',
    Rejected: 'danger',
    'Needs Correction': 'warn',
    Inactive: 'contrast'
  };
  return map[status];
}

export function stallStatusClass(status: StallStatus): string {
  const map: Record<StallStatus, string> = {
    Available: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    Occupied: 'border-blue-200 bg-blue-50 text-blue-800',
    Reserved: 'border-amber-200 bg-amber-50 text-amber-800',
    'Under Repair': 'border-red-200 bg-red-50 text-red-800',
    Inactive: 'border-slate-200 bg-slate-100 text-slate-600'
  };
  return map[status];
}
