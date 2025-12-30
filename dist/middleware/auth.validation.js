import jwt from "jsonwebtoken";
import config from "../utils/env";
import { errorResponse } from "../utils/response";
import { body } from "express-validator";
export const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Email tidak valid")
        .notEmpty()
        .withMessage("Email diperlukan"),
    body("password")
        .notEmpty()
        .withMessage("Password diperlukan")
        .isLength({ min: 6 })
        .withMessage("Password minimal 6 karakter"),
];
export const registerValidation = [
    body("name")
        .notEmpty()
        .withMessage("Nama diperlukan")
        .trim()
        .escape(),
    body("email")
        .isEmail()
        .withMessage("Email tidak valid")
        .notEmpty()
        .withMessage("Email diperlukan"),
    body("password")
        .notEmpty()
        .withMessage("Password diperlukan")
        .isLength({ min: 6 })
        .withMessage("Password minimal 6 karakter"),
    body("role")
        .optional()
        .isIn(["USER", "ADMIN"])
        .withMessage("Role harus USER atau ADMIN"),
];
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, "Token tidak ditemukan", 401);
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, config.JWT_SECRET);
        req.user = {
            id: payload.id,
            email: payload.email,
            role: payload.role
        };
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            errorResponse(res, "Token tidak valid", 401);
        }
        else if (error.name === 'TokenExpiredError') {
            errorResponse(res, "Token telah kadaluarsa", 401);
        }
        else {
            errorResponse(res, "Autentikasi gagal", 401);
        }
    }
};
export const adminOnly = (req, res, next) => {
    if (!req.user) {
        return errorResponse(res, "Unauthorized", 401);
    }
    if (req.user.role !== 'ADMIN') {
        return errorResponse(res, "Akses ditolak. Hanya admin yang diperbolehkan.", 403);
    }
    next();
};
export const memberOnly = (req, res, next) => {
    if (!req.user) {
        return errorResponse(res, "Unauthorized", 401);
    }
    if (req.user.role !== 'USER') {
        return errorResponse(res, "Akses ditolak. Hanya member yang diperbolehkan.", 403);
    }
    next();
};
//# sourceMappingURL=auth.validation.js.map