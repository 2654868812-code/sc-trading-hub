import { PrismaService } from '../prisma/prisma.service';
export declare class LocationsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(): Promise<any[]>;
    detail(name: string): Promise<{
        error: string;
        status: number;
        location?: undefined;
        terminals?: undefined;
        commodities?: undefined;
        gameVersion?: undefined;
    } | {
        location: {
            name: string;
            terminalCount: any;
            starSystemName?: undefined;
            starSystemNameEn?: undefined;
            planetName?: undefined;
            planetNameEn?: undefined;
            moonName?: undefined;
            moonNameEn?: undefined;
        };
        terminals: never[];
        commodities: never[];
        error?: undefined;
        status?: undefined;
        gameVersion?: undefined;
    } | {
        location: {
            name: string;
            starSystemName: any;
            starSystemNameEn: any;
            planetName: any;
            planetNameEn: any;
            moonName: any;
            moonNameEn: any;
            terminalCount: any;
        };
        terminals: any[];
        gameVersion: null;
        error?: undefined;
        status?: undefined;
        commodities?: undefined;
    }>;
}
