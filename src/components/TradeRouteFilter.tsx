'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import type { RouteFilters, ShipOption } from '@/types';

interface SystemOption {
  en: string;
  zh: string;
}

interface TradeRouteFilterProps {
  systems: SystemOption[];
  onFilterChange: (filters: RouteFilters) => void;
  loading?: boolean;
  /** Commodity locked via ?commodityId= — shown as a removable chip */
  lockedCommodity?: { id: number; nameZh: string } | null;
  onClearCommodity?: () => void;
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

export function TradeRouteFilter({
  systems,
  onFilterChange,
  loading,
  lockedCommodity,
  onClearCommodity,
}: TradeRouteFilterProps) {
  const [ships, setShips] = useState<ShipOption[]>([]);
  const [shipId, setShipId] = useState('');
  const [shipSearch, setShipSearch] = useState('');
  const [shipOpen, setShipOpen] = useState(false);
  const shipRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [originSystem, setOriginSystem] = useState('');
  const [destSystem, setDestSystem] = useState('');
  const [maxInvestment, setMaxInvestment] = useState('');
  const [maxDistance, setMaxDistance] = useState('');
  const [commodityType, setCommodityType] = useState(''); // ''|'major'|'minor'
  const [autoLoadType, setAutoLoadType] = useState(''); // ''|'full'|'half'|'manual'
  const [sortBy, setSortBy] = useState('profit');

  useEffect(() => {
    fetch('/api/vehicles')
      .then((r) => r.json())
      .then((data: ShipOption[]) => setShips(data))
      .catch(console.error);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (shipRef.current && !shipRef.current.contains(e.target as Node)) {
        setShipOpen(false);
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

  const hasShip = shipId !== '';

  function apply() {
    if (!hasShip) return;
    onFilterChange({
      commodityId: lockedCommodity?.id,
      shipId: parseInt(shipId),
      originSystem: originSystem || undefined,
      destSystem: destSystem || undefined,
      maxInvestment: maxInvestment ? parseFloat(maxInvestment) : undefined,
      maxDistance: maxDistance ? parseFloat(maxDistance) : undefined,
      commodityType: (commodityType || undefined) as RouteFilters['commodityType'],
      autoLoadType: (autoLoadType || undefined) as RouteFilters['autoLoadType'],
      sortBy: sortBy as RouteFilters['sortBy'],
      sortOrder: 'desc',
    });
  }

  return (
    <div className="section-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          贸易路线筛选器
        </h2>
        {lockedCommodity && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                           border border-primary/40 bg-primary/10 text-primary
                           text-[11px] whitespace-nowrap">
            仅看 {lockedCommodity.nameZh}
            {onClearCommodity && (
              <button
                type="button"
                onClick={onClearCommodity}
                aria-label={`取消仅看 ${lockedCommodity.nameZh}`}
                className="ml-0.5 -mr-0.5 h-4 w-4 flex items-center justify-center rounded-full
                           text-primary/70 hover:text-primary hover:bg-primary/20
                           transition-colors leading-none"
              >
                ×
              </button>
            )}
          </span>
        )}
        <span className="h-px flex-1 bg-gradient-to-r from-border/40 via-border/20 to-transparent" />
      </div>

      {/* Row 1: Ship selector */}
      <div className="flex items-end gap-3" ref={shipRef}>
        <div className="flex flex-col gap-1 relative">
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
      </div>

      {/* Row 2: Filters + button — all on one line */}
      <div className="flex flex-wrap gap-2.5 items-end">
        <SelectField label="起点星系" value={originSystem} onChange={setOriginSystem}>
          <option value="">全部</option>
          {systems.map((s) => (
            <option key={s.en} value={s.en}>{s.zh}</option>
          ))}
        </SelectField>
        <SelectField label="终点星系" value={destSystem} onChange={setDestSystem}>
          <option value="">全部</option>
          {systems.map((s) => (
            <option key={s.en} value={s.en}>{s.zh}</option>
          ))}
        </SelectField>
        <LogInputField label="最大投资" value={maxInvestment} onChange={setMaxInvestment} placeholder="aUEC" max={100000000} />
        <LogInputField label="最大距离" value={maxDistance} onChange={setMaxDistance} placeholder="GM" max={1000} />
        <SelectField label="排序" value={sortBy} onChange={setSortBy}>
          <option value="profit">总利润</option>
          <option value="roi">ROI</option>
          <option value="distance">距离</option>
        </SelectField>
        <SelectField label="自动装卸" value={autoLoadType} onChange={setAutoLoadType}>
          <option value="">全部</option>
          <option value="full">全程自动</option>
          <option value="half">半程自动</option>
          <option value="manual">全手动</option>
        </SelectField>
        <SelectField label="商品类型" value={commodityType} onChange={setCommodityType}>
          <option value="">全部</option>
          <option value="major">大宗商品</option>
          <option value="minor">小宗商品</option>
        </SelectField>
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
