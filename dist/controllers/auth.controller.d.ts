import type { Request, Response } from "express";
import type { IAuthService } from "../services/auth.service";
export interface IAuthController {
    login: (req: Request, res: Response) => Promise<void>;
    register: (req: Request, res: Response) => Promise<void>;
}
export declare class AuthController implements IAuthController {
    private authService;
    constructor(authService: IAuthService);
    login(req: Request, res: Response): Promise<void>;
    register(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map