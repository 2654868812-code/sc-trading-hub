'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import type { RouteFilters, ShipOption } from '@/types';
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
        className="h-9 w-[120px] rounded-md border border-border/40 bg-secondary px-3 text-sm text-foreground
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
        className="h-9 w-[120px] rounded-md border border-border/40 bg-secondary px-3 text-sm text-foreground
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
          className="h-9 w-[88px] border-y border-border/40 bg-secondary px-1 text-center text-sm text-foreground tabular-nums
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

  // Commodity selector
  const [commodities, setCommodities] = useState<CommodityOption[]>([]);
  const [commodityId, setCommodityId] = useState(f.commodityId ? String(f.commodityId) : '');
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

  // Location selectors
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [originLocation, setOriginLocation] = useState(f.originLocation || '');
  const [originLocSearch, setOriginLocSearch] = useState(f.originLocation || '');
  const [originLocOpen, setOriginLocOpen] = useState(false);
  const [destLocation, setDestLocation] = useState(f.destLocation || '');
  const [destLocSearch, setDestLocSearch] = useState(f.destLocation || '');
  const [destLocOpen, setDestLocOpen] = useState(false);
  const originLocRef = useRef<HTMLDivElement>(null);
  const destLocRef = useRef<HTMLDivElement>(null);

  // Load data + restore from sessionStorage if URL is empty (after hydration)
  useEffect(() => {
    const hasUrlParams = !!(f.shipId || f.commodityId || f.originSystem || f.destSystem);

    Promise.all([
      fetch('/api/vehicles').then((r) => r.json()),
      fetch('/api/locations').then((r) => r.json()),
      fetch('/api/commodities').then((r) => r.json()),
    ]).then(([shipsData, locsData, commData]) => {
      setShips(shipsData);
      setLocations(locsData);
      const commList = commData.map((c: any) => ({
        id: c.id, nameZh: c.nameZh || c.name, nameEn: c.nameEn || c.name,
        kindZh: c.kindZh || '', isDazong: c.isDazong || false, isIllegal: c.isIllegal || false,
      }));
      setCommodities(commList);

      // Determine effective shipId/commodityId: URL first, fallback to sessionStorage
      let effectiveShipId = shipId;
      let effectiveCommodityId = commodityId;
      let stored: RouteFilters | null = null;

      if (!hasUrlParams) {
        stored = readFiltersFromStorage();
      }

      if (stored?.shipId) {
        effectiveShipId = String(stored.shipId);
        effectiveCommodityId = stored.commodityId ? String(stored.commodityId) : '';

        setShipId(effectiveShipId);
        if (stored.commodityId) setCommodityId(String(stored.commodityId));
        if (stored.originSystem) setOriginSystem(stored.originSystem);
        if (stored.destSystem) setDestSystem(stored.destSystem);
        if (stored.originLocation) { setOriginLocation(stored.originLocation); setOriginLocSearch(stored.originLocation); }
        if (stored.destLocation) { setDestLocation(stored.destLocation); setDestLocSearch(stored.destLocation); }
        if (stored.maxInvestment) setMaxInvestment(String(stored.maxInvestment));
        if (stored.maxDistance) setMaxDistance(String(stored.maxDistance));
        if (stored.commodityType) setCommodityType(stored.commodityType);
        if (stored.autoLoadType) setAutoLoadType(stored.autoLoadType);
        if (stored.sortBy) setSortBy(stored.sortBy);
        if (stored.roundTrip) setRoundTrip(stored.roundTrip);
      }

      // Restore search text from effective IDs (works for both URL and sessionStorage)
      if (effectiveShipId) {
        const s = shipsData.find((x: ShipOption) => x.id === parseInt(effectiveShipId));
        if (s) setShipSearch(s.name);
      }
      if (effectiveCommodityId) {
        const c = commList.find((x: CommodityOption) => x.id === parseInt(effectiveCommodityId));
        if (c) setCommoditySearch(c.nameZh);
      }

      // Auto-search if sessionStorage had filters (URL case handled by parent)
      if (stored?.shipId) {
        onFilterChange({ ...stored, sortOrder: 'desc' });
      }
    }).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-persist filter changes to URL/sessionStorage without triggering search
  useEffect(() => {
    if (!hasShip || !onFiltersPersist) return;
    onFiltersPersist({
      shipId: parseInt(shipId),
      commodityId: commodityId ? parseInt(commodityId) : undefined,
      originSystem: originSystem || undefined,
      destSystem: destSystem || undefined,
      originLocation: originLocation || undefined,
      destLocation: destLocation || undefined,
      maxInvestment: maxInvestment ? parseFloat(maxInvestment) : undefined,
      maxDistance: maxDistance ? parseFloat(maxDistance) : undefined,
      commodityType: (commodityType || undefined) as RouteFilters['commodityType'],
      autoLoadType: (autoLoadType || undefined) as RouteFilters['autoLoadType'],
      sortBy: sortBy as RouteFilters['sortBy'],
      sortOrder: 'desc',
      roundTrip: roundTrip || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipId, commodityId, originSystem, destSystem, originLocation, destLocation,
      maxInvestment, maxDistance, commodityType, autoLoadType, sortBy, roundTrip]);

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

  const selectedCommodity = commodities.find((c) => c.id === parseInt(commodityId));

  const filteredCommodities = useMemo(() => {
    if (!commoditySearch.trim()) return commodities.slice(0, 30);
    const q = commoditySearch.toLowerCase();
    return commodities.filter(
      (c) => c.nameZh.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q) || c.kindZh.includes(q)
    ).slice(0, 30);
  }, [commodities, commoditySearch]);

  function selectCommodity(id: number) {
    setCommodityId(String(id));
    const c = commodities.find((x) => x.id === id);
    if (c) setCommoditySearch(c.nameZh);
    setCommodityOpen(false);
  }

  // Filtered location lists
  const filteredOriginLocs = useMemo(() => {
    if (!originLocSearch.trim()) return locations.slice(0, 30);
    const q = originLocSearch.toLowerCase();
    return locations.filter(
      (l) => l.name.toLowerCase().includes(q) ||
        l.system.toLowerCase().includes(q) ||
        (l.planet || '').toLowerCase().includes(q)
    ).slice(0, 30);
  }, [locations, originLocSearch]);

  const filteredDestLocs = useMemo(() => {
    if (!destLocSearch.trim()) return locations.slice(0, 30);
    const q = destLocSearch.toLowerCase();
    return locations.filter(
      (l) => l.name.toLowerCase().includes(q) ||
        l.system.toLowerCase().includes(q) ||
        (l.planet || '').toLowerCase().includes(q)
    ).slice(0, 30);
  }, [locations, destLocSearch]);

  function selectOriginLoc(name: string) {
    setOriginLocation(name);
    setOriginLocSearch(name);
    setOriginLocOpen(false);
  }

  function selectDestLoc(name: string) {
    setDestLocation(name);
    setDestLocSearch(name);
    setDestLocOpen(false);
  }

  const hasShip = shipId !== '';

  function apply() {
    if (!hasShip) return;
    onFilterChange({
      commodityId: commodityId ? parseInt(commodityId) : undefined,
      shipId: parseInt(shipId),
      originSystem: originSystem || undefined,
      destSystem: destSystem || undefined,
      originLocation: originLocation || undefined,
      destLocation: destLocation || undefined,
      maxInvestment: maxInvestment ? parseFloat(maxInvestment) : undefined,
      maxDistance: maxDistance ? parseFloat(maxDistance) : undefined,
      commodityType: (commodityType || undefined) as RouteFilters['commodityType'],
      autoLoadType: (autoLoadType || undefined) as RouteFilters['autoLoadType'],
      sortBy: sortBy as RouteFilters['sortBy'],
      sortOrder: 'desc',
      roundTrip,
    });
  }

  return (
    <div className="section-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          贸易路线筛选器
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-border/40 via-border/20 to-transparent" />
      </div>

      {/* Row 1: Ship + Commodity selectors */}
      <div className="flex items-start gap-4">
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
            className="h-9 w-[260px] rounded-md border border-primary/35 bg-secondary px-3 text-sm text-foreground
                       placeholder:text-muted-foreground/50
                       focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none
                       transition-colors"
          />
          {selectedShip && (
            <span className="text-[10px] text-muted-foreground">
              {selectedShip.companyName} · {selectedShip.scu} SCU
              {selectedShip.spaceOnly && (
                <span className="ml-1.5 px-1 py-0.5 rounded bg-destructive/10 text-destructive text-[9px]">
                  仅空间站
                </span>
              )}
            </span>
          )}
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

        {/* Commodity selector */}
        <div className="flex flex-col gap-1 relative" ref={commodityRef}>
          <label className="text-[11px] tracking-wider text-muted-foreground uppercase">
            商品
          </label>
          <input
            type="text"
            value={commoditySearch}
            onChange={(e) => {
              setCommoditySearch(e.target.value);
              setCommodityOpen(true);
              if (e.target.value === '') setCommodityId('');
            }}
            onFocus={() => setCommodityOpen(true)}
            placeholder={selectedCommodity ? selectedCommodity.nameZh : '不限'}
            className="h-9 w-[220px] rounded-md border border-border/40 bg-secondary px-3 text-sm text-foreground
                       placeholder:text-muted-foreground/50
                       focus:border-primary/60 focus:ring-1 focus:ring-primary/30 outline-none transition-colors"
            title={selectedCommodity?.nameEn}
          />
          {selectedCommodity && (
            <span className="text-[10px] text-muted-foreground">
              {selectedCommodity.kindZh}
              {selectedCommodity.isDazong && <span className="text-chart-2/70 ml-1">大宗</span>}
              {selectedCommodity.isIllegal && <span className="text-destructive/70 ml-1">违禁</span>}
            </span>
          )}
          {commodityOpen && (
            <div className="absolute top-full mt-1 left-0 w-[320px] max-h-[280px] overflow-y-auto
                            rounded-md border border-border/40 bg-card shadow-lg z-50">
              {filteredCommodities.length === 0 ? (
                <div className="px-3 py-2 text-xs text-muted-foreground">无匹配商品</div>
              ) : (
                <>
                  <button
                    onClick={() => { setCommodityId(''); setCommoditySearch(''); setCommodityOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent/50 border-b border-border/30"
                  >不限</button>
                  {filteredCommodities.map((c) => (
                    <button key={c.id}
                      onClick={() => selectCommodity(c.id)}
                      className={`w-full text-left px-3 py-1.5 text-sm hover:bg-accent/80 transition-colors
                                 ${parseInt(commodityId) === c.id ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                      title={c.nameEn}
                    >
                      <span className="truncate">{c.nameZh}</span>
                      <span className="text-[10px] text-muted-foreground/60 ml-2">{c.nameEn}</span>
                      <span className="text-[10px] text-muted-foreground/40 ml-1.5">{c.kindZh}</span>
                      {c.isDazong && <span className="text-[9px] text-chart-2/60 ml-1">大宗</span>}
                      {c.isIllegal && <span className="text-[9px] text-destructive/60 ml-1">违禁</span>}
                    </button>
                  ))}
                </>
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
                onChange={(e) => {
                  setOriginLocSearch(e.target.value);
                  setOriginLocOpen(true);
                  if (e.target.value === '') setOriginLocation('');
                }}
                onFocus={() => setOriginLocOpen(true)}
                placeholder={originLocation || '不限'}
                title={locations.find(l => l.name === originLocation)?.nameEn}
                className="h-9 w-[160px] rounded-md border border-border/40 bg-secondary px-3 text-sm text-foreground
                           placeholder:text-muted-foreground/50
                           focus:border-primary/60 focus:ring-1 focus:ring-primary/30 outline-none transition-colors"
              />
              {originLocOpen && (
                <div className="absolute top-full mt-1 left-0 w-[300px] max-h-[280px] overflow-y-auto
                                rounded-md border border-border/40 bg-card shadow-lg z-50">
                  {filteredOriginLocs.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-muted-foreground">无匹配地点</div>
                  ) : (
                    <>
                      <button
                        onClick={() => { setOriginLocation(''); setOriginLocSearch(''); setOriginLocOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent/50 border-b border-border/30"
                      >不限</button>
                      {filteredOriginLocs.map((l) => (
                        <button key={l.name}
                          onClick={() => selectOriginLoc(l.name)}
                          title={l.nameEn}
                          className={`w-full text-left px-3 py-1.5 text-sm hover:bg-accent/80 transition-colors
                                     ${originLocation === l.name ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                        >
                          <span className="truncate">{l.name}</span>
                          <span className="text-[10px] text-muted-foreground/60 ml-2">
                            {[l.system, l.planet].filter(Boolean).join(' · ')}
                          </span>
                        </button>
                      ))}
                    </>
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
                onChange={(e) => {
                  setDestLocSearch(e.target.value);
                  setDestLocOpen(true);
                  if (e.target.value === '') setDestLocation('');
                }}
                onFocus={() => setDestLocOpen(true)}
                placeholder={destLocation || '不限'}
                title={locations.find(l => l.name === destLocation)?.nameEn}
                className="h-9 w-[160px] rounded-md border border-border/40 bg-secondary px-3 text-sm text-foreground
                           placeholder:text-muted-foreground/50
                           focus:border-primary/60 focus:ring-1 focus:ring-primary/30 outline-none transition-colors"
              />
              {destLocOpen && (
                <div className="absolute top-full mt-1 left-0 w-[300px] max-h-[280px] overflow-y-auto
                                rounded-md border border-border/40 bg-card shadow-lg z-50">
                  {filteredDestLocs.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-muted-foreground">无匹配地点</div>
                  ) : (
                    <>
                      <button
                        onClick={() => { setDestLocation(''); setDestLocSearch(''); setDestLocOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent/50 border-b border-border/30"
                      >不限</button>
                      {filteredDestLocs.map((l) => (
                        <button key={l.name}
                          onClick={() => selectDestLoc(l.name)}
                          title={l.nameEn}
                          className={`w-full text-left px-3 py-1.5 text-sm hover:bg-accent/80 transition-colors
                                     ${destLocation === l.name ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
                        >
                          <span className="truncate">{l.name}</span>
                          <span className="text-[10px] text-muted-foreground/60 ml-2">
                            {[l.system, l.planet].filter(Boolean).join(' · ')}
                          </span>
                        </button>
                      ))}
                    </>
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
          <option value="roi">ROI</option>
          <option value="distance">距离</option>
        </SelectField>
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
      </div>
    </div>
  );
}
