'use client';

import { useRouter } from 'next/navigation';
import type { TradeRoute } from '@/types';

interface RoutePairData {
  outward: TradeRoute;
  return_: TradeRoute;
  roundTripProfit: number;
  roundTripInvestment: number;
}

interface RouteTableProps {
  routes: TradeRoute[];
  routePairs?: RoutePairData[];
  loading?: boolean;
  roundTrip?: boolean;
  flipKey?: number;
  onCommodityClick?: (commodityId: number) => void;
}

function Skeleton() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-8 bg-card/50 rounded animate-pulse" />
      ))}
    </div>
  );
}

function fmtM(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

function fmtK(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return k >= 100 ? `${Math.round(k)}k` : `${(Math.round(k * 10) / 10).toFixed(1)}k`;
  }
  return n.toLocaleString();
}

function fmtTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '刚刚';
  if (mins < 60) return `${mins} 分钟前`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} 小时前`;
  const days = Math.floor(hrs / 24);
  return `${days} 天前`;
}

function StockBar({ stock, max }: { stock: number; max: number }) {
  if (stock <= 0) return <span className="text-muted-foreground/40 text-[10px]">—</span>;

  const hasMax = max > 0;
  const pct = hasMax ? Math.min(stock / max, 1) * 100 : 0;
  const barColor = hasMax
    ? pct < 33 ? 'bg-destructive/50' : pct < 66 ? 'bg-primary/50' : 'bg-chart-2/50'
    : '';

  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] tabular-nums whitespace-nowrap">
        {hasMax ? `${fmtK(stock)} / ${fmtK(max)}` : fmtK(stock)}
      </span>
      {hasMax && (
        <div className="w-7 h-1 rounded-full bg-secondary overflow-hidden flex-shrink-0">
          <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.max(pct, 5)}%` }} />
        </div>
      )}
    </div>
  );
}

