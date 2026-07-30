'use client';

import { useEffect, useState, useCallback } from 'react';
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
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'name' | 'margin' | 'profit'>('name');
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch('/api/commodities').then((r) => {
        setLastUpdated(r.headers.get('X-LastUpdated'));
        return r.json();
      }),
      fetch('/api/version').then((r) => r.json()),
    ])
      .then(([data, ver]) => {
        setCommodities(data);
        setGameVersion(ver.gameVersion);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCommodityClick = useCallback(
    (commodityId: number) => {
      router.push(`/commodity/${commodityId}`);
    },
    [router]
  );

  return (
    <>
      <div className="flex items-center gap-3 mb-3 text-[13px] text-muted-foreground/60">
        <span className="data-pulse-dot" />
        <span className="text-chart-2">{fmtLastUpdated(lastUpdated)}</span>
        <span className="text-border/40">·</span>
        <span className="tabular-nums">{commodities.filter(c => (c.currentSellAvg != null && c.currentSellAvg > 0) || (c.currentBuyAvg != null && c.currentBuyAvg > 0)).length} 种</span>
        {gameVersion && (
          <>
            <span className="text-border/40">·</span>
            <span>版本：{gameVersion}</span>
          </>
        )}
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
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索商品…"
          className="h-7 w-44 rounded-md border border-border/50 bg-secondary px-2.5 text-xs text-foreground
                     placeholder:text-muted-foreground/40 outline-none
                     focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
        />
      </div>

      <Heatmap
        commodities={commodities}
        loading={loading}
        search={search}
        sort={sort}
        onCommodityClick={handleCommodityClick}
      />
    </>
  );
}
