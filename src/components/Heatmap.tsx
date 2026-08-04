'use client';

import { useState } from 'react';
import { CommodityCell } from './CommodityCell';
import type { CommodityWithChange } from '@/types';

interface HeatmapProps {
  commodities: CommodityWithChange[];
  loading?: boolean;
  search?: string;
  sort?: 'name' | 'margin' | 'profit';
  flipKey?: number;
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
          <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-[44px] rounded bg-muted/50 animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Heatmap({ commodities, loading, search, sort = 'name', flipKey, onCommodityClick }: HeatmapProps) {
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

  // Per-group trimmed min/max — strip 1 outlier at each end
  function trimmedRange(list: CommodityWithChange[]): { min: number; max: number } {
    const margins = list.map(c => c.profitMargin ?? 0).sort((a, b) => a - b);
    const trimmed = margins.slice(1, -1); // remove lowest and highest
    if (trimmed.length === 0) return { min: margins[0] ?? 0, max: margins[0] ?? 0 };
    return { min: trimmed[0], max: trimmed[trimmed.length - 1] };
  }
  const majorRange = trimmedRange(major);
  const minorRange = trimmedRange(minor);

  if (sorted.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>没有找到匹配的商品</p>
        <p className="text-sm mt-1 text-muted-foreground/50">尝试修改搜索条件</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <section>
        <SectionHeader title="大宗商品" help={`历史最大买量 ≥ 2,000 SCU\n流通量大、供需稳定的主流贸易品`} />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-1">
          {major.map((c, i) => (
            <CommodityCell
              key={`${flipKey || 0}-${c.id}`}
              nameEn={c.nameEn}
              nameZh={c.nameZh}
              kindZh={c.kindZh}
              profitMargin={c.profitMargin}
              profitChange={c.profitChange}
              minMargin={majorRange.min}
              maxMargin={majorRange.max}
              flipKey={flipKey}
              flipIndex={i}
              onClick={() => onCommodityClick(c.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="小宗商品" help={`历史最大买量 ＜ 2,000 SCU\n流通量小、零散交易的小众商品`} />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-1">
          {minor.map((c, i) => (
            <CommodityCell
              key={`${flipKey || 0}-${c.id}`}
              nameEn={c.nameEn}
              nameZh={c.nameZh}
              kindZh={c.kindZh}
              profitMargin={c.profitMargin}
              profitChange={c.profitChange}
              minMargin={minorRange.min}
              maxMargin={minorRange.max}
              flipKey={flipKey}
              flipIndex={major.length + i}
              onClick={() => onCommodityClick(c.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
