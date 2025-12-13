import type { NextFunction, Request, Response } from "express";
import {
  body,
  param,
  query,
  validationResult,
  type ValidationChain,
} from "express-validator";
import { errorResponse } from "../utils/response";

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorList = errors.array().map((err) => ({
      field: err.type === "field" ? err.path : "unknown",
      message: err.msg,
    }));

    return errorResponse(res, "Validasi gagal", 400, errorList);
  };
};

export const createBookValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Judul wajib diisi")
    .isLength({ min: 2 })
    .withMessage("Judul minimal 2 karakter"),

  body("authorId")
    .trim()
    .notEmpty()
    .withMessage("Author ID wajib diisi")
    .isUUID()
    .withMessage("Author ID harus format UUID"),

  body("description").optional().trim(),

  body("year")
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(`Tahun terbit harus antara 1000-${new Date().getFullYear()}`),

  body("genre").trim().notEmpty().withMessage("Genre wajib diisi"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Harga tidak boleh negatif")
    .custom((value) => value > 0)
    .withMessage("Harga harus lebih dari 0"),

  body("stock").isInt({ min: 0 }).withMessage("Stok tidak boleh negatif"),
];

export const updateBookValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Judul minimal 3 karakter"),

  body("author")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Penulis minimal 2 karakter"),

  body("authorId")
    .optional()
    .isUUID()
    .withMessage("Author ID harus format UUID"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Deskripsi minimal 10 karakter"),

  body("year")
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(`Tahun terbit harus antara 1000-${new Date().getFullYear()}`),

  body("genre")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Genre minimal 2 karakter"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Harga tidak boleh negatif")
    .custom((value) => value > 0)
    .withMessage("Harga harus lebih dari 0"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stok tidak boleh negatif"),
];

export const getBookByIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("ID harus angka positif"),
];

export const searchBooksValidation = [
  query("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Judul maksimal 200 karakter"),

  query("author")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Penulis maksimal 100 karakter"),

  query("genre")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Genre maksimal 50 karakter"),

  query("min_price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Harga minimum tidak boleh negatif"),

  query("max_price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Harga maksimum tidak boleh negatif"),

  query("min_year")
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(`Tahun minimum harus antara 1000-${new Date().getFullYear()}`),

  query("max_year")
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(
      `Tahun maksimum harus antara 1000-${new Date().getFullYear()}`
    ),
];
