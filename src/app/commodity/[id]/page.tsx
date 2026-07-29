'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import type { PricePoint, TerminalInfo, CommodityWithChange } from '@/types';

const LINE_COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function CommodityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const commodityId = parseInt(id, 10);

  const [commodity, setCommodity] = useState<CommodityWithChange | null>(null);
  const [priceData, setPriceData] = useState<PricePoint[]>([]);
  const [terminals, setTerminals] = useState<TerminalInfo[]>([]);
  const [selectedTerminalIds, setSelectedTerminalIds] = useState<number[]>([]);
  const [hours, setHours] = useState(24);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/commodities')
      .then((r) => r.json())
      .then((data: CommodityWithChange[]) => {
        const found = data.find((c) => c.id === commodityId);
        if (found) setCommodity(found);
      })
      .catch(console.error);
  }, [commodityId]);

  useEffect(() => {
    fetch(`/api/prices/terminals?commodityId=${commodityId}`)
      .then((r) => r.json())
      .then((data: TerminalInfo[]) => {
        setTerminals(data);
        setSelectedTerminalIds(data.slice(0, 5).map((t) => t.id));
      })
      .catch(console.error);
  }, [commodityId]);

  useEffect(() => {
    if (selectedTerminalIds.length === 0) return;
    setLoading(true);
    const ids = selectedTerminalIds.join(',');
    fetch(`/api/prices?commodityId=${commodityId}&terminalIds=${ids}&hours=${hours}`)
      .then((r) => r.json())
      .then((data: PricePoint[]) => setPriceData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [commodityId, selectedTerminalIds, hours]);

  const chartData = useMemo(() => {
    const map = new Map<string, Record<string, number | null>>();
    for (const p of priceData) {
      const ts = new Date(p.fetchedAt).toLocaleString('zh-CN', {
        month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
      });
      if (!map.has(ts)) map.set(ts, {});
      const row = map.get(ts)!;
      row[p.terminalName] = p.priceBuy;
    }
    return Array.from(map.entries()).map(([time, vals]) => ({ time, ...vals }));
  }, [priceData]);

  const terminalNames = useMemo(() => {
    const names = new Set<string>();
    for (const p of priceData) names.add(p.terminalName);
    return Array.from(names);
  }, [priceData]);

  const buyTerminals = terminals.filter((t) =>
    priceData.some((p) => p.terminalName === t.name && p.priceBuy != null)
  );
  const sellTerminals = terminals.filter((t) =>
    priceData.some((p) => p.terminalName === t.name && p.priceSell != null)
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; 返回仪表盘
      </button>

      {commodity && (
        <div>
          <h1 className="text-2xl font-bold">{commodity.nameZh}</h1>
          <p className="text-sm text-muted-foreground">
            {commodity.name} &middot; {commodity.kind} &middot; {commodity.code}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {[24, 72, 168].map((h) => (
          <button
            key={h}
            onClick={() => setHours(h)}
            className={`px-3 py-1 text-sm rounded-md border ${
              hours === h
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:bg-card text-foreground'
            }`}
          >
            {h === 168 ? '7天' : `${h}小时`}
          </button>
        ))}
      </div>

      <div className="border border-border rounded-lg p-4 bg-card">
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">加载中...</div>
        ) : chartData.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">暂无价格数据</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#888' }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11, fill: '#888' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333', borderRadius: 8 }}
                labelStyle={{ color: '#ccc' }}
              />
              <Legend />
              {terminalNames.map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={LINE_COLORS[i % LINE_COLORS.length]}
                  dot={false}
                  strokeWidth={2}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2">选择终端对比（最多8个）</h3>
        <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto">
          {terminals.map((t) => {
            const isSelected = selectedTerminalIds.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => {
                  if (isSelected) {
                    setSelectedTerminalIds(selectedTerminalIds.filter((id) => id !== t.id));
                  } else if (selectedTerminalIds.length < 8) {
                    setSelectedTerminalIds([...selectedTerminalIds, t.id]);
                  }
                }}
                className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                  isSelected
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'border-border hover:bg-card text-muted-foreground'
                }`}
              >
                {t.name}
                {t.isAutoLoad ? ' 🚀' : ''}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold mb-2 text-green-400">可购买地点</h3>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {buyTerminals.map((t) => {
              const latest = priceData
                .filter((p) => p.terminalName === t.name && p.priceBuy != null)
                .at(-1);
              return (
                <div key={t.id} className="flex justify-between text-sm py-1 px-2 rounded hover:bg-card/50">
                  <span>
                    {t.name}
                    <span className="text-[10px] text-muted-foreground ml-1">
                      {t.starSystemName}
                    </span>
                  </span>
                  {latest && (
                    <span className="font-mono text-green-400">
                      {latest.priceBuy!.toLocaleString()} aUEC
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2 text-red-400">可售出地点</h3>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {sellTerminals.map((t) => {
              const latest = priceData
                .filter((p) => p.terminalName === t.name && p.priceSell != null)
                .at(-1);
              return (
                <div key={t.id} className="flex justify-between text-sm py-1 px-2 rounded hover:bg-card/50">
                  <span>
                    {t.name}
                    <span className="text-[10px] text-muted-foreground ml-1">
                      {t.starSystemName}
                    </span>
                  </span>
                  {latest && (
                    <span className="font-mono text-red-400">
                      {latest.priceSell!.toLocaleString()} aUEC
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
