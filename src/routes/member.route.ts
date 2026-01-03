import { Router } from "express";
import { MemberRepository } from "../repository/member.repository";
import { MemberService } from "../services/member.service";
import { MemberController } from "../controllers/member.controller";
import {
  createMemberValidation,
  updateMemberValidation,
  getMemberByIdValidation,
  searchMembersValidation,
} from "../middleware/member.validation";
import { validate } from "../utils/validation";
import { authenticate, adminOnly } from "../middleware/auth.validation";
import prismaInstance from "../prisma";

const router = Router();

const repo = new MemberRepository(prismaInstance);
const service = new MemberService(repo);
const controller = new MemberController(service);

/**
 * @swagger
 * tags:
 *   name: Members
 *   description: Manajemen member perpustakaan
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /members:
 *   post:
 *     summary: Mendaftarkan member baru
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Member berhasil dibuat
 */
router.post("/", validate(createMemberValidation), controller.create);

/**
 * @swagger
 * /members/stats/all:
 *   get:
 *     summary: Mendapatkan statistik member (Admin only)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik berhasil diambil
 */
router.get("/stats/all", authenticate, adminOnly, controller.getStats);

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Mendapatkan daftar member (Admin only)
 *     tags: [Members]
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
 *         name: email
 *         schema:
 *           type: string
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, email, createdAt]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: Daftar member berhasil diambil
 */
router.get("/", authenticate, adminOnly, controller.list);

/**
 * @swagger
 * /members/search:
 *   get:
 *     summary: Mencari member (Admin only)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pencarian berhasil
 */
router.get(
  "/search",
  authenticate,
  adminOnly,
  validate(searchMembersValidation),
  controller.list
);

/**
 * @swagger
 * /members/{id}:
 *   get:
 *     summary: Mendapatkan member berdasarkan ID (Admin only)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Member berhasil diambil
 */
router.get(
  "/:id",
  authenticate,
  adminOnly,
  validate(getMemberByIdValidation),
  controller.getById
);

/**
 * @swagger
 * /members/{id}:
 *   put:
 *     summary: Mengupdate member (Admin only)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member berhasil diupdate
 */
router.put(
  "/:id",
  authenticate,
  adminOnly,
  validate(updateMemberValidation),
  controller.update
);

/**
 * @swagger
 * /members/{id}:
 *   delete:
 *     summary: Menghapus member (Admin only)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Member berhasil dihapus
 */
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  validate(getMemberByIdValidation),
  controller.delete
);

export default router;