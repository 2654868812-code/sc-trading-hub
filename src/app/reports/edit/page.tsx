'use client';

import { useEffect, useState, useRef } from 'react';

interface NewsItem {
  title: string;
  body: string;
  image: string;
  imagePosition: 'left' | 'right';
  imageScale: number;
  style: 'default' | 'left-half' | 'right-half' | 'flash';
}

interface RouteItem {
  ship: string;
  commodity: string;
  origin: string;
  dest: string;
  profit: string;
  note: string;
}

interface ReportsData {
  date: string;
  news: NewsItem[];
  routes: RouteItem[];
  tips: string[];
}

function emptyNews(): NewsItem {
  return { title: '', body: '', image: '', imagePosition: 'left', imageScale: 45, style: 'default' };
}

function emptyRoute(): RouteItem {
  return { ship: '', commodity: '', origin: '', dest: '', profit: '', note: '' };
}

function getToken(): string {
  if (typeof sessionStorage === 'undefined') return '';
  return sessionStorage.getItem('auth_token') || '';
}

export default function ReportsEditPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [date, setDate] = useState('');
  const [gameVersion, setGameVersion] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/reports'),
      fetch('/api/version'),
    ]).then(async ([reportsRes, verRes]) => {
      if (reportsRes.status === 401) { window.location.href = '/reports/login'; return; }
      const [d, ver] = await Promise.all([reportsRes.json(), verRes.json()]);
      setNews((d as ReportsData).news?.length ? (d as ReportsData).news : [emptyNews()]);
      setRoutes((d as ReportsData).routes?.length ? (d as ReportsData).routes : [emptyRoute()]);
      setTips((d as ReportsData).tips || []);
      setDate((d as ReportsData).date || '');
      setGameVersion(ver.gameVersion);
      setLoaded(true);
    }).catch((err) => {
      console.error(err);
      setLoadError(true);
    });
  }, []);

  async function handleImageUpload(idx: number, file: File) {
    setUploadingIdx(idx);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/reports/upload-image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });
      const data = await res.json();
      if (data.ok) {
        setNews((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], image: data.url };
          return next;
        });
      } else {
        setMsg('图片上传失败: ' + (data.error || ''));
      }
    } catch {
      setMsg('图片上传失败');
    } finally {
      setUploadingIdx(null);
    }
  }

  function save() {
    // Filter out empty items
    const nonEmptyNews = news.filter((n) => n.title || n.body || n.image);
    const nonEmptyRoutes = routes.filter((r) => r.commodity || r.origin || r.dest);
    const nonEmptyTips = tips.filter(t => t.trim());
    setSaving(true);
    setMsg('');
    fetch('/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ date, news: nonEmptyNews, routes: nonEmptyRoutes, tips: nonEmptyTips }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setMsg('保存成功');
        else setMsg('保存失败: ' + (res.error || ''));
      })
      .catch(() => setMsg('保存失败'))
      .finally(() => setSaving(false));
  }

  if (loadError) {
    return <div className="text-center py-16 text-muted-foreground">数据加载失败，请刷新重试</div>;
  }

  if (!loaded) {
    return <div className="text-center py-16 text-muted-foreground">加载中…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">维护商报</h1>
          <p className="text-xs text-muted-foreground mt-1">编辑新闻、路线与小贴士</p>
          <div className="flex items-center gap-2 mt-1">
            {gameVersion && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary/80">
                {gameVersion}
              </span>
            )}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-7 rounded border border-border/40 bg-secondary px-2 text-xs text-foreground
                         outline-none focus:border-primary/60 transition-colors"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {msg && (
            <span className={`text-xs ${msg.includes('成功') ? 'text-chart-2' : 'text-destructive'}`}>
              {msg}
            </span>
          )}
          <a
            href="/reports"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; 返回商报
          </a>
        </div>
      </div>

      {/* News Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">商业新闻</h2>
          <button
            onClick={() => setNews((prev) => [...prev, emptyNews()])}
            className="text-xs px-3 py-1 rounded-md border border-border hover:bg-secondary transition-colors"
          >
            + 添加新闻
          </button>
        </div>

        {news.map((item, idx) => (
          <div key={idx} className="section-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">新闻 #{idx + 1}</span>
              {news.length > 1 && (
                <button
                  onClick={() => setNews((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-xs text-destructive hover:underline"
                >
                  删除
                </button>
              )}
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-3">
              <span className="text-xs text-muted-foreground self-center">标题</span>
              <input
                type="text"
                value={item.title}
                onChange={(e) => {
                  const next = [...news];
                  next[idx] = { ...next[idx], title: e.target.value };
                  setNews(next);
                }}
                placeholder="新闻标题"
                className="h-9 rounded-md border border-border bg-card px-3 text-sm outline-none
                           focus:border-primary/50 transition-colors"
              />

              <span className="text-xs text-muted-foreground self-start pt-2">正文</span>
              <textarea
                value={item.body}
                onChange={(e) => {
                  const next = [...news];
                  next[idx] = { ...next[idx], body: e.target.value };
                  setNews(next);
                }}
                placeholder="新闻正文，支持换行"
                rows={4}
                className="rounded-md border border-border bg-card px-3 py-2 text-sm leading-relaxed outline-none
                           focus:border-primary/50 transition-colors resize-y"
              />

              <span className={`text-xs text-muted-foreground self-center ${(item.style || 'default') === 'flash' ? 'hidden' : ''}`}>配图</span>
              <div className={`space-y-2 ${(item.style || 'default') === 'flash' ? 'hidden' : ''}`}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.image}
                    onChange={(e) => {
                      const next = [...news];
                      next[idx] = { ...next[idx], image: e.target.value };
                      setNews(next);
                    }}
                    placeholder="图片URL，或点击右侧按钮上传"
                    className="flex-1 h-9 rounded-md border border-border bg-card px-3 text-sm outline-none
                               focus:border-primary/50 transition-colors"
                  />
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      (fileInputRef.current as HTMLInputElement | null)?.setAttribute('data-idx', String(idx));
                    }}
                    disabled={uploadingIdx === idx}
                    className="shrink-0 px-3 h-9 rounded-md border border-border text-xs
                               hover:bg-secondary transition-colors disabled:opacity-30"
                  >
                    {uploadingIdx === idx ? '上传中…' : '上传'}
                  </button>
                </div>
                {item.image && (
                  <div className="space-y-2">
                    <img
                      src={item.image}
                      alt="预览"
                      className="max-h-40 rounded-md border border-border object-contain"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">位置：</span>
                      <button
                        onClick={() => {
                          const next = [...news];
                          next[idx] = { ...next[idx], imagePosition: 'left' };
                          setNews(next);
                        }}
                        className={`px-2.5 py-0.5 rounded text-[11px] border transition-colors ${
                          item.imagePosition === 'left'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:bg-secondary'
                        }`}
                      >
                        居左
                      </button>
                      <button
                        onClick={() => {
                          const next = [...news];
                          next[idx] = { ...next[idx], imagePosition: 'right' };
                          setNews(next);
                        }}
                        className={`px-2.5 py-0.5 rounded text-[11px] border transition-colors ${
                          item.imagePosition === 'right'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:bg-secondary'
                        }`}
                      >
                        居右
                      </button>
                      <span className="text-[11px] text-muted-foreground ml-3">缩放：</span>
                      <input
                        type="range"
                        min="20"
                        max="80"
                        value={item.imageScale}
                        onChange={(e) => {
                          const next = [...news];
                          next[idx] = { ...next[idx], imageScale: parseInt(e.target.value) };
                          setNews(next);
                        }}
                        className="w-20 h-4"
                      />
                      <span className="text-[11px] tabular-nums text-muted-foreground w-8">{item.imageScale}%</span>
                    </div>
                  </div>
                )}

                {/* Style selector */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-muted-foreground w-10">样式</span>
                  <select
                    value={item.style || 'default'}
                    onChange={(e) => {
                      const next = [...news];
                      next[idx] = { ...next[idx], style: e.target.value as NewsItem['style'] };
                      setNews(next);
                    }}
                    className="h-7 rounded-md border border-border/40 bg-secondary px-2 text-xs outline-none
                               focus:border-primary/50 transition-colors"
                  >
                    <option value="default">默认</option>
                    <option value="left-half">左半格</option>
                    <option value="right-half">右半格</option>
                    <option value="flash">快讯</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          const idx = parseInt((e.target as HTMLInputElement).getAttribute('data-idx') || '', 10);
          if (file && !isNaN(idx)) {
            handleImageUpload(idx, file);
          }
          e.target.value = '';
        }}
      />

      {/* Routes Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">推荐路线</h2>
          <button
            onClick={() => setRoutes((prev) => [...prev, emptyRoute()])}
            className="text-xs px-3 py-1 rounded-md border border-border hover:bg-secondary transition-colors"
          >
            + 添加路线
          </button>
        </div>

        {routes.map((item, idx) => (
          <div key={idx} className="section-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">路线 #{idx + 1}</span>
              {routes.length > 1 && (
                <button
                  onClick={() => setRoutes((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-xs text-destructive hover:underline"
                >
                  删除
                </button>
              )}
            </div>

            <div className="grid grid-cols-[100px_1fr] gap-3">
              <span className="text-xs text-muted-foreground self-center">货船</span>
              <input
                type="text"
                value={item.ship}
                onChange={(e) => {
                  const next = [...routes];
                  next[idx] = { ...next[idx], ship: e.target.value };
                  setRoutes(next);
                }}
                placeholder="推荐货船，如 黑弯刀"
                className="h-9 rounded-md border border-border bg-card px-3 text-sm outline-none
                           focus:border-primary/50 transition-colors"
              />

              <span className="text-xs text-muted-foreground self-center">商品</span>
              <input
                type="text"
                value={item.commodity}
                onChange={(e) => {
                  const next = [...routes];
                  next[idx] = { ...next[idx], commodity: e.target.value };
                  setRoutes(next);
                }}
                placeholder="商品名称"
                className="h-9 rounded-md border border-border bg-card px-3 text-sm outline-none
                           focus:border-primary/50 transition-colors"
              />

              <span className="text-xs text-muted-foreground self-center">购买地</span>
              <input
                type="text"
                value={item.origin}
                onChange={(e) => {
                  const next = [...routes];
                  next[idx] = { ...next[idx], origin: e.target.value };
                  setRoutes(next);
                }}
                placeholder="终端或城市名称"
                className="h-9 rounded-md border border-border bg-card px-3 text-sm outline-none
                           focus:border-primary/50 transition-colors"
              />

              <span className="text-xs text-muted-foreground self-center">出售地</span>
              <input
                type="text"
                value={item.dest}
                onChange={(e) => {
                  const next = [...routes];
                  next[idx] = { ...next[idx], dest: e.target.value };
                  setRoutes(next);
                }}
                placeholder="终端或城市名称"
                className="h-9 rounded-md border border-border bg-card px-3 text-sm outline-none
                           focus:border-primary/50 transition-colors"
              />

              <span className="text-xs text-muted-foreground self-center">预期总利润</span>
              <input
                type="text"
                value={item.profit}
                onChange={(e) => {
                  const next = [...routes];
                  next[idx] = { ...next[idx], profit: e.target.value };
                  setRoutes(next);
                }}
                placeholder="如 +120k"
                className="h-9 rounded-md border border-border bg-card px-3 text-sm outline-none
                           focus:border-primary/50 transition-colors"
              />

              <span className="text-xs text-muted-foreground self-center">备注</span>
              <input
                type="text"
                value={item.note}
                onChange={(e) => {
                  const next = [...routes];
                  next[idx] = { ...next[idx], note: e.target.value };
                  setRoutes(next);
                }}
                placeholder="如 稳定路线，低风险"
                className="h-9 rounded-md border border-border bg-card px-3 text-sm outline-none
                           focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
        ))}
      </section>

      {/* Tips Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">泛天小贴士</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">首页右下角定时轮播展示</p>
          </div>
          <button
            onClick={() => setTips(prev => [...prev, ''])}
            className="text-xs px-3 py-1 rounded-md border border-border hover:bg-secondary transition-colors"
          >
            + 添加贴士
          </button>
        </div>

        {tips.map((tip, idx) => (
          <div key={idx} className="section-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">贴士 #{idx + 1}</span>
              {tips.length > 1 && (
                <button
                  onClick={() => setTips(prev => prev.filter((_, i) => i !== idx))}
                  className="text-xs text-destructive hover:underline"
                >
                  删除
                </button>
              )}
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-3">
              <span className="text-xs text-muted-foreground self-center">内容</span>
              <input
                type="text"
                value={tip}
                onChange={e => {
                  const next = [...tips];
                  next[idx] = e.target.value;
                  setTips(next);
                }}
                placeholder="贴士内容"
                className="h-9 rounded-md border border-border bg-card px-3 text-sm outline-none
                           focus:border-primary/50 transition-colors"
              />
            </div>
          </div>
        ))}
      </section>

      {/* Save */}
      <div className="flex items-center gap-3 pb-8">
        <button
          onClick={save}
          disabled={saving}
          className="px-8 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold
                     hover:bg-primary/90 disabled:opacity-30 transition-colors"
        >
          {saving ? '保存中…' : '保存'}
        </button>
      </div>
    </div>
  );
}
