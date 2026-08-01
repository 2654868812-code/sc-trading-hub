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
exports.SyncController = void 0;
const common_1 = require("@nestjs/common");
const cron_auth_guard_1 = require("../common/guards/cron-auth.guard");
const public_decorator_1 = require("../common/decorators/public.decorator");
const sync_service_1 = require("./sync.service");
const prisma_service_1 = require("../prisma/prisma.service");
let SyncController = class SyncController {
    syncService;
    prisma;
    constructor(syncService, prisma) {
        this.syncService = syncService;
        this.prisma = prisma;
    }
    async fetch() {
        await this.syncService.fullSync();
        return { status: 'ok', message: 'Sync completed' };
    }
    async freshness() {
        const latest = await this.prisma.priceSnapshot.findFirst({
            orderBy: { fetchedAt: 'desc' },
            select: { fetchedAt: true },
        });
        return { latestFetchedAt: latest?.fetchedAt?.toISOString() ?? null };
    }
};
exports.SyncController = SyncController;
__decorate([
    (0, common_1.Get)('cron/fetch'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(cron_auth_guard_1.CronAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "fetch", null);
__decorate([
    (0, common_1.Get)('data-freshness'),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "freshness", null);
exports.SyncController = SyncController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [sync_service_1.SyncService,
        prisma_service_1.PrismaService])
], SyncController);
//# sourceMappingURL=sync.controller.js.map