import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';
import { getZhKind } from '../lib/commodity-zh';

const SPACE_ONLY_SHIPS = new Set([102, 104, 105, 106, 286]); // Hull A, C, D, E + Odin

@Controller('routes')
export class RoutesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Public()
  async findRoutes(
    @Query('commodityId') commodityId?: string,
    @Query('commodityIds') commodityIdsRaw?: string,
    @Query('commodityMode') commodityModeRaw?: string,
    @Query('shipId') shipId?: string,
    @Query('originSystem') originSystem?: string,
    @Query('destSystem') destSystem?: string,
    @Query('originLocation') originLocation?: string,
    @Query('originLocations') originLocationsRaw?: string,
    @Query('originLocationMode') originLocationModeRaw?: string,
    @Query('destLocation') destLocation?: string,
    @Query('destLocations') destLocationsRaw?: string,
    @Query('destLocationMode') destLocationModeRaw?: string,
    @Query('maxInvestment') maxInvestment?: string,
    @Query('maxDistance') maxDistance?: string,
    @Query('commodityType') commodityType?: string,
    @Query('autoLoadType') autoLoadType?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('roundTrip') roundTrip?: string,
    @Query('profitMode') profitMode?: string,
  ) {
    // Parse commodity: new multi-select takes priority, fallback to old single
    const cids = commodityIdsRaw
      ? commodityIdsRaw.split(',').slice(0, 200).map(Number).filter(n => !isNaN(n))
      : (commodityId ? [parseInt(commodityId)] : []);
    const commodityMode = commodityModeRaw || 'include';

    // Parse locations: new multi-select takes priority, fallback to old single
    const parseLocs = (raw: string | undefined, fallback: string | undefined) => {
      if (raw) {
        try {
          return raw.split(',').slice(0, 100).map(s => decodeURIComponent(s.trim())).filter(Boolean);
        } catch { return raw.split(',').slice(0, 100).map(s => s.trim()).filter(Boolean); }
      }
      if (fallback) return [fallback];
      return [];
    };
    const originLocations = parseLocs(originLocationsRaw, originLocation);
    const destLocations = parseLocs(destLocationsRaw, destLocation);
    const originLocationMode = originLocationModeRaw || 'include';
    const destLocationMode = destLocationModeRaw || 'include';

    const sid = shipId ? parseInt(shipId) : 0;
    const roundTripFlag = roundTrip === '1';

    let shipScu = 0, spaceOnly = false;
    if (sid > 0) {
      const ship = await this.prisma.vehicle.findUnique({ where: { id: sid }, select: { id: true, scu: true } });
      if (ship) { shipScu = ship.scu; spaceOnly = SPACE_ONLY_SHIPS.has(ship.id); }
    }

    const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
    if (!latest) return [];

    // Build terminal filter for location matching (supports include/exclude multi-select)
    const buildLocationFilter = (locs: string[], mode: string, spaceOnlyFlag: boolean) => {
      const filters: any[] = [];
      if (locs.length > 0) {
        const locOr = [
          { cityName: { in: locs } },
          { spaceStationName: { in: locs } },
        ];
        if (mode === 'exclude') {
          filters.push({ terminal: { NOT: { OR: locOr } } });
        } else {
          filters.push({ terminal: { OR: locOr } });
        }
      }
      if (spaceOnlyFlag) {
        filters.push({ terminal: { hasLoadingDock: true } });
      }
      return filters;
    };

    const buyLocationFilters = buildLocationFilter(originLocations, originLocationMode, spaceOnly);
    const sellLocationFilters = buildLocationFilter(destLocations, destLocationMode, spaceOnly);

    // Filter: use priceBuy (not avg) as gate; priceBuyAvg as preferred value with fallback
    const commodityFilter = cids.length > 0
      ? { commodityId: commodityMode === 'exclude' ? { notIn: cids } : { in: cids } }
      : {};

    const [buySnaps, sellSnaps] = await Promise.all([
      this.prisma.priceSnapshot.findMany({
        where: { fetchedAt: latest.fetchedAt, priceBuy: { gt: 0 }, ...commodityFilter, ...(buyLocationFilters.length ? { AND: buyLocationFilters } : {}) },
        include: { commodity: { select: { id: true, name: true, nameEn: true, kind: true, isIllegal: true } }, terminal: { select: { id: true, name: true, nameEn: true, starSystemName: true, starSystemNameEn: true, planetName: true, planetNameEn: true, moonName: true, moonNameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, isAutoLoad: true } } },
      }),
      this.prisma.priceSnapshot.findMany({
        where: { fetchedAt: latest.fetchedAt, priceSell: { gt: 0 }, ...commodityFilter, ...(sellLocationFilters.length ? { AND: sellLocationFilters } : {}) },
        include: { terminal: { select: { id: true, name: true, nameEn: true, starSystemName: true, starSystemNameEn: true, planetName: true, planetNameEn: true, moonName: true, moonNameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, isAutoLoad: true } } },
      }),
    ]);

    // Fetch cargo routes + terminal stock + commodity averages for dazong threshold
    const allCommodityIds = [...new Set([...buySnaps.map(s => s.commodityId), ...sellSnaps.map(s => s.commodityId)])];
    const DAZONG_THRESHOLD = 2000;
    const [cargoRoutes, termMaxRows, commAvgs, termDistances] = await Promise.all([
      this.prisma.cargoRoute.findMany({ where: { commodityId: { in: allCommodityIds } }, select: { commodityId: true, originTerminalId: true, destTerminalId: true, distance: true, containerSizesOrigin: true, containerSizesDest: true } }),
      this.prisma.terminalCommodityMax.findMany({ where: { commodityId: { in: allCommodityIds } }, select: { commodityId: true, terminalId: true, scuBuyMax: true, scuSellMax: true, scuBuyMaxLocal: true, scuSellMaxLocal: true, scuBuyAvg: true, scuSellAvg: true, scuBuyStockAvg24h: true, scuSellStockAvg24h: true, priceBuyAvg: true, priceSellAvg: true, containerSizes: true } }),
      this.prisma.commodityAverage.findMany({ where: { commodityId: { in: allCommodityIds } }, select: { commodityId: true, scuBuyMax: true, scuSellMax: true } }),
      this.prisma.terminalDistance.findMany({ select: { originTerminalId: true, destTerminalId: true, distanceGm: true } }),
    ]);
    const cargoMap = new Map<string, typeof cargoRoutes[number]>();
    for (const cr of cargoRoutes) cargoMap.set(`${cr.commodityId}-${cr.originTerminalId}-${cr.destTerminalId}`, cr);
    const distMap = new Map<string, number>();
    for (const d of termDistances) distMap.set(`${d.originTerminalId}-${d.destTerminalId}`, d.distanceGm);
    const stockMap = new Map<string, typeof termMaxRows[number]>();
    for (const t of termMaxRows) stockMap.set(`${t.commodityId}-${t.terminalId}`, t);
    const commAvgMap = new Map<number, typeof commAvgs[number]>();
    for (const a of commAvgs) commAvgMap.set(a.commodityId, a);
    const isDazong = new Set<number>();
    for (const a of commAvgs) { if ((a.scuBuyMax || 0) >= DAZONG_THRESHOLD) isDazong.add(a.commodityId); }

    const sellByCommodity: Record<number, typeof sellSnaps> = {};
    for (const s of sellSnaps) { if (!sellByCommodity[s.commodityId]) sellByCommodity[s.commodityId] = []; sellByCommodity[s.commodityId].push(s); }

    const routes: any[] = [];
    for (const buy of buySnaps) {
      const sells = sellByCommodity[buy.commodityId]; if (!sells?.length) continue;
      for (const sell of sells) {
        if (buy.terminalId === sell.terminalId) continue;
        if (originSystem && buy.terminal.starSystemName !== originSystem) continue;
        if (destSystem && sell.terminal.starSystemName !== destSystem) continue;
        if (autoLoadType) {
          const oa = buy.terminal.isAutoLoad, da = sell.terminal.isAutoLoad;
          if (autoLoadType === 'full' && !(oa && da)) continue;
          if (autoLoadType === 'half' && !((oa && !da) || (!oa && da))) continue;
          if (autoLoadType === 'manual' && (oa || da)) continue;
        }
        if (commodityType) {
          const dazong = isDazong.has(buy.commodityId);
          if (commodityType === 'major' && !dazong) continue;
          if (commodityType === 'minor' && dazong) continue;
        }

        // Look up terminal-level averages
        const oStock = stockMap.get(`${buy.commodityId}-${buy.terminalId}`);
        const dStock = stockMap.get(`${sell.commodityId}-${sell.terminalId}`);
        const commAvg = commAvgMap.get(buy.commodityId);

        // Three profit modes:
        //   expected (default): 24h avg price + 24h avg stock
        //   live:               current price + current stock
        //   max:                current price + UEX historical max stock
        const mode = profitMode || 'live';

        const buyPriceRaw = buy.priceBuy ?? 0;
        const sellPriceRaw = sell.priceSell ?? 0;
        const buyPrice = mode === 'expected'
          ? (oStock?.priceBuyAvg ?? buyPriceRaw)
          : buyPriceRaw;
        const sellPrice = mode === 'expected'
          ? (dStock?.priceSellAvg ?? sellPriceRaw)
          : sellPriceRaw;
        if (!buyPrice || !sellPrice || buyPrice <= 0 || sellPrice <= 0 || sellPrice <= buyPrice) continue;

        const profitPerScu = sellPrice - buyPrice;

        // Stock cascade by mode:
        //   live:     current snapshot → UEX global → 1
        //   expected: 24h weighted avg → current snapshot → UEX global → 1
        //   max:      UEX max → 24h peak → current snapshot → UEX global → 1
        let originStock: number;
        if (mode === 'max') {
          originStock = oStock?.scuBuyMax
            || oStock?.scuBuyMaxLocal
            || buy.scuBuyStock
            || commAvg?.scuBuyMax
            || 1;
        } else if (mode === 'expected') {
          originStock = Math.round(oStock?.scuBuyStockAvg24h ?? oStock?.scuBuyAvg ?? 0)
            || buy.scuBuyStock
            || commAvg?.scuBuyMax
            || 1;
        } else {
          // live: current snapshot stock
          originStock = buy.scuBuyStock
            || commAvg?.scuBuyMax
            || 1;
        }
        const loadScu = shipScu > 0 ? Math.min(shipScu, originStock > 0 ? originStock : 1) : 1;
        const sellScu = loadScu;
        const totalInvestment = buyPrice * sellScu;
        const totalProfit = profitPerScu * sellScu;
        const roi = totalInvestment > 0 ? Math.round((totalProfit / totalInvestment) * 1000) / 10 : 0;

        // Cargo route info
        const cargoKey = `${buy.commodityId}-${buy.terminalId}-${sell.terminalId}`;
        const cargo = cargoMap.get(cargoKey);

        routes.push({
          commodityId: buy.commodityId, commodityName: buy.commodity.nameEn || buy.commodity.name, commodityNameZh: buy.commodity.name, commodityKind: buy.commodity.kind, commodityKindZh: getZhKind(buy.commodity.kind),
          originTerminalId: buy.terminalId, originTerminalName: buy.terminal.name, originTerminalNameZh: buy.terminal.name, originTerminalNameEn: buy.terminal.nameEn,
          originLocation: buy.terminal.cityName || buy.terminal.spaceStationName || buy.terminal.name,
          originLocationZh: buy.terminal.cityName || buy.terminal.spaceStationName || buy.terminal.name,
          originLocationEn: buy.terminal.cityNameEn || buy.terminal.spaceStationNameEn || buy.terminal.nameEn,
          originSystemName: buy.terminal.starSystemName || '', originSystemNameEn: buy.terminal.starSystemNameEn || '',
          originPlanetName: buy.terminal.planetName || '', originPlanetNameEn: buy.terminal.planetNameEn || '',
          originMoonName: buy.terminal.moonName || '', originMoonNameEn: buy.terminal.moonNameEn || '',
          buyPrice,
          destTerminalId: sell.terminalId, destTerminalName: sell.terminal.name, destTerminalNameZh: sell.terminal.name, destTerminalNameEn: sell.terminal.nameEn,
          destLocation: sell.terminal.cityName || sell.terminal.spaceStationName || sell.terminal.name,
          destLocationZh: sell.terminal.cityName || sell.terminal.spaceStationName || sell.terminal.name,
          destLocationEn: sell.terminal.cityNameEn || sell.terminal.spaceStationNameEn || sell.terminal.nameEn,
          destSystemName: sell.terminal.starSystemName || '', destSystemNameEn: sell.terminal.starSystemNameEn || '',
          destPlanetName: sell.terminal.planetName || '', destPlanetNameEn: sell.terminal.planetNameEn || '',
          destMoonName: sell.terminal.moonName || '', destMoonNameEn: sell.terminal.moonNameEn || '',
          sellPrice, profitPerScu, roi,
          distanceGm: cargo?.distance ?? distMap.get(`${buy.terminalId}-${sell.terminalId}`) ?? null,
          totalProfit, totalInvestment, loadScu, sellScu, shipScu,
          originStock: Math.round(oStock?.scuBuyStockAvg24h || oStock?.scuBuyAvg || buy.scuBuyStock || commAvg?.scuBuyMax || 0), destStock: Math.round(dStock?.scuSellStockAvg24h || dStock?.scuSellAvg || sell.scuSellStock || commAvg?.scuSellMax || 0),
          originStockLive: Math.round(buy.scuBuyStock || 0), destStockLive: Math.round(sell.scuSellStock || 0),
          originStockMax: Math.round(oStock?.scuBuyMax || oStock?.scuBuyMaxLocal || buy.scuBuyStock || commAvg?.scuBuyMax || 0), destStockMax: Math.round(dStock?.scuSellMax || dStock?.scuSellMaxLocal || sell.scuSellStock || commAvg?.scuSellMax || 0),
          originUpdatedAt: buy.uexModifiedAt ? new Date(buy.uexModifiedAt * 1000).toISOString() : buy.fetchedAt.toISOString(),
          destUpdatedAt: sell.uexModifiedAt ? new Date(sell.uexModifiedAt * 1000).toISOString() : sell.fetchedAt.toISOString(),
          isAutoLoadOrigin: buy.terminal.isAutoLoad, isAutoLoadDest: sell.terminal.isAutoLoad,
          containerSizesOrigin: oStock?.containerSizes ?? null, containerSizesDest: dStock?.containerSizes ?? null, isIllegal: buy.commodity.isIllegal,
        });
      }
    }

    // Round-trip: pair routes by terminal pair, return paired result
    if (roundTripFlag) {
      const revMap = new Map<string, any>();
      for (const r of routes) {
        const revKey = `${r.destTerminalId}-${r.originTerminalId}`;
        if (!revMap.has(revKey)) revMap.set(revKey, r);
      }

      const maxInv = maxInvestment ? parseFloat(maxInvestment) : 0;
      const maxDist = maxDistance ? parseFloat(maxDistance) : 0;

      const qualified = routes.filter((r) => {
        if (maxInv > 0 && r.totalInvestment > maxInv) return false;
        if (maxDist > 0 && (r.distanceGm == null || r.distanceGm > maxDist)) return false;
        return true;
      });

      const used = new Set<string>();
      const pairs: any[] = [];

      for (const r of qualified) {
        const key = `${r.originTerminalId}-${r.destTerminalId}`;
        const revKey = `${r.destTerminalId}-${r.originTerminalId}`;
        if (used.has(key) || used.has(revKey)) continue;

        const rev = revMap.get(key);
        if (rev) {
          let revOk = true;
          if (maxInv > 0 && rev.totalInvestment > maxInv) revOk = false;
          if (maxDist > 0 && (rev.distanceGm == null || rev.distanceGm > maxDist)) revOk = false;
          if (revOk) {
            used.add(key);
            used.add(revKey);
            pairs.push({
              outward: r, return_: rev,
              roundTripProfit: r.totalProfit + rev.totalProfit,
              roundTripInvestment: r.totalInvestment + rev.totalInvestment,
            });
          }
        }
      }

      const sort = sortBy || 'profit';
      pairs.sort((a, b) => {
        if (sort === 'profit') return b.roundTripProfit - a.roundTripProfit;
        if (sort === 'roi') {
          const ra = a.roundTripInvestment > 0 ? a.roundTripProfit / a.roundTripInvestment : 0;
          const rb = b.roundTripInvestment > 0 ? b.roundTripProfit / b.roundTripInvestment : 0;
          return rb - ra;
        }
        if (sort === 'distance') {
          return (a.outward.distanceGm ?? Infinity) - (b.outward.distanceGm ?? Infinity);
        }
        return b.roundTripProfit - a.roundTripProfit;
      });

      return { roundTrip: true, pairs: pairs.slice(0, 25) };
    }

    // Non-round-trip: normal route list
    let filtered = routes;
    const maxInv = maxInvestment ? parseFloat(maxInvestment) : 0;
    const maxDist = maxDistance ? parseFloat(maxDistance) : 0;
    if (maxInv > 0) filtered = filtered.filter(r => r.totalInvestment <= maxInv);
    if (maxDist > 0) filtered = filtered.filter(r => r.distanceGm != null && r.distanceGm <= maxDist);

    const sort = sortBy || 'profit';
    const order = sortOrder === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      if (sort === 'profit') return (a.totalProfit - b.totalProfit) * order;
      if (sort === 'roi') return (a.roi - b.roi) * order;
      if (sort === 'distance') {
        if (a.distanceGm == null && b.distanceGm == null) return 0;
        if (a.distanceGm == null) return 1;
        if (b.distanceGm == null) return -1;
        return a.distanceGm - b.distanceGm; // always asc: nearest first
      }
      return (a.totalProfit - b.totalProfit) * order;
    });

    return filtered.slice(0, 50);
  }
}
