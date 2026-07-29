'use client';

import { CommodityCell } from './CommodityCell';
import type { CommodityWithChange } from '@/types';
import { useRouter } from 'next/navigation';

interface HeatmapProps {
  commodities: CommodityWithChange[];
  loading?: boolean;
}

export function Heatmap({ commodities, loading }: HeatmapProps) {
  const router = useRouter();

  // 大宗/小宗按总库存量划分，阈值 5000 SCU
  const STOCK_THRESHOLD = 5000;

  const major = commodities
    .filter((c) => c.totalSellStock >= STOCK_THRESHOLD)
    .sort((a, b) => a.name.localeCompare(b.name));

  const minor = commodities
    .filter((c) => c.totalSellStock < STOCK_THRESHOLD)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading price data...</div>;
  }

  return (
    <div className="space-y-4">
      <section>
        <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
          大宗商品 · 库存 ≥ 5,000 SCU
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
        <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
          小宗商品 · 库存 ＜ 5,000 SCU
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
