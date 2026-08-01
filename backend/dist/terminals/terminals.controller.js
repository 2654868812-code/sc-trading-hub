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
exports.TerminalsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
let TerminalsController = class TerminalsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(distinctSystems, type) {
        if (distinctSystems === 'true') {
            const rows = await this.prisma.terminal.findMany({
                where: { starSystemName: { not: null } },
                distinct: ['starSystemName'],
                select: { starSystemName: true },
                orderBy: { starSystemName: 'asc' },
            });
            return rows.map(r => r.starSystemName);
        }
        const where = {};
        if (type)
            where.type = type;
        return this.prisma.terminal.findMany({
            where,
            orderBy: { name: 'asc' },
            select: { id: true, name: true, nameEn: true, starSystemName: true, starSystemNameEn: true, planetName: true, planetNameEn: true, moonName: true, moonNameEn: true, cityName: true, cityNameEn: true, spaceStationName: true, spaceStationNameEn: true, type: true, hasCargoCenter: true, hasDockingPort: true, hasFreightElevator: true, isAutoLoad: true },
        });
    }
};
exports.TerminalsController = TerminalsController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('distinctSystems')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TerminalsController.prototype, "findAll", null);
exports.TerminalsController = TerminalsController = __decorate([
    (0, common_1.Controller)('terminals'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TerminalsController);
//# sourceMappingURL=terminals.controller.js.map