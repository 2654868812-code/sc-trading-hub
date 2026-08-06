'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import type { RouteFilters, ShipOption, FilterMode } from '@/types';
import { readFiltersFromStorage, buildFilterParams } from '@/lib/filter-storage';

interface SystemOption {
  en: string;
  zh: string;
}

interface CommodityOption {
  id: number;
  nameZh: string;
  nameEn: string;
  kindZh: string;
  isDazong: boolean;
  isIllegal: boolean;
}

interface TradeRouteFilterProps {
  systems: SystemOption[];
  onFilterChange: (filters: RouteFilters) => void;
  onFiltersPersist?: (filters: RouteFilters) => void;
  loading?: boolean;
  initialFilters?: RouteFilters;
}

function SelectField({ label, value, onChange, children }: {
  label: string; value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] tracking-wider text-muted-foreground uppercase">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full sm:w-[100px] lg:w-[120px] rounded-md border border-border/40 bg-secondary px-2 text-sm text-foreground
                   focus:border-primary/60 focus:ring-1 focus:ring-primary/30 outline-none
                   transition-colors appearance-none cursor-pointer"
      >
        {children}
      </select>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = 'text', step, max }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string; step?: string; max?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] tracking-wider text-muted-foreground uppercase">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        step={step}
        max={max}
        className="h-9 w-full sm:w-[100px] lg:w-[120px] rounded-md border border-border/40 bg-secondary px-2 text-sm text-foreground
                   placeholder:text-muted-foreground/40 tabular-nums
                   focus:border-primary/60 focus:ring-1 focus:ring-primary/30 outline-none
                   transition-colors"
      />
    </div>
  );
}

function LogInputField({ label, value, onChange, placeholder, max }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; max: number;
}) {
  const step = (dir: 1 | -1) => {
    const n = value ? parseFloat(value) : 0;
    if (n <= 0 && dir === 1) { onChange('10'); return; }
    if (n <= 0) return;
    const next = dir === 1 ? n * 10 : n / 10;
    if (next > max) { onChange(String(max)); return; }
    if (next < 1) { onChange(''); return; }
    onChange(String(next));
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] tracking-wider text-muted-foreground uppercase">{label}</label>
      <div className="flex items-center">
        <button type="button" onClick={() => step(-1)}
          className="h-9 w-6 flex items-center justify-center rounded-l-md border border-r-0 border-border/40 bg-secondary
                     text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-sm">
          −
        </button>
        <input type="number" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} max={max}
          className="h-9 w-[68px] lg:w-[88px] border-y border-border/40 bg-secondary px-1 text-center text-sm text-foreground tabular-nums
                     placeholder:text-muted-foreground/40
                     focus:border-primary/60 focus:ring-1 focus:ring-primary/30 outline-none transition-colors
                     [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
        <button type="button" onClick={() => step(1)}
          className="h-9 w-6 flex items-center justify-center rounded-r-md border border-l-0 border-border/40 bg-secondary
                     text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-sm">
          +
        </button>
      </div>
    </div>
  );
}

interface LocationOption {
  name: string;
  nameEn: string;
  system: string;
  planet: string | null;
}

