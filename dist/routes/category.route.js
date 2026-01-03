import { Router } from "express";
import { CategoryRepository } from "../repository/category.repository.js";
import { CategoryService } from "../services/category.service.js";
import { CategoryController } from "../controllers/category.controller.js";
import { validate } from "../utils/validation.js";
import { authenticate, adminOnly } from "../middleware/auth.validation.js";
import { createCategoryValidation, updateCategoryValidation, getCategoryByIdValidation, searchCategoriesValidation, } from "../middleware/category.validation.js";
import prismaInstance from "../prisma";
const router = Router();
const repo = new CategoryRepository(prismaInstance);
const service = new CategoryService(repo, prismaInstance);
const controller = new CategoryController(service);
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Manajemen kategori buku perpustakaan
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
 *           description: ID kategori
 *         name:
 *           type: string
 *           description: Nama kategori
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CategoryWithBooks:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         books:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               book:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   author:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Fiction"
 *     CategoryUpdate:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Science Fiction"
 *     CategoryStats:
 *       type: object
 *       properties:
 *         overview:
 *           type: object
 *           properties:
 *             _count:
 *               type: object
 *         byBookCount:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               _count:
 *                 type: object
 *     BookAssignment:
 *       type: object
 *       required:
 *         - bookId
 *         - categoryId
 *       properties:
 *         bookId:
 *           type: string
 *           example: "uuid-book-id"
 *         categoryId:
 *           type: integer
 *           example: 1
 *     BookCategoryRelation:
 *       type: object
 *       properties:
 *         bookId:
 *           type: string
 *         categoryId:
 *           type: integer
 *         book:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             title:
 *               type: string
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 */
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Mendapatkan daftar kategori dengan pagination
 *     tags: [Categories]
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
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt]
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
 *         description: Daftar kategori berhasil diambil
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
 *                     $ref: '#/components/schemas/CategoryWithBooks'
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
 */
router.get("/", controller.list);
/**
 * @swagger
 * /categories/search:
 *   get:
 *     summary: Mencari kategori dengan filter kompleks
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nama kategori
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
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt]
 *         description: Kolom untuk sorting
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Urutan sorting
 *     responses:
 *       200:
 *         description: Hasil pencarian kategori berhasil diambil
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
 *                     $ref: '#/components/schemas/CategoryWithBooks'
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
 */
router.get("/search", validate(searchCategoriesValidation), controller.list);
/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Mendapatkan detail kategori berdasarkan ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori
 *     responses:
 *       200:
 *         description: Detail kategori berhasil diambil
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
 *                   $ref: '#/components/schemas/CategoryWithBooks'
 *       404:
 *         description: Kategori tidak ditemukan
 *       400:
 *         description: ID tidak valid
 */
router.get("/:id", validate(getCategoryByIdValidation), controller.getById);
/**
 * @swagger
 * /categories/stats/all:
 *   get:
 *     summary: Mendapatkan statistik kategori
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Statistik kategori berhasil diambil
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
 *                   $ref: '#/components/schemas/CategoryStats'
 */
router.get("/stats/all", controller.getStats);
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Menambahkan kategori baru (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Kategori berhasil ditambahkan
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
 *                   $ref: '#/components/schemas/CategoryWithBooks'
 *       400:
 *         description: Data tidak valid atau nama kategori sudah ada
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 */
router.post("/", authenticate, adminOnly, validate(createCategoryValidation), controller.create);
/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Mengupdate kategori berdasarkan ID (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryUpdate'
 *     responses:
 *       200:
 *         description: Kategori berhasil diupdate
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
 *                   $ref: '#/components/schemas/CategoryWithBooks'
 *       400:
 *         description: Data tidak valid atau nama kategori sudah digunakan
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.put("/:id", authenticate, adminOnly, validate(updateCategoryValidation), controller.update);
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Menghapus kategori (hard delete, Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID kategori
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
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
 *                   $ref: '#/components/schemas/CategoryWithBooks'
 *       400:
 *         description: Kategori masih memiliki buku
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Kategori tidak ditemukan
 *     description: |
 *       Hard delete (bukan soft delete) - tidak bisa menghapus kategori yang masih memiliki buku
 */
router.delete("/:id", authenticate, adminOnly, validate(getCategoryByIdValidation), controller.delete);
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
 *             $ref: '#/components/schemas/BookAssignment'
 *     responses:
 *       200:
 *         description: Buku berhasil ditambahkan ke kategori
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
 *                   $ref: '#/components/schemas/BookCategoryRelation'
 *       400:
 *         description: Data tidak valid, buku sudah ada di kategori, atau relasi tidak ditemukan
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Buku atau kategori tidak ditemukan
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
 *             $ref: '#/components/schemas/BookAssignment'
 *     responses:
 *       200:
 *         description: Buku berhasil dihapus dari kategori
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
 *                   $ref: '#/components/schemas/BookCategoryRelation'
 *       400:
 *         description: Data tidak valid atau relasi tidak ditemukan
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Relasi buku-kategori tidak ditemukan
 */
router.post("/unassign-book", authenticate, adminOnly, controller.removeBook);
export default router;
//# sourceMappingURL=category.route.js.map
