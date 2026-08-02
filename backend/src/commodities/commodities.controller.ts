import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';
import { getZhKind } from '../lib/commodity-zh';

@Controller()
export class CommoditiesController {
  constructor(private readonly prisma: PrismaService) {}

  private emptyCommodity(c: any) {
    return { id: c.id, name: c.name, nameZh: c.name, nameEn: c.nameEn, code: c.code, kind: c.kind,
      isBuyable: c.isBuyable, isSellable: c.isSellable, isIllegal: c.isIllegal, isRaw: c.isRaw, isRefined: c.isRefined,
      kindZh: getZhKind(c.kind), totalSellStock: 0, totalBuyStock: 0, changePercent: c.changePercent,
      currentBuyAvg: null, currentSellAvg: null, profitMargin: null, profitChange: c.profitChange, maxProfitMargin: c.maxProfitMargin, isDazong: false };
  }

  private DAZONG_THRESHOLD = 2000;

  @Get('commodities')
  @Public()
  async findAll(@Res({ passthrough: true }) res: Response) {
    const commodities = await this.prisma.commodity.findMany({ orderBy: { name: 'asc' } });
    const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
    if (latest) res.setHeader('X-LastUpdated', latest.fetchedAt.toISOString());
    if (!latest) return commodities.map(c => this.emptyCommodity(c));

    // Parallel queries for current prices + stocks + commodity averages
    const [buyPrices, sellPrices, sellStock, buyStock, averages] = await Promise.all([
      (this.prisma as any).priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceBuy: { gt: 0 } }, _avg: { priceBuy: true } }),
      (this.prisma as any).priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceSell: { gt: 0 } }, _avg: { priceSell: true } }),
      (this.prisma as any).priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, scuSellStock: { gt: 0 } }, _sum: { scuSellStock: true } }),
      (this.prisma as any).priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, scuBuyStock: { gt: 0 } }, _sum: { scuBuyStock: true } }),
      this.prisma.commodityAverage.findMany({ select: { commodityId: true, scuBuyMax: true } }),
    ]);

    const buyMap: Record<number, number | null> = {};
    for (const c of buyPrices) buyMap[c.commodityId] = c._avg.priceBuy;
    const sellMap: Record<number, number | null> = {};
    for (const s of sellPrices) sellMap[s.commodityId] = s._avg.priceSell;
    const sellStockMap: Record<number, number> = {};
    for (const s of sellStock) sellStockMap[s.commodityId] = s._sum.scuSellStock || 0;
    const buyStockMap: Record<number, number> = {};
    for (const b of buyStock) buyStockMap[b.commodityId] = b._sum.scuBuyStock || 0;
    const dazongMap: Record<number, boolean> = {};
    for (const a of averages) dazongMap[a.commodityId] = (a.scuBuyMax || 0) >= this.DAZONG_THRESHOLD;

    return commodities.map(c => {
      const buyAvg = buyMap[c.id] ?? null;
      const sellAvg = sellMap[c.id] ?? null;
      const liveMargin = (buyAvg != null && sellAvg != null && buyAvg > 0)
        ? Math.round(((sellAvg - buyAvg) / buyAvg) * 1000) / 10
        : null;
      return {
        ...c, nameZh: c.name, kindZh: getZhKind(c.kind),
        totalSellStock: sellStockMap[c.id] || 0,
        totalBuyStock: buyStockMap[c.id] || 0,
        currentBuyAvg: buyAvg,
        currentSellAvg: sellAvg,
        profitMargin: liveMargin, profitChange: c.profitChange, maxProfitMargin: c.maxProfitMargin,
        isDazong: dazongMap[c.id] ?? false,
      };
    });
  }

  @Get('commodities/:id')
  @Public()
  async findOne(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const c = await this.prisma.commodity.findUnique({ where: { id: parseInt(id) } });
    if (!c) { res.status(404); return { error: 'not found' }; }

    const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
    const avg = await this.prisma.commodityAverage.findUnique({ where: { commodityId: c.id }, select: { scuBuyMax: true } });

    let totalSellStock = 0, totalBuyStock = 0, currentBuyAvg: number | null = null, currentSellAvg: number | null = null;
    if (latest) {
      const [buyData, sellData, sellStock, buyStock] = await Promise.all([
        (this.prisma as any).priceSnapshot.groupBy({ by: ['commodityId'], where: { commodityId: c.id, fetchedAt: latest.fetchedAt, priceBuy: { gt: 0 } }, _avg: { priceBuy: true } }),
        (this.prisma as any).priceSnapshot.groupBy({ by: ['commodityId'], where: { commodityId: c.id, fetchedAt: latest.fetchedAt, priceSell: { gt: 0 } }, _avg: { priceSell: true } }),
        (this.prisma as any).priceSnapshot.groupBy({ by: ['commodityId'], where: { commodityId: c.id, fetchedAt: latest.fetchedAt, scuSellStock: { gt: 0 } }, _sum: { scuSellStock: true } }),
        (this.prisma as any).priceSnapshot.groupBy({ by: ['commodityId'], where: { commodityId: c.id, fetchedAt: latest.fetchedAt, scuBuyStock: { gt: 0 } }, _sum: { scuBuyStock: true } }),
      ]);
      if (buyData[0]) currentBuyAvg = buyData[0]._avg.priceBuy;
      if (sellData[0]) currentSellAvg = sellData[0]._avg.priceSell;
      if (sellStock[0]) totalSellStock = sellStock[0]._sum.scuSellStock || 0;
      if (buyStock[0]) totalBuyStock = buyStock[0]._sum.scuBuyStock || 0;
    }

    const liveMargin = (currentBuyAvg != null && currentSellAvg != null && currentBuyAvg > 0)
      ? Math.round(((currentSellAvg - currentBuyAvg) / currentBuyAvg) * 1000) / 10
      : null;

    return {
      ...c, nameZh: c.name, kindZh: getZhKind(c.kind),
      totalSellStock, totalBuyStock,
      currentBuyAvg, currentSellAvg,
      profitMargin: liveMargin, profitChange: c.profitChange, maxProfitMargin: c.maxProfitMargin,
      isDazong: (avg?.scuBuyMax || 0) >= this.DAZONG_THRESHOLD,
    };
  }

  @Get('version')
  @Public()
  async version() {
    const rows = await this.prisma.commodityAverage.findMany({
      where: { gameVersion: { not: null } }, select: { gameVersion: true },
    });
    if (!rows.length) return { gameVersion: null };
    const counts: Record<string, number> = {};
    for (const r of rows) { const v = r.gameVersion!; counts[v] = (counts[v] || 0) + 1; }
    return { gameVersion: Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] };
  }
}
