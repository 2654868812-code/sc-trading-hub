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
    const ids = (terminalIds || '').split(',').map(Number).filter(Boolean);
    const h = parseInt(hours || '24');
    const since = new Date(Date.now() - h * 60 * 60 * 1000);

    const snapshots = await this.prisma.priceSnapshot.findMany({
      where: { commodityId: cid, terminalId: { in: ids }, fetchedAt: { gte: since } },
      include: { terminal: { select: { name: true } } },
      orderBy: { fetchedAt: 'asc' },
    });
    return snapshots.map(s => ({ fetchedAt: s.fetchedAt.toISOString(), priceBuy: s.priceBuyAvg ?? s.priceBuy, priceSell: s.priceSellAvg ?? s.priceSell, terminalName: s.terminal.name }));
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
    const avgDays = 15;
    const cutoff = new Date(Date.now() - avgDays * 24 * 60 * 60 * 1000);
    const [buyStats, sellStats, termMax] = await Promise.all([
      this.prisma.priceSnapshot.groupBy({ by: ['terminalId'], where: { commodityId: cid, terminalId: { in: tids }, priceBuy: { gt: 0 }, fetchedAt: { gte: cutoff } }, _max: { priceBuy: true }, _min: { priceBuy: true }, _avg: { priceBuy: true } }),
      this.prisma.priceSnapshot.groupBy({ by: ['terminalId'], where: { commodityId: cid, terminalId: { in: tids }, priceSell: { gt: 0 }, fetchedAt: { gte: cutoff } }, _max: { priceSell: true }, _min: { priceSell: true }, _avg: { priceSell: true } }),
      this.prisma.terminalCommodityMax.findMany({ where: { commodityId: cid }, select: { terminalId: true, scuBuyMax: true, scuSellMax: true } }),
    ]);

    const buyMap: Record<number, any> = {}, sellMap: Record<number, any> = {}, maxMap: Record<number, any> = {};
    for (const b of buyStats) buyMap[b.terminalId] = { avg: b._avg.priceBuy, max: b._max.priceBuy, min: b._min.priceBuy };
    for (const s of sellStats) sellMap[s.terminalId] = { avg: s._avg.priceSell, max: s._max.priceSell, min: s._min.priceSell };
    for (const m of termMax) maxMap[m.terminalId] = { buyMax: m.scuBuyMax ?? 0, sellMax: m.scuSellMax ?? 0 };

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
      scuBuyStock: s.scuBuyStock, scuSellStock: s.scuSellStock, scuBuyMax: maxMap[s.terminalId]?.buyMax ?? null, scuSellMax: maxMap[s.terminalId]?.sellMax ?? null,
      updatedAt: s.uexModifiedAt ? new Date(s.uexModifiedAt * 1000).toISOString() : s.fetchedAt.toISOString(),
    }));
  }
}
