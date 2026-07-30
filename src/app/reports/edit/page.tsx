'use client';

import { useEffect, useState } from 'react';

export default function ReportsEditPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [json, setJson] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Load data on mount (read-only, for editing)
  useEffect(() => {
    fetch('/api/reports')
      .then((r) => r.json())
      .then((d) => {
        setJson(JSON.stringify(d, null, 2));
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

  function save() {
    try {
      const parsed = JSON.parse(json);
      setSaving(true);
      setMsg('');
      fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.ok) setMsg('保存成功');
          else setMsg('保存失败: ' + (res.error || ''));
        })
        .catch(() => setMsg('保存失败'))
        .finally(() => setSaving(false));
    } catch {
      setMsg('JSON 格式错误，请检查语法');
    }
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">维护财报</h1>
          <p className="text-xs text-muted-foreground mt-1">
            news 支持 date/title/body/image（图片URL）；routes 支持 commodity/origin/dest/profit（总利润）/note
          </p>
        </div>
        <a
          href="/reports"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; 返回财报
        </a>
      </div>

      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        className="w-full h-[600px] rounded-lg border border-border bg-card p-5 text-sm leading-relaxed
                   outline-none focus:border-primary/50 resize-y"
        style={{ fontFamily: 'ui-monospace, "Cascadia Code", "Consolas", monospace' }}
      />

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="px-8 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold
                     hover:bg-primary/90 disabled:opacity-30 transition-colors"
        >
          {saving ? '保存中…' : '保存'}
        </button>
        {msg && (
          <span className={`text-xs ${msg.includes('成功') ? 'text-chart-2' : 'text-destructive'}`}>
            {msg}
          </span>
        )}
      </div>
    </div>
  );
}
