'use client';

import { useState } from 'react';

interface CommodityCellProps {
  nameEn: string;
  nameZh: string;
  kindZh: string;
  profitMargin: number | null;
  profitChange: number | null;
  onClick: () => void;
}

function fmtProfit(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString();
}

function marginColor(margin: number): string {
  if (margin <= 0) return '#c4554d';
  if (margin >= 200) return '#2d8a4e';
  const t = Math.min(1, margin / 200);
  const hue = t * 142;
  return `hsl(${hue}, 70%, 35%)`;
}

export function CommodityCell({
  nameEn,
  nameZh,
  kindZh,
  profitMargin,
  profitChange,
  onClick,
}: CommodityCellProps) {
  const [tooltip, setTooltip] = useState(false);
  const hasChange = profitChange != null && profitChange !== 0;

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        className="commodity-card w-full"
      >
        <div className="flex items-center gap-1.5 w-full">
          <span className="text-[12px] truncate leading-tight">
            {nameZh}
          </span>
          {profitMargin != null && (
            <span className="text-[10px] tabular-nums font-semibold ml-auto flex-shrink-0" style={{ color: marginColor(profitMargin) }}>
              {profitMargin >= 0 ? '+' : ''}{profitMargin}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 w-full">
          <span className="text-[10px] text-muted-foreground/55">{kindZh}</span>
          {hasChange && (
            <span className={`text-[10px] tabular-nums font-medium ml-auto ${profitChange! >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
              {profitChange! >= 0 ? '▲' : '▼'}{fmtProfit(Math.abs(profitChange!))}
            </span>
          )}
        </div>
      </button>

      {tooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 z-50
                        px-3 py-2 rounded-lg bg-foreground text-background
                        text-xs whitespace-nowrap shadow-xl pointer-events-none">
          <div className="font-semibold">{nameZh}</div>
          <div className="text-[10px] opacity-55 mt-0.5">{nameEn}</div>
        </div>
      )}
    </div>
  );
}
