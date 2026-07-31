import { PrismaService } from '../prisma/prisma.service';
export declare class VehiclesController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
}
