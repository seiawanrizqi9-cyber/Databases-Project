import { Router } from "express";
import { CategoryRepository } from "../repository/category.repository";
import { CategoryService } from "../services/category.service";
import { CategoryController } from "../controllers/category.controller";
import { validate } from "../utils/validation";
import { authenticate, adminOnly } from "../middleware/auth.validation";
import {
  createCategoryValidation,
  updateCategoryValidation,
  getCategoryByIdValidation,
  searchCategoriesValidation,
} from "../middleware/category.validation";
import prismaInstance from "../prisma";

const router = Router();

const repo = new CategoryRepository(prismaInstance);
const service = new CategoryService(repo, prismaInstance);
const controller = new CategoryController(service);

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Manajemen kategori buku
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
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
 * /categories:
 *   get:
 *     summary: Mendapatkan daftar kategori
 *     tags: [Categories]
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
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diambil
 */
router.get("/", controller.list);

/**
 * @swagger
 * /categories/search:
 *   get:
 *     summary: Mencari kategori
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Pencarian berhasil
 */
router.get("/search", validate(searchCategoriesValidation), controller.list);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Mendapatkan kategori berdasarkan ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kategori berhasil diambil
 */
router.get("/:id", validate(getCategoryByIdValidation), controller.getById);

/**
 * @swagger
 * /categories/stats/all:
 *   get:
 *     summary: Mendapatkan statistik kategori
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik berhasil diambil
 */
router.get("/stats/all", controller.getStats);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Membuat kategori baru (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
 */
router.post(
  "/",
  authenticate,
  adminOnly,
  validate(createCategoryValidation),
  controller.create
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Mengupdate kategori (Admin only)
 *     tags: [Categories]
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kategori berhasil diupdate
 */
router.put(
  "/:id",
  authenticate,
  adminOnly,
  validate(updateCategoryValidation),
  controller.update
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Menghapus kategori (Admin only)
 *     tags: [Categories]
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
 *         description: Kategori berhasil dihapus
 */
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  validate(getCategoryByIdValidation),
  controller.delete
);

/**
 * @swagger
 * /categories/assign-book:
 *   post:
 *     summary: Menambahkan buku ke kategori (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - categoryId
 *             properties:
 *               bookId:
 *                 type: string
 *                 format: uuid
 *               categoryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Buku berhasil ditambahkan ke kategori
 */
router.post("/assign-book", authenticate, adminOnly, controller.assignBook);

/**
 * @swagger
 * /categories/unassign-book:
 *   post:
 *     summary: Menghapus buku dari kategori (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - categoryId
 *             properties:
 *               bookId:
 *                 type: string
 *                 format: uuid
 *               categoryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Buku berhasil dihapus dari kategori
 */
router.post("/unassign-book", authenticate, adminOnly, controller.removeBook);

export default router;