import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as generated from '../generated/prisma/client';
const PrismaClient = generated.PrismaClient as any;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client: any;

  // Model delegates — typed as any for now (Prisma v7 generated types are
  // incompatible with NestJS tsc CommonJS build. Runtime delegation works.)
  readonly commodity: any;
  readonly terminal: any;
  readonly priceSnapshot: any;
  readonly cargoRoute: any;
  readonly vehicle: any;
  readonly commodityAverage: any;
  readonly terminalCommodityMax: any;
  readonly $transaction: any;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://trading:trading@localhost:5432/trading',
    });
    this.client = new PrismaClient({ adapter: new PrismaPg(pool) }) as any;
    this.commodity = this.client.commodity;
    this.terminal = this.client.terminal;
    this.priceSnapshot = this.client.priceSnapshot;
    this.cargoRoute = this.client.cargoRoute;
    this.vehicle = this.client.vehicle;
    this.commodityAverage = this.client.commodityAverage;
    this.terminalCommodityMax = this.client.terminalCommodityMax;
    this.$transaction = this.client.$transaction.bind(this.client);
  }

  async onModuleInit()    { await this.client.$connect(); }
  async onModuleDestroy() { await this.client.$disconnect(); }
}
