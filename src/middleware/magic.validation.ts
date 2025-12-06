import type { NextFunction, Request, Response } from "express";
import { body, param, validationResult, type ValidationChain } from "express-validator";
import { errorResponse } from "../utils/response";

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorList = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : 'unknown',
      message: err.msg
    }));

    return errorResponse(res, "Validasi gagal", 400, errorList);
  };
};

// 1. Request Magic Link validation
export const requestMagicLinkValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid')
    .normalizeEmail(),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Nama minimal 2 karakter')
    .isLength({ max: 50 }).withMessage('Nama maksimal 50 karakter')
];

// 2. Verify Token validation
export const verifyTokenValidation = [
  body('token')
    .trim()
    .notEmpty().withMessage('Token wajib diisi')
    .isLength({ min: 10 }).withMessage('Token minimal 10 karakter')
];

// 3. Update Profile validation
export const updateProfileValidation = [
  param('email')
    .trim()
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Nama minimal 2 karakter')
    .isLength({ max: 50 }).withMessage('Nama maksimal 50 karakter')
];

// 4. Get Profile validation
export const getProfileValidation = [
  param('email')
    .trim()
    .notEmpty().withMessage('Email wajib diisi')
    .isEmail().withMessage('Format email tidak valid')
];