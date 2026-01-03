import type { Request, Response } from "express";
import { successResponse } from "../utils/response";
import type { IBookService } from "../services/book.service";

export interface IBookController {
  list: (req: Request, res: Response) => Promise<void>;
  getById: (req: Request, res: Response) => Promise<void>;
  create: (req: Request, res: Response) => Promise<void>;
  update: (req: Request, res: Response) => Promise<void>;
  delete: (req: Request, res: Response) => Promise<void>;
  
  getStats: (req: Request, res: Response) => Promise<void>;
}

export class BookController implements IBookController {
  constructor(private bookService: IBookService) {
    this.list = this.list.bind(this);
    this.getById = this.getById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getStats = this.getStats.bind(this);
  }

  // SEMUA METHOD YANG SUDAH ADA TETAP SAMA PERSIS...
  async list(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as any;
      const sortBy = req.query.sortBy as string;
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

      const result = await this.bookService.list({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });

      const pagination = {
        page: result.currentPage,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      };

      successResponse(res, "Buku berhasil diambil", result.books, pagination);
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengambil buku");
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("ID buku tidak ditemukan");
      }

      const book = await this.bookService.getById(req.params.id);
      successResponse(res, "Buku berhasil diambil", book);
    } catch (error: any) {
      throw new Error(error.message || "Buku tidak ditemukan");
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      const { title, authorId, description, year, genre, price, stock } =
        req.body;

      if (
        !title ||
        !authorId ||
        !year ||
        !genre ||
        !price ||
        stock === undefined
      ) {
        throw new Error("Semua field wajib diisi kecuali description");
      }

      const data = {
        title: title.toString(),
        authorId: authorId.toString(),
        description: description,
        year: Number(year),
        genre: genre.toString(),
        price: Number(price),
        stock: Number(stock),
        image_url: file ? `/books/${file.filename}` : undefined,
      };

      const book = await this.bookService.create(data);
      successResponse(res, "Buku berhasil ditambahkan", book, null, 201);
    } catch (error: any) {
      throw new Error(error.message || "Gagal menambahkan buku");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("ID buku tidak ditemukan");
      }

      const file = req.file;
      const updateData = { ...req.body };

      if (file) {
        updateData.image_url = `/books/${file.filename}`;
      }

      if (updateData.year) updateData.year = Number(updateData.year);
      if (updateData.price) updateData.price = Number(updateData.price);
      if (updateData.stock) updateData.stock = Number(updateData.stock);

      const book = await this.bookService.update(req.params.id, updateData);
      successResponse(res, "Buku berhasil diupdate", book);
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengupdate buku");
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("ID buku tidak ditemukan");
      }

      const deleted = await this.bookService.delete(req.params.id);
      successResponse(res, "Buku berhasil dihapus", deleted);
    } catch (error: any) {
      throw new Error(error.message || "Gagal menghapus buku");
    }
  }

  // HANYA TAMBAHKAN 1 METHOD INI (SESUAI REFERENSI ANDA):
  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.bookService.exec();
      successResponse(res, "Statistik buku berhasil diambil", stats, null, 200);
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengambil statistik");
    }
  }
}