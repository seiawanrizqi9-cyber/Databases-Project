import { body, param, query } from "express-validator";

export const createMemberValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email wajib diisi")
    .isEmail()
    .withMessage("Format email tidak valid")
    .normalizeEmail(),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nama wajib diisi")
    .isLength({ min: 2 })
    .withMessage("Nama minimal 2 karakter"),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone("id-ID")
    .withMessage("Nomor telepon tidak valid"),
];

export const updateMemberValidation = [
  param("id").isUUID().withMessage("ID harus format UUID"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Format email tidak valid")
    .normalizeEmail(),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Nama minimal 2 karakter"),

  body("phone")
    .optional()
    .trim()
    .isMobilePhone("id-ID")
    .withMessage("Nomor telepon tidak valid"),
];

export const getMemberByIdValidation = [
  param("id").isUUID().withMessage("ID harus format UUID"),
];

export const searchMembersValidation = [
  query("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Nama maksimal 100 karakter"),

  query("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Format email tidak valid"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page harus angka positif"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit harus antara 1-100"),
];