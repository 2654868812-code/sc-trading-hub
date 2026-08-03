'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

interface LocationInfo {
  name: string;
  starSystemName: string | null;
  starSystemNameEn: string | null;
  planetName: string | null;
  planetNameEn: string | null;
  moonName: string | null;
  moonNameEn: string | null;
  terminalCount: number;
}

interface TermCommodity {
  id: number;
  name: string;
  nameEn: string;
  code: string;
  kind: string | null;
  kindZh: string;
  isIllegal: boolean;
  profitMargin: number | null;
  priceBuy: number | null;
  priceBuyAvg: number | null;
  priceBuyMax: number | null;
  priceBuyMin: number | null;
  scuBuyStock: number | null;
  scuBuyMax: number | null;
  priceSell: number | null;
  priceSellAvg: number | null;
  priceSellMax: number | null;
  priceSellMin: number | null;
  scuSellStock: number | null;
  scuSellMax: number | null;
  updatedAt: string;
}

interface TerminalGroup {
  id: number;
  name: string;
  nameEn: string;
  type: string | null;
  hasCargoCenter: boolean;
  hasDockingPort: boolean;
  hasFreightElevator: boolean;
  hasLoadingDock: boolean;
  isAutoLoad: boolean;
  isRefinery: boolean;
  isMedical: boolean;
  isFood: boolean;
  isRefuel: boolean;
  isRepair: boolean;
  isHabitation: boolean;
  buys: TermCommodity[];
  sells: TermCommodity[];
}

interface LocationData {
  location: LocationInfo;
  terminals: TerminalGroup[];
  gameVersion: string | null;
}

interface PricePoint {
  fetchedAt: string;
  priceBuy: number | null;
  priceSell: number | null;
  commodityName: string;
  commodityId: number;
}

const LINE_COLORS = [
  '#c9a94e', '#4ade80', '#f87171', '#38bdf8', '#a78bfa',
  '#fb923c', '#2dd4bf', '#f472b6',
];

