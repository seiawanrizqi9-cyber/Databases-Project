import type { Request, Response } from "express";
import { successResponse } from "../utils/response";
import type { ICategoryService } from "../services/category.service";

export interface ICategoryController {
  list: (req: Request, res: Response) => Promise<void>;
  getById: (req: Request, res: Response) => Promise<void>;
  create: (req: Request, res: Response) => Promise<void>;
  update: (req: Request, res: Response) => Promise<void>;
  delete: (req: Request, res: Response) => Promise<void>;
  assignBook: (req: Request, res: Response) => Promise<void>;
  removeBook: (req: Request, res: Response) => Promise<void>;
  
  // HANYA TAMBAH 1 METHOD INI:
  getStats: (req: Request, res: Response) => Promise<void>;
}

export class CategoryController implements ICategoryController {
  constructor(private categoryService: ICategoryService) {
    this.getStats = this.getStats.bind(this);
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as any;
      const sortBy = req.query.sortBy as string;
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

      const result = await this.categoryService.list({
        page, limit, search, sortBy, sortOrder,
      });

      const pagination = {
        page: result.currentPage, limit,
        total: result.total, totalPages: result.totalPages,
      };

      successResponse(res, "Kategori berhasil diambil", result.categories, pagination);
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengambil kategori");
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) throw new Error("ID kategori tidak ditemukan");
      const category = await this.categoryService.getById(req.params.id);
      successResponse(res, "Kategori berhasil diambil", category);
    } catch (error: any) {
      throw new Error(error.message || "Kategori tidak ditemukan");
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      if (!name) throw new Error("Nama kategori wajib diisi");
      const category = await this.categoryService.create(name);
      successResponse(res, "Kategori berhasil ditambahkan", category, null, 201);
    } catch (error: any) {
      throw new Error(error.message || "Gagal menambahkan kategori");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) throw new Error("ID kategori tidak ditemukan");
      const { name } = req.body;
      if (!name) throw new Error("Nama kategori wajib diisi");
      const category = await this.categoryService.update(req.params.id, name);
      successResponse(res, "Kategori berhasil diupdate", category);
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengupdate kategori");
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) throw new Error("ID kategori tidak ditemukan");
      const category = await this.categoryService.delete(req.params.id);
      successResponse(res, "Kategori berhasil dihapus", category);
    } catch (error: any) {
      throw new Error(error.message || "Gagal menghapus kategori");
    }
  }

  async assignBook(req: Request, res: Response): Promise<void> {
    try {
      const { bookId, categoryId } = req.body;
      if (!bookId || !categoryId) throw new Error("bookId dan categoryId wajib diisi");
      const result = await this.categoryService.assignBook(bookId, Number(categoryId));
      successResponse(res, "Buku berhasil ditambahkan ke kategori", result);
    } catch (error: any) {
      throw new Error(error.message || "Gagal menambahkan buku ke kategori");
    }
  }

  async removeBook(req: Request, res: Response): Promise<void> {
    try {
      const { bookId, categoryId } = req.body;
      if (!bookId || !categoryId) throw new Error("bookId dan categoryId wajib diisi");
      const result = await this.categoryService.removeBook(bookId, Number(categoryId));
      successResponse(res, "Buku berhasil dihapus dari kategori", result);
    } catch (error: any) {
      throw new Error(error.message || "Gagal menghapus buku dari kategori");
    }
  }

  // HANYA TAMBAH 1 METHOD INI:
  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.categoryService.exec();
      successResponse(res, "Statistik kategori berhasil diambil", stats, null, 200);
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengambil statistik");
    }
  }
}