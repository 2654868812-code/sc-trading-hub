'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface CommodityResult {
  id: number;
  nameZh: string;
  nameEn: string;
  kindZh: string;
  code: string;
  isIllegal: boolean;
}

interface LocationResult {
  name: string;
  nameEn: string;
  system: string;
  planet: string | null;
}

export function SearchFloat() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [commodities, setCommodities] = useState<CommodityResult[]>([]);
  const [locations, setLocations] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [allCommodities, setAllCommodities] = useState<CommodityResult[]>([]);
  const [allLocations, setAllLocations] = useState<LocationResult[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load all data once on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/commodities').then(r => r.json()),
      fetch('/api/locations').then(r => r.json()),
    ]).then(([commData, locData]) => {
      if (!Array.isArray(commData)) return;
      setAllCommodities(commData.map((c: any) => ({
        id: c.id, nameZh: c.nameZh || c.name, nameEn: c.nameEn || c.name,
        kindZh: c.kindZh || '', code: c.code || '', isIllegal: c.isIllegal || false,
      })));
      setAllLocations(locData.map((l: any) => ({
        name: l.name, nameEn: l.nameEn, system: l.system || '',
        planet: l.planet || null,
      })));
      setDataLoaded(true);
    }).catch(() => {});
  }, []);

  // Filter locally on input change
  useEffect(() => {
    if (!dataLoaded) return;
    const q = query.trim().toLowerCase();
    if (!q) { setCommodities([]); setLocations([]); return; }

    setCommodities(allCommodities.filter(c =>
      c.nameZh.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
c.code.toLowerCase().includes(q)
    ));

    setLocations(allLocations.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.nameEn.toLowerCase().includes(q) ||
      l.system.toLowerCase().includes(q) ||
      (l.planet || '').toLowerCase().includes(q)
    ));
  }, [query, dataLoaded, allCommodities, allLocations]);

  // Keyboard shortcut
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const navigate = useCallback((path: string) => {
    setOpen(false);
    setQuery('');
    router.push(path);
  }, [router]);

  const hasResults = commodities.length > 0 || locations.length > 0;
  const showEmpty = query.trim().length > 0 && !hasResults && dataLoaded;

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-8 right-6 lg:bottom-12 lg:right-10 z-50 w-14 h-14 lg:w-[64px] lg:h-[64px] rounded-full bg-primary text-primary-foreground
                   shadow-lg hover:shadow-xl hover:bg-primary/90 active:scale-95
                   transition-all duration-200 flex items-center justify-center"
        title="搜索 (Ctrl+K)"
      >
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
             className="lg:w-[28px] lg:h-[28px]">
          <circle cx="8.5" cy="8.5" r="6" />
          <line x1="13" y1="13" x2="18" y2="18" />
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-background/60 backdrop-blur-sm">
          <div
            ref={overlayRef}
            className="w-[95vw] lg:w-[520px] rounded-xl border border-border/60 bg-card shadow-2xl overflow-hidden
                       animate-in fade-in slide-in-from-top-2 duration-150"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor"
                   strokeWidth="1.8" strokeLinecap="round" className="text-muted-foreground shrink-0">
                <circle cx="8.5" cy="8.5" r="6" />
                <line x1="13" y1="13" x2="18" y2="18" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="搜索商品或地点…"
                className="flex-1 bg-transparent text-sm text-foreground outline-none
                           placeholder:text-muted-foreground/50"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-secondary border border-border/40
                              text-muted-foreground font-mono">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto">
              {showEmpty && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  没有找到匹配结果
                </div>
              )}

              {!dataLoaded && query.trim() && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  加载中…
                </div>
              )}

              {/* Commodities */}
              {commodities.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-[10px] tracking-[0.15em] text-muted-foreground/70 uppercase bg-muted/30">
                    商品
                  </div>
                  {commodities.map(c => (
                    <button
                      key={`comm-${c.id}`}
                      onClick={() => navigate(`/commodity/${c.id}`)}
                      className="w-full text-left px-4 py-2.5 hover:bg-accent/60 transition-colors
                                 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="text-sm text-foreground truncate">{c.nameZh}</span>
                        <span className="text-[10px] text-muted-foreground/50 ml-2">{c.nameEn}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {c.kindZh && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary/70">
                            {c.kindZh}
                          </span>
                        )}
                        {c.isIllegal && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive/70">
                            违禁
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Locations */}
              {locations.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-[10px] tracking-[0.15em] text-muted-foreground/70 uppercase bg-muted/30">
                    地点
                  </div>
                  {locations.map((l, i) => (
                    <button
                      key={`loc-${i}`}
                      onClick={() => navigate(`/location/${encodeURIComponent(l.name)}`)}
                      className="w-full text-left px-4 py-2.5 hover:bg-accent/60 transition-colors
                                 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="text-sm text-foreground truncate">{l.name}</span>
                        <span className="text-[10px] text-muted-foreground/50 ml-2">{l.nameEn}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground/60 shrink-0">
                        {[l.system, l.planet].filter(Boolean).join(' · ')}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Hint when empty (no search yet) */}
              {!query.trim() && dataLoaded && (
                <div className="px-4 py-6 text-center text-xs text-muted-foreground/50 space-y-1">
                  <p>输入商品名称、地点名称或星系名称搜索</p>
                  <p className="text-[10px]">支持中英文搜索 · 快捷键 <kbd className="px-1 py-0.5 rounded bg-secondary/50 border border-border/30 font-mono">Ctrl+K</kbd></p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
