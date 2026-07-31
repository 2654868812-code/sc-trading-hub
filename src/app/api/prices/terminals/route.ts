import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const commodityId = parseInt(searchParams.get('commodityId') || '0', 10);

  if (!commodityId) {
    return NextResponse.json({ error: 'commodityId required' }, { status: 400 });
  }

  const latest = await prisma.priceSnapshot.findFirst({
    orderBy: { fetchedAt: 'desc' },
    select: { fetchedAt: true },
  });

  if (!latest) return NextResponse.json([]);

  const snapshots = await prisma.priceSnapshot.findMany({
    where: {
      commodityId,
      fetchedAt: latest.fetchedAt,
    },
    include: {
      terminal: {
        select: {
          id: true,
          name: true,
          nameEn: true,
          starSystemName: true,
          starSystemNameEn: true,
          planetName: true,
          planetNameEn: true,
          moonName: true,
          moonNameEn: true,
          cityName: true,
          cityNameEn: true,
          spaceStationName: true,
          spaceStationNameEn: true,
          type: true,
          hasCargoCenter: true,
          hasDockingPort: true,
          hasFreightElevator: true,
          isAutoLoad: true,
        },
      },
    },
  });

  // Get per-terminal max stock
  const termMaxRows = await prisma.terminalCommodityMax.findMany({
    where: { commodityId },
    select: { terminalId: true, scuBuyMax: true, scuSellMax: true, scuBuyAvg: true, scuSellAvg: true },
  });
  const maxMap: Record<number, { buyMax: number; sellMax: number; buyAvg: number; sellAvg: number }> = {};
  for (const m of termMaxRows) {
    maxMap[m.terminalId] = {
      buyMax: m.scuBuyMax ?? 0,
      sellMax: m.scuSellMax ?? 0,
      buyAvg: m.scuBuyAvg ?? 0,
      sellAvg: m.scuSellAvg ?? 0,
    };
  }

  // Price stats from last 3 days per terminal
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const [buyStats, sellStats] = await Promise.all([
    prisma.priceSnapshot.groupBy({
      by: ['terminalId'],
      where: { commodityId, priceBuy: { gt: 0 }, fetchedAt: { gte: threeDaysAgo } },
      _max: { priceBuy: true },
      _min: { priceBuy: true },
      _avg: { priceBuy: true },
    }),
    prisma.priceSnapshot.groupBy({
      by: ['terminalId'],
      where: { commodityId, priceSell: { gt: 0 }, fetchedAt: { gte: threeDaysAgo } },
      _max: { priceSell: true },
      _min: { priceSell: true },
      _avg: { priceSell: true },
    }),
  ]);

  const buyStatsMap: Record<number, { max: number | null; min: number | null; avg: number | null }> = {};
  for (const r of buyStats) {
    buyStatsMap[r.terminalId] = {
      max: r._max.priceBuy,
      min: r._min.priceBuy,
      avg: r._avg.priceBuy,
    };
  }
  const sellStatsMap: Record<number, { max: number | null; min: number | null; avg: number | null }> = {};
  for (const r of sellStats) {
    sellStatsMap[r.terminalId] = {
      max: r._max.priceSell,
      min: r._min.priceSell,
      avg: r._avg.priceSell,
    };
  }

  const seen = new Set<number>();
  const terminals: Array<Record<string, unknown>> = [];
  for (const s of snapshots) {
    if (seen.has(s.terminal.id)) continue;
    seen.add(s.terminal.id);
    const mx = maxMap[s.terminal.id];
    const bStat = buyStatsMap[s.terminal.id];
    const sStat = sellStatsMap[s.terminal.id];
    terminals.push({
      id: s.terminal.id,
      name: s.terminal.name,
      nameZh: s.terminal.name,
      nameEn: s.terminal.nameEn,
      starSystemName: s.terminal.starSystemName,
      starSystemNameEn: s.terminal.starSystemNameEn,
      planetName: s.terminal.planetName,
      planetNameEn: s.terminal.planetNameEn,
      moonName: s.terminal.moonName,
      moonNameEn: s.terminal.moonNameEn,
      cityName: s.terminal.cityName,
      cityNameEn: s.terminal.cityNameEn,
      spaceStationName: s.terminal.spaceStationName,
      spaceStationNameEn: s.terminal.spaceStationNameEn,
      type: s.terminal.type,
      hasCargoCenter: s.terminal.hasCargoCenter,
      hasDockingPort: s.terminal.hasDockingPort,
      hasFreightElevator: s.terminal.hasFreightElevator,
      isAutoLoad: s.terminal.isAutoLoad,
      // Latest prices
      priceBuy: s.priceBuy,
      priceSell: s.priceSell,
      // Historical price stats
      priceBuyAvg: bStat?.avg ?? null,
      priceBuyMax: bStat?.max ?? null,
      priceBuyMin: bStat?.min ?? null,
      priceSellAvg: sStat?.avg ?? null,
      priceSellMax: sStat?.max ?? null,
      priceSellMin: sStat?.min ?? null,
      // Stock
      scuBuyStock: s.scuBuyStock,
      scuSellStock: s.scuSellStock,
      scuBuyMax: mx?.buyMax ?? null,
      scuSellMax: mx?.sellMax ?? null,
      scuBuyAvg: mx?.buyAvg ?? null,
      scuSellAvg: mx?.sellAvg ?? null,
      updatedAt: s.uexModifiedAt
        ? new Date(s.uexModifiedAt * 1000).toISOString()
        : s.fetchedAt.toISOString(),
    });
  }

  return NextResponse.json(terminals);
}
