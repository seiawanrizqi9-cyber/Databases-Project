import { body, param, query } from "express-validator";
export const createCategoryValidation = [
    body("name")
        .notEmpty()
        .withMessage("Nama kategori diperlukan")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Nama kategori minimal 3 karakter"),
];
export const updateCategoryValidation = [
    param("id")
        .notEmpty()
        .withMessage("ID kategori diperlukan")
        .isInt()
        .withMessage("ID kategori harus angka"),
    body("name")
        .notEmpty()
        .withMessage("Nama kategori diperlukan")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Nama kategori minimal 3 karakter"),
];
export const getCategoryByIdValidation = [
    param("id")
        .notEmpty()
        .withMessage("ID kategori diperlukan")
        .isInt()
        .withMessage("ID kategori harus angka"),
];
export const searchCategoriesValidation = [
    query("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Nama pencarian tidak boleh kosong"),
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page harus angka positif"),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit harus antara 1-100"),
];
export const assignBookValidation = [
    body("bookId")
        .notEmpty()
        .withMessage("Book ID diperlukan")
        .isUUID()
        .withMessage("Book ID harus UUID"),
    body("categoryId")
        .notEmpty()
        .withMessage("Category ID diperlukan")
        .isInt()
        .withMessage("Category ID harus angka"),
];
//# sourceMappingURL=category.validation.js.map