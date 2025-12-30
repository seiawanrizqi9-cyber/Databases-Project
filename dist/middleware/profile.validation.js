import { body, param, query } from "express-validator";
export const createProfileValidation = [
    body("user_id")
        .notEmpty()
        .withMessage("User ID diperlukan")
        .isInt()
        .withMessage("User ID harus angka"),
    body("name")
        .notEmpty()
        .withMessage("Nama diperlukan")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Nama minimal 2 karakter"),
    body("gender")
        .optional()
        .isIn(["MALE", "FEMALE", "OTHER"])
        .withMessage("Gender harus MALE, FEMALE, atau OTHER"),
    body("address")
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage("Alamat maksimal 255 karakter"),
];
export const updateProfileValidation = [
    param("id")
        .notEmpty()
        .withMessage("ID profile diperlukan")
        .isInt()
        .withMessage("ID profile harus angka"),
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Nama minimal 2 karakter"),
    body("gender")
        .optional()
        .isIn(["MALE", "FEMALE", "OTHER"])
        .withMessage("Gender harus MALE, FEMALE, atau OTHER"),
    body("address")
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage("Alamat maksimal 255 karakter"),
];
export const getProfileByIdValidation = [
    param("id")
        .notEmpty()
        .withMessage("ID profile diperlukan")
        .isInt()
        .withMessage("ID profile harus angka"),
];
export const getProfileByUserIdValidation = [
    param("userId")
        .notEmpty()
        .withMessage("User ID diperlukan")
        .isInt()
        .withMessage("User ID harus angka"),
];
export const searchProfilesValidation = [
    query("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Nama pencarian tidak boleh kosong"),
    query("gender")
        .optional()
        .isIn(["MALE", "FEMALE", "OTHER"])
        .withMessage("Gender harus MALE, FEMALE, atau OTHER"),
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page harus angka positif"),
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit harus antara 1-100"),
];
//# sourceMappingURL=profile.validation.js.map