export function RouteTable({ routes, routePairs, loading, roundTrip, flipKey, onCommodityClick }: RouteTableProps) {
  const shouldAnimate = flipKey && flipKey > 1;
  const router = useRouter();

  if (loading) return <Skeleton />;

  // Round-trip paired display
  if (roundTrip) {
    const pairs = routePairs || [];
    if (pairs.length === 0) {
      return (
        <div className="text-center py-16 rounded-lg border border-border section-card">
          <p className="text-muted-foreground">没有找到符合条件的往返路线</p>
          <p className="text-sm mt-1 text-muted-foreground/50">尝试放宽筛选条件或关闭往返筛选</p>
        </div>
      );
    }

    return (
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">往返路线</h2>
          <span className="h-px flex-1 bg-border/50" />
          <span className="text-[11px] text-muted-foreground/60 tabular-nums">{pairs.length} 组</span>
        </div>

        <div className="space-y-2">
          {pairs.map((pair, i) => (
            <div key={`${flipKey || 1}-${pair.outward.originTerminalId}-${pair.outward.destTerminalId}-${i}`}
              className="rounded-lg border border-border/50 bg-card/70 hover:border-border transition-colors"
              style={{
                animation: shouldAnimate ? `cellFlip 0.15s ease-in-out ${i * 150}ms both` : undefined,
              }}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-muted/30">
                <span className="text-xs text-muted-foreground">
                  {pair.outward.originLocationZh || pair.outward.originTerminalName}
                  <span className="mx-1.5 text-border/50">⇄</span>
                  {pair.outward.destLocationZh || pair.outward.destTerminalName}
                </span>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-muted-foreground">
                    往返成本 <span className="font-semibold tabular-nums text-foreground">{fmtM(pair.roundTripInvestment)}</span>
                  </span>
                  <span className="text-muted-foreground">
                    往返利润 <span className="font-semibold tabular-nums text-chart-2">+{fmtM(pair.roundTripProfit)}</span>
                  </span>
                </div>
              </div>

              {/* Route rows */}
              <div className="divide-y divide-border/20">
                <RouteRow route={pair.outward} label="去程" router={router} onCommodityClick={onCommodityClick} />
                <RouteRow route={pair.return_} label="回程" router={router} onCommodityClick={onCommodityClick} />
              </div>
            </div>
          ))}

        </div>
      </div>
    );
  }

  // Normal table display
  if (routes.length === 0) {
    return (
      <div className="text-center py-16 rounded-lg border border-border section-card">
        <p className="text-muted-foreground">没有找到符合条件的路线</p>
        <p className="text-sm mt-1 text-muted-foreground/50">尝试放宽筛选条件</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground">路线结果</h2>
        <span className="h-px flex-1 bg-border/50" />
        <span className="text-[11px] text-muted-foreground/60 tabular-nums">{routes.length} 条</span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <RouteTableInner routes={routes} router={router} onCommodityClick={onCommodityClick} flipKey={flipKey} />
      </div>
    </div>
  );
}

/** Single route row in a round-trip card */
function RouteRow({ route: r, label, router, onCommodityClick }: {
  route: TradeRoute; label: string;
  router: ReturnType<typeof useRouter>;
  onCommodityClick?: (commodityId: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 text-xs">
      <span className="text-[10px] text-muted-foreground/70 w-8 flex-shrink-0">{label}</span>

      <button onClick={() => onCommodityClick?.(r.commodityId)}
        className="hover:text-primary transition-colors text-left w-[90px] truncate flex-shrink-0 font-medium"
        title={r.commodityName}>
        {r.commodityNameZh || r.commodityName}
        {r.isIllegal && <span className="text-destructive/80 ml-0.5">!</span>}
      </button>

      <button onClick={() => router.push(`/location/${encodeURIComponent(r.originLocationZh || r.originTerminalNameZh || r.originTerminalName)}`)}
        className="hover:text-primary transition-colors text-left w-[90px] truncate flex-shrink-0"
        title={r.originLocationEn || r.originTerminalNameEn || r.originLocationZh || r.originTerminalName}>
        {r.originLocationZh || r.originTerminalNameZh || r.originTerminalName}
      </button>

      <span className="text-muted-foreground/40 flex-shrink-0">→</span>

      <button onClick={() => router.push(`/location/${encodeURIComponent(r.destLocationZh || r.destTerminalNameZh || r.destTerminalName)}`)}
        className="hover:text-primary transition-colors text-left w-[90px] truncate flex-shrink-0"
        title={r.destLocationEn || r.destTerminalNameEn || r.destLocationZh || r.destTerminalName}>
        {r.destLocationZh || r.destTerminalNameZh || r.destTerminalName}
      </button>

      <span className="tabular-nums w-14 text-right flex-shrink-0">买 {fmtM(r.buyPrice)}</span>
      <span className="tabular-nums w-14 text-right flex-shrink-0">卖 {fmtM(r.sellPrice)}</span>

      <span className="tabular-nums w-16 text-right text-chart-2 font-semibold flex-shrink-0">
        +{fmtM(r.totalProfit)}
      </span>

      <span className="tabular-nums w-12 text-right flex-shrink-0">{r.roi}%</span>

      <span className="text-[10px] text-muted-foreground/50 flex-shrink-0">
        {r.distanceGm != null ? `${r.distanceGm} GM` : '—'}
      </span>
    </div>
  );
}

/** Normal table (reused for non-round-trip and unpaired routes) */
function RouteTableInner({ routes, router, onCommodityClick, flipKey }: {
  routes: TradeRoute[];
  router: ReturnType<typeof useRouter>;
  onCommodityClick?: (commodityId: number) => void;
  flipKey?: number;
}) {
  const shouldAnimate = flipKey && flipKey > 1;
  return (
    <table className="w-full table-zebra">
      <thead>
        <tr>
          <th className="th-cell">商品</th>
          <th className="th-cell">购买地</th>
          <th className="th-cell--right">买价</th>
          <th className="th-cell">均/最大库存</th>
          <th className="th-cell">出售地</th>
          <th className="th-cell--right">卖价</th>
          <th className="th-cell">均/最大库存</th>
          <th className="th-cell--right">成本</th>
          <th className="th-cell--right">利润</th>
          <th className="th-cell--right">/SCU</th>
          <th className="th-cell--right">ROI</th>
          <th className="th-cell--right">距离</th>
          <th className="th-cell">货箱</th>
          <th className="th-cell-last">自动</th>
        </tr>
      </thead>
      <tbody>
        {routes.map((r, i) => (
          <tr key={`${flipKey || 1}-${r.commodityId}-${r.originTerminalId}-${r.destTerminalId}-${i}`}
            style={{
              animation: shouldAnimate ? `rowFlip 0.12s ease-in-out ${i * 120}ms both` : undefined,
            }}>
            <td className="td-cell">
              <button onClick={() => onCommodityClick?.(r.commodityId)}
                className="hover:text-primary transition-colors text-left leading-tight inline-flex items-center gap-1"
                title={r.commodityName}>
                {r.commodityNameZh || r.commodityName}
                {r.isIllegal && (
                  <span className="relative group/illegal inline-flex items-center">
                    <span className="text-[11px] font-bold text-destructive/80">!</span>
                    <span className="absolute left-0 bottom-full mb-1 hidden group-hover/illegal:block
                                    w-48 p-2 rounded-md bg-foreground text-background text-[10px] leading-relaxed
                                    shadow-xl pointer-events-none z-50 whitespace-normal">
                      违禁品需要前往非法终端售卖
                    </span>
                  </span>
                )}
              </button>
              <div className="text-[9px] text-muted-foreground/55">{r.commodityKindZh}</div>
            </td>
            <td className="td-cell">
              <button
                onClick={() => router.push(`/location/${encodeURIComponent(r.originLocationZh || r.originTerminalNameZh || r.originTerminalName)}`)}
                className="hover:text-primary transition-colors text-left leading-tight"
                title={r.originLocationEn || r.originTerminalNameEn || r.originLocationZh || r.originTerminalName}
              >
                {r.originLocationZh || r.originTerminalNameZh || r.originTerminalName}
              </button>
              <div className="text-[9px] text-muted-foreground/50">
                {[r.originSystemName, r.originPlanetName, r.originMoonName].filter(Boolean).join(' · ')}
              </div>
              <div className="text-[8px] text-muted-foreground/35">{fmtTime(r.originUpdatedAt)}</div>
            </td>
            <td className="td-cell--right">{fmtM(r.buyPrice)}</td>
            <td className="td-cell"><StockBar stock={r.originStock} max={r.originStockMax} /></td>
            <td className="td-cell">
              <button
                onClick={() => router.push(`/location/${encodeURIComponent(r.destLocationZh || r.destTerminalNameZh || r.destTerminalName)}`)}
                className="hover:text-primary transition-colors text-left leading-tight"
                title={r.destLocationEn || r.destTerminalNameEn || r.destLocationZh || r.destTerminalName}
              >
                {r.destLocationZh || r.destTerminalNameZh || r.destTerminalName}
              </button>
              <div className="text-[9px] text-muted-foreground/50">
                {[r.destSystemName, r.destPlanetName, r.destMoonName].filter(Boolean).join(' · ')}
              </div>
              <div className="text-[8px] text-muted-foreground/35">{fmtTime(r.destUpdatedAt)}</div>
            </td>
            <td className="td-cell--right">{fmtM(r.sellPrice)}</td>
            <td className="td-cell"><StockBar stock={r.destStock} max={r.destStockMax} /></td>
            <td className="td-cell--right">
              <span className="cursor-help border-b border-dotted border-muted-foreground/30" title={`买价(${fmtM(r.buyPrice)}) × 可售量(${r.sellScu}) = ${fmtM(r.totalInvestment)}`}>{fmtM(r.totalInvestment)}</span>
            </td>
            <td className="td-cell--right text-chart-2 font-semibold">
              <span className="cursor-help border-b border-dotted border-chart-2/30" title={`${fmtM(r.profitPerScu)}/SCU × ${r.sellScu} = ${fmtM(r.totalProfit)}`}>+{fmtM(r.totalProfit)}</span>
            </td>
            <td className="td-cell--right">{fmtM(r.profitPerScu)}</td>
            <td className="td-cell--right">
              <span className="text-chart-2">{r.roi}%</span>
            </td>
            <td className="td-cell--right">
              {r.distanceGm != null ? `${r.distanceGm} GM` : '—'}
            </td>
            <td className="td-cell">
              {r.containerSizesOrigin ? (
                <span className="text-[10px] whitespace-nowrap">
                  {r.containerSizesOrigin.split(',').join('·')}
                </span>
              ) : (
                <span className="text-muted-foreground/40 text-[10px]">—</span>
              )}
            </td>
            <td className="td-cell-last">
              <span className={`inline-block w-2 h-2 rounded-full ${
                r.isAutoLoadOrigin && r.isAutoLoadDest
                  ? 'bg-primary'
                  : r.isAutoLoadOrigin || r.isAutoLoadDest
                  ? 'ring-1 ring-primary bg-primary/40'
                  : 'ring-1 ring-primary/30'
              }`}></span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
