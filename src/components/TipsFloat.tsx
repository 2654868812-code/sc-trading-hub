'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const SHOW_DURATION = 9_000;
const INTERVAL = 90_000;
const STORAGE_NEXT = 'tips_next_at';
const STORAGE_IDX = 'tips_idx';

function readStorage(key: string): number | null {
  try { const v = sessionStorage.getItem(key); return v ? parseInt(v, 10) : null; }
  catch { return null; }
}
function writeStorage(key: string, val: number) {
  try { sessionStorage.setItem(key, String(val)); } catch { /* ignore */ }
}

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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const muted = searchParams.get('tips') === 'muted';

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  function mute() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tips', 'muted');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function unmute() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tips');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // Load tips
  useEffect(() => {
    fetchTips().then(setTips);
  }, []);

  // Toast cycle — synced across pages via sessionStorage
  useEffect(() => {
    if (muted || tips.length === 0) return;
    clearTimer();

    function pickIndex(prev: number | null): number {
      let next = Math.floor(Math.random() * tips.length);
      if (tips.length > 1 && prev !== null) while (next === prev) next = Math.floor(Math.random() * tips.length);
      return next;
    }

    function scheduleNext() {
      clearTimer();
      const nextAt = Date.now() + INTERVAL;
      writeStorage(STORAGE_NEXT, nextAt);
      timerRef.current = setTimeout(() => {
        setToastIndex(prev => {
          const next = pickIndex(prev);
          writeStorage(STORAGE_IDX, next);
          return next;
        });
        setToastVisible(true);
        // Hide after SHOW_DURATION, then schedule next
        setTimeout(() => setToastVisible(false), SHOW_DURATION);
        scheduleNext();
      }, INTERVAL);
    }

    // Resume or start fresh
    const storedNext = readStorage(STORAGE_NEXT);
    const storedIdx = readStorage(STORAGE_IDX);
    const now = Date.now();

    if (storedNext && storedNext > now) {
      // Still waiting — resume countdown
      const remaining = storedNext - now;
      const idx = storedIdx ?? 0;
      setToastIndex(idx);
      timerRef.current = setTimeout(() => {
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), SHOW_DURATION);
        scheduleNext();
      }, remaining);
    } else if (storedNext && storedNext <= now && storedNext > now - SHOW_DURATION - 5000) {
      // Just expired — might have been showing on previous page
      const idx = storedIdx ?? 0;
      setToastIndex(idx);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), Math.max(1000, SHOW_DURATION - (now - storedNext)));
      scheduleNext();
    } else {
      // Fresh start or long-expired — first toast after full interval
      scheduleNext();
    }

    return clearTimer;
  }, [muted, tips, clearTimer]);

  // Hide toast after duration
  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastVisible(false), SHOW_DURATION);
    return () => clearTimeout(t);
  }, [toastVisible]);

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
                       leading-relaxed text-foreground/80 cursor-pointer flex items-start gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor"
                 strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                 className="shrink-0 mt-px opacity-50">
              <path d="M10 2a5 5 0 0 0-3 9v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1a5 5 0 0 0-3-9Z" />
              <line x1="8" y1="15" x2="12" y2="15" />
              <line x1="9" y1="17" x2="11" y2="17" />
            </svg>
            {tips[toastIndex]}
          </button>
        </div>
      )}

      {/* Trigger button */}
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

      {/* Full tips panel — matches search modal style */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-background/60 backdrop-blur-sm"
             onClick={() => setOpen(false)}>
          <div
            className="w-[95vw] lg:w-[480px] max-h-[60vh] overflow-y-auto rounded-xl border border-border/60
                        bg-card shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
              <h3 className="text-sm font-semibold flex items-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor"
                     strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70">
                  <path d="M10 2a5 5 0 0 0-3 9v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1a5 5 0 0 0-3-9Z" />
                  <line x1="8" y1="15" x2="12" y2="15" />
                  <line x1="9" y1="17" x2="11" y2="17" />
                </svg>
                跑商注意事项
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setToastVisible(false); muted ? unmute() : mute(); }}
                  className={`text-[10px] transition-colors px-2 py-0.5 rounded ${muted ? 'text-chart-2 bg-chart-2/10' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {muted ? '✓ 已静音' : '不再提示'}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                >
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 5l8 8M13 5l-8 8" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Body */}
            <div className="p-4">
              {tips.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">暂无贴士</p>
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
        </div>
      )}
    </>
  );
}
