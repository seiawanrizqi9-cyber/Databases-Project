import { body, param, query } from "express-validator";
export const createAuthorValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Nama author wajib diisi")
        .isLength({ min: 2 })
        .withMessage("Nama author minimal 2 karakter"),
    body("bio")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Bio maksimal 500 karakter"),
    body("nationality")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Kebangsaan maksimal 50 karakter"),
];
export const updateAuthorValidation = [
    param("id").isUUID().withMessage("ID harus format UUID"),
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Nama author minimal 2 karakter"),
    body("bio")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Bio maksimal 500 karakter"),
    body("nationality")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Kebangsaan maksimal 50 karakter"),
];
export const getAuthorByIdValidation = [
    param("id").isUUID().withMessage("ID harus format UUID"),
];
export const searchAuthorsValidation = [
    query("name")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Nama maksimal 100 karakter"),
    query("nationality")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Kebangsaan maksimal 50 karakter"),
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page harus angka positif"),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit harus antara 1-100"),
];
//# sourceMappingURL=author.validation.js.map