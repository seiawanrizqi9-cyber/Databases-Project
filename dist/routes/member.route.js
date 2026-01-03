import { Router } from "express";
import { MemberRepository } from "../repository/member.repository.js";
import { MemberService } from "../services/member.service.js";
import { MemberController } from "../controllers/member.controller.js";
import { createMemberValidation, updateMemberValidation, getMemberByIdValidation, searchMembersValidation, } from "../middleware/member.validation.js";
import { validate } from "../utils/validation.js";
import { authenticate, adminOnly } from "../middleware/auth.validation.js";
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
 *           description: ID member (UUID)
 *         name:
 *           type: string
 *           description: Nama member
 *         email:
 *           type: string
 *           format: email
 *           description: Email member (unik)
 *         phone:
 *           type: string
 *           nullable: true
 *         address:
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
 *     MemberWithBorrows:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         borrowRecords:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               borrowDate:
 *                 type: string
 *                 format: date-time
 *               dueDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     quantity:
 *                       type: integer
 *                     book:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                         author:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     MemberInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john@example.com"
 *         phone:
 *           type: string
 *           example: "+628123456789"
 *         address:
 *           type: string
 *           example: "Jl. Contoh No. 123"
 *     MemberUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *     MemberStats:
 *       type: object
 *       properties:
 *         overview:
 *           type: object
 *           properties:
 *             _count:
 *               type: object
 *         byMonth:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               _count:
 *                 type: object
 */
/**
 * @swagger
 * /members:
 *   post:
 *     summary: Registrasi member baru (Public)
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberInput'
 *     responses:
 *       201:
 *         description: Member berhasil didaftarkan
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
 *                   $ref: '#/components/schemas/MemberWithBorrows'
 *       400:
 *         description: Data tidak valid atau email sudah terdaftar
 *     description: |
 *       Public endpoint untuk registrasi member baru.
 *       Email harus unik (tidak boleh duplikat).
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
 *         description: Statistik member berhasil diambil
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
 *                   $ref: '#/components/schemas/MemberStats'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
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
 *           enum: [name, email, createdAt]
 *         description: Kolom untuk sorting
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: | Urutan sorting Default: asc by name
 *     responses:
 *       200:
 *         description: Daftar member berhasil diambil
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
 *                     $ref: '#/components/schemas/MemberWithBorrows'
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
 *       403:
 *         description: Bukan admin
 */
router.get("/", authenticate, adminOnly, controller.list);
/**
 * @swagger
 * /members/search:
 *   get:
 *     summary: Mencari member dengan filter (Admin only)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nama member
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter berdasarkan email
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nomor telepon
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
 *           enum: [name, email, createdAt]
 *         description: Kolom untuk sorting
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Urutan sorting
 *     responses:
 *       200:
 *         description: Hasil pencarian member berhasil diambil
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
 *                     $ref: '#/components/schemas/MemberWithBorrows'
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
 *       403:
 *         description: Bukan admin
 */
router.get("/search", authenticate, adminOnly, validate(searchMembersValidation), controller.list);
/**
 * @swagger
 * /members/{id}:
 *   get:
 *     summary: Mendapatkan detail member berdasarkan ID (Admin only)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID member
 *     responses:
 *       200:
 *         description: Detail member berhasil diambil
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
 *                   $ref: '#/components/schemas/MemberWithBorrows'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Member tidak ditemukan
 */
router.get("/:id", authenticate, adminOnly, validate(getMemberByIdValidation), controller.getById);
/**
 * @swagger
 * /members/{id}:
 *   put:
 *     summary: Mengupdate member berdasarkan ID (Admin only)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID member
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberUpdate'
 *     responses:
 *       200:
 *         description: Member berhasil diupdate
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
 *                   $ref: '#/components/schemas/MemberWithBorrows'
 *       400:
 *         description: Data tidak valid atau email sudah digunakan
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Member tidak ditemukan
 */
router.put("/:id", authenticate, adminOnly, validate(updateMemberValidation), controller.update);
/**
 * @swagger
 * /members/{id}:
 *   delete:
 *     summary: Menghapus member (soft delete, Admin only)
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID member
 *     responses:
 *       200:
 *         description: Member berhasil dihapus
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
 *                   $ref: '#/components/schemas/Member'
 *       400:
 *         description: Member masih memiliki pinjaman aktif
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Member tidak ditemukan
 *     description: |
 *       Soft delete: Tidak bisa menghapus member yang masih memiliki pinjaman aktif (belum dikembalikan).
 */
router.delete("/:id", authenticate, adminOnly, validate(getMemberByIdValidation), controller.delete);
export default router;
//# sourceMappingURL=member.route.js.map
