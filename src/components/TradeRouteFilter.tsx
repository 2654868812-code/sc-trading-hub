'use client';

import { useState } from 'react';
import type { RouteFilters } from '@/types';

interface TradeRouteFilterProps {
  systems: string[];
  onFilterChange: (filters: RouteFilters) => void;
  loading?: boolean;
}

export function TradeRouteFilter({ systems, onFilterChange, loading }: TradeRouteFilterProps) {
  const [originSystem, setOriginSystem] = useState('');
  const [destSystem, setDestSystem] = useState('');
  const [maxInvestment, setMaxInvestment] = useState('');
  const [maxDistance, setMaxDistance] = useState('');
  const [autoLoadOnly, setAutoLoadOnly] = useState(false);
  const [excludeIllegal, setExcludeIllegal] = useState(false);
  const [sortBy, setSortBy] = useState('roi');

  function apply() {
    onFilterChange({
      originSystem: originSystem || undefined,
      destSystem: destSystem || undefined,
      maxInvestment: maxInvestment ? parseFloat(maxInvestment) : undefined,
      maxDistance: maxDistance ? parseFloat(maxDistance) : undefined,
      autoLoadOnly,
      excludeIllegal,
      sortBy: sortBy as RouteFilters['sortBy'],
      sortOrder: 'desc',
    });
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        贸易路线筛选器
      </h2>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">起点星系</label>
          <select
            value={originSystem}
            onChange={(e) => setOriginSystem(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground"
          >
            <option value="">全部</option>
            {systems.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">终点星系</label>
          <select
            value={destSystem}
            onChange={(e) => setDestSystem(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground"
          >
            <option value="">全部</option>
            {systems.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">最大投资 (aUEC)</label>
          <input
            type="number"
            value={maxInvestment}
            onChange={(e) => setMaxInvestment(e.target.value)}
            placeholder="不限"
            className="h-9 w-32 rounded-md border border-border bg-card px-3 text-sm text-foreground"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">最大距离 (GM)</label>
          <input
            type="number"
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            placeholder="不限"
            className="h-9 w-28 rounded-md border border-border bg-card px-3 text-sm text-foreground"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground">排序</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground"
          >
            <option value="roi">ROI</option>
            <option value="profit">利润/SCU</option>
          </select>
        </div>

        <div className="flex items-center gap-4 pb-1">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoLoadOnly}
              onChange={(e) => setAutoLoadOnly(e.target.checked)}
              className="rounded"
            />
            仅自动装卸货
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={excludeIllegal}
              onChange={(e) => setExcludeIllegal(e.target.checked)}
              className="rounded"
            />
            排除违禁品
          </label>
        </div>

        <button
          onClick={apply}
          disabled={loading}
          className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? '查询中...' : '查询路线'}
        </button>
      </div>
    </div>
  );
}
