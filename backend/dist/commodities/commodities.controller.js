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
    DAZONG_THRESHOLD = 2000;
    async findAll(res) {
        const commodities = await this.prisma.commodity.findMany({ orderBy: { name: 'asc' } });
        const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
        if (latest)
            res.setHeader('X-LastUpdated', latest.fetchedAt.toISOString());
        if (!latest)
            return commodities.map(c => this.emptyCommodity(c));
        const [buyPrices, sellPrices, sellStock, buyStock, averages] = await Promise.all([
            this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceBuy: { gt: 0 } }, _avg: { priceBuy: true } }),
            this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, priceSell: { gt: 0 } }, _avg: { priceSell: true } }),
            this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, scuSellStock: { gt: 0 } }, _sum: { scuSellStock: true } }),
            this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { fetchedAt: latest.fetchedAt, scuBuyStock: { gt: 0 } }, _sum: { scuBuyStock: true } }),
            this.prisma.commodityAverage.findMany({ select: { commodityId: true, scuBuyMax: true } }),
        ]);
        const buyMap = {};
        for (const c of buyPrices)
            buyMap[c.commodityId] = c._avg.priceBuy;
        const sellMap = {};
        for (const s of sellPrices)
            sellMap[s.commodityId] = s._avg.priceSell;
        const sellStockMap = {};
        for (const s of sellStock)
            sellStockMap[s.commodityId] = s._sum.scuSellStock || 0;
        const buyStockMap = {};
        for (const b of buyStock)
            buyStockMap[b.commodityId] = b._sum.scuBuyStock || 0;
        const dazongMap = {};
        for (const a of averages)
            dazongMap[a.commodityId] = (a.scuBuyMax || 0) >= this.DAZONG_THRESHOLD;
        return commodities.map(c => ({
            ...c, nameZh: c.name, kindZh: (0, commodity_zh_1.getZhKind)(c.kind),
            totalSellStock: sellStockMap[c.id] || 0,
            totalBuyStock: buyStockMap[c.id] || 0,
            currentBuyAvg: buyMap[c.id] ?? null,
            currentSellAvg: sellMap[c.id] ?? null,
            profitMargin: c.profitMargin, profitChange: c.profitChange, maxProfitMargin: c.maxProfitMargin,
            isDazong: dazongMap[c.id] ?? false,
        }));
    }
    async findOne(id, res) {
        const c = await this.prisma.commodity.findUnique({ where: { id: parseInt(id) } });
        if (!c) {
            res.status(404);
            return { error: 'not found' };
        }
        const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
        const avg = await this.prisma.commodityAverage.findUnique({ where: { commodityId: c.id }, select: { scuBuyMax: true } });
        let totalSellStock = 0, totalBuyStock = 0, currentBuyAvg = null, currentSellAvg = null;
        if (latest) {
            const [buyData, sellData, sellStock, buyStock] = await Promise.all([
                this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { commodityId: c.id, fetchedAt: latest.fetchedAt, priceBuy: { gt: 0 } }, _avg: { priceBuy: true } }),
                this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { commodityId: c.id, fetchedAt: latest.fetchedAt, priceSell: { gt: 0 } }, _avg: { priceSell: true } }),
                this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { commodityId: c.id, fetchedAt: latest.fetchedAt, scuSellStock: { gt: 0 } }, _sum: { scuSellStock: true } }),
                this.prisma.priceSnapshot.groupBy({ by: ['commodityId'], where: { commodityId: c.id, fetchedAt: latest.fetchedAt, scuBuyStock: { gt: 0 } }, _sum: { scuBuyStock: true } }),
            ]);
            if (buyData[0])
                currentBuyAvg = buyData[0]._avg.priceBuy;
            if (sellData[0])
                currentSellAvg = sellData[0]._avg.priceSell;
            if (sellStock[0])
                totalSellStock = sellStock[0]._sum.scuSellStock || 0;
            if (buyStock[0])
                totalBuyStock = buyStock[0]._sum.scuBuyStock || 0;
        }
        return {
            ...c, nameZh: c.name, kindZh: (0, commodity_zh_1.getZhKind)(c.kind),
            totalSellStock, totalBuyStock,
            currentBuyAvg, currentSellAvg,
            profitMargin: c.profitMargin, profitChange: c.profitChange, maxProfitMargin: c.maxProfitMargin,
            isDazong: (avg?.scuBuyMax || 0) >= this.DAZONG_THRESHOLD,
        };
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
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
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