import { body, param, query } from "express-validator";

export const createLoanValidation = [
  body("bookId")
    .trim()
    .notEmpty()
    .withMessage("Book ID wajib diisi")
    .isUUID()
    .withMessage("Book ID harus format UUID"),

  body("memberId")
    .trim()
    .notEmpty()
    .withMessage("Member ID wajib diisi")
    .isUUID()
    .withMessage("Member ID harus format UUID"),

  body("dueDate")
    .isISO8601()
    .withMessage("Due date harus format tanggal valid")
    .custom((value) => {
      const dueDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return dueDate > today;
    })
    .withMessage("Due date harus di masa depan"),
];

export const updateLoanValidation = [
  param("id").isUUID().withMessage("ID harus format UUID"),

  body("bookId")
    .optional()
    .isUUID()
    .withMessage("Book ID harus format UUID"),

  body("memberId")
    .optional()
    .isUUID()
    .withMessage("Member ID harus format UUID"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date harus format tanggal valid"),

  body("status")
    .optional()
    .isIn(["ACTIVE", "RETURNED", "OVERDUE", "CANCELLED"])
    .withMessage("Status tidak valid"),
];

export const getLoanByIdValidation = [
  param("id").isUUID().withMessage("ID harus format UUID"),
];

export const searchLoansValidation = [
  query("bookTitle")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Judul buku maksimal 200 karakter"),

  query("memberEmail")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Email member maksimal 100 karakter"),

  query("status")
    .optional()
    .isIn(["ACTIVE", "RETURNED", "OVERDUE", "CANCELLED"])
    .withMessage("Status tidak valid"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page harus angka positif"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit harus antara 1-100"),
];