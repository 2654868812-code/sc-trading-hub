'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Heatmap } from '@/components/Heatmap';
import type { CommodityWithChange } from '@/types';

function fmtLastUpdated(iso: string | null) {
  if (!iso) return '暂无数据';
  const d = new Date(iso);
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
  if (diffMin < 1) return '刚刚更新数据';
  if (diffMin < 60) return `${diffMin} 分钟前更新数据`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} 小时前更新数据`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} 天前更新数据`;
}

export default function HomePage() {
  const [commodities, setCommodities] = useState<CommodityWithChange[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [gameVersion, setGameVersion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<'name' | 'margin' | 'profit'>('name');
  const [flipKey, setFlipKey] = useState(1);
  const [index, setIndex] = useState<{ current: number | null; change: number | null; min: number; max: number; history: { v: number; t: string }[] }>({ current: null, change: null, min: 0, max: 100, history: [] });
  const router = useRouter();

  const lastCommoditySyncRef = useRef<string | null>(null);
  const [, setTick] = useState(0);

  const fetchCommodities = useCallback(async (signal?: AbortSignal) => {
    try {
      const [dataRes, verRes, idxRes] = await Promise.all([
        fetch('/api/commodities', { signal }),
        fetch('/api/version', { signal }),
        fetch('/api/market-index?days=14', { signal }),
      ]);
      if (signal?.aborted) return;
      if (!dataRes.ok) throw new Error(`HTTP ${dataRes.status}`);
      const lastUpd = dataRes.headers.get('X-LastUpdated');
      setLastUpdated(lastUpd);
      if (lastUpd) lastCommoditySyncRef.current = lastUpd;
      const [data, ver, idx] = await Promise.all([dataRes.json(), verRes.json(), idxRes.json()]);
      if (signal?.aborted) return;
      setCommodities(data);
      setGameVersion(ver.gameVersion);
      setIndex(idx);
      setError(null);
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error(err);
      setError('数据加载失败，请稍后刷新重试');
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    fetchCommodities(ac.signal).finally(() => setLoading(false));
    return () => ac.abort();
  }, [fetchCommodities]);

  // Tick every 60s to keep relative time display fresh
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(timer);
  }, []);

  // Poll market index every 60s
  useEffect(() => {
    let active = true;
    const refreshIndex = async () => {
      try {
        const res = await fetch('/api/market-index?days=1');
        if (!active || !res.ok) return;
        const idx = await res.json();
        if (!active) return;
        setIndex(prev => {
          if (idx.current != null && idx.current !== prev.current) {
            return { ...prev, current: idx.current, min: idx.min ?? prev.min, max: idx.max ?? prev.max };
          }
          return prev;
        });
      } catch { /* ignore */ }
    };
    const timer = setInterval(refreshIndex, 60_000);
    return () => { active = false; clearInterval(timer); };
  }, []);

  // Poll for data sync every 60s, auto-refresh commodities
  useEffect(() => {
    let cancelled = false;
    const timer = setInterval(async () => {
      try {
        const res = await fetch('/api/data-freshness');
        if (cancelled || !res.ok) return;
        const { latestFetchedAt } = await res.json();
        if (latestFetchedAt && lastCommoditySyncRef.current && lastCommoditySyncRef.current !== latestFetchedAt) {
          const ac = new AbortController();
          await fetchCommodities(ac.signal);
          if (cancelled) { ac.abort(); return; }
          setFlipKey((k) => k + 1);
        }
        if (latestFetchedAt && !cancelled) lastCommoditySyncRef.current = latestFetchedAt;
      } catch { /* network error — retry next interval */ }
    }, 60_000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [fetchCommodities]);

  const handleCommodityClick = useCallback(
    (commodityId: number) => {
      router.push(`/commodity/${commodityId}`);
    },
    [router]
  );

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 mb-2 lg:mb-3 text-[11px] sm:text-[12px] lg:text-[13px] text-muted-foreground/60 flex-wrap">
        <span className="data-pulse-dot" />
        <span className="text-chart-2">{fmtLastUpdated(lastUpdated)}</span>
        {index.current != null && (
          <>
            <span className="text-border/40">·</span>
            <button
              onClick={() => router.push('/market-index')}
              className="hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              <span className="text-primary">泛天指数：</span>
              <span className="tabular-nums font-semibold" style={{
                color: (() => {
                  const range = index.max - index.min || 1;
                  const pct = (index.current! - index.min) / range;
                  const h = Math.round(pct * 142);
                  return `hsl(${h}, 65%, 45%)`;
                })(),
              }}>{index.current.toFixed(1)}%</span>
            </button>
          </>
        )}
        {gameVersion && (
          <>
            <span className="text-border/40">·</span>
            <span>游戏版本：{gameVersion}</span>
          </>
        )}
        <span className="text-border/40">·</span>
        <span className="tabular-nums">{commodities.filter(c => (c.currentSellAvg != null && c.currentSellAvg > 0) || (c.currentBuyAvg != null && c.currentBuyAvg > 0)).length} 种</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'name' | 'margin' | 'profit')}
          className="ml-auto h-7 rounded-md border border-border/50 bg-secondary px-2 text-xs text-foreground outline-none
                     focus:border-primary/50 transition-colors cursor-pointer appearance-none"
        >
          <option value="name">按名称</option>
          <option value="margin">按利润率</option>
          <option value="profit">按利润</option>
        </select>
      </div>

      {error && (
        <div className="text-center py-8">
          <p className="text-sm text-destructive">{error}</p>
          <button onClick={() => window.location.reload()}
            className="mt-2 text-xs px-4 py-1.5 rounded-md border border-border/40 bg-secondary
                       hover:bg-accent transition-colors">
            刷新页面
          </button>
        </div>
      )}
      {!error && (
        <Heatmap
          commodities={commodities}
          loading={loading}
          flipKey={flipKey}
          sort={sort}
          onCommodityClick={handleCommodityClick}
        />
      )}
    </>
  );
}
