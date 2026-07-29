'use client';

interface CommodityCellProps {
  name: string;
  nameZh: string;
  code: string;
  kind: string | null;
  changePercent: number | null;
  onClick: () => void;
}

function getColor(change: number | null): string {
  if (change === null) return 'text-gray-500';
  const abs = Math.abs(change);
  const intensity = Math.min(abs / 15, 1);
  if (change > 0) {
    const l = Math.round(60 - intensity * 30);
    return `hsl(142, 71%, ${l}%)`;
  } else if (change < 0) {
    const l = Math.round(60 - intensity * 30);
    return `hsl(0, 84%, ${l}%)`;
  }
  return 'text-gray-400';
}

export function CommodityCell({ name, nameZh, code, kind, changePercent, onClick }: CommodityCellProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-2 rounded-md border border-border
                 hover:bg-accent hover:text-accent-foreground transition-colors
                 min-w-[72px] h-16"
    >
      <span className="text-sm font-medium leading-tight" style={{ color: getColor(changePercent) }}>
        {nameZh}
      </span>
      {kind && (
        <span className="text-[10px] text-muted-foreground leading-tight">{kind}</span>
      )}
    </button>
  );
}
