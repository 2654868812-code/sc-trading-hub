import type { RouteFilters } from '@/types';

const KEY = 'sc-trade-filters';

export function readFiltersFromStorage(): RouteFilters | null {
  try {
    if (typeof sessionStorage === 'undefined') return null;
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RouteFilters;
  } catch {
    return null;
  }
}

export function saveFiltersToStorage(filters: RouteFilters): void {
  try {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(KEY, JSON.stringify(filters));
  } catch { /* ignore */ }
}

export function buildFilterParams(filters: RouteFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.shipId) params.set('shipId', String(filters.shipId));
  if (filters.commodityId) params.set('commodityId', String(filters.commodityId));
  if (filters.originSystem) params.set('originSystem', filters.originSystem);
  if (filters.destSystem) params.set('destSystem', filters.destSystem);
  if (filters.originLocation) params.set('originLocation', filters.originLocation);
  if (filters.destLocation) params.set('destLocation', filters.destLocation);
  if (filters.maxInvestment) params.set('maxInvestment', String(filters.maxInvestment));
  if (filters.maxDistance) params.set('maxDistance', String(filters.maxDistance));
  if (filters.autoLoadType) params.set('autoLoadType', filters.autoLoadType);
  if (filters.commodityType) params.set('commodityType', filters.commodityType);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder || 'desc');
  if (filters.roundTrip) params.set('roundTrip', '1');
  if (filters.profitMode) params.set('profitMode', filters.profitMode);
  return params;
}
