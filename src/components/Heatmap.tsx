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

  // 大宗：能源、矿产、战略原材料，交易量大价值高
  const bulkKinds = new Set([
    'Metal', 'Mineral', 'Gas', 'Fuel', 'Halogen', 'Alloy',
    'Chemical', 'Non-Metal', 'Raw Materials', 'Liquid', 'Minteral',
  ]);

  const major = commodities
    .filter((c) => bulkKinds.has(c.kind || '') || c.isRefined)
    .sort((a, b) => a.name.localeCompare(b.name));

  // 小宗：农产品、日用品、轻工业品、药品、废料等
  const minor = commodities
    .filter((c) => !bulkKinds.has(c.kind || ''))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading price data...</div>;
  }

  return (
    <div className="space-y-4">
      <section>
        <h2 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
          大宗商品 · 矿产能源原材料
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
          小宗商品 · 日用品消耗品
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
