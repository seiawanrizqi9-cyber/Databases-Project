import { body, param, query } from "express-validator";

export const createBorrowValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Minimal pinjam 1 buku")
    .custom((items) => {
      if (!Array.isArray(items)) return false;
      
      return items.every((item: any) => {
        return item.bookId && typeof item.bookId === 'string' && 
               item.quantity && typeof item.quantity === 'number' && 
               item.quantity > 0;
      });
    })
    .withMessage("Format items tidak valid. Setiap item harus memiliki bookId (string) dan quantity (number > 0)"),
  
  body("dueDate")
    .notEmpty()
    .withMessage("Tanggal jatuh tempo diperlukan")
    .isISO8601()
    .withMessage("Format tanggal tidak valid (gunakan ISO 8601)")
    .custom((value) => {
      const dueDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return dueDate > today;
    })
    .withMessage("Tanggal jatuh tempo harus lebih besar dari hari ini"),
];

export const returnBorrowValidation = [
  body("borrowRecordId")
    .notEmpty()
    .withMessage("ID peminjaman diperlukan")
    .isUUID()
    .withMessage("ID peminjaman harus UUID"),
  
  body("returnItems")
    .isArray({ min: 1 })
    .withMessage("Minimal kembalikan 1 buku")
    .custom((items) => {
      if (!Array.isArray(items)) return false;
      
      return items.every((item: any) => {
        return item.borrowItemId && typeof item.borrowItemId === 'string' &&
               item.quantity && typeof item.quantity === 'number' && 
               item.quantity > 0;
      });
    })
    .withMessage("Format returnItems tidak valid"),
];

export const getBorrowByIdValidation = [
  param("id")
    .notEmpty()
    .withMessage("ID peminjaman diperlukan")
    .isUUID()
    .withMessage("ID peminjaman harus UUID"),
];

export const searchBorrowsValidation = [
  query("memberEmail")
    .optional()
    .isEmail()
    .withMessage("Email member tidak valid"),
  
  query("bookTitle")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Judul buku tidak boleh kosong"),
  
  query("status")
    .optional()
    .isIn(["ACTIVE", "RETURNED", "OVERDUE", "CANCELLED"])
    .withMessage("Status harus ACTIVE, RETURNED, OVERDUE, atau CANCELLED"),
  
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page harus angka positif"),
  
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit harus antara 1-100"),
];