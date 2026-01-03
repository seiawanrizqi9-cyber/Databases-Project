import type { Request, Response } from "express";
import type { IBorrowService } from "../services/borrow.service.js";
export interface IBorrowController {
    list: (req: Request, res: Response) => Promise<void>;
    getById: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    returnBooks: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    delete: (req: Request, res: Response) => Promise<void>;
    getStats: (req: Request, res: Response) => Promise<void>;
}
export declare class BorrowController implements IBorrowController {
    private borrowService;
    constructor(borrowService: IBorrowService);
    list(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    returnBooks(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    delete(req: Request, res: Response): Promise<void>;
    getStats(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=borrow.controller.d.ts.map
