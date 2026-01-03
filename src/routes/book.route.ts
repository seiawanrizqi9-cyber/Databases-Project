import { Router } from "express";
import { BookRepository } from "../repository/book.repository";
import { BookService } from "../services/book.service";
import { BookController } from "../controllers/book.controller";
import {
  createBookValidation,
  updateBookValidation,
  getBookByIdValidation,
  searchBooksValidation,
  validate,
} from "../middleware/book.validation";
import { authenticate, adminOnly } from "../middleware/auth.validation";
import { upload } from "../middleware/upload.validation";
import prismaInstance from "../prisma";

const router = Router();
const repo = new BookRepository(prismaInstance);
const service = new BookService(repo, prismaInstance);
const controller = new BookController(service);

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Manajemen buku perpustakaan
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         year:
 *           type: integer
 *         genre:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         stock:
 *           type: integer
 *         image_url:
 *           type: string
 *         authorId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Mendapatkan daftar buku
 *     tags: [Books]
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
 *         name: title
 *         schema:
 *           type: string
 *       - in: query
 *         name: authorName
 *         schema:
 *           type: string
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, year, price, createdAt, stock]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Daftar buku berhasil diambil
 */
router.get("/", controller.list);

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Mencari buku
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Pencarian berhasil
 */
router.get("/search", validate(searchBooksValidation), controller.list);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Mendapatkan buku berdasarkan ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Buku berhasil diambil
 */
router.get("/:id", validate(getBookByIdValidation), controller.getById);

/**
 * @swagger
 * /books/stats/all:
 *   get:
 *     summary: Mendapatkan statistik buku
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik berhasil diambil
 */
router.get("/stats/all", controller.getStats);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Membuat buku baru (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - authorId
 *               - year
 *               - genre
 *               - price
 *               - stock
 *             properties:
 *               title:
 *                 type: string
 *               authorId:
 *                 type: string
 *               description:
 *                 type: string
 *               year:
 *                 type: integer
 *               genre:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Buku berhasil dibuat
 */
router.post(
  "/",
  authenticate,
  adminOnly,
  upload.single("image"),
  validate(createBookValidation),
  controller.create
);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Mengupdate buku (Admin only)
 *     tags: [Books]
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
 *               title:
 *                 type: string
 *               authorId:
 *                 type: string
 *               description:
 *                 type: string
 *               year:
 *                 type: integer
 *               genre:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Buku berhasil diupdate
 */
router.put(
  "/:id",
  authenticate,
  adminOnly,
  upload.single("image"),
  validate(updateBookValidation),
  controller.update
);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Menghapus buku (Admin only)
 *     tags: [Books]
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
 *         description: Buku berhasil dihapus
 */
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  validate(getBookByIdValidation),
  controller.delete
);

export default router;