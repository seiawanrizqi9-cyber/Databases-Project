import { Router } from "express";
import { createAuthorValidation, updateAuthorValidation, getAuthorByIdValidation, searchAuthorsValidation, } from "../middleware/author.validation.js";
import { authenticate, adminOnly } from "../middleware/auth.validation.js";
import { AuthorRepository } from "../repository/author.repository.js";
import { AuthorService } from "../services/author.service.js";
import { AuthorController } from "../controllers/author.controller.js";
import prismaInstance from "../prisma";
import { validate } from "../utils/validation.js"; // PASTIKAN IMPORT INI ADA
const router = Router();
const repo = new AuthorRepository(prismaInstance);
const service = new AuthorService(repo, prismaInstance); // TAMBAH prismaInstance
const controller = new AuthorController(service);
/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Manajemen author buku
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID author (UUID)
 *         name:
 *           type: string
 *           description: Nama author
 *         biography:
 *           type: string
 *           nullable: true
 *           description: Biografi author
 *         birthDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         deathDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         nationality:
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
 *     AuthorInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "J.K. Rowling"
 *         biography:
 *           type: string
 *           example: "Penulis seri Harry Potter"
 *         birthDate:
 *           type: string
 *           format: date
 *           example: "1965-07-31"
 *         deathDate:
 *           type: string
 *           format: date
 *           example: null
 *         nationality:
 *           type: string
 *           example: "British"
 *     AuthorUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         biography:
 *           type: string
 *         birthDate:
 *           type: string
 *           format: date
 *         deathDate:
 *           type: string
 *           format: date
 *         nationality:
 *           type: string
 */
/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Mendapatkan daftar author dengan pagination
 *     tags: [Authors]
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
 *           enum: [name, createdAt, birthDate]
 *         description: Kolom untuk sorting
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: |
 *           Urutan sorting
 *           Default: asc by name
 *     responses:
 *       200:
 *         description: Daftar author berhasil diambil
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
 *                     $ref: '#/components/schemas/Author'
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
 * /authors/search:
 *   get:
 *     summary: Mencari author dengan filter
 *     tags: [Authors]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nama author
 *       - in: query
 *         name: nationality
 *         schema:
 *           type: string
 *         description: Filter berdasarkan kewarganegaraan
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
 *           enum: [name, createdAt, birthDate]
 *         description: Kolom untuk sorting
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: |
 *           Urutan sorting
 *           Default: asc by name
 *     responses:
 *       200:
 *         description: Hasil pencarian author berhasil diambil
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
 *                     $ref: '#/components/schemas/Author'
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
router.get("/search", validate(searchAuthorsValidation), controller.list);
/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Mendapatkan detail author berdasarkan ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID author
 *     responses:
 *       200:
 *         description: Detail author berhasil diambil
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
 *                   $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author tidak ditemukan
 *       400:
 *         description: ID tidak valid
 */
router.get("/:id", validate(getAuthorByIdValidation), controller.getById);
/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Menambahkan author baru (Admin only)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorInput'
 *     responses:
 *       201:
 *         description: Author berhasil ditambahkan
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
 *                   $ref: '#/components/schemas/Author'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 */
router.post("/", authenticate, adminOnly, validate(createAuthorValidation), controller.create);
/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Mengupdate author berdasarkan ID (Admin only)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID author
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorUpdate'
 *     responses:
 *       200:
 *         description: Author berhasil diupdate
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
 *                   $ref: '#/components/schemas/Author'
 *       400:
 *         description: Data tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Author tidak ditemukan
 */
router.put("/:id", authenticate, adminOnly, validate(updateAuthorValidation), controller.update);
/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Menghapus author berdasarkan ID (soft delete, Admin only)
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID author
 *     responses:
 *       200:
 *         description: Author berhasil dihapus
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
 *                   $ref: '#/components/schemas/Author'
 *       401:
 *         description: Tidak terautentikasi
 *       403:
 *         description: Bukan admin
 *       404:
 *         description: Author tidak ditemukan
 */
router.delete("/:id", authenticate, adminOnly, validate(getAuthorByIdValidation), controller.delete);
/**
 * @swagger
 * /authors/stats/all:
 *   get:
 *     summary: Mendapatkan statistik author
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Statistik author berhasil diambil
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
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                     byNationality:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.get("/stats/all", controller.getStats);
export default router;
//# sourceMappingURL=author.route.js.map
