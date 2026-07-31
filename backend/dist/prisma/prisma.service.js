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
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const generated = require("../generated/prisma/client");
const PrismaClient = generated.PrismaClient;
let PrismaService = class PrismaService {
    client;
    commodity;
    terminal;
    priceSnapshot;
    cargoRoute;
    vehicle;
    commodityAverage;
    terminalCommodityMax;
    $transaction;
    constructor() {
        const pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL || 'postgresql://trading:trading@localhost:5432/trading',
        });
        this.client = new PrismaClient({ adapter: new adapter_pg_1.PrismaPg(pool) });
        this.commodity = this.client.commodity;
        this.terminal = this.client.terminal;
        this.priceSnapshot = this.client.priceSnapshot;
        this.cargoRoute = this.client.cargoRoute;
        this.vehicle = this.client.vehicle;
        this.commodityAverage = this.client.commodityAverage;
        this.terminalCommodityMax = this.client.terminalCommodityMax;
        this.$transaction = this.client.$transaction.bind(this.client);
    }
    async onModuleInit() { await this.client.$connect(); }
    async onModuleDestroy() { await this.client.$disconnect(); }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map