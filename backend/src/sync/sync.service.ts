import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { uexFetch } from './uex';

interface SpaceStationMeta {
  isLagrange: boolean;
  isJumpPoint: boolean;
}

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private spaceStationMeta: Map<string, SpaceStationMeta> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  // ── Public API ───────────────────────────────────────────────

  /** Full sync (backward compat — runs everything in order) */
  async fullSync() {
    this.logger.log('Starting full sync...');
    await this.syncSpaceStations();
    await this.syncCommoditiesOnly();
    await this.syncTerminals();
    await this.syncVehicles();
    await this.syncPricesData();
    await this.syncComputations();
    this.logger.log('Full sync complete');
  }

  /** 24h: space stations, terminals, vehicles */
  async syncMetadata() {
    this.logger.log('Starting metadata sync...');
    await this.syncSpaceStations();
    await this.syncTerminals();
    await this.syncVehicles();
    await this.syncTerminalDistances();
    this.logger.log('Metadata sync complete');
  }

  /** 1h: commodities + averages */
  async syncCommoditiesOnly() {
    this.logger.log('Starting commodities sync...');
    await this.syncCommodities();
    await this.syncCommodityAverages();
    this.logger.log('Commodities sync complete');
  }

  /** Fast sync: price data (30min) */
  async syncPricesData() {
    this.logger.log('Starting price data sync...');
    await this.syncPrices();
    await Promise.allSettled([
      this.syncCargoRoutes(),
      this.syncTerminalCommodityMax(),
    ]);
    this.logger.log('Price data sync complete');
  }

  /** Post-price computations: averages, profit changes, market index */
  async syncComputations() {
    this.logger.log('Starting post-price computations...');
    await this.computeAverages24h();
    await this.updatePriceChanges();
    await this.computeMarketIndex();
    this.logger.log('Post-price computations complete');
  }

  // ── Reference data (slow / 24h) ──────────────────────────────

  /** Fetch /space_stations and build name→meta lookup */
  private async syncSpaceStations() {
    const data = await uexFetch<any[]>('/space_stations');
    const map = new Map<string, SpaceStationMeta>();
    for (const s of data) {
      if (s.name) map.set(s.name, { isLagrange: s.is_lagrange === 1, isJumpPoint: s.is_jump_point === 1 });
    }
    this.spaceStationMeta = map;
    this.logger.log(`Loaded ${map.size} space stations (${Array.from(map.values()).filter(v => v.isLagrange).length} Lagrange, ${Array.from(map.values()).filter(v => v.isJumpPoint).length} jump points)`);
  }

  private async syncCommodities() {
    const data = await uexFetch<any[]>('/commodities');
    const { getZhName } = require('../lib/commodity-zh');
    for (const c of data) {
      await this.prisma.commodity.upsert({
        where: { id: c.id },
        update: { name: getZhName(c.name), nameEn: c.name, code: c.code, kind: c.kind, weightScu: c.weight_scu, isBuyable: c.is_buyable === 1, isSellable: c.is_sellable === 1, isIllegal: c.is_illegal === 1, isRaw: c.is_raw === 1, isRefined: c.is_refined === 1, dateAdded: c.date_added, dateModified: c.date_modified },
        create: { id: c.id, name: getZhName(c.name), nameEn: c.name, code: c.code, kind: c.kind, weightScu: c.weight_scu, isBuyable: c.is_buyable === 1, isSellable: c.is_sellable === 1, isIllegal: c.is_illegal === 1, isRaw: c.is_raw === 1, isRefined: c.is_refined === 1, dateAdded: c.date_added, dateModified: c.date_modified },
      });
    }
    this.logger.log(`Synced ${data.length} commodities`);
  }

  /** Determine location type from city/space-station names + /space_stations API metadata */
  private determineLocationType(cityName: string | null, spaceStationNameEn: string | null): string | null {
    if (cityName) return '主城';
    if (spaceStationNameEn) {
      const meta = this.spaceStationMeta.get(spaceStationNameEn);
      if (meta?.isJumpPoint) return '星门';
      if (meta?.isLagrange) return '拉格朗日点';
      return '空间站';
    }
    return '地面站';
  }

  /** Whether this terminal supports auto-load: true for any city/station, else fallback to UEX */
  private determineAutoLoad(cityName: string | null, spaceStationName: string | null, uexAutoLoad: boolean): boolean {
    if (cityName || spaceStationName) return true;
    return uexAutoLoad;
  }

  private async syncTerminals() {
    const data = await uexFetch<any[]>('/terminals?type=commodity');
    const { getTerminalZh } = require('../lib/terminal-zh');
    const { getLocationZh } = require('../lib/location-zh');

    for (const t of data) {
      const cityName = t.city_name ? getLocationZh(t.city_name) : null;
      const spaceStationName = t.space_station_name ? getLocationZh(t.space_station_name) : null;
      const autoLoad = this.determineAutoLoad(t.city_name, t.space_station_name, t.is_auto_load === 1);
      const locationType = this.determineLocationType(cityName, t.space_station_name);

      await this.prisma.terminal.upsert({
        where: { id: t.id },
        update: { name: getTerminalZh(t.name), nameEn: t.name, code: t.code, type: t.type, starSystemName: getLocationZh(t.star_system_name), starSystemNameEn: t.star_system_name || '', planetName: getLocationZh(t.planet_name), planetNameEn: t.planet_name || '', moonName: getLocationZh(t.moon_name), moonNameEn: t.moon_name || '', cityName, cityNameEn: t.city_name || '', spaceStationName, spaceStationNameEn: t.space_station_name || '', hasCargoCenter: t.is_cargo_center === 1, hasDockingPort: t.has_docking_port === 1, hasFreightElevator: t.has_freight_elevator === 1, hasLoadingDock: t.has_loading_dock === 1, isAutoLoad: autoLoad, isRefinery: t.is_refinery === 1, isMedical: t.is_medical === 1, isFood: t.is_food === 1, isRefuel: t.is_refuel === 1, isRepair: t.is_repair === 1, isHabitation: t.is_habitation === 1, locationType },
        create: { id: t.id, name: getTerminalZh(t.name), nameEn: t.name, code: t.code, type: t.type, starSystemName: getLocationZh(t.star_system_name), starSystemNameEn: t.star_system_name || '', planetName: getLocationZh(t.planet_name), planetNameEn: t.planet_name || '', moonName: getLocationZh(t.moon_name), moonNameEn: t.moon_name || '', cityName, cityNameEn: t.city_name || '', spaceStationName, spaceStationNameEn: t.space_station_name || '', hasCargoCenter: t.is_cargo_center === 1, hasDockingPort: t.has_docking_port === 1, hasFreightElevator: t.has_freight_elevator === 1, hasLoadingDock: t.has_loading_dock === 1, isAutoLoad: autoLoad, isRefinery: t.is_refinery === 1, isMedical: t.is_medical === 1, isFood: t.is_food === 1, isRefuel: t.is_refuel === 1, isRepair: t.is_repair === 1, isHabitation: t.is_habitation === 1, locationType },
      });
    }
    this.logger.log(`Synced ${data.length} terminals`);
  }

  private async syncVehicles() {
    const data = await uexFetch<any[]>('/vehicles');
    const ships = data.filter((v: any) => (v.scu ?? 0) > 0 && v.is_spaceship === 1).map((v: any) => ({ id: v.id, name: v.name_full || v.name, scu: v.scu ?? 0, companyName: v.company_name || '', isCargo: v.is_cargo === 1, padType: v.pad_type || '', updatedAt: new Date() }));
    await this.prisma.$transaction(async tx => { await tx.vehicle.deleteMany(); for (let i = 0; i < ships.length; i += 500) await tx.vehicle.createMany({ data: ships.slice(i, i + 500) }); });
    this.logger.log(`Synced ${ships.length} vehicles`);
  }

  /** One-time: pull terminal pair distances, skip existing */
  private async syncTerminalDistances() {
    const terminals = await this.prisma.terminal.findMany({ select: { id: true } });
    if (terminals.length < 2) return;

    // Check existing count — if already populated, skip
    const existCount = await this.prisma.terminalDistance.count();
    const totalPairs = terminals.length * (terminals.length - 1);
    if (existCount >= totalPairs * 0.9) {
      this.logger.log(`Terminal distances already populated (${existCount}/${totalPairs}), skipping`);
      return;
    }

    let fetched = 0, skipped = 0;
    for (const origin of terminals) {
      for (const dest of terminals) {
        if (origin.id === dest.id) continue;
        // Skip if already exists
        const exist = await this.prisma.terminalDistance.findUnique({
          where: { originTerminalId_destTerminalId: { originTerminalId: origin.id, destTerminalId: dest.id } },
          select: { originTerminalId: true },
        });
        if (exist) { skipped++; continue; }

        try {
          const data = await uexFetch<any[]>(`/terminals_distances?id_terminal_origin=${origin.id}&id_terminal_destination=${dest.id}`);
          if (data?.[0]?.distance != null) {
            await this.prisma.terminalDistance.create({
              data: { originTerminalId: origin.id, destTerminalId: dest.id, distanceGm: data[0].distance },
            });
            fetched++;
          }
        } catch (err) {
          // rate limit or timeout — pause then continue
          await new Promise(r => setTimeout(r, 200));
        }
        // 50ms between calls to avoid rate limiting
        if (fetched % 10 === 0) await new Promise(r => setTimeout(r, 100));
      }
    }
    this.logger.log(`Terminal distances: ${fetched} new, ${skipped} skipped`);
  }

  // ── Price data (fast / 30min) ────────────────────────────────

  private async syncPrices() {
    const fetchedAt = new Date();
    // Use transaction to prevent TOCTOU race with concurrent syncs
    const exist = await this.prisma.priceSnapshot.findFirst({ where: { fetchedAt }, select: { id: true } });
    if (exist) { this.logger.log('Prices already synced at this timestamp'); return; }

    const data = await uexFetch<any[]>('/commodities_prices_all');
    const batch: any[] = [];
    const seen = new Set<string>();
    for (const p of data) {
      if (!p.id_commodity || !p.id_terminal) continue;
      const k = `${p.id_commodity}-${p.id_terminal}`; if (seen.has(k)) continue; seen.add(k);
      // Store null for priceBuyAvg/priceSellAvg — computed later by computeAverages3d
      batch.push({ commodityId: p.id_commodity, terminalId: p.id_terminal, priceBuy: p.price_buy, priceBuyAvg: null, priceSell: p.price_sell, priceSellAvg: null, scuBuyStock: p.scu_buy, scuSellStock: p.scu_sell_stock, scuSellMax: p.scu_sell, uexModifiedAt: p.date_modified, fetchedAt });
    }
    for (let i = 0; i < batch.length; i += 1000) await this.prisma.priceSnapshot.createMany({ data: batch.slice(i, i + 1000) });
    this.logger.log(`Inserted ${batch.length} price snapshots`);
  }

  // Compute 24h weighted averages (recent 6h ×3 + older 6-24h ×1 / 4)
  private async computeAverages24h() {
    const now = Date.now();
    const recentCutoff = new Date(now - 6 * 60 * 60 * 1000);
    const dayCutoff = new Date(now - 24 * 60 * 60 * 1000);

    const RECENT_W = 3, OLDER_W = 1, TOTAL_W = RECENT_W + OLDER_W;

    // Per-terminal: two windows for weighted average
    const [recentRows, olderRows] = await Promise.all([
      (this.prisma as any).priceSnapshot.groupBy({
        by: ['commodityId', 'terminalId'],
        where: { fetchedAt: { gte: recentCutoff } },
        _avg: { priceBuy: true, priceSell: true, scuBuyStock: true, scuSellStock: true },
        _max: { scuBuyStock: true, scuSellStock: true },
      }),
      (this.prisma as any).priceSnapshot.groupBy({
        by: ['commodityId', 'terminalId'],
        where: { fetchedAt: { gte: dayCutoff, lt: recentCutoff } },
        _avg: { priceBuy: true, priceSell: true, scuBuyStock: true, scuSellStock: true },
        _max: { scuBuyStock: true, scuSellStock: true },
      }),
    ]);

    // Merge two windows
    const merged = new Map<string, { recent: any; older: any }>();
    for (const r of recentRows) merged.set(`${r.commodityId}-${r.terminalId}`, { recent: r, older: null });
    for (const r of olderRows) {
      const k = `${r.commodityId}-${r.terminalId}`;
      const e = merged.get(k);
      if (e) e.older = r; else merged.set(k, { recent: null, older: r });
    }

    // Weighted combine helper
    const wavg = (recent: number | null, older: number | null): number | null => {
      if (recent != null && older != null) return (recent * RECENT_W + older * OLDER_W) / TOTAL_W;
      if (recent != null) return recent;
      if (older != null) return older;
      return null;
    };

    let updated = 0;
    for (const [key, { recent, older }] of merged) {
      const [cid, tid] = key.split('-').map(Number);
      const priceBuyAvg = wavg(recent?._avg?.priceBuy ?? null, older?._avg?.priceBuy ?? null);
      const priceSellAvg = wavg(recent?._avg?.priceSell ?? null, older?._avg?.priceSell ?? null);
      const scuBuyAvgW = wavg(recent?._avg?.scuBuyStock ?? null, older?._avg?.scuBuyStock ?? null);
      const scuSellAvgW = wavg(recent?._avg?.scuSellStock ?? null, older?._avg?.scuSellStock ?? null);
      // Peak: max across both windows
      const buyMaxPeak = Math.max(recent?._max?.scuBuyStock ?? 0, older?._max?.scuBuyStock ?? 0) || null;
      const sellMaxPeak = Math.max(recent?._max?.scuSellStock ?? 0, older?._max?.scuSellStock ?? 0) || null;

      await (this.prisma as any).terminalCommodityMax.upsert({
        where: { commodityId_terminalId: { commodityId: cid, terminalId: tid } },
        update: {
          priceBuyAvg, priceSellAvg,
          scuBuyAvg: scuBuyAvgW, scuSellAvg: scuSellAvgW,
          scuBuyStockAvg24h: scuBuyAvgW, scuSellStockAvg24h: scuSellAvgW,
          scuBuyMaxLocal: buyMaxPeak, scuSellMaxLocal: sellMaxPeak,
        },
        create: {
          commodityId: cid, terminalId: tid,
          priceBuyAvg, priceSellAvg,
          scuBuyAvg: scuBuyAvgW, scuSellAvg: scuSellAvgW,
          scuBuyStockAvg24h: scuBuyAvgW, scuSellStockAvg24h: scuSellAvgW,
          scuBuyMaxLocal: buyMaxPeak, scuSellMaxLocal: sellMaxPeak,
          fetchedAt: new Date(),
        },
      });
      updated++;
    }

    // Per-commodity: same weighted approach
    const [commRecent, commOlder] = await Promise.all([
      (this.prisma as any).priceSnapshot.groupBy({
        by: ['commodityId'],
        where: { fetchedAt: { gte: recentCutoff } },
        _avg: { priceBuy: true, priceSell: true, scuBuyStock: true, scuSellStock: true },
      }),
      (this.prisma as any).priceSnapshot.groupBy({
        by: ['commodityId'],
        where: { fetchedAt: { gte: dayCutoff, lt: recentCutoff } },
        _avg: { priceBuy: true, priceSell: true, scuBuyStock: true, scuSellStock: true },
      }),
    ]);

    const commMerged = new Map<number, { recent: any; older: any }>();
    for (const r of commRecent) commMerged.set(r.commodityId, { recent: r, older: null });
    for (const r of commOlder) {
      const e = commMerged.get(r.commodityId);
      if (e) e.older = r; else commMerged.set(r.commodityId, { recent: null, older: r });
    }

    let commUpdated = 0;
    for (const [cid, { recent, older }] of commMerged) {
      const pb = wavg(recent?._avg?.priceBuy ?? null, older?._avg?.priceBuy ?? null);
      const ps = wavg(recent?._avg?.priceSell ?? null, older?._avg?.priceSell ?? null);
      const sb = wavg(recent?._avg?.scuBuyStock ?? null, older?._avg?.scuBuyStock ?? null);
      const ss = wavg(recent?._avg?.scuSellStock ?? null, older?._avg?.scuSellStock ?? null);
      await (this.prisma as any).commodityAverage.upsert({
        where: { commodityId: cid },
        update: { priceBuyAvg: pb, priceSellAvg: ps, scuBuyAvg: sb, scuSellAvg: ss },
        create: { commodityId: cid, priceBuyAvg: pb, priceSellAvg: ps, scuBuyAvg: sb, scuSellAvg: ss, fetchedAt: new Date() },
      });
      commUpdated++;
    }

    this.logger.log(`Computed 24h weighted averages: ${updated} terminal pairs, ${commUpdated} commodities`);
  }

  private async updatePriceChanges() {
    const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
    if (!latest) return;
    const [buyRows, sellRows, minRows, maxRows] = await Promise.all([
      this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceBuy: { gt: 0 } }, _avg: { priceBuy: true } }),
      this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceSell: { gt: 0 } }, _avg: { priceSell: true } }),
      this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceBuy: { gt: 0 } }, _min: { priceBuy: true } }),
      this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceSell: { gt: 0 } }, _max: { priceSell: true } }),
    ]);
    const map: Record<number, { buy: number; sell: number }> = {};
    for (const b of buyRows) { if (!map[b.commodityId]) map[b.commodityId] = { buy: 0, sell: 0 }; map[b.commodityId].buy = b._avg.priceBuy || 0; }
    for (const s of sellRows) { if (!map[s.commodityId]) map[s.commodityId] = { buy: 0, sell: 0 }; map[s.commodityId].sell = s._avg.priceSell || 0; }
    const minMap: Record<number, number> = {}, maxMap: Record<number, number> = {};
    for (const m of minRows) if (m._min.priceBuy) minMap[m.commodityId] = m._min.priceBuy;
    for (const m of maxRows) if (m._max.priceSell) maxMap[m.commodityId] = m._max.priceSell;
    let updated = 0;
    for (const [idStr, cur] of Object.entries(map)) {
      const id = parseInt(idStr);
      if (cur.buy <= 0 || cur.sell <= 0) continue;
      const margin = Math.round(((cur.sell - cur.buy) / cur.buy) * 1000) / 10;
      const profit = Math.round(cur.sell - cur.buy);
      const stored = await this.prisma.commodity.findUnique({ where: { id }, select: { prevBuyAvg: true, profitChange: true } });
      let change = stored?.profitChange ?? null;
      if (stored?.prevBuyAvg != null && profit !== stored.prevBuyAvg) change = Math.round(profit - stored.prevBuyAvg);
      let maxMargin: number | null = null;
      if (minMap[id] && maxMap[id] && minMap[id] > 0) maxMargin = Math.round(((maxMap[id] - minMap[id]) / minMap[id]) * 1000) / 10;
      await this.prisma.commodity.update({ where: { id }, data: { profitMargin: margin, profitChange: change, maxProfitMargin: maxMargin, prevBuyAvg: profit } });
      if (change != null) updated++;
    }
    this.logger.log(`Updated profit changes for ${updated} commodities`);
  }

  private async syncCommodityAverages() {
    const commodities = await this.prisma.commodity.findMany({ select: { id: true } });
    for (const c of commodities) {
      try {
        const a = await uexFetch<any[]>(`/commodities_averages?id_commodity=${c.id}`);
        if (!a?.[0]) continue;
        // Only set UEX all-time max + meta; avg fields filled by computeAverages3d
        await this.prisma.commodityAverage.upsert({
          where: { commodityId: c.id },
          update: { scuBuyMax: a[0].scu_buy_max, scuSellMax: a[0].scu_sell_max, statusBuyAvg: a[0].status_buy_avg, statusSellAvg: a[0].status_sell_avg, caxScore: a[0].cax_score, gameVersion: a[0].game_version, dateModified: a[0].date_modified, fetchedAt: new Date() },
          create: { commodityId: c.id, scuBuyMax: a[0].scu_buy_max, scuSellMax: a[0].scu_sell_max, statusBuyAvg: a[0].status_buy_avg, statusSellAvg: a[0].status_sell_avg, caxScore: a[0].cax_score, gameVersion: a[0].game_version, dateModified: a[0].date_modified, fetchedAt: new Date() },
        });
      } catch (err) { this.logger.warn(`syncCommodityAverages failed for commodity ${c.id}: ${err}`); }
      await new Promise(r => setTimeout(r, 100));
    }
  }

  private async syncCargoRoutes() {
    const commodities = await this.prisma.commodity.findMany({ select: { id: true } });
    const rows: any[] = [];
    for (const c of commodities) {
      try {
        const routes = await uexFetch<any[]>(`/commodities_routes?id_commodity=${c.id}`);
        for (const r of routes) {
          if (!r.id_terminal_origin || !r.id_terminal_destination) continue;
          rows.push({ commodityId: r.id_commodity, originTerminalId: r.id_terminal_origin, destTerminalId: r.id_terminal_destination, distance: r.distance, containerSizesOrigin: r.container_sizes_origin, containerSizesDest: r.container_sizes_destination });
        }
      } catch (err) { this.logger.warn(`syncCargoRoutes failed for commodity ${c.id}: ${err}`); }
      await new Promise(r => setTimeout(r, 50));
    }
    const seen = new Map<string, any>();
    for (const r of rows) seen.set(`${r.commodityId}-${r.originTerminalId}-${r.destTerminalId}`, r);
    const deduped = [...seen.values()];
    // Upsert in transaction: insert new before deleting old to prevent data loss
    await this.prisma.$transaction(async (tx: any) => {
      for (let i = 0; i < deduped.length; i += 1000) {
        await tx.cargoRoute.createMany({ data: deduped.slice(i, i + 1000), skipDuplicates: true });
      }
      const allExisting = await tx.cargoRoute.findMany({ select: { commodityId: true, originTerminalId: true, destTerminalId: true } });
      for (const old of allExisting) {
        if (!seen.has(`${old.commodityId}-${old.originTerminalId}-${old.destTerminalId}`)) {
          await tx.cargoRoute.delete({ where: { commodityId_originTerminalId_destTerminalId: old } });
        }
      }
    });
    this.logger.log(`Synced ${deduped.length} cargo routes`);
  }

  private async syncTerminalCommodityMax() {
    const commodities = await this.prisma.commodity.findMany({ select: { id: true } });
    for (const c of commodities) {
      try {
        const data = await uexFetch<any[]>(`/commodities_prices?id_commodity=${c.id}`);
        for (const t of data) {
          await this.prisma.terminalCommodityMax.upsert({
            where: { commodityId_terminalId: { commodityId: t.id_commodity, terminalId: t.id_terminal } },
            update: { scuBuyMax: t.scu_buy_max, scuSellMax: t.scu_sell_max, scuBuyAvg: t.scu_buy_avg, scuSellAvg: t.scu_sell_avg, containerSizes: t.container_sizes || null, dateModified: t.date_modified, fetchedAt: new Date() },
            create: { commodityId: t.id_commodity, terminalId: t.id_terminal, scuBuyMax: t.scu_buy_max, scuSellMax: t.scu_sell_max, scuBuyAvg: t.scu_buy_avg, scuSellAvg: t.scu_sell_avg, containerSizes: t.container_sizes || null, dateModified: t.date_modified, fetchedAt: new Date() },
          });
        }
      } catch (err) { this.logger.warn(`syncTerminalCommodityMax failed for commodity ${c.id}: ${err}`); }
      await new Promise(r => setTimeout(r, 50));
    }
  }

  private async computeMarketIndex() {
    const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
    if (!latest) return;

    // Best buy/sell price per commodity from latest snapshot
    const [bestBuys, bestSells] = await Promise.all([
      (this.prisma as any).priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceBuy: { gt: 0 } }, _min: { priceBuy: true } }),
      (this.prisma as any).priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceSell: { gt: 0 } }, _max: { priceSell: true } }),
    ]);

    const buyMap = new Map<number, number>();
    for (const b of bestBuys) buyMap.set(b.commodityId, b._min.priceBuy);
    const sellMap = new Map<number, number>();
    for (const s of bestSells) sellMap.set(s.commodityId, s._max.priceSell);

    // Fetch stock weights (UEX global max buy stock per commodity)
    const ids = [...new Set([...buyMap.keys()])];
    const avgs = await this.prisma.commodityAverage.findMany({
      where: { commodityId: { in: ids } },
      select: { commodityId: true, scuBuyMax: true },
    });
    const stockMap = new Map<number, number>();
    for (const a of avgs) stockMap.set(a.commodityId, Math.max(a.scuBuyMax || 0, 1));

    let totalProfit = 0, totalCost = 0, count = 0;
    for (const [commodityId, buyPrice] of buyMap) {
      const sellPrice = sellMap.get(commodityId);
      if (!sellPrice || sellPrice <= buyPrice) continue;
      const stock = stockMap.get(commodityId) || 1;
      totalProfit += (sellPrice - buyPrice) * stock;
      totalCost += buyPrice * stock;
      count++;
    }

    if (!count || !totalCost) return;
    const index = Math.round((totalProfit / totalCost) * 1000) / 10;

    await this.prisma.marketIndex.create({ data: { value: index, commodityCount: count } });
    // Cleanup disabled — permanent storage
    // const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    // await this.prisma.marketIndex.deleteMany({ where: { fetchedAt: { lt: cutoff } } });
    this.logger.log(`Market index: ${index.toFixed(1)}% (${count} commodities, stock-weighted)`);
  }

  private async cleanupOldSnapshots(days: number) {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const r = await this.prisma.priceSnapshot.deleteMany({ where: { fetchedAt: { lt: cutoff } } });
    this.logger.log(`Cleaned ${r.count} old snapshots`);
  }
}
