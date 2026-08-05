import { Request, Response } from 'express';
export declare class ReportsController {
    private readonly logger;
    get(): any;
    save(body: any, res: Response): Response<any, Record<string, any>>;
    auth(body: {
        password: string;
    }, res: Response): Response<any, Record<string, any>> | undefined;
    serveFile(filename: string, res: Response): Response<any, Record<string, any>> | undefined;
    uploadImage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
