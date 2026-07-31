"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const uex_1 = require("./uex");
let SyncService = SyncService_1 = class SyncService {
    prisma;
    logger = new common_1.Logger(SyncService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async fullSync() {
        this.logger.log('Starting full sync...');
        await this.syncCommodities();
        await this.syncTerminals();
        await this.syncPrices();
        await this.updatePriceChanges();
        await Promise.allSettled([
            this.syncCommodityAverages(),
            this.syncCargoRoutes(),
            this.syncVehicles(),
            this.syncTerminalCommodityMax(),
        ]);
        await this.cleanupOldSnapshots(parseInt(process.env.PRICE_RETENTION_DAYS || '30', 10));
        this.logger.log('Full sync complete');
    }
    async syncCommodities() {
        const data = await (0, uex_1.uexFetch)('/commodities');
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
    async syncTerminals() {
        const data = await (0, uex_1.uexFetch)('/terminals?type=commodity');
        const { getTerminalZh } = require('../lib/terminal-zh');
        const { getLocationZh } = require('../lib/location-zh');
        for (const t of data) {
            await this.prisma.terminal.upsert({
                where: { id: t.id },
                update: { name: getTerminalZh(t.name), nameEn: t.name, code: t.code, type: t.type, starSystemName: getLocationZh(t.star_system_name), starSystemNameEn: t.star_system_name || '', planetName: getLocationZh(t.planet_name), planetNameEn: t.planet_name || '', moonName: getLocationZh(t.moon_name), moonNameEn: t.moon_name || '', cityName: getLocationZh(t.city_name), cityNameEn: t.city_name || '', spaceStationName: getLocationZh(t.space_station_name), spaceStationNameEn: t.space_station_name || '', hasCargoCenter: t.has_cargo_center === 1, hasDockingPort: t.has_docking_port === 1, hasFreightElevator: t.has_freight_elevator === 1, isAutoLoad: t.is_auto_load === 1 },
                create: { id: t.id, name: getTerminalZh(t.name), nameEn: t.name, code: t.code, type: t.type, starSystemName: getLocationZh(t.star_system_name), starSystemNameEn: t.star_system_name || '', planetName: getLocationZh(t.planet_name), planetNameEn: t.planet_name || '', moonName: getLocationZh(t.moon_name), moonNameEn: t.moon_name || '', cityName: getLocationZh(t.city_name), cityNameEn: t.city_name || '', spaceStationName: getLocationZh(t.space_station_name), spaceStationNameEn: t.space_station_name || '', hasCargoCenter: t.has_cargo_center === 1, hasDockingPort: t.has_docking_port === 1, hasFreightElevator: t.has_freight_elevator === 1, isAutoLoad: t.is_auto_load === 1 },
            });
        }
        this.logger.log(`Synced ${data.length} terminals`);
    }
    async syncPrices() {
        const fetchedAt = new Date();
        const exist = await this.prisma.priceSnapshot.findFirst({ where: { fetchedAt }, select: { id: true } });
        if (exist) {
            this.logger.log('Prices already synced at this timestamp');
            return;
        }
        const data = await (0, uex_1.uexFetch)('/commodities_prices_all');
        const batch = [];
        const seen = new Set();
        for (const p of data) {
            if (!p.id_commodity || !p.id_terminal)
                continue;
            const k = `${p.id_commodity}-${p.id_terminal}`;
            if (seen.has(k))
                continue;
            seen.add(k);
            batch.push({ commodityId: p.id_commodity, terminalId: p.id_terminal, priceBuy: p.price_buy, priceBuyAvg: p.price_buy_avg, priceSell: p.price_sell, priceSellAvg: p.price_sell_avg, scuBuyStock: p.scu_buy, scuSellStock: p.scu_sell_stock, scuSellMax: p.scu_sell, uexModifiedAt: p.date_modified, fetchedAt });
        }
        for (let i = 0; i < batch.length; i += 1000)
            await this.prisma.priceSnapshot.createMany({ data: batch.slice(i, i + 1000) });
        this.logger.log(`Inserted ${batch.length} price snapshots`);
    }
    async updatePriceChanges() {
        const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
        if (!latest)
            return;
        const [buyRows, sellRows, minRows, maxRows] = await Promise.all([
            this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceBuy: { gt: 0 } }, _avg: { priceBuy: true } }),
            this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceSell: { gt: 0 } }, _avg: { priceSell: true } }),
            this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceBuy: { gt: 0 } }, _min: { priceBuy: true } }),
            this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceSell: { gt: 0 } }, _max: { priceSell: true } }),
        ]);
        const map = {};
        for (const b of buyRows) {
            if (!map[b.commodityId])
                map[b.commodityId] = { buy: 0, sell: 0 };
            map[b.commodityId].buy = b._avg.priceBuy || 0;
        }
        for (const s of sellRows) {
            if (!map[s.commodityId])
                map[s.commodityId] = { buy: 0, sell: 0 };
            map[s.commodityId].sell = s._avg.priceSell || 0;
        }
        const minMap = {}, maxMap = {};
        for (const m of minRows)
            if (m._min.priceBuy)
                minMap[m.commodityId] = m._min.priceBuy;
        for (const m of maxRows)
            if (m._max.priceSell)
                maxMap[m.commodityId] = m._max.priceSell;
        let updated = 0;
        for (const [idStr, cur] of Object.entries(map)) {
            const id = parseInt(idStr);
            if (cur.buy <= 0 || cur.sell <= 0)
                continue;
            const margin = Math.round(((cur.sell - cur.buy) / cur.buy) * 1000) / 10;
            const profit = Math.round(cur.sell - cur.buy);
            const stored = await this.prisma.commodity.findUnique({ where: { id }, select: { prevBuyAvg: true, profitChange: true } });
            let change = stored?.profitChange ?? null;
            if (stored?.prevBuyAvg != null && profit !== stored.prevBuyAvg)
                change = Math.round(profit - stored.prevBuyAvg);
            let maxMargin = null;
            if (minMap[id] && maxMap[id] && minMap[id] > 0)
                maxMargin = Math.round(((maxMap[id] - minMap[id]) / minMap[id]) * 1000) / 10;
            await this.prisma.commodity.update({ where: { id }, data: { profitMargin: margin, profitChange: change, maxProfitMargin: maxMargin, prevBuyAvg: profit } });
            if (change != null)
                updated++;
        }
        this.logger.log(`Updated profit changes for ${updated} commodities`);
    }
    async syncCommodityAverages() {
        const commodities = await this.prisma.commodity.findMany({ select: { id: true } });
        for (const c of commodities) {
            try {
                const a = await (0, uex_1.uexFetch)(`/commodities_averages?id_commodity=${c.id}`);
                if (!a?.[0])
                    continue;
                await this.prisma.commodityAverage.upsert({
                    where: { commodityId: c.id },
                    update: { priceBuyAvg: a[0].price_buy_avg, priceSellAvg: a[0].price_sell_avg, scuBuyMax: a[0].scu_buy_max, scuBuyAvg: a[0].scu_buy_avg, scuSellMax: a[0].scu_sell_max, scuSellAvg: a[0].scu_sell_avg, gameVersion: a[0].game_version, dateModified: a[0].date_modified, fetchedAt: new Date() },
                    create: { commodityId: c.id, priceBuyAvg: a[0].price_buy_avg, priceSellAvg: a[0].price_sell_avg, scuBuyMax: a[0].scu_buy_max, scuBuyAvg: a[0].scu_buy_avg, scuSellMax: a[0].scu_sell_max, scuSellAvg: a[0].scu_sell_avg, gameVersion: a[0].game_version, dateModified: a[0].date_modified, fetchedAt: new Date() },
                });
            }
            catch { }
            await new Promise(r => setTimeout(r, 100));
        }
    }
    async syncCargoRoutes() {
        const commodities = await this.prisma.commodity.findMany({ select: { id: true } });
        const rows = [];
        for (const c of commodities) {
            try {
                const routes = await (0, uex_1.uexFetch)(`/commodities_routes?id_commodity=${c.id}`);
                for (const r of routes) {
                    if (!r.id_terminal_origin || !r.id_terminal_destination)
                        continue;
                    rows.push({ commodityId: r.id_commodity, originTerminalId: r.id_terminal_origin, destTerminalId: r.id_terminal_destination, distance: r.distance, containerSizesOrigin: r.container_sizes_origin, containerSizesDest: r.container_sizes_destination });
                }
            }
            catch { }
            await new Promise(r => setTimeout(r, 50));
        }
        const seen = new Map();
        for (const r of rows)
            seen.set(`${r.commodityId}-${r.originTerminalId}-${r.destTerminalId}`, r);
        const deduped = [...seen.values()];
        await this.prisma.$transaction(async (tx) => { await tx.cargoRoute.deleteMany(); for (let i = 0; i < deduped.length; i += 1000)
            await tx.cargoRoute.createMany({ data: deduped.slice(i, i + 1000) }); });
        this.logger.log(`Synced ${deduped.length} cargo routes`);
    }
    async syncVehicles() {
        const data = await (0, uex_1.uexFetch)('/vehicles');
        const ships = data.filter((v) => (v.scu ?? 0) > 0 && v.is_spaceship === 1).map((v) => ({ id: v.id, name: v.name_full || v.name, scu: v.scu ?? 0, companyName: v.company_name || '', isCargo: v.is_cargo === 1, padType: v.pad_type || '', updatedAt: new Date() }));
        await this.prisma.$transaction(async (tx) => { await tx.vehicle.deleteMany(); for (let i = 0; i < ships.length; i += 500)
            await tx.vehicle.createMany({ data: ships.slice(i, i + 500) }); });
        this.logger.log(`Synced ${ships.length} vehicles`);
    }
    async syncTerminalCommodityMax() {
        const commodities = await this.prisma.commodity.findMany({ select: { id: true } });
        for (const c of commodities) {
            try {
                const data = await (0, uex_1.uexFetch)(`/commodities_prices?id_commodity=${c.id}`);
                for (const t of data) {
                    await this.prisma.terminalCommodityMax.upsert({
                        where: { commodityId_terminalId: { commodityId: t.id_commodity, terminalId: t.id_terminal } },
                        update: { scuBuyMax: t.scu_buy_max, scuSellMax: t.scu_sell_max, scuBuyAvg: t.scu_buy_avg, scuSellAvg: t.scu_sell_avg, dateModified: t.date_modified, fetchedAt: new Date() },
                        create: { commodityId: t.id_commodity, terminalId: t.id_terminal, scuBuyMax: t.scu_buy_max, scuSellMax: t.scu_sell_max, scuBuyAvg: t.scu_buy_avg, scuSellAvg: t.scu_sell_avg, dateModified: t.date_modified, fetchedAt: new Date() },
                    });
                }
            }
            catch { }
            await new Promise(r => setTimeout(r, 50));
        }
    }
    async cleanupOldSnapshots(days) {
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        const r = await this.prisma.priceSnapshot.deleteMany({ where: { fetchedAt: { lt: cutoff } } });
        this.logger.log(`Cleaned ${r.count} old snapshots`);
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = SyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SyncService);
//# sourceMappingURL=sync.service.js.map