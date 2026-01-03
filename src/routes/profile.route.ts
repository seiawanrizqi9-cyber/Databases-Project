import { Router } from "express";
import { ProfileRepository } from "../repository/profile.repository";
import { ProfileService } from "../services/profile.service";
import { ProfileController } from "../controllers/profile.controller";
import { validate } from "../utils/validation";
import { authenticate } from "../middleware/auth.validation";
import { upload } from "../middleware/upload.validation";
import {
  createProfileValidation,
  updateProfileValidation,
  getProfileByIdValidation,
  getProfileByUserIdValidation,
} from "../middleware/profile.validation";
import prismaInstance from "../prisma";

const router = Router();

const repo = new ProfileRepository(prismaInstance);
const service = new ProfileService(repo, prismaInstance);
const controller = new ProfileController(service);

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: Manajemen profil pengguna
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         gender:
 *           type: string
 *         address:
 *           type: string
 *         profile_picture_url:
 *           type: string
 *         user_id:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Membuat profil baru
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - name
 *             properties:
 *               user_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *               address:
 *                 type: string
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Profil berhasil dibuat
 */
router.post("/", upload.single('profile_picture'), validate(createProfileValidation), controller.create);

/**
 * @swagger
 * /profiles/stats/all:
 *   get:
 *     summary: Mendapatkan statistik profil
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik berhasil diambil
 */
router.get("/stats/all", authenticate, controller.getStats);

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Mendapatkan daftar profil
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt, gender]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Daftar profil berhasil diambil
 */
router.get("/", authenticate, controller.list);

/**
 * @swagger
 * /profiles/user/{userId}:
 *   get:
 *     summary: Mendapatkan profil berdasarkan User ID
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profil berhasil diambil
 */
router.get("/user/:userId", authenticate, validate(getProfileByUserIdValidation), controller.getByUserId);

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Mendapatkan profil berdasarkan ID
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profil berhasil diambil
 */
router.get("/:id", authenticate, validate(getProfileByIdValidation), controller.getById);

/**
 * @swagger
 * /profiles/{id}:
 *   put:
 *     summary: Mengupdate profil
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER]
 *               address:
 *                 type: string
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profil berhasil diupdate
 */
router.put("/:id", authenticate, upload.single('profile_picture'), validate(updateProfileValidation), controller.update);

/**
 * @swagger
 * /profiles/{id}:
 *   delete:
 *     summary: Menghapus profil
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profil berhasil dihapus
 */
router.delete("/:id", authenticate, validate(getProfileByIdValidation), controller.delete);

export default router;