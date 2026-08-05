import { Request, Response } from 'express';
export declare class ReportsController {
    private readonly logger;
    get(): any;
    save(body: any, res: Response): Response<any, Record<string, any>>;
    auth(body: {
        password: string;
    }): {
        ok: boolean;
        token: string;
    } | {
        ok: boolean;
        token?: undefined;
    };
    uploadImage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
