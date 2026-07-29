'use client';

import { useState } from 'react';
import { CommodityCell } from './CommodityCell';
import type { CommodityWithChange } from '@/types';
import { useRouter } from 'next/navigation';

interface HeatmapProps {
  commodities: CommodityWithChange[];
  loading?: boolean;
}

function HelpIcon({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-flex items-center cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-border text-[10px] leading-none text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
        ?
      </span>
      {show && (
        <span className="absolute left-0 top-full mt-1 w-56 p-2 rounded-md border border-border bg-card text-xs text-foreground shadow-lg z-50 whitespace-pre-line leading-relaxed">
          {text}
        </span>
      )}
    </span>
  );
}

export function Heatmap({ commodities, loading }: HeatmapProps) {
  const router = useRouter();

  const STOCK_THRESHOLD = 1500;

  // Blacklist: no stock data, or one-way trade (buy-only or sell-only)
  const displayList = commodities.filter((c) => {
    if (c.totalSellStock === 0) return false;
    if (c.isBuyable && !c.isSellable) return false;
    if (!c.isBuyable && c.isSellable) return false;
    return true;
  });

  const major = displayList
    .filter((c) => c.totalSellStock >= STOCK_THRESHOLD)
    .sort((a, b) => a.name.localeCompare(b.name));

  const minor = displayList
    .filter((c) => c.totalSellStock < STOCK_THRESHOLD)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading price data...</div>;
  }

  return (
    <div className="space-y-4">
      <section>
        <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          大宗商品
          <HelpIcon text={'交易总量大、库存充足的标准化初级商品。\n当前阈值：总卖出库存 ≥ 1,500 SCU'} />
        </h2>
        <div className="flex flex-wrap gap-2">
          {major.map((c) => (
            <CommodityCell
              key={c.id}
              name={c.name}
              nameZh={c.nameZh}
              code={c.code}
              kind={c.kind}
              kindZh={c.kindZh}
              changePercent={c.changePercent}
              onClick={() => router.push(`/commodity/${c.id}`)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          小宗商品
          <HelpIcon text={'交易规模较小、库存有限的商品。\n含农产品、日用品、轻工业品等。\n当前阈值：总卖出库存 ＜ 1,500 SCU'} />
        </h2>
        <div className="flex flex-wrap gap-2">
          {minor.map((c) => (
            <CommodityCell
              key={c.id}
              name={c.name}
              nameZh={c.nameZh}
              code={c.code}
              kind={c.kind}
              kindZh={c.kindZh}
              changePercent={c.changePercent}
              onClick={() => router.push(`/commodity/${c.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
