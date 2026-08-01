import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
export declare class CommoditiesController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private emptyCommodity;
    private DAZONG_THRESHOLD;
    findAll(res: Response): Promise<any>;
    findOne(id: string, res: Response): Promise<any>;
    version(): Promise<{
        gameVersion: null;
    } | {
        gameVersion: string;
    }>;
}
