'use client';

import { useEffect, useState, useRef } from 'react';

interface NewsItem {
  date: string;
  title: string;
  body: string;
  image: string;
  imagePosition: 'left' | 'right';
  imageScale: number;
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
  news: NewsItem[];
  routes: RouteItem[];
}

function emptyNews(): NewsItem {
  return { date: '', title: '', body: '', image: '', imagePosition: 'left', imageScale: 45 };
}

function emptyRoute(): RouteItem {
  return { ship: '', commodity: '', origin: '', dest: '', profit: '', note: '' };
}

export default function ReportsEditPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/reports')
      .then((r) => r.json())
      .then((d: ReportsData) => {
        setNews(d.news?.length ? d.news : [emptyNews()]);
        setRoutes(d.routes?.length ? d.routes : [emptyRoute()]);
        setLoaded(true);
      })
      .catch(console.error);
  }, []);

  function tryAuth() {
    fetch('/api/reports/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setAuthed(true);
        else setMsg('密码错误');
      })
      .catch(() => setMsg('验证失败'));
  }

  async function handleImageUpload(idx: number, file: File) {
    setUploadingIdx(idx);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/reports/upload-image', {
        method: 'POST',
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
    setSaving(true);
    setMsg('');
    fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ news: nonEmptyNews, routes: nonEmptyRoutes }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok) setMsg('保存成功');
        else setMsg('保存失败: ' + (res.error || ''));
      })
      .catch(() => setMsg('保存失败'))
      .finally(() => setSaving(false));
  }

  if (!loaded) {
    return <div className="text-center py-16 text-muted-foreground">加载中…</div>;
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto mt-20">
        <h1 className="text-xl font-bold mb-6 text-center">维护验证</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && tryAuth()}
          placeholder="输入维护密码"
          className="w-full h-10 rounded-lg border border-border bg-card px-4 text-sm outline-none
                     focus:border-primary/50 transition-colors mb-3"
        />
        <button
          onClick={tryAuth}
          className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold
                     hover:bg-primary/90 transition-colors"
        >
          进入维护
        </button>
        {msg && <p className="text-xs text-destructive text-center mt-3">{msg}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">维护商报</h1>
          <p className="text-xs text-muted-foreground mt-1">
            编辑每周商业新闻与推荐跑商路线
          </p>
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
              <span className="text-xs text-muted-foreground self-center">日期</span>
              <input
                type="date"
                value={item.date}
                onChange={(e) => {
                  const next = [...news];
                  next[idx] = { ...next[idx], date: e.target.value };
                  setNews(next);
                }}
                className="h-9 rounded-md border border-border bg-card px-3 text-sm outline-none
                           focus:border-primary/50 transition-colors"
              />

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

              <span className="text-xs text-muted-foreground self-center">配图</span>
              <div className="space-y-2">
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
