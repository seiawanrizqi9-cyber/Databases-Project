import { Router } from "express";
import { BookRepository } from "../repository/book.repository";
import { BookService } from "../services/book.service";
import { BookController } from "../controllers/book.controller";
import { createBookValidation, updateBookValidation, getBookByIdValidation, searchBooksValidation, validate } from "../middleware/book.validation";
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
 *           description: ID buku (UUID)
 *         title:
 *           type: string
 *           description: Judul buku
 *         description:
 *           type: string
 *           nullable: true
 *         year:
 *           type: integer
 *           description: Tahun terbit
 *         genre:
 *           type: string
 *           description: Genre buku
 *         price:
 *           type: number
 *           format: float
 *           description: Harga buku
 *         stock:
 *           type: integer
 *           description: Stok buku
 *         image_url:
 *           type: string
 *           nullable: true
 *         authorId:
 *           type: string
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
 *     BookWithAuthor:
 *       type: object
 *       properties:
 *         id:
 *           type: string
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
 *         stock:
 *           type: integer
 *         image_url:
 *           type: string
 *         author:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             bio:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     BookInput:
 *       type: object
 *       required:
 *         - title
 *         - authorId
 *         - year
 *         - genre
 *         - price
 *         - stock
 *       properties:
 *         title:
 *           type: string
 *           example: "The Great Gatsby"
 *         authorId:
 *           type: string
 *           example: "uuid-author-id"
 *         description:
 *           type: string
 *           example: "A classic novel about the American Dream"
 *         year:
 *           type: integer
 *           example: 1925
 *         genre:
 *           type: string
 *           example: "Fiction"
 *         price:
 *           type: number
 *           format: float
 *           example: 25.99
 *         stock:
 *           type: integer
 *           example: 50
 *     BookUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         authorId:
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
 *     BookStats:
 *       type: object
 *       properties:
 *         overview:
 *           type: object
 *           properties:
 *             _count:
 *               type: object
 *             _avg:
 *               type: object
 *             _sum:
 *               type: object
 *             _min:
 *               type: object
 *             _max:
 *               type: object
 *         byGenre:
 *           type: array
 *           items:
 *             type: object
 */
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Mendapatkan daftar buku dengan pagination
 *     tags: [Books]
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
 *           enum: [title, year, price, createdAt, stock]
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
 *         description: Daftar buku berhasil diambil
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
 *                     $ref: '#/components/schemas/BookWithAuthor'
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
router.get('/', controller.list);
/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Mencari buku dengan filter kompleks
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter berdasarkan judul
 *       - in: query
 *         name: authorName
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nama author
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter berdasarkan genre
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Harga minimum
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Harga maksimum
 *       - in: query
 *         name: minYear
 *         schema:
 *           type: integer
 *         description: Tahun minimum
 *       - in: query
 *         name: maxYear
 *         schema:
 *           type: integer
 *         description: Tahun maksimum
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
 *           enum: [title, year, price, createdAt, stock]
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
 *         description: Hasil pencarian buku berhasil diambil
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
 *                     $ref: '#/components/schemas/BookWithAuthor'
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
router.get('/search', validate(searchBooksValidation), controller.list);
/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Mendapatkan detail buku berdasarkan ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID buku
 *     responses:
 *       200:
 *         description: Detail buku berhasil diambil
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
 *                   $ref: '#/components/schemas/BookWithAuthor'
 *       404:
 *         description: Buku tidak ditemukan
 *       400:
 *         description: ID tidak valid
 */
router.get('/:id', validate(getBookByIdValidation), controller.getById);
/**
 * @swagger
 * /books/stats/all:
 *   get:
 *     summary: Mendapatkan statistik buku
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Statistik buku berhasil diambil
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
 *                   $ref: '#/components/schemas/BookStats'
 */
router.get('/stats/all', controller.getStats);
/**
 * @swagger
 * /books:
 *   post:
 *     summary: Menambahkan buku baru (Admin only)
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
 *                 format: float
 *               stock:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Gambar cover buku
 *     responses:
 *       201:
 *         description: Buku berhasil ditambahkan
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
 *                   $ref: '#/components/schemas/BookWithAuthor'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Author tidak ditemukan
 */
router.post('/', authenticate, adminOnly, upload.single('image'), validate(createBookValidation), controller.create);
/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Mengupdate buku berdasarkan ID (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID buku
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
 *                 format: float
 *               stock:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Gambar cover buku baru (optional)
 *     responses:
 *       200:
 *         description: Buku berhasil diupdate
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
 *                   $ref: '#/components/schemas/BookWithAuthor'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Buku atau author tidak ditemukan
 */
router.put('/:id', authenticate, adminOnly, upload.single('image'), validate(updateBookValidation), controller.update);
/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Menghapus buku berdasarkan ID (soft delete, Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID buku
 *     responses:
 *       200:
 *         description: Buku berhasil dihapus
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
 *                   $ref: '#/components/schemas/Book'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Buku tidak ditemukan
 */
router.delete('/:id', authenticate, adminOnly, validate(getBookByIdValidation), controller.delete);
export default router;
//# sourceMappingURL=book.route.js.map