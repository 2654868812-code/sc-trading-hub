import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { CommodityWithChange } from '@/types';
import { getZhKind } from '@/lib/commodity-zh';

export async function GET() {
  const now = new Date();
  const twentyFourHrsAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const latestSnapshot = await prisma.priceSnapshot.findFirst({
    orderBy: { fetchedAt: 'desc' },
    select: { fetchedAt: true },
  });

  if (!latestSnapshot) {
    const commodities = await prisma.commodity.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(
      commodities.map((c) => ({ ...c, nameZh: c.name, kindZh: getZhKind(c.kind), totalSellStock: 0, changePercent: null, currentBuyAvg: null, currentSellAvg: null }))
    );
  }

  const latestTime = latestSnapshot.fetchedAt;

  const currentPrices = await prisma.priceSnapshot.groupBy({
    by: ['commodityId'],
    where: { fetchedAt: latestTime },
    _avg: { priceBuy: true, priceSell: true },
  });

  const oldTime = await prisma.priceSnapshot.findFirst({
    where: { fetchedAt: { lte: twentyFourHrsAgo } },
    orderBy: { fetchedAt: 'desc' },
    select: { fetchedAt: true },
  });

  let oldPrices: Record<number, { avgBuy: number | null; avgSell: number | null }> = {};
  if (oldTime) {
    const oldData = await prisma.priceSnapshot.groupBy({
      by: ['commodityId'],
      where: { fetchedAt: oldTime.fetchedAt },
      _avg: { priceBuy: true, priceSell: true },
    });
    for (const o of oldData) {
      oldPrices[o.commodityId] = { avgBuy: o._avg.priceBuy, avgSell: o._avg.priceSell };
    }
  }

  const currentMap: Record<number, { avgBuy: number | null; avgSell: number | null }> = {};
  for (const c of currentPrices) {
    currentMap[c.commodityId] = { avgBuy: c._avg.priceBuy, avgSell: c._avg.priceSell };
  }

  // Get total sell stock per commodity from latest snapshot
  const stockData = await prisma.priceSnapshot.groupBy({
    by: ['commodityId'],
    where: { fetchedAt: latestTime, scuSellStock: { gt: 0 } },
    _sum: { scuSellStock: true },
  });
  const stockMap: Record<number, number> = {};
  for (const s of stockData) {
    stockMap[s.commodityId] = s._sum.scuSellStock || 0;
  }

  const commodities = await prisma.commodity.findMany({ orderBy: { name: 'asc' } });

  const result: CommodityWithChange[] = commodities.map((c) => {
    const cur = currentMap[c.id];
    const old = oldPrices[c.id];
    let changePercent: number | null = null;
    if (cur?.avgBuy && old?.avgBuy && old.avgBuy > 0) {
      changePercent = ((cur.avgBuy - old.avgBuy) / old.avgBuy) * 100;
    }
    return {
      ...c,
      nameZh: c.name,
      kindZh: getZhKind(c.kind),
      totalSellStock: stockMap[c.id] || 0,
      changePercent,
      currentBuyAvg: cur?.avgBuy ?? null,
      currentSellAvg: cur?.avgSell ?? null,
    };
  });

  return NextResponse.json(result);
}
