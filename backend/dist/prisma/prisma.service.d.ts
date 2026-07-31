import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
export declare class PrismaService implements OnModuleInit, OnModuleDestroy {
    private readonly client;
    readonly commodity: any;
    readonly terminal: any;
    readonly priceSnapshot: any;
    readonly cargoRoute: any;
    readonly vehicle: any;
    readonly commodityAverage: any;
    readonly terminalCommodityMax: any;
    readonly $transaction: any;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
