import { Router } from "express";
import { 
  createAuthorValidation, 
  updateAuthorValidation, 
  getAuthorByIdValidation,
  searchAuthorsValidation,
} from "../middleware/author.validation";
import { authenticate, adminOnly } from "../middleware/auth.validation";
import { AuthorRepository } from "../repository/author.repository";
import { AuthorService } from "../services/author.service";
import { AuthorController } from "../controllers/author.controller";
import prismaInstance from "../prisma";
import { validate } from "../utils/validation";

const router = Router();
const repo = new AuthorRepository(prismaInstance);
const service = new AuthorService(repo, prismaInstance);
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
 *           format: uuid
 *         name:
 *           type: string
 *         bio:
 *           type: string
 *         nationality:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         books:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Mendapatkan daftar author
 *     tags: [Authors]
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
 *         name: nationality
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, nationality, createdAt]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: Daftar author berhasil diambil
 */
router.get('/', controller.list);

/**
 * @swagger
 * /authors/search:
 *   get:
 *     summary: Mencari author
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Pencarian berhasil
 */
router.get('/search', validate(searchAuthorsValidation), controller.list);

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Mendapatkan author berdasarkan ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Author berhasil diambil
 */
router.get('/:id', validate(getAuthorByIdValidation), controller.getById);

/**
 * @swagger
 * /authors/stats/all:
 *   get:
 *     summary: Mendapatkan statistik author
 *     tags: [Authors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik berhasil diambil
 */
router.get('/stats/all', controller.getStats);

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Membuat author baru (Admin only)
 *     tags: [Authors]
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
 *               bio:
 *                 type: string
 *               nationality:
 *                 type: string
 *     responses:
 *       201:
 *         description: Author berhasil dibuat
 */
router.post(
  '/', 
  authenticate, 
  adminOnly, 
  validate(createAuthorValidation), 
  controller.create
);

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Mengupdate author (Admin only)
 *     tags: [Authors]
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
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               nationality:
 *                 type: string
 *     responses:
 *       200:
 *         description: Author berhasil diupdate
 */
router.put(
  '/:id', 
  authenticate, 
  adminOnly, 
  validate(updateAuthorValidation), 
  controller.update
);

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Menghapus author (Admin only)
 *     tags: [Authors]
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
 *         description: Author berhasil dihapus
 */
router.delete(
  '/:id', 
  authenticate, 
  adminOnly, 
  validate(getAuthorByIdValidation), 
  controller.delete
);

export default router;