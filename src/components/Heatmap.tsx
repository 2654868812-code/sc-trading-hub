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

  const refined = commodities
    .filter((c) => c.isRefined)
    .sort((a, b) => a.name.localeCompare(b.name));

  const raw = commodities
    .filter((c) => c.isRaw)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading price data...</div>;
  }

  return (
    <div className="space-y-4">
      <section>
        <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
          大宗商品 · Refined
        </h2>
        <div className="flex flex-wrap gap-2">
          {refined.map((c) => (
            <CommodityCell
              key={c.id}
              name={c.name}
              code={c.code}
              kind={c.kind}
              changePercent={c.changePercent}
              onClick={() => router.push(`/commodity/${c.id}`)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
          小宗商品 · Raw
        </h2>
        <div className="flex flex-wrap gap-2">
          {raw.map((c) => (
            <CommodityCell
              key={c.id}
              name={c.name}
              code={c.code}
              kind={c.kind}
              changePercent={c.changePercent}
              onClick={() => router.push(`/commodity/${c.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
