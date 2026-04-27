import { Injectable, signal } from '@angular/core';
import { AppSettings, MasterDataItem } from '../models';
import { buildMasterData } from '../../mock-data/mock-data';
import { defaultSettings } from '../../mock-data/reference-data';

@Injectable({ providedIn: 'root' })
export class MasterDataMockService {
  readonly data = signal<Record<string, MasterDataItem[]>>(buildMasterData());
  readonly settings = signal<AppSettings>({ ...defaultSettings });

  upsert(tab: string, item: MasterDataItem): void {
    this.data.update((data) => {
      const items = data[tab] ?? [];
      const exists = items.some((entry) => entry.id === item.id);
      return {
        ...data,
        [tab]: exists ? items.map((entry) => (entry.id === item.id ? item : entry)) : [{ ...item, id: item.id || `${tab}-${Date.now()}` }, ...items]
      };
    });
  }

  remove(tab: string, id: string): void {
    this.data.update((data) => ({ ...data, [tab]: (data[tab] ?? []).filter((item) => item.id !== id) }));
  }
}
