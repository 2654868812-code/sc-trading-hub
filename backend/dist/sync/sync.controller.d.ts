import { SyncService } from './sync.service';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    fetch(): Promise<{
        status: string;
        message: string;
    }>;
}
