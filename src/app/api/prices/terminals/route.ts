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
    select: { terminalId: true, scuBuyMax: true, scuSellMax: true },
  });
  const maxMap: Record<number, { buyMax: number; sellMax: number }> = {};
  for (const m of termMaxRows) {
    maxMap[m.terminalId] = { buyMax: m.scuBuyMax ?? 0, sellMax: m.scuSellMax ?? 0 };
  }

  const seen = new Set<number>();
  const terminals: Array<Record<string, unknown>> = [];
  for (const s of snapshots) {
    if (seen.has(s.terminal.id)) continue;
    seen.add(s.terminal.id);
    const mx = maxMap[s.terminal.id];
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
      priceBuy: s.priceBuy,
      priceSell: s.priceSell,
      scuBuyStock: s.scuBuyStock,
      scuSellStock: s.scuSellStock,
      scuBuyMax: mx?.buyMax ?? null,
      scuSellMax: mx?.sellMax ?? null,
      updatedAt: s.uexModifiedAt
        ? new Date(s.uexModifiedAt * 1000).toISOString()
        : s.fetchedAt.toISOString(),
    });
  }

  return NextResponse.json(terminals);
}
