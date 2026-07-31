'use client';

import { useEffect, useState, useCallback, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TradeRouteFilter } from '@/components/TradeRouteFilter';
import { RouteTable } from '@/components/RouteTable';
import type { TradeRoute, RouteFilters } from '@/types';

function RoutesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [systems, setSystems] = useState<{ en: string; zh: string }[]>([]);
  const [routes, setRoutes] = useState<TradeRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);
  const lastFetchedAtRef = useRef<string | null>(null);
  const currentFiltersRef = useRef<RouteFilters | null>(null);

  // Read initial filters from URL
  const initialFilters: RouteFilters = {
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

  // Load systems list
  useEffect(() => {
    fetch('/api/terminals?distinctSystems=true')
      .then((r) => r.json())
      .then((data: string[]) =>
        setSystems(data.map((name) => ({ en: name, zh: name })))
      )
      .catch(console.error);
  }, []);

  const doSearch = useCallback(async (filters: RouteFilters) => {
    setLoading(true);
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
      const data = await res.json();
      setRoutes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  // Poll for data freshness every 60s
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    async function checkFreshness() {
      try {
        const res = await fetch('/api/data-freshness');
        const { latestFetchedAt } = await res.json();
        if (!latestFetchedAt) return;
        if (lastFetchedAtRef.current && lastFetchedAtRef.current !== latestFetchedAt) {
          setDataUpdated(true);
        }
        lastFetchedAtRef.current = latestFetchedAt;
      } catch { /* ignore */ }
    }
    checkFreshness();
    timer = setInterval(checkFreshness, 60000);
    return () => clearInterval(timer);
  }, []);

  // When data updates, re-search with current filters
  useEffect(() => {
    if (dataUpdated && currentFiltersRef.current) {
      doSearch(currentFiltersRef.current);
      setDataUpdated(false);
    }
  }, [dataUpdated, doSearch]);

  const handleFilterChange = useCallback(async (filters: RouteFilters) => {
    // Persist to URL
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
    router.replace(`/routes?${params.toString()}`, { scroll: false });

    currentFiltersRef.current = filters;
    await doSearch(filters);
  }, [router, doSearch]);

  const handleCommodityClick = useCallback(
    (commodityId: number) => {
      router.push(`/commodity/${commodityId}`);
    },
    [router]
  );

  return (
    <div className="space-y-4">
      <TradeRouteFilter
        systems={systems}
        onFilterChange={handleFilterChange}
        loading={loading}
        initialFilters={initialFilters}
      />

      {dataUpdated && searched && (
        <div className="px-4 py-2 rounded-md border border-chart-2/30 bg-chart-2/5 text-xs text-chart-2/80 animate-pulse">
          检测到新数据，正在刷新...
        </div>
      )}

      {searched && (
        <RouteTable
          routes={routes}
          loading={loading}
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
