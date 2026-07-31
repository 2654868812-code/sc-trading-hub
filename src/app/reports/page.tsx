'use client';

import { useEffect, useState } from 'react';

interface NewsItem {
  date: string;
  title: string;
  body: string;
  image?: string;
  imagePosition?: 'left' | 'right';
  imageScale?: number;
}

interface RouteItem {
  ship?: string;
  commodity: string;
  origin: string;
  dest: string;
  profit: string;
  note: string;
}

interface ReportsData {
  news: NewsItem[];
  routes: RouteItem[];
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [gameVersion, setGameVersion] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/reports').then((r) => r.json()),
      fetch('/api/version').then((r) => r.json()),
    ]).then(([reports, ver]) => {
      setData(reports);
      setGameVersion(ver.gameVersion);
    }).catch(console.error);
  }, []);

  if (!data) {
    return <div className="text-center py-16 text-muted-foreground">加载中…</div>;
  }

  const newsItems = data.news.filter((n) => n.title);
  const routeItems = data.routes.filter((r) => r.commodity);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">泛天商报</h1>
        <p className="text-sm text-muted-foreground mt-1">
          每周商业新闻与推荐跑商路线
          {gameVersion && (
            <span className="ml-2.5 px-2 py-0.5 rounded text-[11px] bg-primary/10 text-primary/80">
              {gameVersion}
            </span>
          )}
        </p>
      </div>

      {/* Weekly News */}
      <section>
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4 flex items-center gap-2">
          每周商业新闻
          <span className="h-px flex-1 bg-border/50" />
        </h2>
        {newsItems.length === 0 ? (
          <div className="text-sm text-muted-foreground/60 py-8 text-center">暂无新闻</div>
        ) : (
          <div className="space-y-5">
            {newsItems.map((item, i) => (
              <div key={i} className="section-card p-5">
                <div className="flex items-baseline gap-3 mb-2">
                  {item.date && (
                    <span className="text-[11px] tabular-nums text-muted-foreground/60">{item.date}</span>
                  )}
                  <h3 className="text-base font-semibold">{item.title}</h3>
                </div>
                {item.image ? (
                  <div className={`flex gap-4 ${item.imagePosition === 'right' ? 'flex-row-reverse' : ''}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-80 object-contain rounded-lg shrink-0"
                      style={{ width: `${item.imageScale ?? 45}%` }}
                    />
                    {item.body && (
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line flex-1">{item.body}</p>
                    )}
                  </div>
                ) : (
                  item.body && (
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{item.body}</p>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recommended Routes */}
      <section>
        <h2 className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4 flex items-center gap-2">
          推荐跑商路线
          <span className="h-px flex-1 bg-border/50" />
          <span className="text-[10px] text-muted-foreground/50 font-normal normal-case">人工核验</span>
        </h2>
        {routeItems.length === 0 ? (
          <div className="text-sm text-muted-foreground/60 py-8 text-center">暂无推荐路线</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="th-cell">货船</th>
                  <th className="th-cell">商品</th>
                  <th className="th-cell">购买地</th>
                  <th className="th-cell">出售地</th>
                  <th className="th-cell--right">预期总利润</th>
                  <th className="th-cell-last">备注</th>
                </tr>
              </thead>
              <tbody>
                {routeItems.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-card' : 'bg-[#faf7f0]'}>
                    <td className="td-cell font-medium">{item.ship || '—'}</td>
                    <td className="td-cell font-medium">{item.commodity}</td>
                    <td className="td-cell">{item.origin}</td>
                    <td className="td-cell">{item.dest}</td>
                    <td className="td-cell--right text-chart-2 font-semibold">{item.profit}</td>
                    <td className="td-cell-last text-[11px] text-muted-foreground">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
