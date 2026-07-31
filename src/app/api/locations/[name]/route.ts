import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getZhKind } from '@/lib/commodity-zh';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const locationName = decodeURIComponent(name);
  if (!locationName) {
    return NextResponse.json({ error: 'invalid location name' }, { status: 400 });
  }

  // Find all terminals at this location (cityName, spaceStationName, or terminal name for ground stations)
  const terminals = await prisma.terminal.findMany({
    where: {
      OR: [
        { cityName: locationName },
        { spaceStationName: locationName },
        { name: locationName },
      ],
    },
  });

  if (terminals.length === 0) {
    return NextResponse.json({ error: 'location not found' }, { status: 404 });
  }

  // Build location info from first terminal
  const t0 = terminals[0];
  const locationInfo = {
    name: locationName,
    starSystemName: t0.starSystemName,
    starSystemNameEn: t0.starSystemNameEn,
    planetName: t0.planetName,
    planetNameEn: t0.planetNameEn,
    moonName: t0.moonName,
    moonNameEn: t0.moonNameEn,
    terminalCount: terminals.length,
  };

  const terminalIds = terminals.map((t) => t.id);

  // Latest price snapshots for all terminals at this location
  const latest = await prisma.priceSnapshot.findFirst({
    orderBy: { fetchedAt: 'desc' },
    select: { fetchedAt: true },
  });

  if (!latest) {
    return NextResponse.json({
      location: locationInfo,
      terminals: terminals.map((t) => ({
        id: t.id,
        name: t.name,
        nameEn: t.nameEn,
        type: t.type,
        hasCargoCenter: t.hasCargoCenter,
        hasDockingPort: t.hasDockingPort,
        hasFreightElevator: t.hasFreightElevator,
        isAutoLoad: t.isAutoLoad,
      })),
      commodities: [],
      gameVersion: null,
    });
  }

  const snapshots = await prisma.priceSnapshot.findMany({
    where: { terminalId: { in: terminalIds }, fetchedAt: latest.fetchedAt },
    include: {
      commodity: { select: { id: true, name: true, nameEn: true, code: true, kind: true, isIllegal: true, profitMargin: true } },
    },
  });

  // Historical price stats per terminal-commodity
  const commodityIds = [...new Set(snapshots.map((s) => s.commodityId))];
  const [buyStats, sellStats] = await Promise.all([
    prisma.priceSnapshot.groupBy({
      by: ['commodityId', 'terminalId'],
      where: { terminalId: { in: terminalIds }, commodityId: { in: commodityIds }, priceBuy: { gt: 0 } },
      _max: { priceBuy: true },
      _min: { priceBuy: true },
      _avg: { priceBuy: true },
    }),
    prisma.priceSnapshot.groupBy({
      by: ['commodityId', 'terminalId'],
      where: { terminalId: { in: terminalIds }, commodityId: { in: commodityIds }, priceSell: { gt: 0 } },
      _max: { priceSell: true },
      _min: { priceSell: true },
      _avg: { priceSell: true },
    }),
  ]);

  const buyStatMap = new Map<string, { avg: number | null; max: number | null; min: number | null }>();
  for (const r of buyStats) {
    buyStatMap.set(`${r.commodityId}-${r.terminalId}`, {
      avg: r._avg.priceBuy, max: r._max.priceBuy, min: r._min.priceBuy,
    });
  }
  const sellStatMap = new Map<string, { avg: number | null; max: number | null; min: number | null }>();
  for (const r of sellStats) {
    sellStatMap.set(`${r.commodityId}-${r.terminalId}`, {
      avg: r._avg.priceSell, max: r._max.priceSell, min: r._min.priceSell,
    });
  }

  const gameVersion = await prisma.commodityAverage.findFirst({
    where: { gameVersion: { not: null } },
    select: { gameVersion: true },
    orderBy: { fetchedAt: 'desc' },
  });

  // Group commodities by terminal
  const termMap = new Map<number, {
    id: number; name: string; nameEn: string; type: string | null;
    hasCargoCenter: boolean; hasDockingPort: boolean; hasFreightElevator: boolean; isAutoLoad: boolean;
    buys: Array<Record<string, unknown>>; sells: Array<Record<string, unknown>>;
  }>();
  for (const t of terminals) {
    termMap.set(t.id, {
      id: t.id, name: t.name, nameEn: t.nameEn, type: t.type,
      hasCargoCenter: t.hasCargoCenter, hasDockingPort: t.hasDockingPort,
      hasFreightElevator: t.hasFreightElevator, isAutoLoad: t.isAutoLoad,
      buys: [], sells: [],
    });
  }

  for (const s of snapshots) {
    const term = termMap.get(s.terminalId);
    if (!term) continue;
    const key = `${s.commodityId}-${s.terminalId}`;
    const bStat = buyStatMap.get(key);
    const sStat = sellStatMap.get(key);
    const item = {
      id: s.commodityId,
      name: s.commodity.name,
      nameEn: s.commodity.nameEn,
      code: s.commodity.code,
      kind: s.commodity.kind,
      kindZh: getZhKind(s.commodity.kind),
      isIllegal: s.commodity.isIllegal,
      profitMargin: s.commodity.profitMargin,
      priceBuy: s.priceBuy,
      priceBuyAvg: bStat?.avg ?? null,
      priceBuyMax: bStat?.max ?? null,
      priceBuyMin: bStat?.min ?? null,
      scuBuyStock: s.scuBuyStock,
      priceSell: s.priceSell,
      priceSellAvg: sStat?.avg ?? null,
      priceSellMax: sStat?.max ?? null,
      priceSellMin: sStat?.min ?? null,
      scuSellStock: s.scuSellStock,
      updatedAt: s.uexModifiedAt
        ? new Date(s.uexModifiedAt * 1000).toISOString()
        : s.fetchedAt.toISOString(),
    };
    if (s.priceBuy && s.priceBuy > 0) term.buys.push(item);
    if (s.priceSell && s.priceSell > 0) term.sells.push(item);
  }

  return NextResponse.json({
    location: locationInfo,
    terminals: Array.from(termMap.values()),
    gameVersion: gameVersion?.gameVersion ?? null,
  });
}
