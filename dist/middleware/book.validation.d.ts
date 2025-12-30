import type { NextFunction, Request, Response } from "express";
import { type ValidationChain } from "express-validator";
export declare const validate: (validations: ValidationChain[]) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const createBookValidation: ValidationChain[];
export declare const updateBookValidation: ValidationChain[];
export declare const getBookByIdValidation: ValidationChain[];
export declare const searchBooksValidation: ValidationChain[];
//# sourceMappingURL=book.validation.d.ts.map