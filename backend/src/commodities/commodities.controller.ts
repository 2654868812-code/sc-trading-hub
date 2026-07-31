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
      currentBuyAvg: null, currentSellAvg: null, profitMargin: null, profitChange: null, maxProfitMargin: null, isDazong: false };
  }

  @Get('commodities')
  @Public()
  async findAll(@Res({ passthrough: true }) res: Response) {
    const commodities = await this.prisma.commodity.findMany({ orderBy: { name: 'asc' } });
    const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
    if (latest) res.setHeader('X-LastUpdated', latest.fetchedAt.toISOString());
    if (!latest) return commodities.map(c => this.emptyCommodity(c));

    const dazongMap: Record<number, boolean> = {};
    const allMax = await this.prisma.terminalCommodityMax.findMany({ select: { commodityId: true, scuBuyMax: true } });
    for (const m of allMax) { if (m.scuBuyMax && m.scuBuyMax >= 2000) dazongMap[m.commodityId] = true; }

    const allBuy = await this.prisma.priceSnapshot.findMany({
      where: { fetchedAt: latest.fetchedAt }, select: { commodityId: true, priceBuy: true, priceBuyAvg: true },
    });
    const allSell = await this.prisma.priceSnapshot.findMany({
      where: { fetchedAt: latest.fetchedAt }, select: { commodityId: true, priceSell: true, priceSellAvg: true },
    });
    const buyAcc: Record<number, { sum: number; count: number }> = {};
    for (const s of allBuy) {
      const v = s.priceBuyAvg ?? s.priceBuy; if (!v || v <= 0) continue;
      if (!buyAcc[s.commodityId]) buyAcc[s.commodityId] = { sum: 0, count: 0 };
      buyAcc[s.commodityId].sum += v; buyAcc[s.commodityId].count++;
    }
    const sellAcc: Record<number, { sum: number; count: number }> = {};
    for (const s of allSell) {
      const v = s.priceSellAvg ?? s.priceSell; if (!v || v <= 0) continue;
      if (!sellAcc[s.commodityId]) sellAcc[s.commodityId] = { sum: 0, count: 0 };
      sellAcc[s.commodityId].sum += v; sellAcc[s.commodityId].count++;
    }
    const buyMap: Record<number, number> = {}, sellMap: Record<number, number> = {};
    for (const [id, a] of Object.entries(buyAcc)) buyMap[+id] = Math.round(a.sum / a.count);
    for (const [id, a] of Object.entries(sellAcc)) sellMap[+id] = Math.round(a.sum / a.count);

    return commodities.map(c => ({
      id: c.id, name: c.name, nameZh: c.name, nameEn: c.nameEn, code: c.code, kind: c.kind,
      isBuyable: c.isBuyable, isSellable: c.isSellable, isIllegal: c.isIllegal, isRaw: c.isRaw, isRefined: c.isRefined,
      kindZh: getZhKind(c.kind), totalSellStock: 0, totalBuyStock: 0, changePercent: c.changePercent,
      currentBuyAvg: buyMap[c.id] ?? null, currentSellAvg: sellMap[c.id] ?? null,
      profitMargin: c.profitMargin, profitChange: c.profitChange, maxProfitMargin: c.maxProfitMargin,
      isDazong: dazongMap[c.id] ?? false,
    }));
  }

  @Get('commodities/:id')
  @Public()
  async findOne(@Param('id') id: string) {
    const c = await this.prisma.commodity.findUnique({ where: { id: parseInt(id) } });
    if (!c) return { error: 'not found' };
    return { ...c, nameZh: c.name, kindZh: getZhKind(c.kind) };
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
