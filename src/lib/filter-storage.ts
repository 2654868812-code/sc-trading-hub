import type { RouteFilters } from '@/types';

const KEY = 'sc-trade-filters';

function encodeArray(values: string[]): string {
  return values.map(v => encodeURIComponent(v)).join(',');
}

export function readFiltersFromStorage(): RouteFilters | null {
  try {
    if (typeof sessionStorage === 'undefined') return null;
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Migration: detect old single-value format and clear
    if (typeof parsed.commodityId === 'number' || typeof parsed.originLocation === 'string' || typeof parsed.destLocation === 'string') {
      sessionStorage.removeItem(KEY);
      return null;
    }
    return parsed as RouteFilters;
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
  if (filters.commodityIds?.length) {
    params.set('commodityIds', encodeArray(filters.commodityIds.map(String)));
    if (filters.commodityMode) params.set('commodityMode', filters.commodityMode);
  }
  if (filters.originSystem) params.set('originSystem', filters.originSystem);
  if (filters.destSystem) params.set('destSystem', filters.destSystem);
  if (filters.originLocations?.length) {
    params.set('originLocations', encodeArray(filters.originLocations));
    if (filters.originLocationMode) params.set('originLocationMode', filters.originLocationMode);
  }
  if (filters.destLocations?.length) {
    params.set('destLocations', encodeArray(filters.destLocations));
    if (filters.destLocationMode) params.set('destLocationMode', filters.destLocationMode);
  }
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
