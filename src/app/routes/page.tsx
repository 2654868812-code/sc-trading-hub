'use client';

import { useEffect, useState, useCallback, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TradeRouteFilter } from '@/components/TradeRouteFilter';
import { RouteTable } from '@/components/RouteTable';
import type { TradeRoute, RouteFilters } from '@/types';
import { saveFiltersToStorage, buildFilterParams } from '@/lib/filter-storage';

function readFiltersFromParams(searchParams: URLSearchParams): RouteFilters {
  return {
    shipId: searchParams.get('shipId') ? parseInt(searchParams.get('shipId')!) : undefined,
    commodityId: searchParams.get('commodityId') ? parseInt(searchParams.get('commodityId')!) : undefined,
    originSystem: searchParams.get('originSystem') || undefined,
    destSystem: searchParams.get('destSystem') || undefined,
    originLocation: searchParams.get('originLocation') || undefined,
    destLocation: searchParams.get('destLocation') || undefined,
    maxInvestment: searchParams.get('maxInvestment') ? parseFloat(searchParams.get('maxInvestment')!) : undefined,
    maxDistance: searchParams.get('maxDistance') ? parseFloat(searchParams.get('maxDistance')!) : undefined,
    commodityType: (searchParams.get('commodityType') || undefined) as RouteFilters['commodityType'],
    autoLoadType: (searchParams.get('autoLoadType') || undefined) as RouteFilters['autoLoadType'],
    sortBy: (searchParams.get('sortBy') || undefined) as RouteFilters['sortBy'],
    sortOrder: (searchParams.get('sortOrder') || undefined) as RouteFilters['sortOrder'],
    roundTrip: searchParams.get('roundTrip') === '1' || undefined,
  };
}

function RoutesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [systems, setSystems] = useState<{ en: string; zh: string }[]>([]);
  const [routes, setRoutes] = useState<TradeRoute[]>([]);
  const [routePairs, setRoutePairs] = useState<Array<{ outward: TradeRoute; return_: TradeRoute; roundTripProfit: number; roundTripInvestment: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [flipKey, setFlipKey] = useState(1);
  const [roundTrip, setRoundTrip] = useState(
    searchParams.get('roundTrip') === '1'
  );
  const currentFiltersRef = useRef<RouteFilters | null>(null);
  const lastSyncRef = useRef<string | null>(null);

  // Read initial filters from URL only (sessionStorage handled client-side after mount)
  const initialFilters = readFiltersFromParams(searchParams);

  // Load systems list
  useEffect(() => {
    fetch('/api/terminals?distinctSystems=true')
      .then((r) => r.json())
      .then((data: string[]) =>
        setSystems(data.map((name) => ({ en: name, zh: name })))
      )
      .catch(console.error);
  }, []);

  const doSearch = useCallback(async (filters: RouteFilters, silent?: boolean) => {
    if (!silent) setLoading(true);
    setSearched(true);
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
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
    if (filters.roundTrip) params.set('roundTrip', '1');

    try {
      const res = await fetch(`/api/routes?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.roundTrip) {
        setRoutePairs(data.pairs || []);
        setRoutes([]);
      } else {
        setRoutes(Array.isArray(data) ? data : []);
        setRoutePairs([]);
      }
      setSearchError(null);
    } catch (err) {
      console.error(err);
      setSearchError('查询失败，请稍后重试');
      setRoutes([]);
      setRoutePairs([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Auto-search on mount if shipId present in URL
  useEffect(() => {
    if (initialFilters.shipId || initialFilters.commodityId) {
      currentFiltersRef.current = initialFilters;
      doSearch(initialFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = useCallback(async (filters: RouteFilters) => {
    // Persist to URL
    const params = buildFilterParams(filters);
    router.replace(`/routes?${params.toString()}`, { scroll: false });

    saveFiltersToStorage(filters);
    currentFiltersRef.current = filters;
    setRoundTrip(filters.roundTrip || false);
    await doSearch(filters);
  }, [router, doSearch]);

  // Persist filters to URL/storage without search (called on every filter change)
  const handleFiltersPersist = useCallback((filters: RouteFilters) => {
    if (!filters.shipId) return;
    const params = buildFilterParams(filters);
    router.replace(`/routes?${params.toString()}`, { scroll: false });
    saveFiltersToStorage(filters);
    currentFiltersRef.current = filters;
    setRoundTrip(filters.roundTrip || false);
  }, [router]);

  const handleCommodityClick = useCallback(
    (commodityId: number) => {
      router.push(`/commodity/${commodityId}`);
    },
    [router]
  );

  // Check for data sync every 2 minutes, auto-refresh if new data available
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    async function check() {
      try {
        const res = await fetch('/api/data-freshness');
        const { latestFetchedAt } = await res.json();
        if (!latestFetchedAt) return;
        if (lastSyncRef.current && lastSyncRef.current !== latestFetchedAt && currentFiltersRef.current) {
          await doSearch(currentFiltersRef.current, true);
          setFlipKey((k) => k + 1);
        }
        lastSyncRef.current = latestFetchedAt;
      } catch { /* ignore */ }
    }
    check();
    timer = setInterval(check, 60_000);
    return () => clearInterval(timer);
  }, [doSearch]);

  return (
    <div className="space-y-4">
      <TradeRouteFilter
        systems={systems}
        onFilterChange={handleFilterChange}
        onFiltersPersist={handleFiltersPersist}
        loading={loading}
        initialFilters={initialFilters}
      />

      {searchError && (
        <div className="text-center py-8">
          <p className="text-sm text-destructive">{searchError}</p>
        </div>
      )}
      {searched && !searchError && (
        <RouteTable
          routes={routes}
          routePairs={routePairs}
          loading={loading}
          roundTrip={roundTrip}
          flipKey={flipKey}
          onCommodityClick={handleCommodityClick}
        />
      )}

      {!searched && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">选择筛选条件后点击「查询路线」</p>
          <p className="text-sm mt-2 text-muted-foreground/60">
            或从商品总览点击任意商品快速查询
          </p>
        </div>
      )}
    </div>
  );
}

export default function RoutesPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-16 text-muted-foreground">加载中…</div>
    }>
      <RoutesContent />
    </Suspense>
  );
}
