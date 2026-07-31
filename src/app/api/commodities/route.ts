import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { CommodityWithChange } from '@/types';
import { getZhKind } from '@/lib/commodity-zh';

export async function GET() {
  try {
    const DAZONG_MAX_STOCK_THRESHOLD = 2000;

  // Single query: latest snapshot time
  const latestSnapshot = await prisma.priceSnapshot.findFirst({
    orderBy: { fetchedAt: 'desc' },
    select: { fetchedAt: true },
  });

  if (!latestSnapshot) {
    const commodities = await prisma.commodity.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(
      commodities.map((c) => ({
        ...c, nameZh: c.name, kindZh: getZhKind(c.kind),
        totalSellStock: 0, totalBuyStock: 0,
        changePercent: null, currentBuyAvg: null, currentSellAvg: null,
        profitMargin: null, profitChange: null, maxProfitMargin: null,
        isDazong: false,
      }))
    );
  }

  const latestTime = latestSnapshot.fetchedAt;

  // Parallel queries only for stock + current prices
  const [currentPrices, sellPrices, stockData, buyStockData, commodityAverages] = await Promise.all([
    prisma.priceSnapshot.groupBy({
      by: ['commodityId'],
      where: { fetchedAt: latestTime, priceBuy: { gt: 0 } },
      _avg: { priceBuy: true },
    }),
    prisma.priceSnapshot.groupBy({
      by: ['commodityId'],
      where: { fetchedAt: latestTime, priceSell: { gt: 0 } },
      _avg: { priceSell: true },
    }),
    prisma.priceSnapshot.groupBy({
      by: ['commodityId'],
      where: { fetchedAt: latestTime, scuSellStock: { gt: 0 } },
      _sum: { scuSellStock: true },
    }),
    prisma.priceSnapshot.groupBy({
      by: ['commodityId'],
      where: { fetchedAt: latestTime, scuBuyStock: { gt: 0 } },
      _sum: { scuBuyStock: true },
    }),
    prisma.commodityAverage.findMany({
      select: { commodityId: true, scuBuyMax: true, priceBuyAvg: true, priceSellAvg: true },
    }),
  ]);

  const currentMap: Record<number, { avgBuy: number | null; avgSell: number | null }> = {};
  for (const c of currentPrices) {
    currentMap[c.commodityId] = { avgBuy: c._avg.priceBuy, avgSell: null };
  }
  for (const s of sellPrices) {
    if (currentMap[s.commodityId]) {
      currentMap[s.commodityId].avgSell = s._avg.priceSell;
    } else {
      currentMap[s.commodityId] = { avgBuy: null, avgSell: s._avg.priceSell };
    }
  }

  const stockMap: Record<number, number> = {};
  for (const s of stockData) stockMap[s.commodityId] = s._sum.scuSellStock || 0;

  const buyStockMap: Record<number, number> = {};
  for (const b of buyStockData) buyStockMap[b.commodityId] = b._sum.scuBuyStock || 0;

  const avgMap: Record<number, { maxBuy: number; priceBuyAvg: number | null; priceSellAvg: number | null }> = {};
  for (const a of commodityAverages) {
    avgMap[a.commodityId] = { maxBuy: a.scuBuyMax || 0, priceBuyAvg: a.priceBuyAvg, priceSellAvg: a.priceSellAvg };
  }

  // changePercent, profitMargin, profitChange are pre-computed during sync
  const commodities = await prisma.commodity.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, nameEn: true, code: true, kind: true, weightScu: true, isBuyable: true, isSellable: true, isIllegal: true, isRaw: true, isRefined: true, dateAdded: true, dateModified: true, changePercent: true, profitMargin: true, profitChange: true, maxProfitMargin: true },
  });

  const result: CommodityWithChange[] = commodities.map((c) => {
    const cur = currentMap[c.id];
    const avg = avgMap[c.id];

    return {
      ...c,
      nameZh: c.name,
      kindZh: getZhKind(c.kind),
      totalSellStock: stockMap[c.id] || 0,
      totalBuyStock: buyStockMap[c.id] || 0,
      changePercent: c.changePercent ?? null,
      currentBuyAvg: cur?.avgBuy ?? avg?.priceBuyAvg ?? null,
      currentSellAvg: cur?.avgSell ?? avg?.priceSellAvg ?? null,
      profitMargin: c.profitMargin ?? null,
      profitChange: c.profitChange ?? null,
      maxProfitMargin: c.maxProfitMargin ?? null,
      isDazong: (avg?.maxBuy || 0) >= DAZONG_MAX_STOCK_THRESHOLD,
    };
  });

  return NextResponse.json(result, {
    headers: { 'X-LastUpdated': latestTime.toISOString() },
  });
  } catch (err) {
    console.error('[commodities] Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch commodities' },
      { status: 500 }
    );
  }
}
