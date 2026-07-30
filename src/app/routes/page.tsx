'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TradeRouteFilter } from '@/components/TradeRouteFilter';
import { RouteTable } from '@/components/RouteTable';
import type { TradeRoute, RouteFilters, CommodityWithChange } from '@/types';

function RoutesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [systems, setSystems] = useState<{ en: string; zh: string }[]>([]);
  const [routes, setRoutes] = useState<TradeRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [lockedCommodity, setLockedCommodity] = useState<
    { id: number; nameZh: string } | null
  >(null);

  const commodityIdParam = searchParams.get('commodityId');

  // Load systems list
  useEffect(() => {
    fetch('/api/terminals?distinctSystems=true')
      .then((r) => r.json())
      .then((data: string[]) =>
        setSystems(data.map((name) => ({ en: name, zh: name })))
      )
      .catch(console.error);
  }, []);

  // Resolve the locked commodity's Chinese name so the filter can label it
  useEffect(() => {
    if (!commodityIdParam) {
      setLockedCommodity(null);
      return;
    }
    const id = parseInt(commodityIdParam, 10);
    if (Number.isNaN(id)) {
      setLockedCommodity(null);
      return;
    }
    // Show the chip immediately; refine the label once names arrive
    setLockedCommodity({ id, nameZh: `#${id}` });
    fetch('/api/commodities')
      .then((r) => r.json())
      .then((data: CommodityWithChange[]) => {
        const hit = data.find((c) => c.id === id);
        if (hit) setLockedCommodity({ id, nameZh: hit.nameZh || hit.name });
      })
      .catch(console.error);
  }, [commodityIdParam]);

  // If commodityId in URL, auto-search
  useEffect(() => {
    if (commodityIdParam) {
      const id = parseInt(commodityIdParam, 10);
      if (!Number.isNaN(id)) {
        handleFilterChange({
          commodityId: id,
          sortBy: 'profit',
          sortOrder: 'desc',
        });
      }
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = useCallback(async (filters: RouteFilters) => {
    setLoading(true);
    setSearched(true);
    const params = new URLSearchParams();
    if (filters.shipId) params.set('shipId', String(filters.shipId));
    if (filters.commodityId) params.set('commodityId', String(filters.commodityId));
    if (filters.originSystem) params.set('originSystem', filters.originSystem);
    if (filters.destSystem) params.set('destSystem', filters.destSystem);
    if (filters.maxInvestment) params.set('maxInvestment', String(filters.maxInvestment));
    if (filters.maxDistance) params.set('maxDistance', String(filters.maxDistance));
    if (filters.autoLoadType) params.set('autoLoadType', filters.autoLoadType);
    if (filters.commodityType) params.set('commodityType', filters.commodityType);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

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

  // Drop the commodity lock: clear the URL param and re-query everything else
  const handleClearCommodity = useCallback(() => {
    setLockedCommodity(null);
    router.replace('/routes');
    handleFilterChange({ sortBy: 'profit', sortOrder: 'desc' });
  }, [router, handleFilterChange]);

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
        lockedCommodity={lockedCommodity}
        onClearCommodity={handleClearCommodity}
      />

      {searched && (
        <RouteTable
          routes={routes}
          loading={loading}
          onCommodityClick={handleCommodityClick}
        />
      )}

      {!searched && !commodityIdParam && (
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
