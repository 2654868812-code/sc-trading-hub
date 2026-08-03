'use client';

import { useEffect, useState, useCallback, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TradeRouteFilter } from '@/components/TradeRouteFilter';
import { RouteTable } from '@/components/RouteTable';
import type { TradeRoute, RouteFilters } from '@/types';
import { saveFiltersToStorage, buildFilterParams } from '@/lib/filter-storage';

function parseIds(raw: string | null): number[] | undefined {
  if (!raw) return undefined;
  const ids = raw.split(',').map(Number).filter(n => !isNaN(n));
  return ids.length ? ids : undefined;
}

function parseLocs(raw: string | null): string[] | undefined {
  if (!raw) return undefined;
  const locs = raw.split(',').map(s => decodeURIComponent(s.trim())).filter(Boolean);
  return locs.length ? locs : undefined;
}

function readFiltersFromParams(searchParams: URLSearchParams): RouteFilters {
  // Parse commodity: new multi-select takes priority, fallback to old single
  const newCids = parseIds(searchParams.get('commodityIds'));
  const oldCid = searchParams.get('commodityId');
  const commodityIds = newCids ?? (oldCid ? [parseInt(oldCid)] : undefined);

  // Parse locations: new multi-select takes priority, fallback to old single
  const newOrigins = parseLocs(searchParams.get('originLocations'));
  const oldOrigin = searchParams.get('originLocation');
  const originLocations = newOrigins ?? (oldOrigin ? [oldOrigin] : undefined);

  const newDests = parseLocs(searchParams.get('destLocations'));
  const oldDest = searchParams.get('destLocation');
  const destLocations = newDests ?? (oldDest ? [oldDest] : undefined);

  return {
    shipId: searchParams.get('shipId') ? parseInt(searchParams.get('shipId')!) : undefined,
    commodityIds,
    commodityMode: (searchParams.get('commodityMode') || undefined) as RouteFilters['commodityMode'],
    originSystem: searchParams.get('originSystem') || undefined,
    destSystem: searchParams.get('destSystem') || undefined,
    originLocations,
    originLocationMode: (searchParams.get('originLocationMode') || undefined) as RouteFilters['originLocationMode'],
    destLocations,
    destLocationMode: (searchParams.get('destLocationMode') || undefined) as RouteFilters['destLocationMode'],
    maxInvestment: searchParams.get('maxInvestment') ? parseFloat(searchParams.get('maxInvestment')!) : undefined,
    maxDistance: searchParams.get('maxDistance') ? parseFloat(searchParams.get('maxDistance')!) : undefined,
    commodityType: (searchParams.get('commodityType') || undefined) as RouteFilters['commodityType'],
    autoLoadType: (searchParams.get('autoLoadType') || undefined) as RouteFilters['autoLoadType'],
    sortBy: (searchParams.get('sortBy') || undefined) as RouteFilters['sortBy'],
    sortOrder: (searchParams.get('sortOrder') || undefined) as RouteFilters['sortOrder'],
    roundTrip: searchParams.get('roundTrip') === '1' || undefined,
    profitMode: (searchParams.get('profitMode') || undefined) as RouteFilters['profitMode'],
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
    const params = buildFilterParams(filters);

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
    if (initialFilters.shipId || initialFilters.commodityIds?.length) {
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
    let isChecking = false;
    async function check() {
      if (isChecking) return;
      isChecking = true;
      try {
        const res = await fetch('/api/data-freshness');
        if (!res.ok) return;
        const { latestFetchedAt } = await res.json();
        if (!latestFetchedAt) return;
        if (lastSyncRef.current && lastSyncRef.current !== latestFetchedAt && currentFiltersRef.current) {
          await doSearch(currentFiltersRef.current, true);
          setFlipKey((k) => k + 1);
        }
        lastSyncRef.current = latestFetchedAt;
      } catch { /* network error — retry next interval */ }
      finally { isChecking = false; }
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
