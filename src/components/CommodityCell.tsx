'use client';

interface CommodityCellProps {
  name: string;
  nameZh: string;
  code: string;
  kind: string | null;
  kindZh: string;
  changePercent: number | null;
  onClick: () => void;
}

function getColor(change: number | null): { color: string; fontWeight: number } {
  if (change === null) return { color: '#9ca3af', fontWeight: 500 };
  const abs = Math.abs(change);
  const intensity = Math.min(abs / 15, 1);
  const l = Math.round(48 - intensity * 28);
  if (change > 0) {
    return { color: `hsl(145, 65%, ${l}%)`, fontWeight: 600 + Math.round(intensity * 200) };
  } else if (change < 0) {
    return { color: `hsl(0, 72%, ${l}%)`, fontWeight: 600 + Math.round(intensity * 200) };
  }
  return { color: '#9ca3af', fontWeight: 500 };
}

export function CommodityCell({ name, nameZh, code, kind, kindZh, changePercent, onClick }: CommodityCellProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-2 rounded-md border border-border
                 hover:bg-accent hover:text-accent-foreground transition-colors
                 min-w-[72px] h-16"
    >
      <span className="text-sm leading-tight" style={(() => {
          const c = getColor(changePercent);
          return { color: c.color, fontWeight: c.fontWeight };
        })()}>
        {nameZh}
      </span>
      {kindZh && (
        <span className="text-[10px] text-muted-foreground leading-tight">{kindZh}</span>
      )}
    </button>
  );
}
