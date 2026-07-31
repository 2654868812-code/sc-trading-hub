import { PrismaService } from '../prisma/prisma.service';
export declare class TerminalsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(distinctSystems?: string): Promise<any>;
}
