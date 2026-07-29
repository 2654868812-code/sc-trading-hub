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
  if (change === null) return { color: '#6b7280', fontWeight: 600 };
  const abs = Math.abs(change);
  const intensity = Math.min(abs / 15, 1);
  const l = Math.round(38 - intensity * 22);
  if (change > 0) {
    return { color: `hsl(145, 70%, ${l}%)`, fontWeight: 600 + Math.round(intensity * 300) };
  } else if (change < 0) {
    return { color: `hsl(0, 75%, ${l}%)`, fontWeight: 600 + Math.round(intensity * 300) };
  }
  return { color: '#6b7280', fontWeight: 600 };
}

export function CommodityCell({ name, nameZh, code, kind, kindZh, changePercent, onClick }: CommodityCellProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-2 rounded-md border border-border
                 hover:bg-accent hover:text-accent-foreground transition-colors
                 w-[88px] h-[60px]"
    >
      <span className="text-sm leading-tight" style={(() => {
          const c = getColor(changePercent);
          return { color: c.color, fontWeight: c.fontWeight };
        })()}>
        {nameZh}
      </span>
    </button>
  );
}
