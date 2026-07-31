import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class CommoditiesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('commodities')
  @Public()
  async findAll() {
    const commodities = await this.prisma.commodity.findMany({ orderBy: { name: 'asc' } });
    const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
    if (!latest) return commodities.map(c => ({ ...c, kindZh: '', totalSellStock: 0, totalBuyStock: 0, changePercent: null, currentBuyAvg: null, currentSellAvg: null, isDazong: false }));

    const allMax = await this.prisma.terminalCommodityMax.findMany({
      select: { commodityId: true, scuBuyMax: true },
    });
    const dazongMap: Record<number, boolean> = {};
    for (const m of allMax) {
      if (m.scuBuyMax && m.scuBuyMax >= 2000) dazongMap[m.commodityId] = true;
    }

    const buyAvgs = await this.prisma.priceSnapshot.groupBy({
      by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceBuyAvg: { gt: 0 } }, _avg: { priceBuyAvg: true },
    });
    const sellAvgs = await this.prisma.priceSnapshot.groupBy({
      by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceSellAvg: { gt: 0 } }, _avg: { priceSellAvg: true },
    });
    const buyMap: Record<number, number> = {}, sellMap: Record<number, number> = {};
    for (const b of buyAvgs) if (b._avg.priceBuyAvg) buyMap[b.commodityId] = b._avg.priceBuyAvg;
    for (const s of sellAvgs) if (s._avg.priceSellAvg) sellMap[s.commodityId] = s._avg.priceSellAvg;

    return commodities.map(c => ({
      id: c.id, name: c.name, nameZh: c.name, nameEn: c.nameEn, code: c.code, kind: c.kind,
      isBuyable: c.isBuyable, isSellable: c.isSellable, isIllegal: c.isIllegal, isRaw: c.isRaw, isRefined: c.isRefined,
      kindZh: '', totalSellStock: 0, totalBuyStock: 0, changePercent: c.changePercent,
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
    return { ...c, nameZh: c.name, kindZh: '' };
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
