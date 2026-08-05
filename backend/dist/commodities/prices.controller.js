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
exports.PricesController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
let PricesController = class PricesController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async history(commodityId, terminalIds, hours) {
        const cid = parseInt(commodityId);
        if (!cid)
            return [];
        const ids = (terminalIds || '').split(',').map(Number).filter(n => !isNaN(n));
        const hRaw = parseInt(hours || '24');
        const h = Math.min(Math.max(hRaw || 24, 1), 168);
        const since = new Date(Date.now() - h * 60 * 60 * 1000);
        const where = { commodityId: cid, fetchedAt: { gte: since } };
        if (ids.length > 0)
            where.terminalId = { in: ids };
        const snapshots = await this.prisma.priceSnapshot.findMany({
            where,
            include: { terminal: { select: { name: true } } },
            orderBy: { fetchedAt: 'asc' },
            take: 2000,
        });
        return snapshots.map(s => ({ fetchedAt: s.fetchedAt.toISOString(), priceBuy: s.priceBuy, priceSell: s.priceSell, terminalName: s.terminal.name }));
    }
    async locationPrices(locationName, hours) {
        let name;
        try {
            name = decodeURIComponent(locationName || '');
        }
        catch {
            name = locationName || '';
        }
        if (!name)
            return [];
        const terminals = await this.prisma.terminal.findMany({
            where: { OR: [{ cityName: name }, { spaceStationName: name }, { name }] },
            select: { id: true },
        });
        if (!terminals.length)
            return [];
        const tids = terminals.map(t => t.id);
        const hRaw = parseInt(hours || '24');
        const h = Math.min(Math.max(hRaw || 24, 1), 168);
        const since = new Date(Date.now() - h * 60 * 60 * 1000);
        const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
        if (!latest)
            return [];
        const latestSnaps = await this.prisma.priceSnapshot.findMany({
            where: { terminalId: { in: tids }, fetchedAt: latest.fetchedAt },
            select: { commodityId: true, priceBuy: true, priceSell: true },
        });
        const topBuy = [...latestSnaps.filter(s => s.priceBuy > 0)]
            .sort((a, b) => b.priceBuy - a.priceBuy).slice(0, 5).map(s => s.commodityId);
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
    async terminals(commodityId) {
        const cid = parseInt(commodityId);
        if (!cid)
            return [];
        const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
        if (!latest)
            return [];
        const snapshots = await this.prisma.priceSnapshot.findMany({
            where: { commodityId: cid, fetchedAt: latest.fetchedAt },
            include: { terminal: { select: { id: true, name: true, nameEn: true, starSystemName: true, starSystemNameEn: true, planetName: true, planetNameEn: true, moonName: true, moonNameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, type: true, hasCargoCenter: true, hasDockingPort: true, hasFreightElevator: true, isAutoLoad: true } } },
        });
        const tids = [...new Set(snapshots.map(s => s.terminalId))];
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        const [buyStats, sellStats, termMax] = await Promise.all([
            this.prisma.priceSnapshot.groupBy({ by: ['terminalId'], where: { commodityId: cid, terminalId: { in: tids }, priceBuy: { gt: 0 }, fetchedAt: { gte: threeDaysAgo } }, _max: { priceBuy: true }, _min: { priceBuy: true }, _avg: { priceBuy: true } }),
            this.prisma.priceSnapshot.groupBy({ by: ['terminalId'], where: { commodityId: cid, terminalId: { in: tids }, priceSell: { gt: 0 }, fetchedAt: { gte: threeDaysAgo } }, _max: { priceSell: true }, _min: { priceSell: true }, _avg: { priceSell: true } }),
            this.prisma.terminalCommodityMax.findMany({ where: { commodityId: cid }, select: { terminalId: true, scuBuyMax: true, scuSellMax: true, scuBuyAvg: true, scuSellAvg: true } }),
        ]);
        const buyMap = {}, sellMap = {}, maxMap = {};
        for (const b of buyStats)
            buyMap[b.terminalId] = { avg: b._avg.priceBuy, max: b._max.priceBuy, min: b._min.priceBuy };
        for (const s of sellStats)
            sellMap[s.terminalId] = { avg: s._avg.priceSell, max: s._max.priceSell, min: s._min.priceSell };
        for (const m of termMax)
            maxMap[m.terminalId] = { buyMax: m.scuBuyMax ?? 0, sellMax: m.scuSellMax ?? 0, buyAvg: m.scuBuyAvg ?? null, sellAvg: m.scuSellAvg ?? null };
        const seen = new Set();
        return snapshots.filter(s => { if (seen.has(s.terminalId))
            return false; seen.add(s.terminalId); return true; }).map(s => ({
            id: s.terminal.id, name: s.terminal.name, nameZh: s.terminal.name, nameEn: s.terminal.nameEn,
            starSystemName: s.terminal.starSystemName, starSystemNameEn: s.terminal.starSystemNameEn,
            planetName: s.terminal.planetName, planetNameEn: s.terminal.planetNameEn,
            moonName: s.terminal.moonName, moonNameEn: s.terminal.moonNameEn,
            cityName: s.terminal.cityName, cityNameEn: s.terminal.cityNameEn,
            spaceStationName: s.terminal.spaceStationName, spaceStationNameEn: s.terminal.spaceStationNameEn,
            type: s.terminal.type, hasCargoCenter: s.terminal.hasCargoCenter, hasDockingPort: s.terminal.hasDockingPort, hasFreightElevator: s.terminal.hasFreightElevator, isAutoLoad: s.terminal.isAutoLoad,
            priceBuy: s.priceBuy, priceBuyAvg: buyMap[s.terminalId]?.avg ?? null, priceBuyMax: buyMap[s.terminalId]?.max ?? null, priceBuyMin: buyMap[s.terminalId]?.min ?? null,
            priceSell: s.priceSell, priceSellAvg: sellMap[s.terminalId]?.avg ?? null, priceSellMax: sellMap[s.terminalId]?.max ?? null, priceSellMin: sellMap[s.terminalId]?.min ?? null,
            scuBuyStock: s.scuBuyStock, scuSellStock: s.scuSellStock,
            scuBuyMax: maxMap[s.terminalId]?.buyMax ?? null, scuSellMax: maxMap[s.terminalId]?.sellMax ?? null,
            scuBuyAvg: maxMap[s.terminalId]?.buyAvg ?? null, scuSellAvg: maxMap[s.terminalId]?.sellAvg ?? null,
            updatedAt: s.uexModifiedAt ? new Date(s.uexModifiedAt * 1000).toISOString() : s.fetchedAt.toISOString(),
        }));
    }
};
exports.PricesController = PricesController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('commodityId')),
    __param(1, (0, common_1.Query)('terminalIds')),
    __param(2, (0, common_1.Query)('hours')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PricesController.prototype, "history", null);
__decorate([
    (0, common_1.Get)('location'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('locationName')),
    __param(1, (0, common_1.Query)('hours')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PricesController.prototype, "locationPrices", null);
__decorate([
    (0, common_1.Get)('terminals'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('commodityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PricesController.prototype, "terminals", null);
exports.PricesController = PricesController = __decorate([
    (0, common_1.Controller)('prices'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PricesController);
//# sourceMappingURL=prices.controller.js.map