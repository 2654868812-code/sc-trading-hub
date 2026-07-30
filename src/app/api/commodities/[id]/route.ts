import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getZhKind } from '@/lib/commodity-zh';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const commodityId = parseInt(id, 10);
    if (!commodityId) {
      return NextResponse.json({ error: 'Invalid commodity ID' }, { status: 400 });
    }

    const commodity = await prisma.commodity.findUnique({
      where: { id: commodityId },
    });

    if (!commodity) {
      return NextResponse.json({ error: 'Commodity not found' }, { status: 404 });
    }

    const latestSnapshot = await prisma.priceSnapshot.findFirst({
      orderBy: { fetchedAt: 'desc' },
      select: { fetchedAt: true },
    });

    let totalSellStock = 0;
    let totalBuyStock = 0;
    let currentBuyAvg: number | null = null;
    let currentSellAvg: number | null = null;
    let isDazong = false;

    if (latestSnapshot) {
      const [sellStock, buyStock, prices, avgData] = await Promise.all([
        prisma.priceSnapshot.groupBy({
          by: ['commodityId'],
          where: { fetchedAt: latestSnapshot.fetchedAt, commodityId, scuSellStock: { gt: 0 } },
          _sum: { scuSellStock: true },
        }),
        prisma.priceSnapshot.groupBy({
          by: ['commodityId'],
          where: { fetchedAt: latestSnapshot.fetchedAt, commodityId, scuBuyStock: { gt: 0 } },
          _sum: { scuBuyStock: true },
        }),
        prisma.priceSnapshot.groupBy({
          by: ['commodityId'],
          where: { fetchedAt: latestSnapshot.fetchedAt, commodityId },
          _avg: { priceBuy: true, priceSell: true },
        }),
        prisma.commodityAverage.findUnique({
          where: { commodityId },
          select: { scuBuyMax: true, priceBuyAvg: true, priceSellAvg: true },
        }),
      ]);

      totalSellStock = sellStock[0]?._sum.scuSellStock || 0;
      totalBuyStock = buyStock[0]?._sum.scuBuyStock || 0;
      currentBuyAvg = prices[0]?._avg.priceBuy ?? avgData?.priceBuyAvg ?? null;
      currentSellAvg = prices[0]?._avg.priceSell ?? avgData?.priceSellAvg ?? null;
      isDazong = (avgData?.scuBuyMax || 0) >= 2000;
    }

    return NextResponse.json({
      ...commodity,
      nameZh: commodity.name,
      kindZh: getZhKind(commodity.kind),
      totalSellStock,
      totalBuyStock,
      changePercent: null,
      currentBuyAvg,
      currentSellAvg,
      isDazong,
    });
  } catch (err) {
    console.error('[commodity] Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch commodity', message: String(err) },
      { status: 500 }
    );
  }
}
