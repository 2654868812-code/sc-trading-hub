'use client';

import { useState } from 'react';
import { CommodityCell } from './CommodityCell';
import type { CommodityWithChange } from '@/types';

interface HeatmapProps {
  commodities: CommodityWithChange[];
  loading?: boolean;
  search?: string;
  sort?: 'name' | 'margin' | 'profit';
  onCommodityClick: (commodityId: number) => void;
}

function HelpDot({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      <svg width="14" height="14" viewBox="0 0 14 14" className="cursor-help stroke-muted-foreground/55 hover:stroke-foreground transition-colors" fill="none" strokeWidth="1">
        <circle cx="7" cy="7" r="6.5" />
        <text x="7" y="10.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="9" fontWeight="600" fontFamily="sans-serif">?</text>
      </svg>
      {show && (
        <span className="absolute left-0 top-full mt-1 w-52 p-2 rounded-md border border-border bg-card text-[10px] leading-relaxed text-foreground shadow-lg z-50 whitespace-pre-line">
          {text}
        </span>
      )}
    </span>
  );
}

function SectionHeader({ title, help }: { title: string; help?: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <h2 className="text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground flex items-center gap-1.5">
        {title}
        {help && <HelpDot text={help} />}
      </h2>
      <span className="h-px flex-1 bg-border/50" />
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((s) => (
        <div key={s}>
          <div className="h-3 w-20 bg-muted rounded mb-3 animate-pulse" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-[60px] rounded-lg bg-muted/50 animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Heatmap({ commodities, loading, search, sort = 'name', onCommodityClick }: HeatmapProps) {
  if (loading) return <Skeleton />;

  const q = (search || '').toLowerCase();
  const displayList = commodities.filter((c) => {
    if (!(c.currentSellAvg != null && c.currentSellAvg > 0) &&
        !(c.currentBuyAvg != null && c.currentBuyAvg > 0)) return false;
    if (!q) return true;
    return c.nameZh.toLowerCase().includes(q) ||
           c.nameEn.toLowerCase().includes(q) ||
           c.code.toLowerCase().includes(q) ||
           c.kindZh.toLowerCase().includes(q);
  });

  function sortFn(a: CommodityWithChange, b: CommodityWithChange): number {
    if (sort === 'margin') return (b.profitMargin ?? -Infinity) - (a.profitMargin ?? -Infinity);
    if (sort === 'profit') {
      const unitProfit = (c: CommodityWithChange): number => {
        if (c.currentSellAvg == null || c.currentBuyAvg == null) return -Infinity;
        return c.currentSellAvg - c.currentBuyAvg;
      };
      return unitProfit(b) - unitProfit(a);
    }
    return a.name.localeCompare(b.name);
  }

  const sorted = [...displayList].sort(sortFn);
  const major = sorted.filter((c) => c.isDazong);
  const minor = sorted.filter((c) => !c.isDazong);

  return (
    <div className="space-y-3">
      <section>
        <SectionHeader title="大宗商品" help={`历史最大买量 ≥ 2,000 SCU\n流通量大、供需稳定的主流贸易品`} />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-1">
          {major.map((c) => (
            <CommodityCell
              key={c.id}
              nameEn={c.nameEn}
              nameZh={c.nameZh}
              kindZh={c.kindZh}
              profitMargin={c.profitMargin}
              profitChange={c.profitChange}
              onClick={() => onCommodityClick(c.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="小宗商品" help={`历史最大买量 ＜ 2,000 SCU\n流通量小、零散交易的小众商品`} />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-1">
          {minor.map((c) => (
            <CommodityCell
              key={c.id}
              nameEn={c.nameEn}
              nameZh={c.nameZh}
              kindZh={c.kindZh}
              profitMargin={c.profitMargin}
              profitChange={c.profitChange}
              onClick={() => onCommodityClick(c.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