function FacilityBadge({ yes, label }: { yes: boolean; label: string }) {
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] border ${yes ? 'bg-chart-2/10 text-chart-2 border-chart-2/30' : 'bg-muted/30 text-muted-foreground/40 border-border/30'}`}>
      {yes ? '✓' : '✗'} {label}
    </span>
  );
}

function MergedFacilities({ terminals }: { terminals: TerminalGroup[] }) {
  const hasCargoCenter = terminals.some(t => t.hasCargoCenter);
  const hasDockingPort = terminals.some(t => t.hasDockingPort);
  const hasFreightElevator = terminals.some(t => t.hasFreightElevator);
  const hasLoadingDock = terminals.some(t => t.hasLoadingDock);
  const isAutoLoad = terminals.some(t => t.isAutoLoad);
  const isRefinery = terminals.some(t => t.isRefinery);
  const isMedical = terminals.some(t => t.isMedical);
  const isFood = terminals.some(t => t.isFood);
  const isRefuel = terminals.some(t => t.isRefuel);
  const isRepair = terminals.some(t => t.isRepair);
  const isHabitation = terminals.some(t => t.isHabitation);

  const hasAny = hasCargoCenter || hasDockingPort || hasFreightElevator || hasLoadingDock
    || isAutoLoad || isRefinery || isMedical || isFood || isRefuel || isRepair || isHabitation;
  if (!hasAny) return null;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {hasCargoCenter && <FacilityBadge yes label="货运中心" />}
      {hasDockingPort && <FacilityBadge yes label="停机坪" />}
      {hasFreightElevator && <FacilityBadge yes label="货梯" />}
      {hasLoadingDock && <FacilityBadge yes label="外部货柜" />}
      {isAutoLoad && <FacilityBadge yes label="自动装卸" />}
      {isRefinery && <FacilityBadge yes label="精炼站" />}
      {isMedical && <FacilityBadge yes label="医疗" />}
      {isFood && <FacilityBadge yes label="餐饮" />}
      {isRefuel && <FacilityBadge yes label="加油" />}
      {isRepair && <FacilityBadge yes label="维修" />}
      {isHabitation && <FacilityBadge yes label="居住区" />}
    </div>
  );
}

function CommodityRow({ c, side, terminalName }: { c: TermCommodity; side: 'buy' | 'sell'; terminalName?: string }) {
  const router = useRouter();
  const price = side === 'buy' ? c.priceBuy : c.priceSell;
  const avg = side === 'buy' ? c.priceBuyAvg : c.priceSellAvg;
  const maxPrice = side === 'buy' ? c.priceBuyMax : c.priceSellMax;
  const minPrice = side === 'buy' ? c.priceBuyMin : c.priceSellMin;
  const stock = side === 'buy' ? c.scuBuyStock : c.scuSellStock;
  const stockMax = side === 'buy' ? c.scuBuyMax : c.scuSellMax;
  const priceColor = side === 'buy' ? 'text-chart-2' : 'text-destructive';
  const hasStats = avg != null || maxPrice != null || minPrice != null;

  return (
    <div
      onClick={() => router.push(`/commodity/${c.id}`)}
      className="py-2 px-3 rounded-md hover:bg-accent/50 transition-colors cursor-pointer flex justify-between items-start gap-2"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-foreground/90 truncate hover:text-primary transition-colors">{c.name}</span>
          {c.kindZh && <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary/70">{c.kindZh}</span>}
          {c.isIllegal && <span className="text-[9px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive/70">违禁</span>}
        </div>
        <div className="text-[10px] text-muted-foreground/60">
          {[terminalName, c.nameEn, c.code].filter(Boolean).join(' · ')}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] tabular-nums text-muted-foreground/50">
            库存: {stock != null ? stock.toLocaleString() : '—'}
            {stockMax ? ` / ${stockMax.toLocaleString()}` : ''}
          </span>
          {c.profitMargin != null && (
            <span className={`text-[10px] tabular-nums ${c.profitMargin > 0 ? 'text-chart-2' : 'text-destructive'}`}>
              {c.profitMargin > 0 ? '+' : ''}{c.profitMargin}%
            </span>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        {price != null && price > 0 && (
          <div className={`text-sm tabular-nums font-medium ${priceColor}`}>
            {price.toLocaleString()} aUEC
          </div>
        )}
        {hasStats && (
          <div className="text-[10px] tabular-nums text-muted-foreground/70 flex gap-1.5 justify-end mt-0.5">
            {avg != null && <span title="历史均价">均{avg.toFixed(0)}</span>}
            {maxPrice != null && <span title="历史最高">高{maxPrice.toFixed(0)}</span>}
            {minPrice != null && <span title="历史最低">低{minPrice.toFixed(0)}</span>}
          </div>
        )}
        <div className="text-[9px] text-muted-foreground/30 mt-0.5">
          {(() => {
            const diff = Date.now() - new Date(c.updatedAt).getTime();
            const mins = Math.floor(diff / 60000);
            if (mins < 1) return '刚刚';
            if (mins < 60) return `${mins}分钟前`;
            const hrs = Math.floor(mins / 60);
            if (hrs < 24) return `${hrs}小时前`;
            return `${Math.floor(hrs / 24)}天前`;
          })()}
        </div>
      </div>
    </div>
  );
}

export default function LocationDetailPage() {
  const { name } = useParams<{ name: string }>();
  const router = useRouter();
  const locationName = decodeURIComponent(name);

  const [data, setData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  // Chart state
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [hours, setHours] = useState(24);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    setFetchError(false);
    fetch(`/api/locations/${encodeURIComponent(locationName)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: LocationData & { error?: string }) => {
        if ('error' in d) { setFetchError(true); return; }
        setData(d);
      })
      .catch((err) => {
        console.error(err);
        setFetchError(true);
      })
      .finally(() => setLoading(false));
  }, [locationName]);

  // Fetch chart data
  useEffect(() => {
    setChartLoading(true);
    fetch(`/api/prices/location?locationName=${encodeURIComponent(locationName)}&hours=${hours}`)
      .then(r => r.json())
      .then((d: PricePoint[]) => setPriceData(d))
      .catch(() => {})
      .finally(() => setChartLoading(false));
  }, [locationName, hours]);

  // Process chart data
  const { buyChartData, sellChartData, buyNames, sellNames } = useMemo(() => {
    const buyMap = new Map<string, Record<string, number | null>>();
    const sellMap = new Map<string, Record<string, number | null>>();
    const bNames = new Set<string>();
    const sNames = new Set<string>();

    for (const p of priceData) {
      const ts = new Date(p.fetchedAt).toLocaleString('zh-CN', {
        month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
      });
      if (p.priceBuy != null && p.priceBuy > 0) {
        if (!buyMap.has(ts)) buyMap.set(ts, {});
        buyMap.get(ts)![p.commodityName] = p.priceBuy;
        bNames.add(p.commodityName);
      }
      if (p.priceSell != null && p.priceSell > 0) {
        if (!sellMap.has(ts)) sellMap.set(ts, {});
        sellMap.get(ts)![p.commodityName] = p.priceSell;
        sNames.add(p.commodityName);
      }
    }

    return {
      buyChartData: Array.from(buyMap.entries()).map(([time, vals]) => ({ time, ...vals })),
      sellChartData: Array.from(sellMap.entries()).map(([time, vals]) => ({ time, ...vals })),
      buyNames: Array.from(bNames),
      sellNames: Array.from(sNames),
    };
  }, [priceData]);

  if (loading) return <div className="text-center py-16 text-muted-foreground">加载中…</div>;
  if (fetchError) return <div className="text-center py-16 text-muted-foreground">数据加载失败，请稍后刷新重试</div>;
  if (!data) return <div className="text-center py-16 text-muted-foreground">地点不存在</div>;

  const loc = data.location;
  const subtitle = [loc.starSystemName, loc.planetName, loc.moonName].filter(Boolean).join(' · ');

  return (
    <div className="space-y-7">
      {/* Back + breadcrumb */}
      <div className="flex items-center gap-3 text-sm">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-primary transition-colors font-medium">
          &larr; 返回
        </button>
        <span className="text-border/40">/</span>
        <span className="text-foreground font-semibold">{loc.name}</span>
      </div>

      {/* Location header — same style as commodity detail */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{loc.name}</h1>
          <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {loc.terminalCount} 个终端
          </span>
        </div>
        <button
          onClick={() => router.push(`/routes?originLocation=${encodeURIComponent(loc.name)}`)}
          className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-medium
                     hover:bg-primary/90 transition-colors"
        >
          查看贸易路线 →
        </button>
      </div>
      {subtitle && (
        <p className="text-sm text-muted-foreground/60 -mt-4">{subtitle}</p>
      )}

      {/* Terminal facilities — merged union across all terminals */}
      <div className="-mt-2">
        <MergedFacilities terminals={data.terminals} />
      </div>

      {/* Time range selector — same as commodity detail */}
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

      {/* Buy / Sell price charts — same layout as commodity detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="section-card p-5">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-chart-2 uppercase mb-3">买价趋势</h3>
          {chartLoading ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">加载中...</div>
          ) : buyChartData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">暂无买价数据</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={buyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(36 18% 85%)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'hsl(220 5% 42%)' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(220 5% 42%)' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid hsl(36 22% 72%)', borderRadius: 8, color: 'hsl(220 15% 15%)' }} labelStyle={{ color: 'hsl(220 5% 42%)' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {buyNames.map((name, i) => (
                  <Line key={name} type="monotone" dataKey={name} stroke={LINE_COLORS[i % LINE_COLORS.length]} dot={false} strokeWidth={2} connectNulls />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="section-card p-5">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-destructive uppercase mb-3">卖价趋势</h3>
          {chartLoading ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">加载中...</div>
          ) : sellChartData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">暂无卖价数据</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sellChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(36 18% 85%)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'hsl(220 5% 42%)' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(220 5% 42%)' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid hsl(36 22% 72%)', borderRadius: 8, color: 'hsl(220 15% 15%)' }} labelStyle={{ color: 'hsl(220 5% 42%)' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {sellNames.map((name, i) => (
                  <Line key={name} type="monotone" dataKey={name} stroke={LINE_COLORS[i % LINE_COLORS.length]} dot={false} strokeWidth={2} connectNulls />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Buy / Sell lists — two section-cards like commodity detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="section-card p-5">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-chart-2 uppercase mb-4">
            可购买商品
          </h3>
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {data.terminals.flatMap(t => t.buys.map(c => ({ c, termName: t.name }))).length === 0 ? (
              <div className="text-sm text-muted-foreground/50 py-4">暂无</div>
            ) : (
              data.terminals.flatMap(t => t.buys.map(c => ({ c, termName: t.name }))).map(({ c, termName }) => (
                <CommodityRow key={`b-${c.id}-${termName}`} c={c} side="buy" terminalName={termName} />
              ))
            )}
          </div>
        </div>

        <div className="section-card p-5">
          <h3 className="text-xs font-semibold tracking-[0.2em] text-destructive uppercase mb-4">
            可售出商品
          </h3>
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            {data.terminals.flatMap(t => t.sells.map(c => ({ c, termName: t.name }))).length === 0 ? (
              <div className="text-sm text-muted-foreground/50 py-4">暂无</div>
            ) : (
              data.terminals.flatMap(t => t.sells.map(c => ({ c, termName: t.name }))).map(({ c, termName }) => (
                <CommodityRow key={`s-${c.id}-${termName}`} c={c} side="sell" terminalName={termName} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
