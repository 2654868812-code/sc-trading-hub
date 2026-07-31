import { PrismaService } from '../prisma/prisma.service';
export declare class CommoditiesController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    version(): Promise<{
        gameVersion: null;
    } | {
        gameVersion: string;
    }>;
}
