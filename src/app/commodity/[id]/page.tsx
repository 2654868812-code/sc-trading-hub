'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import type { PricePoint, TerminalInfo, CommodityWithChange } from '@/types';
import { getZhKind } from '@/lib/commodity-zh';

const LINE_COLORS = [
  '#c9a94e', '#4ade80', '#f87171', '#38bdf8', '#a78bfa',
  '#fb923c', '#2dd4bf', '#f472b6',
];

export default function CommodityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const commodityId = parseInt(id, 10);

  const [commodity, setCommodity] = useState<CommodityWithChange | null>(null);
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [terminals, setTerminals] = useState<TerminalInfo[]>([]);
  const [hours, setHours] = useState(24);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/commodities/${commodityId}`)
      .then((r) => r.json())
      .then((data: CommodityWithChange) => {
        if (data && !('error' in data)) setCommodity(data);
      })
      .catch(console.error);
  }, [commodityId]);

  useEffect(() => {
    fetch(`/api/prices/terminals?commodityId=${commodityId}`)
      .then((r) => r.json())
      .then((data: TerminalInfo[]) => setTerminals(data))
      .catch(console.error);
  }, [commodityId]);

  // Pick top 5 buy terminals and top 5 sell terminals for charts
  const chartTerminalIds = useMemo(() => {
    const buyIds = terminals.filter((t: any) => t.priceBuy > 0).slice(0, 5).map((t: any) => t.id);
    const sellIds = terminals.filter((t: any) => t.priceSell > 0).slice(0, 5).map((t: any) => t.id);
    return [...new Set([...buyIds, ...sellIds])];
  }, [terminals]);

  useEffect(() => {
    if (chartTerminalIds.length === 0) return;
    setLoading(true);
    fetch(`/api/prices?commodityId=${commodityId}&terminalIds=${chartTerminalIds.join(',')}&hours=${hours}`)
      .then((r) => r.json())
      .then((data: PricePoint[]) => setPriceData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [commodityId, chartTerminalIds, hours]);

  const { buyChartData, sellChartData, buyTerminalNames, sellTerminalNames } = useMemo(() => {
    const buyMap = new Map<string, Record<string, number | null>>();
    const sellMap = new Map<string, Record<string, number | null>>();
    const buyNames = new Set<string>();
    const sellNames = new Set<string>();

    for (const p of priceData) {
      const ts = new Date(p.fetchedAt).toLocaleString('zh-CN', {
        month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
      });
      if (p.priceBuy != null && p.priceBuy > 0) {
        if (!buyMap.has(ts)) buyMap.set(ts, {});
        buyMap.get(ts)![p.terminalName] = p.priceBuy;
        buyNames.add(p.terminalName);
      }
      if (p.priceSell != null && p.priceSell > 0) {
        if (!sellMap.has(ts)) sellMap.set(ts, {});
        sellMap.get(ts)![p.terminalName] = p.priceSell;
        sellNames.add(p.terminalName);
      }
    }

    return {
      buyChartData: Array.from(buyMap.entries()).map(([time, vals]) => ({ time, ...vals })),
      sellChartData: Array.from(sellMap.entries()).map(([time, vals]) => ({ time, ...vals })),
      buyTerminalNames: Array.from(buyNames),
      sellTerminalNames: Array.from(sellNames),
    };
  }, [priceData]);

  const buyTerminals = terminals.filter((t: any) => t.priceBuy > 0);
  const sellTerminals = terminals.filter((t: any) => t.priceSell > 0);

  return (
    <div className="space-y-7">
      {/* Back + breadcrumb */}
      <div className="flex items-center gap-3 text-sm">
        <button
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          &larr; 返回
        </button>
        <span className="text-border/40">/</span>
        <span className="text-foreground font-semibold">
          {commodity?.nameZh || '商品详情'}
        </span>
      </div>

      {/* Commodity header */}
      {commodity && (
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {commodity.nameZh}
            </h1>
            <span className="text-sm text-muted-foreground/60">
              {commodity.code}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {getZhKind(commodity.kind)}
            </span>
          </div>
          <button
            onClick={() => router.push(`/routes?commodityId=${commodityId}`)}
            className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-medium
                       hover:bg-primary/90 transition-colors"
          >
            查看贸易路线 →
          </button>
        </div>
      )}

      {/* Time range selector */}
      <div className="flex gap-1">
        {[24, 72, 168].map((h) => (
          <button
            key={h}
            onClick={() => setHours(h)}
            className={`px-4 py-1.5 text-sm rounded-md border transition-colors ${
              hours === h
                ? 'bg-primary text-primary-foreground border-primary font-medium'
                : 'border-border/30 text-muted-foreground hover:text-foreground hover:border-border/60'
            }`}
          >
            {h === 168 ? '7天' : `${h}小时`}
          </button>
        ))}
      </div>

      {/* Buy price chart */}
      <div className="section-card p-5">
        <h3 className="text-xs font-semibold tracking-[0.2em] text-chart-2 uppercase mb-3">
          买价趋势
        </h3>
        {loading ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            加载中...
          </div>
        ) : buyChartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            暂无买价数据
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={buyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(36 18% 85%)" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: 'hsl(220 5% 42%)' }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(220 5% 42%)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid hsl(36 22% 72%)',
                  borderRadius: 8,
                  color: 'hsl(220 15% 15%)',
                }}
                labelStyle={{ color: 'hsl(220 5% 42%)' }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {buyTerminalNames.map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={LINE_COLORS[i % LINE_COLORS.length]}
                  dot={false}
                  strokeWidth={2}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Sell price chart */}
      <div className="section-card p-5">
        <h3 className="text-xs font-semibold tracking-[0.2em] text-destructive uppercase mb-3">
          卖价趋势
        </h3>
        {loading ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            加载中...
          </div>
        ) : sellChartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            暂无卖价数据
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sellChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(36 18% 85%)" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: 'hsl(220 5% 42%)' }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(220 5% 42%)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid hsl(36 22% 72%)',
                  borderRadius: 8,
                  color: 'hsl(220 15% 15%)',
                }}
                labelStyle={{ color: 'hsl(220 5% 42%)' }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {sellTerminalNames.map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={LINE_COLORS[i % LINE_COLORS.length]}
                  dot={false}
                  strokeWidth={2}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Buy / Sell lists */}
      <div className="grid grid-cols-2 gap-6">
        <div className="section-card p-5">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-chart-2 uppercase mb-4">
            可购买地点
          </h3>
          <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
            {buyTerminals.map((t: any) => {
              const location = t.cityName || t.spaceStationName || (t.nameZh || t.name);
              return (
                <div
                  key={t.id}
                  className="flex justify-between items-center text-sm py-2 px-3 rounded-md
                             hover:bg-accent/50 transition-colors relative group"
                >
                  <div>
                    <span className="text-foreground/90">{location}</span>
                    <div className="text-[10px] text-muted-foreground/60">
                      {[t.starSystemName, t.planetName, t.moonName]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                    {(t.cityName || t.spaceStationName) &&
                      (t.nameZh || t.name) !== location && (
                        <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block
                                        px-2 py-1 rounded-md bg-card border border-border/40
                                        text-xs text-foreground shadow-lg whitespace-nowrap z-10">
                          {t.nameZh || t.name}
                        </div>
                      )}
                    {t.updatedAt && (
                      <div className="text-[9px] text-muted-foreground/40 mt-0.5">
                        {(() => {
                          const diff = Date.now() - new Date(t.updatedAt).getTime();
                          const mins = Math.floor(diff / 60000);
                          if (mins < 1) return '刚刚更新';
                          if (mins < 60) return `${mins} 分钟前`;
                          const hrs = Math.floor(mins / 60);
                          if (hrs < 24) return `${hrs} 小时前`;
                          return `${Math.floor(hrs / 24)} 天前`;
                        })()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] tabular-nums text-muted-foreground">
                      {t.scuBuyStock != null ? `${t.scuBuyStock.toLocaleString()}${t.scuBuyMax ? ` / ${t.scuBuyMax.toLocaleString()}` : ''}` : '—'}
                    </span>
                    {t.priceBuy > 0 && (
                      <span className="text-chart-2 text-sm tabular-nums">
                        {t.priceBuy.toLocaleString()} aUEC
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="section-card p-5">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-destructive uppercase mb-4">
            可售出地点
          </h3>
          <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
            {sellTerminals.map((t: any) => {
              const location = t.cityName || t.spaceStationName || (t.nameZh || t.name);
              return (
                <div
                  key={t.id}
                  className="flex justify-between items-center text-sm py-2 px-3 rounded-md
                             hover:bg-accent/50 transition-colors relative group"
                >
                  <div>
                    <span className="text-foreground/90">{location}</span>
                    <div className="text-[10px] text-muted-foreground/60">
                      {[t.starSystemName, t.planetName, t.moonName]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                    {(t.cityName || t.spaceStationName) &&
                      (t.nameZh || t.name) !== location && (
                        <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block
                                        px-2 py-1 rounded-md bg-card border border-border/40
                                        text-xs text-foreground shadow-lg whitespace-nowrap z-10">
                          {t.nameZh || t.name}
                        </div>
                      )}
                    {t.updatedAt && (
                      <div className="text-[9px] text-muted-foreground/40 mt-0.5">
                        {(() => {
                          const diff = Date.now() - new Date(t.updatedAt).getTime();
                          const mins = Math.floor(diff / 60000);
                          if (mins < 1) return '刚刚更新';
                          if (mins < 60) return `${mins} 分钟前`;
                          const hrs = Math.floor(mins / 60);
                          if (hrs < 24) return `${hrs} 小时前`;
                          return `${Math.floor(hrs / 24)} 天前`;
                        })()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] tabular-nums text-muted-foreground">
                      {t.scuSellStock != null ? `${t.scuSellStock.toLocaleString()}${t.scuSellMax ? ` / ${t.scuSellMax.toLocaleString()}` : ''}` : '—'}
                    </span>
                    {t.priceSell > 0 && (
                      <span className="text-destructive text-sm tabular-nums">
                        {t.priceSell.toLocaleString()} aUEC
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