function ModeToggle({ mode, onChange }: { mode: FilterMode; onChange: (m: FilterMode) => void }) {
  return (
    <div className="flex items-center rounded border border-border/30 overflow-hidden">
      <button
        type="button"
        onClick={() => onChange('include')}
        className={`px-1.5 py-0.5 text-[9px] transition-colors ${mode === 'include' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
      >仅选择</button>
      <button
        type="button"
        onClick={() => onChange('exclude')}
        className={`px-1.5 py-0.5 text-[9px] transition-colors ${mode === 'exclude' ? 'bg-destructive text-destructive-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
      >仅排除</button>
    </div>
  );
}

export function TradeRouteFilter({
  systems,
  onFilterChange,
  onFiltersPersist,
  loading,
  initialFilters,
}: TradeRouteFilterProps) {
  const f = initialFilters || {};
  const [ships, setShips] = useState<ShipOption[]>([]);
  const [shipId, setShipId] = useState(f.shipId ? String(f.shipId) : '');
  const [shipSearch, setShipSearch] = useState('');
  const [shipOpen, setShipOpen] = useState(false);
  const shipRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Commodity multi-select
  const [commodities, setCommodities] = useState<CommodityOption[]>([]);
  const [commodityIds, setCommodityIds] = useState<number[]>(f.commodityIds || []);
  const [commodityMode, setCommodityMode] = useState<FilterMode>(f.commodityMode || 'include');
  const [commoditySearch, setCommoditySearch] = useState('');
  const [commodityOpen, setCommodityOpen] = useState(false);
  const commodityRef = useRef<HTMLDivElement>(null);

  const [originSystem, setOriginSystem] = useState(f.originSystem || '');
  const [destSystem, setDestSystem] = useState(f.destSystem || '');
  const [maxInvestment, setMaxInvestment] = useState(f.maxInvestment ? String(f.maxInvestment) : '');
  const [maxDistance, setMaxDistance] = useState(f.maxDistance ? String(f.maxDistance) : '');
  const [commodityType, setCommodityType] = useState(f.commodityType || '');
  const [autoLoadType, setAutoLoadType] = useState(f.autoLoadType || '');
  const [sortBy, setSortBy] = useState<string>(f.sortBy || 'profit');
  const [roundTrip, setRoundTrip] = useState(f.roundTrip || false);
  const [profitMode, setProfitMode] = useState<string>(f.profitMode || 'live');

  // Location multi-select
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [originLocations, setOriginLocations] = useState<string[]>(f.originLocations || []);
  const [originLocationMode, setOriginLocationMode] = useState<FilterMode>(f.originLocationMode || 'include');
  const [originLocSearch, setOriginLocSearch] = useState('');
  const [originLocOpen, setOriginLocOpen] = useState(false);
  const [destLocations, setDestLocations] = useState<string[]>(f.destLocations || []);
  const [destLocationMode, setDestLocationMode] = useState<FilterMode>(f.destLocationMode || 'include');
  const [destLocSearch, setDestLocSearch] = useState('');
  const [destLocOpen, setDestLocOpen] = useState(false);
  const originLocRef = useRef<HTMLDivElement>(null);
  const destLocRef = useRef<HTMLDivElement>(null);

  // Load reference data once on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/vehicles').then((r) => r.json()),
      fetch('/api/locations').then((r) => r.json()),
      fetch('/api/commodities').then((r) => r.json()),
    ]).then(([shipsData, locsData, commData]) => {
      setShips(shipsData);
      setLocations(locsData);
      if (!Array.isArray(commData)) return;
      const commList = commData.map((c: any) => ({
        id: c.id, nameZh: c.nameZh || c.name, nameEn: c.nameEn || c.name,
        kindZh: c.kindZh || '', isDazong: c.isDazong || false, isIllegal: c.isIllegal || false,
      }));
      setCommodities(commList);
    }).catch(console.error);
  }, []);

  // Restore filters from sessionStorage when URL is empty
  const restoredRef = useRef(false);
  const fKey = `${f.shipId ?? ''}|${f.commodityIds?.join(',') ?? ''}|${f.originLocations?.join(',') ?? ''}|${f.destLocations?.join(',') ?? ''}|${f.originSystem ?? ''}|${f.destSystem ?? ''}`;
  const hasUrlParams = !!(f.shipId || f.commodityIds?.length || f.originLocations?.length || f.destLocations?.length || f.originSystem || f.destSystem);
  useEffect(() => {
    if (hasUrlParams || restoredRef.current || !ships.length) return;
    const stored = readFiltersFromStorage();
    if (!stored?.shipId) return;
    restoredRef.current = true;

    setShipId(String(stored.shipId));
    if (stored.commodityIds) setCommodityIds(stored.commodityIds);
    if (stored.commodityMode) setCommodityMode(stored.commodityMode);
    if (stored.originSystem) setOriginSystem(stored.originSystem);
    if (stored.destSystem) setDestSystem(stored.destSystem);
    if (stored.originLocations) setOriginLocations(stored.originLocations);
    if (stored.originLocationMode) setOriginLocationMode(stored.originLocationMode);
    if (stored.destLocations) setDestLocations(stored.destLocations);
    if (stored.destLocationMode) setDestLocationMode(stored.destLocationMode);
    if (stored.maxInvestment) setMaxInvestment(String(stored.maxInvestment));
    if (stored.maxDistance) setMaxDistance(String(stored.maxDistance));
    if (stored.commodityType) setCommodityType(stored.commodityType);
    if (stored.autoLoadType) setAutoLoadType(stored.autoLoadType);
    if (stored.sortBy) setSortBy(stored.sortBy);
    if (stored.roundTrip) setRoundTrip(stored.roundTrip);
    if (stored.profitMode) setProfitMode(stored.profitMode);

    // Restore ship search text
    const s = ships.find((x: ShipOption) => x.id === stored.shipId);
    if (s) setShipSearch(s.name);

    onFilterChange({ ...stored, sortOrder: 'desc' });
  }, [hasUrlParams, fKey, onFilterChange, ships]);

  // Restore ship search text from URL params (shipId set but shipSearch empty)
  useEffect(() => {
    if (!shipId || !ships.length) return;
    const s = ships.find((x: ShipOption) => x.id === parseInt(shipId));
    if (s) setShipSearch(s.name);
  }, [shipId, ships]);

  // Auto-persist filter changes to URL/sessionStorage without triggering search
  useEffect(() => {
    if (!hasShip || !onFiltersPersist) return;
    onFiltersPersist({
      shipId: parseInt(shipId),
      commodityIds: commodityIds.length ? commodityIds : undefined,
      commodityMode: commodityIds.length ? commodityMode : undefined,
      originSystem: originSystem || undefined,
      destSystem: destSystem || undefined,
      originLocations: originLocations.length ? originLocations : undefined,
      originLocationMode: originLocations.length ? originLocationMode : undefined,
      destLocations: destLocations.length ? destLocations : undefined,
      destLocationMode: destLocations.length ? destLocationMode : undefined,
      maxInvestment: maxInvestment ? parseFloat(maxInvestment) : undefined,
      maxDistance: maxDistance ? parseFloat(maxDistance) : undefined,
      commodityType: (commodityType || undefined) as RouteFilters['commodityType'],
      autoLoadType: (autoLoadType || undefined) as RouteFilters['autoLoadType'],
      sortBy: sortBy as RouteFilters['sortBy'],
      sortOrder: 'desc',
      roundTrip: roundTrip || undefined,
      profitMode: profitMode as RouteFilters['profitMode'],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipId, commodityIds, commodityMode, originSystem, destSystem, originLocations, originLocationMode, destLocations, destLocationMode,
      maxInvestment, maxDistance, commodityType, autoLoadType, sortBy, roundTrip, profitMode]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (shipRef.current && !shipRef.current.contains(e.target as Node)) {
        setShipOpen(false);
      }
      if (commodityRef.current && !commodityRef.current.contains(e.target as Node)) {
        setCommodityOpen(false);
      }
      if (originLocRef.current && !originLocRef.current.contains(e.target as Node)) {
        setOriginLocOpen(false);
      }
      if (destLocRef.current && !destLocRef.current.contains(e.target as Node)) {
        setDestLocOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedShip = ships.find((s) => s.id === parseInt(shipId));

  const filteredShips = useMemo(() => {
    if (!shipSearch.trim()) return ships;
    const q = shipSearch.toLowerCase();
    return ships.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.companyName.toLowerCase().includes(q)
    );
  }, [ships, shipSearch]);

  function selectShip(id: number) {
    setShipId(String(id));
    const ship = ships.find((s) => s.id === id);
    if (ship) setShipSearch(ship.name);
    setShipOpen(false);
  }

  const filteredCommodities = useMemo(() => {
    const q = commoditySearch.trim().toLowerCase();
    const filtered = q
      ? commodities.filter(c => c.nameZh.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q) || c.kindZh.includes(q))
      : commodities;
    // Sort selected first
    return [...filtered].sort((a, b) => {
      const aSel = commodityIds.includes(a.id) ? 0 : 1;
      const bSel = commodityIds.includes(b.id) ? 0 : 1;
      return aSel - bSel;
    });
  }, [commodities, commoditySearch, commodityIds]);

  function selectCommodity(id: number) {
    setCommodityIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  // Filtered location lists
  const filteredOriginLocs = useMemo(() => {
    const q = originLocSearch.trim().toLowerCase();
    const filtered = q
      ? locations.filter(l => l.name.toLowerCase().includes(q) || l.system.toLowerCase().includes(q) || (l.planet || '').toLowerCase().includes(q))
      : locations;
    return [...filtered].sort((a, b) => {
      const aSel = originLocations.includes(a.name) ? 0 : 1;
      const bSel = originLocations.includes(b.name) ? 0 : 1;
      return aSel - bSel;
    });
  }, [locations, originLocSearch, originLocations]);

  const filteredDestLocs = useMemo(() => {
    const q = destLocSearch.trim().toLowerCase();
    const filtered = q
      ? locations.filter(l => l.name.toLowerCase().includes(q) || l.system.toLowerCase().includes(q) || (l.planet || '').toLowerCase().includes(q))
      : locations;
    return [...filtered].sort((a, b) => {
      const aSel = destLocations.includes(a.name) ? 0 : 1;
      const bSel = destLocations.includes(b.name) ? 0 : 1;
      return aSel - bSel;
    });
  }, [locations, destLocSearch, destLocations]);

  function selectOriginLoc(name: string) {
    setOriginLocations(prev => prev.includes(name) ? prev.filter(l => l !== name) : [...prev, name]);
  }

  function selectDestLoc(name: string) {
    setDestLocations(prev => prev.includes(name) ? prev.filter(l => l !== name) : [...prev, name]);
  }

  const hasShip = shipId !== '';

  function resetFilters() {
    try { sessionStorage.removeItem('sc-trade-filters'); } catch { /* ignore */ }
    window.location.href = '/routes';
  }

  function apply() {
    if (!hasShip) return;
    onFilterChange({
      shipId: parseInt(shipId),
      commodityIds: commodityIds.length ? commodityIds : undefined,
      commodityMode: commodityIds.length ? commodityMode : undefined,
      originSystem: originSystem || undefined,
      destSystem: destSystem || undefined,
      originLocations: originLocations.length ? originLocations : undefined,
      originLocationMode: originLocations.length ? originLocationMode : undefined,
      destLocations: destLocations.length ? destLocations : undefined,
      destLocationMode: destLocations.length ? destLocationMode : undefined,
      maxInvestment: maxInvestment ? parseFloat(maxInvestment) : undefined,
      maxDistance: maxDistance ? parseFloat(maxDistance) : undefined,
      commodityType: (commodityType || undefined) as RouteFilters['commodityType'],
      autoLoadType: (autoLoadType || undefined) as RouteFilters['autoLoadType'],
      sortBy: sortBy as RouteFilters['sortBy'],
      sortOrder: 'desc',
      roundTrip,
      profitMode: profitMode as RouteFilters['profitMode'],
    });
  }

  return (
    <div className="section-card p-3 sm:p-4 lg:p-6 space-y-3 lg:space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          贸易路线筛选器
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-border/40 via-border/20 to-transparent" />
      </div>

      {/* Row 1: Ship + Commodity selectors */}
      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex flex-col gap-1 relative" ref={shipRef}>
          <label className="text-[11px] tracking-wider text-primary/80 uppercase">
            选择货船
          </label>
          <input
            ref={inputRef}
            type="text"
            value={shipSearch}
            onChange={(e) => {
              setShipSearch(e.target.value);
              setShipOpen(true);
              if (e.target.value === '') setShipId('');
            }}
            onFocus={() => setShipOpen(true)}
            placeholder={selectedShip ? selectedShip.name : '搜索货船...'}
            className="h-9 w-full sm:w-[240px] lg:w-[260px] rounded-md border border-primary/35 bg-secondary px-3 text-sm text-foreground
                       placeholder:text-muted-foreground/50
                       focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none
                       transition-colors"
          />
          <span className={`text-[10px] text-muted-foreground ${selectedShip ? '' : 'invisible'}`}>
            {selectedShip ? `${selectedShip.companyName} · ${selectedShip.scu} SCU` : 'placeholder'}
            {selectedShip?.spaceOnly && (
              <span className="ml-1.5 px-1 py-0.5 rounded bg-destructive/10 text-destructive text-[9px]">
                仅外部货柜
              </span>
            )}
          </span>
          {shipOpen && (
            <div className="absolute top-full mt-1 left-0 w-[280px] max-h-[240px] overflow-y-auto
                            rounded-md border border-border/40 bg-card shadow-lg z-50">
              {filteredShips.length === 0 ? (
                <div className="px-3 py-2 text-xs text-muted-foreground">无匹配货船</div>
              ) : (
                filteredShips.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => selectShip(s.id)}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-accent/80 transition-colors
                               flex items-center justify-between gap-2
                               ${parseInt(shipId) === s.id ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                  >
                    <span className="truncate">
                      {s.name}
                      <span className="text-[10px] text-muted-foreground ml-1.5">{s.nameEn}</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {s.scu} SCU
                      {s.spaceOnly && <span className="text-[9px] text-destructive/70 ml-1">站</span>}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Commodity multi-select */}
        <div className="flex flex-col gap-1 relative" ref={commodityRef}>
          <label className="text-[11px] tracking-wider text-muted-foreground uppercase">商品</label>
          <input
            type="text"
            value={commoditySearch}
            onChange={(e) => { setCommoditySearch(e.target.value); setCommodityOpen(true); }}
            onFocus={() => setCommodityOpen(true)}
            placeholder={commodityIds.length ? `已选 ${commodityIds.length} 项` : '不限'}
            className="h-9 w-full sm:w-[200px] lg:w-[220px] rounded-md border border-border/40 bg-secondary px-3 text-sm text-foreground
                       placeholder:text-muted-foreground/50
                       focus:border-primary/60 focus:ring-1 focus:ring-primary/30 outline-none transition-colors"
          />
          {commodityOpen && (
            <div className="absolute top-full mt-1 left-0 w-[320px] max-h-[320px] overflow-y-auto
                            rounded-md border border-border/40 bg-card shadow-lg z-50">
              <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border/30 bg-muted/20">
                <ModeToggle mode={commodityMode} onChange={setCommodityMode} />
                <button
                  onClick={() => { setCommodityIds([]); setCommoditySearch(''); setCommodityOpen(false); }}
                  className="ml-auto text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >清空</button>
              </div>
              {filteredCommodities.length === 0 ? (
                <div className="px-3 py-2 text-xs text-muted-foreground">无匹配商品</div>
              ) : (
                filteredCommodities.map((c) => {
                  const checked = commodityIds.includes(c.id);
                  return (
                    <label key={c.id}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent/80 transition-colors cursor-pointer
                                 ${checked ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                        title={c.nameEn}
                      >
                        <input type="checkbox" checked={checked} onChange={() => selectCommodity(c.id)} className="shrink-0" />
                        <span className="truncate">{c.nameZh}</span>
                        <span className="text-[10px] text-muted-foreground/60">{c.nameEn}</span>
                        <span className="text-[10px] text-muted-foreground/40">{c.kindZh}</span>
                        {c.isDazong && <span className="text-[9px] text-chart-2/60">大宗</span>}
                        {c.isIllegal && <span className="text-[9px] text-destructive/60">违禁</span>}
                      </label>
                    );
                  })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Origin group + Dest group */}
      <div className="flex flex-wrap gap-x-6 gap-y-2.5 items-end">
        {/* Origin group */}
        <div className="flex items-end gap-2">
          <div className="border-l-[3px] border-chart-2/40 pl-2.5 flex items-end gap-2">
            <span className="text-[10px] tracking-[0.15em] text-chart-2/70 uppercase mb-2">起点</span>
            <SelectField label="星系" value={originSystem} onChange={setOriginSystem}>
              <option value="">全部</option>
              {systems.map((s) => (
                <option key={s.en} value={s.en}>{s.zh}</option>
              ))}
            </SelectField>
            <div className="flex flex-col gap-1 relative" ref={originLocRef}>
              <label className="text-[11px] tracking-wider text-muted-foreground uppercase">地点</label>
              <input
                type="text"
                value={originLocSearch}
                onChange={(e) => { setOriginLocSearch(e.target.value); setOriginLocOpen(true); }}
                onFocus={() => setOriginLocOpen(true)}
                placeholder={originLocations.length ? `已选 ${originLocations.length} 项` : '不限'}
                className="h-9 w-full sm:w-[150px] lg:w-[160px] rounded-md border border-border/40 bg-secondary px-3 text-sm text-foreground
                           placeholder:text-muted-foreground/50
                           focus:border-primary/60 focus:ring-1 focus:ring-primary/30 outline-none transition-colors"
              />
              {originLocOpen && (
                <div className="absolute top-full mt-1 left-0 w-[300px] max-h-[320px] overflow-y-auto
                                rounded-md border border-border/40 bg-card shadow-lg z-50">
                  <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border/30 bg-muted/20">
                    <ModeToggle mode={originLocationMode} onChange={setOriginLocationMode} />
                    <button
                      onClick={() => { setOriginLocations([]); setOriginLocSearch(''); setOriginLocOpen(false); }}
                      className="ml-auto text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    >清空</button>
                  </div>
                  {filteredOriginLocs.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-muted-foreground">无匹配地点</div>
                  ) : (
                    filteredOriginLocs.map((l) => {
                      const checked = originLocations.includes(l.name);
                      return (
                        <label key={l.name}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent/80 transition-colors cursor-pointer
                                     ${checked ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                          title={l.nameEn}
                        >
                          <input type="checkbox" checked={checked} onChange={() => selectOriginLoc(l.name)} className="shrink-0" />
                          <span className="truncate">{l.name}</span>
                          <span className="text-[10px] text-muted-foreground/60 ml-2">
                            {[l.system, l.planet].filter(Boolean).join(' · ')}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dest group */}
        <div className="flex items-end gap-2">
          <div className="border-l-[3px] border-destructive/40 pl-2.5 flex items-end gap-2">
            <span className="text-[10px] tracking-[0.15em] text-destructive/70 uppercase mb-2">终点</span>
            <SelectField label="星系" value={destSystem} onChange={setDestSystem}>
              <option value="">全部</option>
              {systems.map((s) => (
                <option key={s.en} value={s.en}>{s.zh}</option>
              ))}
            </SelectField>
            <div className="flex flex-col gap-1 relative" ref={destLocRef}>
              <label className="text-[11px] tracking-wider text-muted-foreground uppercase">地点</label>
              <input
                type="text"
                value={destLocSearch}
                onChange={(e) => { setDestLocSearch(e.target.value); setDestLocOpen(true); }}
                onFocus={() => setDestLocOpen(true)}
                placeholder={destLocations.length ? `已选 ${destLocations.length} 项` : '不限'}
                className="h-9 w-full sm:w-[150px] lg:w-[160px] rounded-md border border-border/40 bg-secondary px-3 text-sm text-foreground
                           placeholder:text-muted-foreground/50
                           focus:border-primary/60 focus:ring-1 focus:ring-primary/30 outline-none transition-colors"
              />
              {destLocOpen && (
                <div className="absolute top-full mt-1 left-0 w-[300px] max-h-[320px] overflow-y-auto
                                rounded-md border border-border/40 bg-card shadow-lg z-50">
                  <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border/30 bg-muted/20">
                    <ModeToggle mode={destLocationMode} onChange={setDestLocationMode} />
                    <button
                      onClick={() => { setDestLocations([]); setDestLocSearch(''); setDestLocOpen(false); }}
                      className="ml-auto text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                    >清空</button>
                  </div>
                  {filteredDestLocs.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-muted-foreground">无匹配地点</div>
                  ) : (
                    filteredDestLocs.map((l) => {
                      const checked = destLocations.includes(l.name);
                      return (
                        <label key={l.name}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent/80 transition-colors cursor-pointer
                                     ${checked ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                          title={l.nameEn}
                        >
                          <input type="checkbox" checked={checked} onChange={() => selectDestLoc(l.name)} className="shrink-0" />
                          <span className="truncate">{l.name}</span>
                          <span className="text-[10px] text-muted-foreground/60 ml-2">
                            {[l.system, l.planet].filter(Boolean).join(' · ')}
                          </span>
                        </label>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Constraints + sort + button */}
      <div className="flex flex-wrap gap-2.5 items-end">
        <LogInputField label="最大投资" value={maxInvestment} onChange={setMaxInvestment} placeholder="aUEC" max={100000000} />
        <LogInputField label="最大距离" value={maxDistance} onChange={setMaxDistance} placeholder="GM" max={1000} />
        <SelectField label="商品类型" value={commodityType} onChange={setCommodityType}>
          <option value="">全部</option>
          <option value="major">大宗商品</option>
          <option value="minor">小宗商品</option>
        </SelectField>
        <SelectField label="自动装卸" value={autoLoadType} onChange={setAutoLoadType}>
          <option value="">全部</option>
          <option value="full">全程自动</option>
          <option value="half">半程自动</option>
          <option value="manual">全手动</option>
        </SelectField>
        <SelectField label="排序" value={sortBy} onChange={setSortBy}>
          <option value="profit">总利润</option>
          <option value="roi">利润率</option>
          <option value="distance">距离</option>
        </SelectField>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] tracking-wider text-muted-foreground uppercase flex items-center gap-1">
            利润算法
            <span className="relative group/help inline-flex">
              <svg width="13" height="13" viewBox="0 0 14 14" className="cursor-help stroke-muted-foreground/50 hover:stroke-foreground transition-colors" fill="none" strokeWidth="1">
                <circle cx="7" cy="7" r="6.5" />
                <text x="7" y="10.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="9" fontWeight="600" fontFamily="sans-serif">?</text>
              </svg>
              <span className="absolute left-0 bottom-full mb-1 w-56 p-2.5 rounded-md border border-border bg-card text-[10px] leading-relaxed text-foreground shadow-lg z-50 whitespace-pre-line hidden group-hover/help:block">
{'即时利润（默认）：价格取当前快照价，库存取当前快照库存，并基于此计算总利润，参考价值最高。\n\n期望利润：价格取24h加权平均值，库存取24h加权平均值，并基于此计算总利润。如果您追求更稳健的路线参考，请选择此算法。\n\n最大利润：价格取当前快照价，库存取历史最大库存，并基于此计算总利润。展示当前理论利润天花板，实际可买量通常远低于历史峰值。如果您追求更激进的路线参考，请选择此算法。'}
              </span>
            </span>
          </span>
          <select
            value={profitMode}
            onChange={(e) => setProfitMode(e.target.value)}
            className="h-9 w-[90px] sm:w-[100px] lg:w-[120px] rounded-md border border-border/40 bg-secondary px-2 text-sm text-foreground
                       focus:border-primary/60 focus:ring-1 focus:ring-primary/30 outline-none
                       transition-colors appearance-none cursor-pointer"
          >
            <option value="live">即时利润</option>
            <option value="expected">期望利润</option>
            <option value="max">最大利润</option>
          </select>
        </div>
        <label className="flex items-center gap-2 h-9 px-3 rounded-md border border-border/40 bg-secondary cursor-pointer hover:border-primary/40 transition-colors select-none">
          <span className="text-[11px] tracking-wider text-muted-foreground uppercase">往返航线</span>
          <div className="relative w-8 h-[18px] flex items-center">
            <div className={`w-8 h-[18px] rounded-full transition-colors ${roundTrip ? 'bg-primary' : 'bg-muted-foreground/25'}`} />
            <div className={`absolute w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform ${roundTrip ? 'translate-x-[15px]' : 'translate-x-[1px]'}`} />
          </div>
          <input type="checkbox" checked={roundTrip} onChange={(e) => setRoundTrip(e.target.checked)} className="sr-only" />
        </label>
        <button onClick={apply} disabled={loading || !hasShip}
          className="h-9 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold
                     hover:bg-primary/90 hover:shadow-[0_2px_10px_hsl(42_65%_45%/0.3)]
                     active:bg-primary/80 active:shadow-none
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none
                     transition-all duration-200 tracking-wide"
          title={!hasShip ? '请先选择货船' : ''}
        >
          {!hasShip ? '请先选择货船' : loading ? '查询中…' : '查询路线'}
        </button>
        <button onClick={resetFilters}
          className="h-9 px-4 rounded-lg border border-border/50 bg-secondary text-sm text-muted-foreground
                     hover:text-foreground hover:border-border hover:bg-accent
                     active:bg-accent/80 transition-all duration-200"
        >
          重置
        </button>
      </div>
    </div>
  );
}
