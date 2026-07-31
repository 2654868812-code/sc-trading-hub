import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
export declare class CommoditiesController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private emptyCommodity;
    findAll(res: Response): Promise<any>;
    findOne(id: string): Promise<any>;
    version(): Promise<{
        gameVersion: null;
    } | {
        gameVersion: string;
    }>;
}
