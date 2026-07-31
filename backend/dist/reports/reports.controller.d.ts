import { Request, Response } from 'express';
export declare class ReportsController {
    get(): any;
    save(body: any): {
        ok: boolean;
    };
    auth(body: {
        password: string;
    }): {
        ok: boolean;
    };
    uploadImage(req: Request, res: Response): Promise<void>;
}
