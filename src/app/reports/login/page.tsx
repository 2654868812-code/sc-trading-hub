'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  function login() {
    if (submitting) return;
    setSubmitting(true);
    fetch('/api/reports/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.ok && res.token) {
          // Cookie: signed token for proxy page-access validation
          // Token already set as HttpOnly cookie by backend; store in sessionStorage for Bearer auth
          sessionStorage.setItem('auth_token', res.token);
          router.push('/reports/edit');
        } else {
          setMsg('密码错误');
          setSubmitting(false);
        }
      })
      .catch(() => {
        setMsg('验证失败');
        setSubmitting(false);
      });
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-xl font-bold mb-6 text-center">维护验证</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !submitting && login()}
        placeholder="输入维护密码"
        className="w-full h-10 rounded-lg border border-border bg-card px-4 text-sm outline-none
                   focus:border-primary/50 transition-colors mb-3"
      />
      <button
        type="button"
        onClick={login}
        disabled={submitting}
        className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold
                   hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? '验证中…' : '进入维护'}
      </button>
      {msg && <p className="text-xs text-destructive text-center mt-3">{msg}</p>}
    </div>
  );
}
