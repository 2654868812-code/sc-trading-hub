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
exports.CommoditiesController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
const commodity_zh_1 = require("../lib/commodity-zh");
let CommoditiesController = class CommoditiesController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    emptyCommodity(c) {
        return { id: c.id, name: c.name, nameZh: c.name, nameEn: c.nameEn, code: c.code, kind: c.kind,
            isBuyable: c.isBuyable, isSellable: c.isSellable, isIllegal: c.isIllegal, isRaw: c.isRaw, isRefined: c.isRefined,
            kindZh: (0, commodity_zh_1.getZhKind)(c.kind), totalSellStock: 0, totalBuyStock: 0, changePercent: c.changePercent,
            currentBuyAvg: null, currentSellAvg: null, profitMargin: null, profitChange: null, maxProfitMargin: null, isDazong: false };
    }
    async findAll(res) {
        const commodities = await this.prisma.commodity.findMany({ orderBy: { name: 'asc' } });
        const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
        if (latest)
            res.setHeader('X-LastUpdated', latest.fetchedAt.toISOString());
        if (!latest)
            return commodities.map(c => this.emptyCommodity(c));
        const dazongMap = {};
        const allMax = await this.prisma.terminalCommodityMax.findMany({ select: { commodityId: true, scuBuyMax: true } });
        for (const m of allMax) {
            if (m.scuBuyMax && m.scuBuyMax >= 2000)
                dazongMap[m.commodityId] = true;
        }
        const allBuy = await this.prisma.priceSnapshot.findMany({
            where: { fetchedAt: latest.fetchedAt }, select: { commodityId: true, priceBuy: true, priceBuyAvg: true },
        });
        const allSell = await this.prisma.priceSnapshot.findMany({
            where: { fetchedAt: latest.fetchedAt }, select: { commodityId: true, priceSell: true, priceSellAvg: true },
        });
        const buyAcc = {};
        for (const s of allBuy) {
            const v = s.priceBuyAvg ?? s.priceBuy;
            if (!v || v <= 0)
                continue;
            if (!buyAcc[s.commodityId])
                buyAcc[s.commodityId] = { sum: 0, count: 0 };
            buyAcc[s.commodityId].sum += v;
            buyAcc[s.commodityId].count++;
        }
        const sellAcc = {};
        for (const s of allSell) {
            const v = s.priceSellAvg ?? s.priceSell;
            if (!v || v <= 0)
                continue;
            if (!sellAcc[s.commodityId])
                sellAcc[s.commodityId] = { sum: 0, count: 0 };
            sellAcc[s.commodityId].sum += v;
            sellAcc[s.commodityId].count++;
        }
        const buyMap = {}, sellMap = {};
        for (const [id, a] of Object.entries(buyAcc))
            buyMap[+id] = Math.round(a.sum / a.count);
        for (const [id, a] of Object.entries(sellAcc))
            sellMap[+id] = Math.round(a.sum / a.count);
        return commodities.map(c => ({
            id: c.id, name: c.name, nameZh: c.name, nameEn: c.nameEn, code: c.code, kind: c.kind,
            isBuyable: c.isBuyable, isSellable: c.isSellable, isIllegal: c.isIllegal, isRaw: c.isRaw, isRefined: c.isRefined,
            kindZh: (0, commodity_zh_1.getZhKind)(c.kind), totalSellStock: 0, totalBuyStock: 0, changePercent: c.changePercent,
            currentBuyAvg: buyMap[c.id] ?? null, currentSellAvg: sellMap[c.id] ?? null,
            profitMargin: c.profitMargin, profitChange: c.profitChange, maxProfitMargin: c.maxProfitMargin,
            isDazong: dazongMap[c.id] ?? false,
        }));
    }
    async findOne(id) {
        const c = await this.prisma.commodity.findUnique({ where: { id: parseInt(id) } });
        if (!c)
            return { error: 'not found' };
        return { ...c, nameZh: c.name, kindZh: (0, commodity_zh_1.getZhKind)(c.kind) };
    }
    async version() {
        const rows = await this.prisma.commodityAverage.findMany({
            where: { gameVersion: { not: null } }, select: { gameVersion: true },
        });
        if (!rows.length)
            return { gameVersion: null };
        const counts = {};
        for (const r of rows) {
            const v = r.gameVersion;
            counts[v] = (counts[v] || 0) + 1;
        }
        return { gameVersion: Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] };
    }
};
exports.CommoditiesController = CommoditiesController;
__decorate([
    (0, common_1.Get)('commodities'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommoditiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('commodities/:id'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommoditiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('version'),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommoditiesController.prototype, "version", null);
exports.CommoditiesController = CommoditiesController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommoditiesController);
//# sourceMappingURL=commodities.controller.js.map