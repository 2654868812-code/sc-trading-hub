'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface IndexData {
  current: number | null;
  commodityCount: number;
  change: number | null;
  history: { v: number; t: string }[];
}

export default function MarketIndexPage() {
  const router = useRouter();
  const [data, setData] = useState<IndexData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/market-index?days=90')
      .then(r => r.json())
      .then((d: IndexData) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-16 text-muted-foreground">加载中…</div>;
  if (!data || data.current == null) return <div className="text-center py-16 text-muted-foreground">暂无数据，等待数据更新后生成</div>;

  const high = Math.max(...data.history.map(h => h.v));
  const low = Math.min(...data.history.map(h => h.v));
  const range = high - low || 1;

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <button onClick={() => router.back()} className="text-sm text-muted-foreground hover:text-primary transition-colors">
        &larr; 返回
      </button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">数据趋势指数</h1>
        <p className="text-sm text-muted-foreground mt-1">全市场最优买卖组合的库存加权回报率，衡量跑商市场景气度</p>
      </div>

      {/* Current value */}
      <div className="section-card p-6">
        <div className="text-[11px] tracking-wider text-muted-foreground uppercase mb-1">当前指数</div>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold tabular-nums text-chart-2">{data.current.toFixed(1)}%</span>
          {data.change != null && (
            <span className={`text-lg font-semibold tabular-nums ${data.change >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
              {data.change >= 0 ? '↑' : '↓'} {Math.abs(data.change)}%
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-2">基于 {data.commodityCount} 种可交易商品 · 上次更新时计算</div>
      </div>

      {/* Line chart */}
      {data.history.length > 1 && (
        <div className="section-card p-5">
          <h3 className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase mb-3">90日走势</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.history.map(h => ({ ...h, label: new Date(h.t).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(36 18% 85%)" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(220 5% 42%)' }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(220 5% 42%)' }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid hsl(36 22% 72%)', borderRadius: 8, color: 'hsl(220 15% 15%)' }}
                labelStyle={{ color: 'hsl(220 5% 42%)' }}
                formatter={(value: any) => [`${value}%`, '数据趋势指数']}
              />
              <Line type="monotone" dataKey="v" stroke="#c9a94e" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="section-card p-4 text-center">
          <div className="text-[10px] tracking-wider text-muted-foreground uppercase mb-1">最高</div>
          <div className="text-xl font-bold tabular-nums text-chart-2">{high}%</div>
        </div>
        <div className="section-card p-4 text-center">
          <div className="text-[10px] tracking-wider text-muted-foreground uppercase mb-1">最低</div>
          <div className="text-xl font-bold tabular-nums text-destructive">{low}%</div>
        </div>
        <div className="section-card p-4 text-center">
          <div className="text-[10px] tracking-wider text-muted-foreground uppercase mb-1">商品数</div>
          <div className="text-xl font-bold tabular-nums text-foreground">{data.commodityCount}</div>
        </div>
      </div>

      {/* Definition */}
      <div className="section-card p-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h3 className="text-foreground font-semibold text-xs">指数定义</h3>
        <p>数据趋势指数 = 全市场最优买卖组合的加权总回报率。每个商品取最新快照中最低买价和最高卖价，以该商品 UEX 历史最大买入量为权重：Σ[(最高卖价 − 最低买价) × 最大库存] / Σ(最低买价 × 最大库存) × 100%。大宗商品（如废料、铁）权重高，小宗商品权重低。数值越高，跑商的资金回报率越高。</p>
        <p>每 30 分钟数据更新时重新计算，历史数据永久保存。</p>
      </div>
    </div>
  );
}
