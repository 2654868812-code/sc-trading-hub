import { PrismaService } from '../prisma/prisma.service';
export declare class RoutesController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findRoutes(commodityId?: string, shipId?: string, originSystem?: string, destSystem?: string, originLocation?: string, destLocation?: string, maxInvestment?: string, maxDistance?: string, commodityType?: string, autoLoadType?: string, sortBy?: string, sortOrder?: string, roundTrip?: string, profitMode?: string): Promise<any[] | {
        roundTrip: boolean;
        pairs: any[];
    }>;
}
