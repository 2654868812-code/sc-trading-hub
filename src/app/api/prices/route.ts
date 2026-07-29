import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { PricePoint } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const commodityId = parseInt(searchParams.get('commodityId') || '0', 10);
  const terminalIdsParam = searchParams.get('terminalIds');
  const hours = parseInt(searchParams.get('hours') || '24', 10);

  if (!commodityId) {
    return NextResponse.json({ error: 'commodityId required' }, { status: 400 });
  }

  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const where: Record<string, unknown> = {
    commodityId,
    fetchedAt: { gte: since },
  };

  if (terminalIdsParam) {
    const terminalIds = terminalIdsParam.split(',').map(Number).filter(Boolean);
    if (terminalIds.length > 0) {
      where.terminalId = { in: terminalIds };
    }
  }

  const snapshots = await prisma.priceSnapshot.findMany({
    where,
    orderBy: { fetchedAt: 'asc' },
    include: {
      terminal: { select: { name: true } },
    },
    take: 2000,
  });

  const result: PricePoint[] = snapshots.map((s) => ({
    fetchedAt: s.fetchedAt.toISOString(),
    priceBuy: s.priceBuy,
    priceSell: s.priceSell,
    terminalName: s.terminal.name,
  }));

  return NextResponse.json(result);
}
