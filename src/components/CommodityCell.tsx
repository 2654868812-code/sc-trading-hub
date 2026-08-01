'use client';

import { useState } from 'react';

interface CommodityCellProps {
  nameEn: string;
  nameZh: string;
  kindZh: string;
  profitMargin: number | null;
  profitChange: number | null;
  flipKey?: number;
  flipIndex?: number;
  onClick: () => void;
}

function fmtChange(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1000) return `${(abs / 1000).toFixed(1)}k`;
  return abs.toLocaleString();
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
  flipKey,
  flipIndex = 0,
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
        className="w-full text-left px-2 py-1.5 rounded border border-border/20 bg-white
                   hover:bg-accent/60 hover:border-border/50 transition-all
                   active:scale-[0.97] overflow-hidden
                   dark:bg-white dark:text-gray-900"
        style={{
          animation: (flipKey && flipKey > 1) ? `cellFlip 0.1s ease-in-out ${flipIndex * 100}ms both` : undefined,
        }}
      >
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] truncate leading-tight font-medium">
            {nameZh}
          </span>
          {profitMargin != null && (
            <span
              className="text-[10px] tabular-nums font-bold flex-shrink-0"
              style={{ color: marginColor(profitMargin) }}
            >
              {profitMargin >= 0 ? '+' : ''}{profitMargin}%
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <span className="text-[10px] text-muted-foreground/55">{kindZh}</span>
          {hasChange && (
            <span className={`text-[10px] tabular-nums font-medium flex-shrink-0 ${profitChange! >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
              {profitChange! >= 0 ? '▲' : '▼'}{fmtChange(Math.abs(profitChange!))}
            </span>
          )}
        </div>
      </button>

      {tooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 z-50
                        px-3 py-2 rounded-lg bg-foreground text-background
                        text-xs shadow-xl pointer-events-none space-y-1 whitespace-nowrap">
          <div className="font-semibold">{nameZh}</div>
          <div className="text-[10px] opacity-55">{nameEn}</div>
          <div className="text-[10px] opacity-80">
            平均单位利润率: {profitMargin != null ? `${profitMargin >= 0 ? '+' : ''}${profitMargin}%` : '—'}
          </div>
          <div className="text-[10px] opacity-80">
            平均单位利润变化: {profitChange != null && profitChange !== 0
              ? `${profitChange >= 0 ? '+' : ''}${profitChange.toLocaleString()} aUEC`
              : '—'}
          </div>
        </div>
      )}
    </div>
  );
}
