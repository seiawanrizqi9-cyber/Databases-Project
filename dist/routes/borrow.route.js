import { Router } from "express";
import { BorrowRecordRepository } from "../repository/borrowRecord.repository.js";
import { BorrowService } from "../services/borrow.service.js";
import { BorrowController } from "../controllers/borrow.controller.js";
import { validate } from "../utils/validation.js";
import { createBorrowValidation, returnBorrowValidation, getBorrowByIdValidation, searchBorrowsValidation, } from "../middleware/borrow.validation.js";
import { authenticate, memberOnly, adminOnly, } from "../middleware/auth.validation.js";
import prismaInstance from "../prisma";
const router = Router();
const borrowRecordRepo = new BorrowRecordRepository(prismaInstance);
const service = new BorrowService(borrowRecordRepo, prismaInstance);
const controller = new BorrowController(service);
/**
 * @swagger
 * tags:
 *   name: Borrows
 *   description: Manajemen peminjaman buku perpustakaan
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     BorrowItem:
 *       type: object
 *       required:
 *         - bookId
 *         - quantity
 *       properties:
 *         bookId:
 *           type: string
 *           example: "uuid-book-id"
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *     ReturnItem:
 *       type: object
 *       required:
 *         - borrowItemId
 *         - quantity
 *       properties:
 *         borrowItemId:
 *           type: string
 *           example: "uuid-borrow-item-id"
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *     BorrowRequest:
 *       type: object
 *       required:
 *         - items
 *         - dueDate
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BorrowItem'
 *         dueDate:
 *           type: string
 *           format: date
 *           example: "2024-12-31"
 *     ReturnRequest:
 *       type: object
 *       required:
 *         - borrowRecordId
 *         - returnItems
 *       properties:
 *         borrowRecordId:
 *           type: string
 *           example: "uuid-borrow-record-id"
 *         returnItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReturnItem'
 *     BorrowRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID peminjaman
 *         memberId:
 *           type: string
 *           description: ID member
 *         borrowDate:
 *           type: string
 *           format: date-time
 *         dueDate:
 *           type: string
 *           format: date
 *         returnDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [ACTIVE, RETURNED, OVERDUE]
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
 *     BorrowRecordWithDetails:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         memberId:
 *           type: string
 *         borrowDate:
 *           type: string
 *           format: date-time
 *         dueDate:
 *           type: string
 *           format: date
 *         returnDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         status:
 *           type: string
 *         member:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               bookId:
 *                 type: string
 *               quantity:
 *                 type: integer
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
 *     BorrowStats:
 *       type: object
 *       properties:
 *         overview:
 *           type: object
 *           properties:
 *             _count:
 *               type: object
 *         byStatus:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               _count:
 *                 type: object
 */
/**
 * @swagger
 * /borrows:
 *   post:
 *     summary: Membuat peminjaman baru (Member only)
 *     tags: [Borrows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BorrowRequest'
 *     responses:
 *       201:
 *         description: Peminjaman berhasil dibuat
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
 *                   $ref: '#/components/schemas/BorrowRecordWithDetails'
 *       400:
 *         description: Data tidak valid, stok tidak cukup, atau bukan member
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan member atau tidak memiliki akses
 *       404:
 *         description: Buku atau member tidak ditemukan
 *     description: |
 *       - Member ID diambil otomatis dari email user yang login
 *       - Stok buku akan otomatis berkurang
 *       - Status default: ACTIVE
 */
router.post("/", authenticate, memberOnly, validate(createBorrowValidation), controller.create);
/**
 * @swagger
 * /borrows/stats/all:
 *   get:
 *     summary: Mendapatkan statistik peminjaman (Admin only)
 *     tags: [Borrows]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik peminjaman berhasil diambil
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
 *                   $ref: '#/components/schemas/BorrowStats'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 */
router.get("/stats/all", authenticate, adminOnly, controller.getStats);
/**
 * @swagger
 * /borrows/return:
 *   post:
 *     summary: Mengembalikan buku (Member only)
 *     tags: [Borrows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReturnRequest'
 *     responses:
 *       200:
 *         description: Buku berhasil dikembalikan
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
 *                   $ref: '#/components/schemas/BorrowRecordWithDetails'
 *       400:
 *         description: Data tidak valid atau jumlah pengembalian melebihi peminjaman
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan member atau tidak memiliki akses
 *       404:
 *         description: Peminjaman atau item tidak ditemukan
 *     description: |
 *       - Stok buku akan otomatis bertambah
 *       - Jika semua buku dikembalikan, status berubah menjadi RETURNED
 *       - Jika sebagian, status tetap ACTIVE
 */
router.post("/return", authenticate, validate(returnBorrowValidation), controller.returnBooks);
/**
 * @swagger
 * /borrows:
 *   get:
 *     summary: Mendapatkan daftar peminjaman dengan filter
 *     tags: [Borrows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: memberEmail
 *         schema:
 *           type: string
 *         description: Filter berdasarkan email member
 *       - in: query
 *         name: bookTitle
 *         schema:
 *           type: string
 *         description: Filter berdasarkan judul buku
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, RETURNED, OVERDUE]
 *         description: Filter berdasarkan status
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
 *           enum: [borrowDate, dueDate, status, createdAt]
 *         description: Kolom untuk sorting
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: |
  Urutan sorting
  Default: desc by borrowDate
 *     responses:
 *       200:
 *         description: Daftar peminjaman berhasil diambil
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
 *                     $ref: '#/components/schemas/BorrowRecordWithDetails'
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
 *     description: |
 *       Admin: Melihat semua peminjaman
 *       Member: Hanya melihat peminjaman milik sendiri
 */
router.get("/", authenticate, validate(searchBorrowsValidation), controller.list);
/**
 * @swagger
 * /borrows/{id}:
 *   get:
 *     summary: Mendapatkan detail peminjaman berdasarkan ID
 *     tags: [Borrows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID peminjaman
 *     responses:
 *       200:
 *         description: Detail peminjaman berhasil diambil
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
 *                   $ref: '#/components/schemas/BorrowRecordWithDetails'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Tidak memiliki akses
 *       404:
 *         description: Peminjaman tidak ditemukan
 *     description: |
 *       Admin: Bisa melihat semua detail peminjaman
 *       Member: Hanya bisa melihat detail peminjaman milik sendiri
 */
router.get("/:id", authenticate, validate(getBorrowByIdValidation), controller.getById);
/**
 * @swagger
 * /borrows/{id}:
 *   put:
 *     summary: Mengupdate peminjaman (Admin only)
 *     tags: [Borrows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID peminjaman
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dueDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, RETURNED, OVERDUE]
 *     responses:
 *       200:
 *         description: Peminjaman berhasil diupdate
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
 *                   $ref: '#/components/schemas/BorrowRecordWithDetails'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Peminjaman tidak ditemukan
 */
router.put("/:id", authenticate, adminOnly, validate(getBorrowByIdValidation), controller.update);
/**
 * @swagger
 * /borrows/{id}:
 *   delete:
 *     summary: Menghapus peminjaman (soft delete, Admin only)
 *     tags: [Borrows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID peminjaman
 *     responses:
 *       200:
 *         description: Peminjaman berhasil dihapus
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
 *                   $ref: '#/components/schemas/BorrowRecord'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Peminjaman tidak ditemukan
 */
router.delete("/:id", authenticate, adminOnly, validate(getBorrowByIdValidation), controller.delete);
export default router;
//# sourceMappingURL=borrow.route.js.map
