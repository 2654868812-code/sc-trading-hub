'use client';

import type { TradeRoute } from '@/types';
import { getLocationZh } from '@/lib/location-zh';

interface RouteTableProps {
  routes: TradeRoute[];
  loading?: boolean;
  onCommodityClick?: (commodityId: number) => void;
}

export function RouteTable({ routes, loading, onCommodityClick }: RouteTableProps) {
  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Calculating routes...</div>;
  }

  if (routes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        没有找到符合条件的路线。尝试放宽筛选条件。
      </div>
    );
  }

  function fmtTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '刚刚';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  }

  return (
    <div>
      <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-2 font-medium text-muted-foreground">商品</th>
            <th className="text-left py-2 px-2 font-medium text-muted-foreground">购买地</th>
            <th className="text-right py-2 px-2 font-medium text-muted-foreground">买价</th>
            <th className="text-right py-2 px-2 font-medium text-muted-foreground">库存</th>
            <th className="text-left py-2 px-2 font-medium text-muted-foreground">出售地</th>
            <th className="text-right py-2 px-2 font-medium text-muted-foreground">卖价</th>
            <th className="text-right py-2 px-2 font-medium text-muted-foreground">库存</th>
            <th className="text-right py-2 px-2 font-medium text-muted-foreground">利润/SCU</th>
            <th className="text-right py-2 px-2 font-medium text-muted-foreground">ROI</th>
            <th className="text-center py-2 px-2 font-medium text-muted-foreground">自动装卸</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r, i) => (
            <tr key={`${r.commodityId}-${r.originTerminalId}-${r.destTerminalId}-${i}`}
                className="border-b border-border/50 hover:bg-card/50">
              <td className="py-2 px-2">
                <button
                  onClick={() => onCommodityClick?.(r.commodityId)}
                  className="text-primary hover:underline text-left"
                >
                  {r.commodityNameZh || r.commodityName}
                </button>
              </td>
              <td className="py-2 px-2">
                {r.originLocationZh || r.originTerminalNameZh || r.originTerminalName}
                <div className="text-[10px] text-muted-foreground">{getLocationZh(r.originSystemName)}</div>
                <div className="text-[9px] text-muted-foreground/60">{fmtTime(r.originUpdatedAt)}</div>
              </td>
              <td className="py-2 px-2 text-right font-mono text-foreground">
                {r.buyPrice.toLocaleString()}
              </td>
              <td className="py-2 px-2 text-right font-mono text-muted-foreground">
                {r.originStock > 0 ? r.originStock.toLocaleString() : '-'}
              </td>
              <td className="py-2 px-2">
                {r.destLocationZh || r.destTerminalNameZh || r.destTerminalName}
                <div className="text-[10px] text-muted-foreground">{getLocationZh(r.destSystemName)}</div>
                <div className="text-[9px] text-muted-foreground/60">{fmtTime(r.destUpdatedAt)}</div>
              </td>
              <td className="py-2 px-2 text-right font-mono text-foreground">
                {r.sellPrice.toLocaleString()}
              </td>
              <td className="py-2 px-2 text-right font-mono text-muted-foreground">
                {r.destStock > 0 ? r.destStock.toLocaleString() : '-'}
              </td>
              <td className="py-2 px-2 text-right font-mono text-green-400">
                {r.profitPerScu.toLocaleString()}
              </td>
              <td className="py-2 px-2 text-right font-mono text-foreground">
                {r.roi}%
              </td>
              <td className="py-2 px-2 text-center">
                {r.isAutoLoadOrigin && r.isAutoLoadDest ? '✓' : '✗'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
