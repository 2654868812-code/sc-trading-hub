import { PrismaService } from '../prisma/prisma.service';
export declare class SyncService {
    private readonly prisma;
    private readonly logger;
    private spaceStationMeta;
    constructor(prisma: PrismaService);
    fullSync(): Promise<void>;
    syncMetadata(): Promise<void>;
    syncCommoditiesOnly(): Promise<void>;
    syncPricesData(): Promise<void>;
    syncComputations(): Promise<void>;
    private syncSpaceStations;
    private syncCommodities;
    private determineLocationType;
    private determineAutoLoad;
    private syncTerminals;
    private syncVehicles;
    private syncTerminalDistances;
    private syncPrices;
    private computeAverages24h;
    private updatePriceChanges;
    private syncCommodityAverages;
    private syncCargoRoutes;
    private syncTerminalCommodityMax;
    private computeMarketIndex;
    private cleanupOldSnapshots;
}
