'use client';

import { useEffect, useState } from 'react';

interface NewsItem {
  date: string;
  title: string;
  body: string;
  image?: string;
  imagePosition?: 'left' | 'right';
  imageScale?: number;
  style?: 'default' | 'left-half' | 'right-half' | 'flash';
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

function NewsCard({ item, half }: { item: NewsItem; half?: boolean }) {
  return (
    <div className={`section-card p-5 ${half ? 'flex-1 min-w-0' : ''}`}>
      <div className="flex items-baseline gap-3 mb-2">
        {item.date && (
          <span className="text-[11px] tabular-nums text-muted-foreground/60">{item.date}</span>
        )}
        <h3 className={`${half ? 'text-sm' : 'text-base'} font-semibold`}>{item.title}</h3>
      </div>
      {item.image ? (
        <div className={`flex gap-4 ${item.imagePosition === 'right' ? 'flex-row-reverse' : ''}`}>
          <img
            src={item.image} alt={item.title}
            className="max-h-80 object-contain rounded-lg shrink-0"
            style={{ width: `${item.imageScale ?? 45}%` }}
          />
          {item.body && (
            <p className={`text-sm text-muted-foreground leading-relaxed whitespace-pre-line ${half ? 'line-clamp-6' : ''}`}>{item.body}</p>
          )}
        </div>
      ) : (
        item.body && (
          <p className={`text-sm text-muted-foreground leading-relaxed whitespace-pre-line ${half ? 'line-clamp-6' : ''}`}>{item.body}</p>
        )
      )}
    </div>
  );
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [gameVersion, setGameVersion] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/reports').then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
      fetch('/api/version').then((r) => r.json()),
    ]).then(([reports, ver]) => {
      setData(reports);
      setGameVersion(ver.gameVersion);
    }).catch((err) => {
      console.error(err);
      setError(true);
    });
  }, []);

  if (error) {
    return <div className="text-center py-16 text-muted-foreground">加载失败，请稍后刷新重试</div>;
  }

  if (!data) {
    return <div className="text-center py-16 text-muted-foreground">加载中…</div>;
  }

  const newsItems = data.news.filter((n) => n.title);
  const routeItems = data.routes.filter((r) => r.commodity || r.ship || r.origin || r.dest);

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
            {(() => {
              // Pair consecutive left-half + right-half items into the same row
              const rows: Array<{ left: NewsItem | null; right: NewsItem | null; isFlash?: boolean; item?: NewsItem }> = [];
              for (let i = 0; i < newsItems.length; i++) {
                const item = newsItems[i];
                const style = item.style || 'default';
                if (style === 'left-half' && i + 1 < newsItems.length && (newsItems[i + 1].style || 'default') === 'right-half') {
                  rows.push({ left: item, right: newsItems[i + 1] });
                  i++; // skip next item
                } else if (style === 'right-half' && i > 0 && (newsItems[i - 1].style || 'default') === 'left-half') {
                  // already paired, skip (shouldn't reach here due to i++ above)
                  rows.push({ left: null, right: item });
                } else {
                  rows.push({ left: null, right: null, isFlash: style === 'flash', item });
                }
              }

              return rows.map((row, i) => {
                // Flash news
                if (row.isFlash && row.item) {
                  const item = row.item;
                  return (
                    <div key={i} className="border-l-[3px] border-primary/50 pl-4 py-2">
                      <div className="flex items-baseline gap-3">
                        {item.date && <span className="text-[10px] tabular-nums text-muted-foreground/50">{item.date}</span>}
                        <h3 className="text-sm font-semibold">{item.title}</h3>
                      </div>
                      {item.body && <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.body}</p>}
                    </div>
                  );
                }

                // Half-width pair
                if (row.left || row.right) {
                  return (
                    <div key={i} className="flex gap-5">
                      {row.left && <NewsCard item={row.left} half />}
                      {row.right && <NewsCard item={row.right} half />}
                    </div>
                  );
                }

                // Default single card
                if (row.item) {
                  return <NewsCard key={i} item={row.item} />;
                }

                return null;
              });
            })()}
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
            <table className="w-full text-sm">
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
                  <tr key={i}>
                    <td className="td-cell font-medium py-3">{item.ship || '—'}</td>
                    <td className="td-cell font-medium py-3">{item.commodity}</td>
                    <td className="td-cell py-3">{item.origin}</td>
                    <td className="td-cell py-3">{item.dest}</td>
                    <td className="td-cell--right text-chart-2 font-semibold py-3">{item.profit}</td>
                    <td className="td-cell-last text-xs text-muted-foreground py-3">{item.note}</td>
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
