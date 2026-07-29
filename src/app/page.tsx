'use client';

import { useEffect, useState, useCallback } from 'react';
import { Heatmap } from '@/components/Heatmap';
import { TradeRouteFilter } from '@/components/TradeRouteFilter';
import { RouteTable } from '@/components/RouteTable';
import type { CommodityWithChange, TradeRoute, RouteFilters } from '@/types';

export default function HomePage() {
  const [commodities, setCommodities] = useState<CommodityWithChange[]>([]);
  const [systems, setSystems] = useState<{ en: string; zh: string }[]>([]);
  const [routes, setRoutes] = useState<TradeRoute[]>([]);
  const [loadingCommodities, setLoadingCommodities] = useState(true);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [routesSearched, setRoutesSearched] = useState(false);

  useEffect(() => {
    fetch('/api/commodities')
      .then((r) => r.json())
      .then((data) => setCommodities(data))
      .catch(console.error)
      .finally(() => setLoadingCommodities(false));

    fetch('/api/terminals?distinctSystems=true')
      .then((r) => r.json())
      .then((data) => {
        const names = data as string[];
        setSystems(names.map((name) => ({ en: name, zh: name })));
      })
      .catch(console.error);
  }, []);

  const handleFilterChange = useCallback(async (filters: RouteFilters) => {
    setLoadingRoutes(true);
    setRoutesSearched(true);
    const params = new URLSearchParams();
    if (filters.commodityId) params.set('commodityId', String(filters.commodityId));
    if (filters.originSystem) params.set('originSystem', filters.originSystem);
    if (filters.destSystem) params.set('destSystem', filters.destSystem);
    if (filters.maxInvestment) params.set('maxInvestment', String(filters.maxInvestment));
    if (filters.maxDistance) params.set('maxDistance', String(filters.maxDistance));
    if (filters.autoLoadOnly) params.set('autoLoadOnly', 'true');
    if (filters.excludeIllegal) params.set('excludeIllegal', 'true');
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    try {
      const res = await fetch(`/api/routes?${params.toString()}`);
      const data = await res.json();
      setRoutes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRoutes(false);
    }
  }, []);

  const handleCommodityClick = useCallback((commodityId: number) => {
    handleFilterChange({ commodityId, sortBy: 'roi', sortOrder: 'desc' });
  }, [handleFilterChange]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <Heatmap commodities={commodities} loading={loadingCommodities} />

      <hr className="border-border" />

      <TradeRouteFilter systems={systems} onFilterChange={handleFilterChange} loading={loadingRoutes} />

      {routesSearched && (
        <RouteTable
          routes={routes}
          loading={loadingRoutes}
          onCommodityClick={handleCommodityClick}
        />
      )}
    </div>
  );
}
