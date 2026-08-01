import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as generated from '../generated/prisma/client';
const PrismaClient = generated.PrismaClient as any;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly client: any;

  readonly commodity: any;
  readonly terminal: any;
  readonly priceSnapshot: any;
  readonly cargoRoute: any;
  readonly vehicle: any;
  readonly commodityAverage: any;
  readonly terminalCommodityMax: any;
  readonly $transaction: any;

  constructor() {
    const url = process.env.DATABASE_URL || 'file:./dev.db';
    const isPostgres = url.startsWith('postgres');

    if (isPostgres) {
      const { PrismaPg } = require('@prisma/adapter-pg');
      const { Pool } = require('pg');
      const pool = new Pool({ connectionString: url });
      this.client = new PrismaClient({ adapter: new PrismaPg(pool) }) as any;
      this.logger.log('Using PostgreSQL adapter');
    } else {
      const { PrismaLibSql } = require('@prisma/adapter-libsql');
      this.client = new PrismaClient({ adapter: new PrismaLibSql({ url }) }) as any;
      this.logger.log('Using LibSQL/SQLite adapter');
    }

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
