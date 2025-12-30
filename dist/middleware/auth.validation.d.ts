import type { Request, Response, NextFunction } from "express";
export declare const loginValidation: import("express-validator").ValidationChain[];
export declare const registerValidation: import("express-validator").ValidationChain[];
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const adminOnly: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const memberOnly: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.validation.d.ts.map