'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const SHOW_DURATION = 9_000;    // 9s
const INTERVAL = 90_000;        // 1.5min

async function fetchTips(): Promise<string[]> {
  try {
    const res = await fetch('/api/reports');
    if (!res.ok) return [];
    const data = await res.json();
    return data.tips || [];
  } catch { return []; }
}

export default function TipsFloat() {
  const [tips, setTips] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [toastIndex, setToastIndex] = useState<number | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [muted, setMuted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  // Load tips
  useEffect(() => {
    fetchTips().then(setTips);
  }, []);

  // Toast cycle
  useEffect(() => {
    if (muted || tips.length === 0) return;
    const initial = setTimeout(() => {
      setToastIndex(Math.floor(Math.random() * tips.length));
      setToastVisible(true);
    }, 2000);

    const cycle = setInterval(() => {
      setToastIndex(prev => {
        let next = Math.floor(Math.random() * tips.length);
        if (tips.length > 1) while (next === prev) next = Math.floor(Math.random() * tips.length);
        return next;
      });
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), SHOW_DURATION);
    }, INTERVAL);

    return () => { clearTimeout(initial); clearInterval(cycle); };
  }, [muted, tips]);

  // Hide toast after duration
  useEffect(() => {
    if (!toastVisible) return;
    clearTimer();
    timerRef.current = setTimeout(() => setToastVisible(false), SHOW_DURATION);
    return clearTimer;
  }, [toastVisible, clearTimer]);

  return (
    <>
      {/* Timed toast tip */}
      {toastIndex !== null && toastVisible && !muted && tips[toastIndex] && (
        <div className="fixed bottom-[7.5rem] right-[5.5rem] lg:bottom-[8.5rem] lg:right-28 z-40
                        animate-in slide-in-from-right-2 fade-in duration-300">
          <button
            onClick={() => setOpen(true)}
            className="max-w-[220px] sm:max-w-[260px] text-left px-3 py-2 rounded-xl
                       bg-card/95 backdrop-blur border border-border/60 shadow-lg
                       hover:border-primary/30 transition-all text-[11px] sm:text-xs
                       leading-relaxed text-foreground/80 cursor-pointer"
          >
            💡 {tips[toastIndex]}
          </button>
        </div>
      )}

      {/* Trigger button — matches search icon style */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-[7rem] right-6 lg:bottom-32 lg:right-10 z-50
                   w-14 h-14 lg:w-[64px] lg:h-[64px] rounded-full
                   bg-primary text-primary-foreground shadow-lg
                   hover:shadow-xl hover:bg-primary/90 active:scale-95
                   transition-all duration-200 flex items-center justify-center"
        title="跑商贴士"
      >
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor"
             strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
             className="lg:w-[28px] lg:h-[28px]">
          <path d="M10 2a5 5 0 0 0-3 9v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1a5 5 0 0 0-3-9Z" />
          <line x1="8" y1="15" x2="12" y2="15" />
          <line x1="9" y1="17" x2="11" y2="17" />
        </svg>
      </button>

      {/* Full tips panel */}
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
             onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-sm max-h-[70vh] overflow-y-auto rounded-xl border border-border
                        bg-card shadow-2xl p-5 space-y-3 animate-in slide-in-from-bottom-4 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold">💡 跑商注意事项</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setOpen(false); setMuted(true); setToastVisible(false); }}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5"
                >
                  不再提示
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 5l8 8M13 5l-8 8" />
                  </svg>
                </button>
              </div>
            </div>
            {tips.length === 0 ? (
              <p className="text-xs text-muted-foreground">暂无贴士</p>
            ) : (
              <ul className="space-y-2">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] leading-relaxed">
                    <span className="text-muted-foreground/40 shrink-0 mt-0.5 text-[10px]">{i + 1}.</span>
                    <span className="text-foreground/80">{tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
