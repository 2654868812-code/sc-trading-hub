import { PrismaService } from '../prisma/prisma.service';
export declare class PricesController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    history(commodityId: string, terminalIds: string, hours: string): Promise<any>;
    locationPrices(locationName: string, hours: string): Promise<any>;
    terminals(commodityId: string): Promise<any>;
}
