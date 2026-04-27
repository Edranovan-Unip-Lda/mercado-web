import { Injectable, signal } from '@angular/core';
import { Market } from '../models';
import { markets } from '../../mock-data/mock-data';

@Injectable({ providedIn: 'root' })
export class MarketMockService {
  readonly markets = signal<Market[]>(structuredClone(markets));

  upsert(market: Market): void {
    this.markets.update((items) => {
      const exists = items.some((item) => item.id === market.id);
      return exists ? items.map((item) => (item.id === market.id ? market : item)) : [market, ...items];
    });
  }

  getById(id?: string): Market | undefined {
    return this.markets().find((market) => market.id === id);
  }
}
