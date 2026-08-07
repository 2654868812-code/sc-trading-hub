import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('prices')
export class PricesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Public()
  async history(@Query('commodityId') commodityId: string, @Query('terminalIds') terminalIds: string, @Query('hours') hours: string) {
    const cid = parseInt(commodityId);
    if (!cid) return [];
    const ids = (terminalIds || '').split(',').map(Number).filter(n => !isNaN(n));
    const hRaw = parseInt(hours || '24');
    const h = Math.min(Math.max(hRaw || 24, 1), 168); // clamp 1-168
    const since = new Date(Date.now() - h * 60 * 60 * 1000);

    const where: any = { commodityId: cid, fetchedAt: { gte: since } };
    if (ids.length > 0) where.terminalId = { in: ids };

    const snapshots = await this.prisma.priceSnapshot.findMany({
      where,
      include: { terminal: { select: { name: true } } },
      orderBy: { fetchedAt: 'asc' },
      take: 2000,
    });
    return snapshots.map(s => ({ fetchedAt: s.fetchedAt.toISOString(), priceBuy: s.priceBuy, priceSell: s.priceSell, terminalName: s.terminal.name }));
  }

  @Get('location')
  @Public()
  async locationPrices(@Query('locationName') locationName: string, @Query('hours') hours: string) {
    let name: string;
    try { name = decodeURIComponent(locationName || ''); } catch { name = locationName || ''; }
    if (!name) return [];

    const terminals = await this.prisma.terminal.findMany({
      where: { OR: [{ cityName: name }, { spaceStationName: name }, { name }] },
      select: { id: true },
    });
    if (!terminals.length) return [];

    const tids = terminals.map(t => t.id);
    const hRaw = parseInt(hours || '24');
    const h = Math.min(Math.max(hRaw || 24, 1), 168);
    const since = new Date(Date.now() - h * 60 * 60 * 1000);

    // Get top 5 commodities by buy price and top 5 by sell price
    const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
    if (!latest) return [];

    const latestSnaps = await this.prisma.priceSnapshot.findMany({
      where: { terminalId: { in: tids }, fetchedAt: latest.fetchedAt },
      select: { commodityId: true, priceBuy: true, priceSell: true },
    });

    // Top 5 buy commodities
    const topBuy = [...latestSnaps.filter(s => s.priceBuy > 0)]
      .sort((a, b) => b.priceBuy - a.priceBuy).slice(0, 5).map(s => s.commodityId);
    // Top 5 sell commodities
    const topSell = [...latestSnaps.filter(s => s.priceSell > 0)]
      .sort((a, b) => a.priceSell - b.priceSell).slice(0, 5).map(s => s.commodityId);
    const cids = [...new Set([...topBuy, ...topSell])];

    const snapshots = await this.prisma.priceSnapshot.findMany({
      where: { terminalId: { in: tids }, commodityId: { in: cids }, fetchedAt: { gte: since } },
      include: { commodity: { select: { name: true } } },
      orderBy: { fetchedAt: 'asc' },
      take: 2000,
    });

    return snapshots.map(s => ({
      fetchedAt: s.fetchedAt.toISOString(),
      priceBuy: s.priceBuy,
      priceSell: s.priceSell,
      commodityName: s.commodity.name,
      commodityId: s.commodityId,
    }));
  }

  @Get('terminals')
  @Public()
  async terminals(@Query('commodityId') commodityId: string) {
    const cid = parseInt(commodityId);
    if (!cid) return [];

    const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
    if (!latest) return [];

    const snapshots = await this.prisma.priceSnapshot.findMany({
      where: { commodityId: cid, fetchedAt: latest.fetchedAt },
      include: { terminal: { select: { id: true, name: true, nameEn: true, starSystemName: true, starSystemNameEn: true, planetName: true, planetNameEn: true, moonName: true, moonNameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, type: true, hasCargoCenter: true, hasDockingPort: true, hasFreightElevator: true, isAutoLoad: true } } },
    });

    const tids = [...new Set(snapshots.map(s => s.terminalId))];
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [buyStats, sellStats, termMax] = await Promise.all([
      (this.prisma as any).priceSnapshot.groupBy({ by: ['terminalId'], where: { commodityId: cid, terminalId: { in: tids }, priceBuy: { gt: 0 }, fetchedAt: { gte: oneDayAgo } }, _max: { priceBuy: true }, _min: { priceBuy: true }, _avg: { priceBuy: true } }),
      (this.prisma as any).priceSnapshot.groupBy({ by: ['terminalId'], where: { commodityId: cid, terminalId: { in: tids }, priceSell: { gt: 0 }, fetchedAt: { gte: oneDayAgo } }, _max: { priceSell: true }, _min: { priceSell: true }, _avg: { priceSell: true } }),
      this.prisma.terminalCommodityMax.findMany({ where: { commodityId: cid }, select: { terminalId: true, scuBuyMax: true, scuSellMax: true, scuBuyMaxLocal: true, scuSellMaxLocal: true, scuBuyAvg: true, scuSellAvg: true, scuBuyStockAvg24h: true, scuSellStockAvg24h: true, priceBuyAvg: true, priceSellAvg: true } }),
    ]);

    const buyMap: Record<number, any> = {}, sellMap: Record<number, any> = {}, maxMap: Record<number, any> = {};
    for (const b of buyStats) buyMap[b.terminalId] = { avg: b._avg.priceBuy, max: b._max.priceBuy, min: b._min.priceBuy };
    for (const s of sellStats) sellMap[s.terminalId] = { avg: s._avg.priceSell, max: s._max.priceSell, min: s._min.priceSell };
    for (const m of termMax) maxMap[m.terminalId] = { buyMax: m.scuBuyMax, sellMax: m.scuSellMax, buyMaxLocal: m.scuBuyMaxLocal, sellMaxLocal: m.scuSellMaxLocal, buyAvg: m.scuBuyAvg ?? null, sellAvg: m.scuSellAvg ?? null, buyStockAvg24h: m.scuBuyStockAvg24h ?? null, sellStockAvg24h: m.scuSellStockAvg24h ?? null, priceBuyAvg24h: m.priceBuyAvg ?? null, priceSellAvg24h: m.priceSellAvg ?? null };

    const seen = new Set<number>();
    return snapshots.filter(s => { if (seen.has(s.terminalId)) return false; seen.add(s.terminalId); return true; }).map(s => ({
      id: s.terminal.id, name: s.terminal.name, nameZh: s.terminal.name, nameEn: s.terminal.nameEn,
      starSystemName: s.terminal.starSystemName, starSystemNameEn: s.terminal.starSystemNameEn,
      planetName: s.terminal.planetName, planetNameEn: s.terminal.planetNameEn,
      moonName: s.terminal.moonName, moonNameEn: s.terminal.moonNameEn,
      cityName: s.terminal.cityName, cityNameEn: s.terminal.cityNameEn,
      spaceStationName: s.terminal.spaceStationName, spaceStationNameEn: s.terminal.spaceStationNameEn,
      type: s.terminal.type, hasCargoCenter: s.terminal.hasCargoCenter, hasDockingPort: s.terminal.hasDockingPort, hasFreightElevator: s.terminal.hasFreightElevator, isAutoLoad: s.terminal.isAutoLoad,
      priceBuy: s.priceBuy, priceBuyAvg: buyMap[s.terminalId]?.avg ?? null, priceBuyMax: buyMap[s.terminalId]?.max ?? null, priceBuyMin: buyMap[s.terminalId]?.min ?? null,
      priceSell: s.priceSell, priceSellAvg: sellMap[s.terminalId]?.avg ?? null, priceSellMax: sellMap[s.terminalId]?.max ?? null, priceSellMin: sellMap[s.terminalId]?.min ?? null,
      priceBuyAvg24h: maxMap[s.terminalId]?.priceBuyAvg24h ?? null, priceSellAvg24h: maxMap[s.terminalId]?.priceSellAvg24h ?? null,
      scuBuyStock: s.scuBuyStock, scuSellStock: s.scuSellStock,
      scuBuyMax: maxMap[s.terminalId]?.buyMax || maxMap[s.terminalId]?.buyMaxLocal || s.scuBuyStock || 1, scuSellMax: maxMap[s.terminalId]?.sellMax || maxMap[s.terminalId]?.sellMaxLocal || s.scuSellStock || 1,
      sellStockPredicted: !maxMap[s.terminalId]?.sellMax,
      scuBuyAvg: maxMap[s.terminalId]?.buyAvg ?? null, scuSellAvg: maxMap[s.terminalId]?.sellAvg ?? null,
      scuBuyStockAvg24h: maxMap[s.terminalId]?.buyStockAvg24h ?? null, scuSellStockAvg24h: maxMap[s.terminalId]?.sellStockAvg24h ?? null,
      updatedAt: s.uexModifiedAt ? new Date(s.uexModifiedAt * 1000).toISOString() : s.fetchedAt.toISOString(),
    }));
  }
}
