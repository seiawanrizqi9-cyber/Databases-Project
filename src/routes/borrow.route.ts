import { Router } from "express";
import { BorrowRecordRepository } from "../repository/borrowRecord.repository";
import { BorrowService } from "../services/borrow.service";
import { BorrowController } from "../controllers/borrow.controller";
import { validate } from "../utils/validation";
import {
  createBorrowValidation,
  returnBorrowValidation,
  getBorrowByIdValidation,
  searchBorrowsValidation,
} from "../middleware/borrow.validation";
import {
  authenticate,
  memberOnly,
  adminOnly,
} from "../middleware/auth.validation";
import prismaInstance from "../prisma";

const router = Router();

const borrowRecordRepo = new BorrowRecordRepository(prismaInstance);
const service = new BorrowService(borrowRecordRepo, prismaInstance);
const controller = new BorrowController(service);

/**
 * @swagger
 * tags:
 *   name: Borrow
 *   description: Manajemen peminjaman dan pengembalian buku
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BorrowRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         memberId:
 *           type: string
 *           format: uuid
 *         borrowDate:
 *           type: string
 *           format: date-time
 *         dueDate:
 *           type: string
 *           format: date-time
 *         returnDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [ACTIVE, RETURNED, OVERDUE, CANCELLED]
 *     
 *     BorrowItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         bookId:
 *           type: string
 *           format: uuid
 *         quantity:
 *           type: integer
 *     
 *     CreateBorrowRequest:
 *       type: object
 *       required:
 *         - items
 *         - dueDate
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - bookId
 *               - quantity
 *             properties:
 *               bookId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *         dueDate:
 *           type: string
 *           format: date-time
 *     
 *     ReturnBorrowRequest:
 *       type: object
 *       required:
 *         - borrowRecordId
 *         - returnItems
 *       properties:
 *         borrowRecordId:
 *           type: string
 *           format: uuid
 *         returnItems:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - borrowItemId
 *               - quantity
 *             properties:
 *               borrowItemId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 */

/**
 * @swagger
 * /borrow:
 *   post:
 *     summary: Membuat peminjaman buku baru (Member only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBorrowRequest'
 *     responses:
 *       201:
 *         description: Peminjaman berhasil dibuat
 *       400:
 *         description: Data peminjaman tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Hanya member yang diperbolehkan
 *       404:
 *         description: Buku atau member tidak ditemukan
 */
router.post(
  "/",
  authenticate,
  memberOnly,
  validate(createBorrowValidation),
  controller.create
);

/**
 * @swagger
 * /borrow/stats/all:
 *   get:
 *     summary: Mendapatkan statistik peminjaman (Admin only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik berhasil diambil
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Hanya admin yang diperbolehkan
 */
router.get("/stats/all", authenticate, adminOnly, controller.getStats);

/**
 * @swagger
 * /borrow/return:
 *   post:
 *     summary: Mengembalikan buku yang dipinjam
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReturnBorrowRequest'
 *     responses:
 *       200:
 *         description: Buku berhasil dikembalikan
 *       400:
 *         description: Data pengembalian tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Peminjaman tidak ditemukan
 */
router.post(
  "/return",
  authenticate,
  validate(returnBorrowValidation),
  controller.returnBooks
);

/**
 * @swagger
 * /borrow:
 *   get:
 *     summary: Mendapatkan daftar peminjaman
 *     tags: [Borrow]
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
 *         name: memberEmail
 *         schema:
 *           type: string
 *       - in: query
 *         name: bookTitle
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, RETURNED, OVERDUE, CANCELLED]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [borrowDate, dueDate, status]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Daftar peminjaman berhasil diambil
 *       401:
 *         description: Tidak terautentikasi
 */
router.get(
  "/",
  authenticate,
  validate(searchBorrowsValidation),
  controller.list
);

/**
 * @swagger
 * /borrow/{id}:
 *   get:
 *     summary: Mendapatkan detail peminjaman berdasarkan ID
 *     tags: [Borrow]
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
 *         description: Detail peminjaman berhasil diambil
 *       400:
 *         description: ID tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Peminjaman tidak ditemukan
 */
router.get(
  "/:id",
  authenticate,
  validate(getBorrowByIdValidation),
  controller.getById
);

/**
 * @swagger
 * /borrow/{id}:
 *   put:
 *     summary: Mengupdate peminjaman (Admin only)
 *     tags: [Borrow]
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
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, RETURNED, OVERDUE, CANCELLED]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Peminjaman berhasil diupdate
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Hanya admin yang diperbolehkan
 *       404:
 *         description: Peminjaman tidak ditemukan
 */
router.put(
  "/:id",
  authenticate,
  adminOnly,
  validate(getBorrowByIdValidation),
  controller.update
);

/**
 * @swagger
 * /borrow/{id}:
 *   delete:
 *     summary: Menghapus peminjaman (Admin only)
 *     tags: [Borrow]
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
 *         description: Peminjaman berhasil dihapus
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Hanya admin yang diperbolehkan
 *       404:
 *         description: Peminjaman tidak ditemukan
 */
router.delete(
  "/:id",
  authenticate,
  adminOnly,
  validate(getBorrowByIdValidation),
  controller.delete
);

export default router;