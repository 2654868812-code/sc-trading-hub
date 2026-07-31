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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
let VehiclesController = class VehiclesController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const { getShipZh } = require('../lib/ship-zh');
        const ships = await this.prisma.vehicle.findMany({ orderBy: { name: 'asc' } });
        return ships.map(v => ({
            id: v.id,
            name: getShipZh(v.name),
            nameEn: v.name,
            scu: v.scu,
            companyName: v.companyName,
            spaceOnly: false,
        }));
    }
};
exports.VehiclesController = VehiclesController;
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "findAll", null);
exports.VehiclesController = VehiclesController = __decorate([
    (0, common_1.Controller)('vehicles'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehiclesController);
//# sourceMappingURL=vehicles.controller.js.map