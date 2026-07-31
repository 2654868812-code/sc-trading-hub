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
let LocationsController = class LocationsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list() {
        const terminals = await this.prisma.terminal.findMany({
            select: { name: true, cityName: true, spaceStationName: true, starSystemName: true, planetName: true, moonName: true },
            orderBy: { name: 'asc' },
        });
        const seen = new Map();
        for (const t of terminals) {
            const key = t.cityName || t.spaceStationName || t.name;
            if (!key || seen.has(key))
                continue;
            seen.set(key, { name: key, system: t.starSystemName || '', planet: t.planetName || t.moonName });
        }
        return [...seen.values()];
    }
    async detail(name) {
        const locationName = decodeURIComponent(name);
        const terminals = await this.prisma.terminal.findMany({
            where: { OR: [{ cityName: locationName }, { spaceStationName: locationName }, { name: locationName }] },
        });
        if (!terminals.length)
            return { error: 'location not found', status: 404 };
        const latest = await this.prisma.priceSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' }, select: { fetchedAt: true } });
        if (!latest)
            return { location: { name: locationName, terminalCount: terminals.length }, terminals: [], commodities: [] };
        const ids = terminals.map(t => t.id);
        const snapshots = await this.prisma.priceSnapshot.findMany({
            where: { terminalId: { in: ids }, fetchedAt: latest.fetchedAt },
            include: { commodity: { select: { id: true, name: true, nameEn: true, code: true, kind: true, isIllegal: true, profitMargin: true } } },
        });
        const termMap = new Map();
        for (const t of terminals)
            termMap.set(t.id, { id: t.id, name: t.name, nameEn: t.nameEn, type: t.type, hasCargoCenter: t.hasCargoCenter, hasDockingPort: t.hasDockingPort, hasFreightElevator: t.hasFreightElevator, isAutoLoad: t.isAutoLoad, buys: [], sells: [] });
        for (const s of snapshots) {
            const term = termMap.get(s.terminalId);
            if (!term)
                continue;
            const item = { id: s.commodityId, name: s.commodity.name, nameEn: s.commodity.nameEn, code: s.commodity.code, kind: s.commodity.kind, isIllegal: s.commodity.isIllegal, profitMargin: s.commodity.profitMargin, priceBuy: s.priceBuy, priceBuyAvg: null, priceBuyMax: null, priceBuyMin: null, scuBuyStock: s.scuBuyStock, priceSell: s.priceSell, priceSellAvg: null, priceSellMax: null, priceSellMin: null, scuSellStock: s.scuSellStock, updatedAt: s.fetchedAt.toISOString() };
            if (s.priceBuy && s.priceBuy > 0)
                term.buys.push(item);
            if (s.priceSell && s.priceSell > 0)
                term.sells.push(item);
        }
        return {
            location: { name: locationName, starSystemName: terminals[0].starSystemName, starSystemNameEn: terminals[0].starSystemNameEn, planetName: terminals[0].planetName, planetNameEn: terminals[0].planetNameEn, moonName: terminals[0].moonName, moonNameEn: terminals[0].moonNameEn, terminalCount: terminals.length },
            terminals: [...termMap.values()],
            gameVersion: null,
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "detail", null);
exports.LocationsController = LocationsController = __decorate([
    (0, common_1.Controller)('locations'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocationsController);
//# sourceMappingURL=locations.controller.js.map