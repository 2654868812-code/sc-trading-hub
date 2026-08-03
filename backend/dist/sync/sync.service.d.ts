import { PrismaService } from '../prisma/prisma.service';
export declare class SyncService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    fullSync(): Promise<void>;
    private syncCommodities;
    private syncTerminals;
    private syncPrices;
    private computeAverages3d;
    private updatePriceChanges;
    private syncCommodityAverages;
    private syncCargoRoutes;
    private syncVehicles;
    private syncTerminalCommodityMax;
    private computeMarketIndex;
    private cleanupOldSnapshots;
}
