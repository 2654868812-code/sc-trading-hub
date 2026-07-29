import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { TradeRoute } from '@/types';
import { getZhName, getZhKind } from '@/lib/commodity-zh';
import { getTerminalZh } from '@/lib/terminal-zh';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const commodityId = searchParams.get('commodityId')
    ? parseInt(searchParams.get('commodityId')!, 10) : undefined;
  const originSystem = searchParams.get('originSystem') || undefined;
  const destSystem = searchParams.get('destSystem') || undefined;
  const maxInvestment = searchParams.get('maxInvestment')
    ? parseFloat(searchParams.get('maxInvestment')!) : undefined;
  const maxDistance = searchParams.get('maxDistance')
    ? parseFloat(searchParams.get('maxDistance')!) : undefined;
  const autoLoadOnly = searchParams.get('autoLoadOnly') === 'true';
  const excludeIllegal = searchParams.get('excludeIllegal') === 'true';
  const sortBy = searchParams.get('sortBy') || 'roi';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  const latest = await prisma.priceSnapshot.findFirst({
    orderBy: { fetchedAt: 'desc' },
    select: { fetchedAt: true },
  });

  if (!latest) {
    return NextResponse.json([]);
  }

  // Fetch buy-side snapshots
  const buySnapshots = await prisma.priceSnapshot.findMany({
    where: {
      fetchedAt: latest.fetchedAt,
      priceBuy: { gt: 0 },
      ...(commodityId ? { commodityId } : {}),
      ...(maxInvestment ? { priceBuy: { gt: 0, lte: maxInvestment } } : {}),
    },
    include: {
      commodity: { select: { id: true, name: true, kind: true, isIllegal: true } },
      terminal: { select: { id: true, name: true, starSystemName: true, isAutoLoad: true } },
    },
  });

  // Fetch sell-side snapshots
  const sellSnapshots = await prisma.priceSnapshot.findMany({
    where: {
      fetchedAt: latest.fetchedAt,
      priceSell: { gt: 0 },
      ...(commodityId ? { commodityId } : {}),
    },
    include: {
      terminal: { select: { id: true, name: true, starSystemName: true, isAutoLoad: true } },
    },
  });

  // Index sell side by commodityId
  const sellByCommodity: Record<number, typeof sellSnapshots> = {};
  for (const s of sellSnapshots) {
    if (!sellByCommodity[s.commodityId]) sellByCommodity[s.commodityId] = [];
    sellByCommodity[s.commodityId].push(s);
  }

  const routes: TradeRoute[] = [];

  for (const buy of buySnapshots) {
    const sells = sellByCommodity[buy.commodityId];
    if (!sells) continue;

    for (const sell of sells) {
      if (buy.terminalId === sell.terminalId) continue;
      if (sell.priceSell! <= buy.priceBuy!) continue;
      if (originSystem && buy.terminal.starSystemName !== originSystem) continue;
      if (destSystem && sell.terminal.starSystemName !== destSystem) continue;
      if (autoLoadOnly && (!buy.terminal.isAutoLoad || !sell.terminal.isAutoLoad)) continue;
      if (excludeIllegal && buy.commodity.isIllegal) continue;

      const profitPerScu = sell.priceSell! - buy.priceBuy!;
      const roi = (profitPerScu / buy.priceBuy!) * 100;

      routes.push({
        commodityId: buy.commodityId,
        commodityName: buy.commodity.name,
        commodityNameZh: getZhName(buy.commodity.name),
        commodityKind: buy.commodity.kind,
        commodityKindZh: getZhKind(buy.commodity.kind),
        originTerminalId: buy.terminalId,
        originTerminalName: buy.terminal.name,
        originTerminalNameZh: getTerminalZh(buy.terminal.name),
        originSystemName: buy.terminal.starSystemName || '',
        buyPrice: buy.priceBuy!,
        destTerminalId: sell.terminalId,
        destTerminalName: sell.terminal.name,
        destTerminalNameZh: getTerminalZh(sell.terminal.name),
        destSystemName: sell.terminal.starSystemName || '',
        sellPrice: sell.priceSell!,
        profitPerScu,
        roi: Math.round(roi * 10) / 10,
        distanceGm: null,
        isAutoLoadOrigin: buy.terminal.isAutoLoad,
        isAutoLoadDest: sell.terminal.isAutoLoad,
      });
    }
  }

  // Sort
  routes.sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'profit') return (a.profitPerScu - b.profitPerScu) * multiplier;
    return (a.roi - b.roi) * multiplier;
  });

  return NextResponse.json(routes.slice(0, 500));
}
