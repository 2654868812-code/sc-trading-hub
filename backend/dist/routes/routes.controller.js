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
exports.RoutesController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
const commodity_zh_1 = require("../lib/commodity-zh");
const SPACE_ONLY_SHIPS = new Set([102, 104, 105, 106]);
let RoutesController = class RoutesController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findRoutes(commodityId, shipId, originSystem, destSystem, originLocation, destLocation, maxInvestment, maxDistance, commodityType, autoLoadType, sortBy, sortOrder) {
        const cid = commodityId ? parseInt(commodityId) : undefined;
        const sid = shipId ? parseInt(shipId) : 0;
        let shipScu = 0, spaceOnly = false;
        if (sid > 0) {
            const ship = await this.prisma.vehicle.findUnique({ where: { id: sid }, select: { id: true, scu: true } });
            if (ship) {
                shipScu = ship.scu;
                spaceOnly = SPACE_ONLY_SHIPS.has(ship.id);
            }
        }
        const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
        if (!latest)
            return [];
        const buildLocationFilter = (loc, spaceOnlyFlag) => {
            const filters = [];
            if (loc)
                filters.push({ terminal: { OR: [{ cityName: loc }, { spaceStationName: loc }] } });
            if (!loc && spaceOnlyFlag)
                filters.push({ terminal: { spaceStationName: { not: null } } });
            return filters;
        };
        const buyLocationFilters = buildLocationFilter(originLocation, spaceOnly);
        const sellLocationFilters = buildLocationFilter(destLocation, spaceOnly);
        const [buySnaps, sellSnaps] = await Promise.all([
            this.prisma.priceSnapshot.findMany({
                where: { fetchedAt: latest.fetchedAt, OR: [{ priceBuyAvg: { gt: 0 } }, { priceBuy: { gt: 0 } }], ...(cid ? { commodityId: cid } : {}), ...(buyLocationFilters.length ? { AND: buyLocationFilters } : {}) },
                include: { commodity: { select: { id: true, name: true, kind: true, isIllegal: true } }, terminal: { select: { id: true, name: true, nameEn: true, starSystemName: true, starSystemNameEn: true, planetName: true, planetNameEn: true, moonName: true, moonNameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, isAutoLoad: true } } },
            }),
            this.prisma.priceSnapshot.findMany({
                where: { fetchedAt: latest.fetchedAt, OR: [{ priceSellAvg: { gt: 0 } }, { priceSell: { gt: 0 } }], ...(cid ? { commodityId: cid } : {}), ...(sellLocationFilters.length ? { AND: sellLocationFilters } : {}) },
                include: { terminal: { select: { id: true, name: true, nameEn: true, starSystemName: true, starSystemNameEn: true, planetName: true, planetNameEn: true, moonName: true, moonNameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, isAutoLoad: true } } },
            }),
        ]);
        const commodityIds = [...new Set([...buySnaps.map(s => s.commodityId), ...sellSnaps.map(s => s.commodityId)])];
        const [cargoRoutes, termMaxRows] = await Promise.all([
            this.prisma.cargoRoute.findMany({ where: { commodityId: { in: commodityIds } }, select: { commodityId: true, originTerminalId: true, destTerminalId: true, distance: true, containerSizesOrigin: true, containerSizesDest: true } }),
            this.prisma.terminalCommodityMax.findMany({ where: { commodityId: { in: commodityIds } }, select: { commodityId: true, terminalId: true, scuBuyMax: true, scuSellMax: true, scuBuyAvg: true } }),
        ]);
        const cargoMap = new Map();
        for (const cr of cargoRoutes)
            cargoMap.set(`${cr.commodityId}-${cr.originTerminalId}-${cr.destTerminalId}`, cr);
        const stockMap = new Map();
        for (const t of termMaxRows)
            stockMap.set(`${t.commodityId}-${t.terminalId}`, t);
        const sellByCommodity = {};
        for (const s of sellSnaps) {
            if (!sellByCommodity[s.commodityId])
                sellByCommodity[s.commodityId] = [];
            sellByCommodity[s.commodityId].push(s);
        }
        const routes = [];
        for (const buy of buySnaps) {
            const sells = sellByCommodity[buy.commodityId];
            if (!sells?.length)
                continue;
            for (const sell of sells) {
                if (buy.terminalId === sell.terminalId)
                    continue;
                const buyPrice = buy.priceBuyAvg ?? buy.priceBuy;
                const sellPrice = sell.priceSellAvg ?? sell.priceSell;
                if (!buyPrice || !sellPrice || buyPrice <= 0 || sellPrice <= 0 || sellPrice <= buyPrice)
                    continue;
                if (originSystem && buy.terminal.starSystemName !== originSystem)
                    continue;
                if (destSystem && sell.terminal.starSystemName !== destSystem)
                    continue;
                if (autoLoadType) {
                    const oa = buy.terminal.isAutoLoad, da = sell.terminal.isAutoLoad;
                    if (autoLoadType === 'full' && !(oa && da))
                        continue;
                    if (autoLoadType === 'half' && !((oa && !da) || (!oa && da)))
                        continue;
                    if (autoLoadType === 'manual' && (oa || da))
                        continue;
                }
                if (commodityType) {
                    const oSt = !!buy.terminal.spaceStationName, dSt = !!sell.terminal.spaceStationName;
                    if (commodityType === 'major' && !(oSt && dSt))
                        continue;
                    if (commodityType === 'minor' && (oSt && dSt))
                        continue;
                }
                const profitPerScu = sellPrice - buyPrice;
                const roi = Math.round((profitPerScu / buyPrice) * 1000) / 10;
                const oStock = stockMap.get(`${buy.commodityId}-${buy.terminalId}`);
                const dStock = stockMap.get(`${sell.commodityId}-${sell.terminalId}`);
                const originAvgStock = oStock?.scuBuyAvg ?? 0;
                const loadScu = shipScu > 0 ? Math.min(shipScu, originAvgStock > 0 ? originAvgStock : 1) : 1;
                const sellScu = shipScu > 0 ? Math.min(shipScu, originAvgStock > 0 ? originAvgStock : 1, dStock?.scuSellMax && dStock.scuSellMax > 0 ? dStock.scuSellMax : Infinity) : 1;
                const cargoKey = `${buy.commodityId}-${buy.terminalId}-${sell.terminalId}`;
                const cargo = cargoMap.get(cargoKey);
                routes.push({
                    commodityId: buy.commodityId, commodityName: buy.commodity.name, commodityNameZh: buy.commodity.name, commodityKind: buy.commodity.kind, commodityKindZh: (0, commodity_zh_1.getZhKind)(buy.commodity.kind),
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
                    distanceGm: cargo?.distance ?? null,
                    totalProfit: profitPerScu * sellScu, totalInvestment: buyPrice * loadScu, loadScu, sellScu, shipScu,
                    originStock: buy.scuBuyStock || 0, destStock: sell.scuSellStock || 0,
                    originStockMax: Math.round(oStock?.scuBuyMax ?? 0), destStockMax: Math.round(dStock?.scuSellMax ?? 0),
                    originUpdatedAt: buy.uexModifiedAt ? new Date(buy.uexModifiedAt * 1000).toISOString() : buy.fetchedAt.toISOString(),
                    destUpdatedAt: sell.uexModifiedAt ? new Date(sell.uexModifiedAt * 1000).toISOString() : sell.fetchedAt.toISOString(),
                    isAutoLoadOrigin: buy.terminal.isAutoLoad, isAutoLoadDest: sell.terminal.isAutoLoad,
                    containerSizesOrigin: cargo?.containerSizesOrigin ?? null, containerSizesDest: cargo?.containerSizesDest ?? null, isIllegal: buy.commodity.isIllegal,
                });
            }
        }
        let filtered = routes;
        const maxInv = maxInvestment ? parseFloat(maxInvestment) : 0;
        const maxDist = maxDistance ? parseFloat(maxDistance) : 0;
        if (maxInv > 0)
            filtered = filtered.filter(r => r.totalInvestment <= maxInv);
        if (maxDist > 0)
            filtered = filtered.filter(r => r.distanceGm != null && r.distanceGm <= maxDist);
        const sort = sortBy || 'profit';
        const order = sortOrder === 'asc' ? 1 : -1;
        filtered.sort((a, b) => {
            if (sort === 'profit')
                return (a.totalProfit - b.totalProfit) * order;
            if (sort === 'roi')
                return (a.roi - b.roi) * order;
            return ((a.distanceGm ?? 0) - (b.distanceGm ?? 0)) * order;
        });
        return filtered.slice(0, 50);
    }
};
exports.RoutesController = RoutesController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('commodityId')),
    __param(1, (0, common_1.Query)('shipId')),
    __param(2, (0, common_1.Query)('originSystem')),
    __param(3, (0, common_1.Query)('destSystem')),
    __param(4, (0, common_1.Query)('originLocation')),
    __param(5, (0, common_1.Query)('destLocation')),
    __param(6, (0, common_1.Query)('maxInvestment')),
    __param(7, (0, common_1.Query)('maxDistance')),
    __param(8, (0, common_1.Query)('commodityType')),
    __param(9, (0, common_1.Query)('autoLoadType')),
    __param(10, (0, common_1.Query)('sortBy')),
    __param(11, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], RoutesController.prototype, "findRoutes", null);
exports.RoutesController = RoutesController = __decorate([
    (0, common_1.Controller)('routes'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoutesController);
//# sourceMappingURL=routes.controller.js.map