'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
  priceSell: number | null;
  priceSellAvg: number | null;
  priceSellMax: number | null;
  priceSellMin: number | null;
  scuSellStock: number | null;
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
  isAutoLoad: boolean;
  buys: TermCommodity[];
  sells: TermCommodity[];
}

interface LocationData {
  location: LocationInfo;
  terminals: TerminalGroup[];
  gameVersion: string | null;
}

function FacilityBadge({ yes, label }: { yes: boolean; label: string }) {
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] border ${yes ? 'bg-chart-2/10 text-chart-2 border-chart-2/30' : 'bg-muted/30 text-muted-foreground/40 border-border/30'}`}>
      {yes ? '✓' : '✗'} {label}
    </span>
  );
}

function CommodityRow({ c, side }: { c: TermCommodity; side: 'buy' | 'sell' }) {
  const router = useRouter();
  const price = side === 'buy' ? c.priceBuy : c.priceSell;
  const avg = side === 'buy' ? c.priceBuyAvg : c.priceSellAvg;
  const max = side === 'buy' ? c.priceBuyMax : c.priceSellMax;
  const min = side === 'buy' ? c.priceBuyMin : c.priceSellMin;
  const stock = side === 'buy' ? c.scuBuyStock : c.scuSellStock;
  const priceColor = side === 'buy' ? 'text-chart-2' : 'text-destructive';
  const hasStats = avg != null || max != null || min != null;

  return (
    <div
      onClick={() => router.push(`/commodity/${c.id}`)}
      className="py-2 px-3 rounded-md hover:bg-accent/50 transition-colors cursor-pointer flex justify-between items-start gap-2"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground/90 truncate">{c.name}</span>
          <span className="text-[10px] text-muted-foreground/50">{c.code}</span>
          {c.kindZh && <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary/70">{c.kindZh}</span>}
          {c.isIllegal && <span className="text-[9px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive/70">违禁</span>}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] tabular-nums text-muted-foreground/50">
            库存: {stock != null ? stock.toLocaleString() : '—'}
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
            {max != null && <span title="历史最高">高{max.toFixed(0)}</span>}
            {min != null && <span title="历史最低">低{min.toFixed(0)}</span>}
          </div>
        )}
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

  if (loading) return <div className="text-center py-16 text-muted-foreground">加载中…</div>;
  if (fetchError) return <div className="text-center py-16 text-muted-foreground">数据加载失败，请稍后刷新重试</div>;
  if (!data) return <div className="text-center py-16 text-muted-foreground">地点不存在</div>;

  const loc = data.location;
  const subtitle = [loc.starSystemName, loc.planetName, loc.moonName].filter(Boolean).join(' · ');

  return (
    <div className="space-y-7">
      <div className="flex items-center gap-3 text-sm">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-primary transition-colors font-medium">
          &larr; 返回
        </button>
        <span className="text-border/40">/</span>
        <span className="text-foreground font-semibold">{loc.name}</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{loc.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[11px] text-muted-foreground/60">
            {loc.terminalCount} 个交易终端
          </span>
          {data.gameVersion && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary/70">
              {data.gameVersion}
            </span>
          )}
        </div>
      </div>

      {data.terminals.map((term) => (
        <div key={term.id} className="section-card p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-semibold">{term.name}</h2>
              {term.nameEn !== term.name && (
                <span className="text-[11px] text-muted-foreground/60 ml-2">{term.nameEn}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              <FacilityBadge yes={term.hasCargoCenter} label="货柜中心" />
              <FacilityBadge yes={term.hasDockingPort} label="停泊口" />
              <FacilityBadge yes={term.hasFreightElevator} label="货运电梯" />
              <FacilityBadge yes={term.isAutoLoad} label="自动装卸" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Buyable */}
            <div>
              <h3 className="text-[11px] font-semibold tracking-[0.15em] text-chart-2 uppercase mb-2">
                可购买 {term.buys.length > 0 && <span className="font-normal text-[10px] normal-case">({term.buys.length})</span>}
              </h3>
              <div className="space-y-0.5 max-h-[350px] overflow-y-auto">
                {term.buys.length === 0 ? (
                  <div className="text-[11px] text-muted-foreground/50 py-2">无</div>
                ) : (
                  term.buys.map((c) => <CommodityRow key={c.id} c={c} side="buy" />)
                )}
              </div>
            </div>
            {/* Sellable */}
            <div>
              <h3 className="text-[11px] font-semibold tracking-[0.15em] text-destructive uppercase mb-2">
                可售出 {term.sells.length > 0 && <span className="font-normal text-[10px] normal-case">({term.sells.length})</span>}
              </h3>
              <div className="space-y-0.5 max-h-[350px] overflow-y-auto">
                {term.sells.length === 0 ? (
                  <div className="text-[11px] text-muted-foreground/50 py-2">无</div>
                ) : (
                  term.sells.map((c) => <CommodityRow key={c.id} c={c} side="sell" />)
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
