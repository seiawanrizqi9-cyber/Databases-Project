import { Router } from "express";
import { ProfileRepository } from "../repository/profile.repository.js";
import { ProfileService } from "../services/profile.service.js";
import { ProfileController } from "../controllers/profile.controller.js";
import { validate } from "../utils/validation.js";
import { authenticate } from "../middleware/auth.validation.js";
import { upload } from "../middleware/upload.validation.js";
import { createProfileValidation, updateProfileValidation, getProfileByIdValidation, getProfileByUserIdValidation, } from "../middleware/profile.validation.js";
import prismaInstance from "../prisma";
const router = Router();
const repo = new ProfileRepository(prismaInstance);
const service = new ProfileService(repo, prismaInstance);
const controller = new ProfileController(service);
/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: Manajemen profile pengguna
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
 *           description: ID profile
 *         user_id:
 *           type: integer
 *           description: ID user pemilik profile
 *         name:
 *           type: string
 *           description: Nama lengkap
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE]
 *           nullable: true
 *         address:
 *           type: string
 *           nullable: true
 *         profile_picture_url:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     ProfileWithUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         name:
 *           type: string
 *         gender:
 *           type: string
 *         address:
 *           type: string
 *         profile_picture_url:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProfileInput:
 *       type: object
 *       required:
 *         - user_id
 *         - name
 *       properties:
 *         user_id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "John Doe"
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE]
 *           example: "MALE"
 *         address:
 *           type: string
 *           example: "Jl. Contoh No. 123"
 *     ProfileUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE]
 *         address:
 *           type: string
 *     ProfileStats:
 *       type: object
 *       properties:
 *         overview:
 *           type: object
 *           properties:
 *             _count:
 *               type: object
 *         byGender:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               gender:
 *                 type: string
 *               _count:
 *                 type: object
 */
/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Membuat profile baru
 *     tags: [Profiles]
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
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *                 example: "MALE"
 *               address:
 *                 type: string
 *                 example: "Jl. Contoh No. 123"
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *                 description: Foto profil (optional)
 *     responses:
 *       201:
 *         description: Profile berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProfileWithUser'
 *       400:
 *         description: Data tidak valid atau user sudah memiliki profile
 *       404:
 *         description: User tidak ditemukan
 *     description: |
 *       Public endpoint untuk membuat profile.
 *       Setiap user hanya bisa memiliki 1 profile.
 */
router.post("/", upload.single("profile_picture"), validate(createProfileValidation), controller.create);
/**
 * @swagger
 * /profiles/stats/all:
 *   get:
 *     summary: Mendapatkan statistik profile (Auth required)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik profile berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProfileStats'
 *       401:
 *         description: Tidak terautentikasi
 */
router.get("/stats/all", authenticate, controller.getStats);
/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Mendapatkan daftar profile (Auth required)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah item per halaman
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nama
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [MALE, FEMALE]
 *         description: Filter berdasarkan gender
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: Filter berdasarkan alamat
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt, gender]
 *         description: Kolom untuk sorting
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: | Urutan sorting Default: desc by createdAt
 *     responses:
 *       200:
 *         description: Daftar profile berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProfileWithUser'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Tidak terautentikasi
 */
router.get("/", authenticate, controller.list);
/**
 * @swagger
 * /profiles/user/{userId}:
 *   get:
 *     summary: Mendapatkan profile berdasarkan user ID (Auth required)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID user pemilik profile
 *     responses:
 *       200:
 *         description: Profile berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProfileWithUser'
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Profile tidak ditemukan
 */
router.get("/user/:userId", authenticate, validate(getProfileByUserIdValidation), controller.getByUserId);
/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Mendapatkan profile berdasarkan ID (Auth required)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID profile
 *     responses:
 *       200:
 *         description: Profile berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProfileWithUser'
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Profile tidak ditemukan
 */
router.get("/:id", authenticate, validate(getProfileByIdValidation), controller.getById);
/**
 * @swagger
 * /profiles/{id}:
 *   put:
 *     summary: Mengupdate profile (Auth required)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID profile
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Smith"
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *                 example: "MALE"
 *               address:
 *                 type: string
 *                 example: "Jl. Baru No. 456"
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *                 description: Foto profil baru (optional)
 *     responses:
 *       200:
 *         description: Profile berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProfileWithUser'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Profile tidak ditemukan
 */
router.put("/:id", authenticate, upload.single("profile_picture"), validate(updateProfileValidation), controller.update);
/**
 * @swagger
 * /profiles/{id}:
 *   delete:
 *     summary: Menghapus profile (soft delete, Auth required)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID profile
 *     responses:
 *       200:
 *         description: Profile berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Profile tidak ditemukan
 *     description: |
 *       Soft delete: Menggunakan deletedAt timestamp.
 *       Tidak ada constraint khusus untuk delete profile.
 */
router.delete("/:id", authenticate, validate(getProfileByIdValidation), controller.delete);
export default router;
//# sourceMappingURL=profile.route.js.map
