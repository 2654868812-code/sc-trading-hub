import { SyncService } from './sync.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class SyncController {
    private readonly syncService;
    private readonly prisma;
    constructor(syncService: SyncService, prisma: PrismaService);
    fetch(): Promise<{
        status: string;
        message: string;
    }>;
    metaSync(): Promise<{
        status: string;
        message: string;
    }>;
    freshness(): Promise<{
        latestFetchedAt: any;
    }>;
}
