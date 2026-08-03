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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const generated = require("../generated/prisma/client");
const PrismaClient = generated.PrismaClient;
let PrismaService = PrismaService_1 = class PrismaService {
    logger = new common_1.Logger(PrismaService_1.name);
    client;
    commodity;
    terminal;
    priceSnapshot;
    cargoRoute;
    vehicle;
    commodityAverage;
    terminalCommodityMax;
    marketIndex;
    $transaction;
    constructor() {
        const url = process.env.DATABASE_URL || 'postgresql://trading:trading@localhost:5432/trading';
        const { PrismaPg } = require('@prisma/adapter-pg');
        const { Pool } = require('pg');
        const pool = new Pool({ connectionString: url });
        this.client = new PrismaClient({ adapter: new PrismaPg(pool) });
        this.logger.log('Using PostgreSQL adapter');
        this.commodity = this.client.commodity;
        this.terminal = this.client.terminal;
        this.priceSnapshot = this.client.priceSnapshot;
        this.cargoRoute = this.client.cargoRoute;
        this.vehicle = this.client.vehicle;
        this.commodityAverage = this.client.commodityAverage;
        this.terminalCommodityMax = this.client.terminalCommodityMax;
        this.marketIndex = this.client.marketIndex;
        this.$transaction = this.client.$transaction.bind(this.client);
    }
    async onModuleInit() { await this.client.$connect(); }
    async onModuleDestroy() { await this.client.$disconnect(); }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map