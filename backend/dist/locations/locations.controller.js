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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
const commodity_zh_1 = require("../lib/commodity-zh");
function locationTypeFrom(terminals) {
    for (const t of terminals) {
        if (t.locationType)
            return t.locationType;
    }
    return '地面站';
}
let LocationsController = class LocationsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list() {
        const terminals = await this.prisma.terminal.findMany({
            select: { name: true, nameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, starSystemName: true, planetName: true, moonName: true, locationType: true },
            orderBy: { name: 'asc' },
        });
        const seen = new Map();
        for (const t of terminals) {
            const key = t.cityName || t.spaceStationName || t.name;
            if (!key || seen.has(key))
                continue;
            const en = t.cityNameEn || t.spaceStationNameEn || t.nameEn;
            seen.set(key, { name: key, nameEn: en || '', system: t.starSystemName || '', planet: t.planetName || t.moonName, locationType: t.locationType || '地面站' });
        }
        return [...seen.values()];
    }
    async detail(name, res) {
        let locationName;
        try {
            locationName = decodeURIComponent(name);
        }
        catch {
            locationName = name;
        }
        const terminals = await this.prisma.terminal.findMany({
            where: { OR: [{ cityName: locationName }, { spaceStationName: locationName }, { name: locationName }] },
        });
        if (!terminals.length) {
            res.status(404);
            return { error: 'location not found' };
        }
        const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
        if (!latest)
            return { location: { name: locationName, terminalCount: terminals.length, locationType: locationTypeFrom(terminals) }, terminals: [], commodities: [] };
        const ids = terminals.map(t => t.id);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const [snapshots, buyStats, sellStats, termMax, commAvgs, gameVer] = await Promise.all([
            this.prisma.priceSnapshot.findMany({
                where: { terminalId: { in: ids }, fetchedAt: latest.fetchedAt },
                include: { commodity: { select: { id: true, name: true, nameEn: true, code: true, kind: true, isIllegal: true, profitMargin: true } } },
            }),
            this.prisma.priceSnapshot.groupBy({ by: ['terminalId', 'commodityId'], where: { terminalId: { in: ids }, priceBuy: { gt: 0 }, fetchedAt: { gte: oneDayAgo } }, _avg: { priceBuy: true }, _max: { priceBuy: true }, _min: { priceBuy: true } }),
            this.prisma.priceSnapshot.groupBy({ by: ['terminalId', 'commodityId'], where: { terminalId: { in: ids }, priceSell: { gt: 0 }, fetchedAt: { gte: oneDayAgo } }, _avg: { priceSell: true }, _max: { priceSell: true }, _min: { priceSell: true } }),
            this.prisma.terminalCommodityMax.findMany({ where: { terminalId: { in: ids } }, select: { terminalId: true, commodityId: true, scuBuyMax: true, scuSellMax: true, scuBuyMaxLocal: true, scuSellMaxLocal: true, scuBuyStockAvg24h: true, scuSellStockAvg24h: true, priceBuyAvg: true, priceSellAvg: true } }),
            this.prisma.commodityAverage.findMany({ select: { commodityId: true, scuBuyMax: true, scuSellMax: true } }),
            this.prisma.commodityAverage.findFirst({ where: { gameVersion: { not: null } }, select: { gameVersion: true }, orderBy: { fetchedAt: 'desc' } }),
        ]);
        const buyStatMap = new Map();
        for (const b of buyStats)
            buyStatMap.set(`${b.terminalId}-${b.commodityId}`, { avg: b._avg.priceBuy, max: b._max.priceBuy, min: b._min.priceBuy });
        const sellStatMap = new Map();
        for (const s of sellStats)
            sellStatMap.set(`${s.terminalId}-${s.commodityId}`, { avg: s._avg.priceSell, max: s._max.priceSell, min: s._min.priceSell });
        const stockMaxMap = new Map();
        for (const m of termMax)
            stockMaxMap.set(`${m.terminalId}-${m.commodityId}`, {
                scuBuyMax: m.scuBuyMax ?? 0, scuSellMax: m.scuSellMax ?? 0,
                scuBuyMaxLocal: m.scuBuyMaxLocal ?? 0, scuSellMaxLocal: m.scuSellMaxLocal ?? 0,
                scuBuyStockAvg24h: m.scuBuyStockAvg24h ?? null, scuSellStockAvg24h: m.scuSellStockAvg24h ?? null,
                priceBuyAvg24h: m.priceBuyAvg ?? null, priceSellAvg24h: m.priceSellAvg ?? null,
            });
        const globalMaxMap = new Map();
        for (const a of commAvgs)
            globalMaxMap.set(a.commodityId, { buyMax: a.scuBuyMax || 0, sellMax: a.scuSellMax || 0 });
        const termMap = new Map();
        for (const t of terminals)
            termMap.set(t.id, { id: t.id, name: t.name, nameEn: t.nameEn, type: t.type, hasCargoCenter: t.hasCargoCenter, hasDockingPort: t.hasDockingPort, hasFreightElevator: t.hasFreightElevator, hasLoadingDock: t.hasLoadingDock, isAutoLoad: t.isAutoLoad, isRefinery: t.isRefinery, isMedical: t.isMedical, isFood: t.isFood, isRefuel: t.isRefuel, isRepair: t.isRepair, isHabitation: t.isHabitation, buys: [], sells: [] });
        for (const s of snapshots) {
            const term = termMap.get(s.terminalId);
            if (!term)
                continue;
            const bStat = buyStatMap.get(`${s.terminalId}-${s.commodityId}`);
            const sStat = sellStatMap.get(`${s.terminalId}-${s.commodityId}`);
            const sm = stockMaxMap.get(`${s.terminalId}-${s.commodityId}`);
            const item = {
                id: s.commodityId, name: s.commodity.name, nameEn: s.commodity.nameEn, code: s.commodity.code,
                kind: s.commodity.kind, kindZh: (0, commodity_zh_1.getZhKind)(s.commodity.kind), isIllegal: s.commodity.isIllegal,
                profitMargin: s.commodity.profitMargin,
                priceBuy: s.priceBuy, priceBuyAvg: bStat?.avg ?? null, priceBuyMax: bStat?.max ?? null, priceBuyMin: bStat?.min ?? null,
                priceSell: s.priceSell, priceSellAvg: sStat?.avg ?? null, priceSellMax: sStat?.max ?? null, priceSellMin: sStat?.min ?? null,
                priceBuyAvg24h: sm?.priceBuyAvg24h ?? null, priceSellAvg24h: sm?.priceSellAvg24h ?? null,
                scuBuyStock: s.scuBuyStock, scuSellStock: s.scuSellStock,
                scuBuyMax: (sm?.scuBuyMax || sm?.scuBuyMaxLocal || s.scuBuyStock || globalMaxMap.get(s.commodityId)?.buyMax) || null, scuSellMax: (sm?.scuSellMax || sm?.scuSellMaxLocal || s.scuSellStock || globalMaxMap.get(s.commodityId)?.sellMax) || null,
                scuBuyStockAvg24h: sm?.scuBuyStockAvg24h ?? null, scuSellStockAvg24h: sm?.scuSellStockAvg24h ?? null,
                updatedAt: s.uexModifiedAt ? new Date(s.uexModifiedAt * 1000).toISOString() : s.fetchedAt.toISOString(),
            };
            if (s.priceBuy && s.priceBuy > 0)
                term.buys.push(item);
            if (s.priceSell && s.priceSell > 0)
                term.sells.push(item);
        }
        return {
            location: { name: locationName, starSystemName: terminals[0].starSystemName, starSystemNameEn: terminals[0].starSystemNameEn, planetName: terminals[0].planetName, planetNameEn: terminals[0].planetNameEn, moonName: terminals[0].moonName, moonNameEn: terminals[0].moonNameEn, terminalCount: terminals.length, locationType: locationTypeFrom(terminals) },
            terminals: [...termMap.values()],
            gameVersion: gameVer?.gameVersion ?? null,
        };
    }
};
exports.LocationsController = LocationsController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':name'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "detail", null);
exports.LocationsController = LocationsController = __decorate([
    (0, common_1.Controller)('locations'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocationsController);
//# sourceMappingURL=locations.controller.js.map