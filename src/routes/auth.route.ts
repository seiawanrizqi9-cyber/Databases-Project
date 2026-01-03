import { Router } from "express";
import { AuthRepository } from "../repository/auth.repository";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../utils/validation";
import { 
  loginValidation, 
  registerValidation 
} from "../middleware/auth.validation";
import prismaInstance from "../prisma";

const router = Router();

const repo = new AuthRepository(prismaInstance);
const service = new AuthService(repo, prismaInstance); // TAMBAH prismaInstance
const controller = new AuthController(service);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autentikasi dan registrasi pengguna
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil
 *       400:
 *         description: Data login tidak valid
 *       401:
 *         description: Email atau password salah
 */
router.post("/login", validate(loginValidation), controller.login.bind(controller));

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrasi pengguna baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Data registrasi tidak valid
 *       409:
 *         description: Email sudah terdaftar
 */
router.post("/register", validate(registerValidation), controller.register.bind(controller));

export default router;