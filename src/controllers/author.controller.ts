import type { Request, Response } from "express";
import { successResponse } from "../utils/response";
import type { IAuthorService } from "../services/author.service";

export interface IAuthorController {
  list: (req: Request, res: Response) => Promise<void>;
  getById: (req: Request, res: Response) => Promise<void>;
  create: (req: Request, res: Response) => Promise<void>;
  update: (req: Request, res: Response) => Promise<void>;
  delete: (req: Request, res: Response) => Promise<void>;
  
  // HANYA TAMBAH 1 METHOD INI (SAMA DENGAN PRODUCT):
  getStats: (req: Request, res: Response) => Promise<void>;
}

export class AuthorController implements IAuthorController {
  constructor(private authorService: IAuthorService) {
    this.getStats = this.getStats.bind(this);
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as any;
      const sortBy = req.query.sortBy as string;
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "asc";

      const result = await this.authorService.list({
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

      successResponse(res, "Author berhasil diambil", result.authors, pagination);
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengambil author");
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("ID author tidak ditemukan");
      }

      const author = await this.authorService.getById(req.params.id);
      successResponse(res, "Author berhasil diambil", author);
    } catch (error: any) {
      throw new Error(error.message || "Author tidak ditemukan");
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, bio, nationality } = req.body;

      if (!name) {
        throw new Error("Nama author wajib diisi");
      }

      const data = {
        name: name.toString(),
        bio: bio || undefined,
        nationality: nationality || undefined,
      };

      const author = await this.authorService.create(data);
      successResponse(res, "Author berhasil ditambahkan", author, null, 201);
    } catch (error: any) {
      throw new Error(error.message || "Gagal menambahkan author");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("ID author tidak ditemukan");
      }

      const { name, bio, nationality } = req.body;
      const updateData: any = {};

      if (name !== undefined) updateData.name = name;
      if (bio !== undefined) updateData.bio = bio;
      if (nationality !== undefined) updateData.nationality = nationality;

      const author = await this.authorService.update(req.params.id, updateData);
      successResponse(res, "Author berhasil diupdate", author);
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengupdate author");
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("ID author tidak ditemukan");
      }

      const deleted = await this.authorService.delete(req.params.id);
      successResponse(res, "Author berhasil dihapus", deleted);
    } catch (error: any) {
      throw new Error(error.message || "Gagal menghapus author");
    }
  }

  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.authorService.exec();
      successResponse(res, "Statistik author berhasil diambil", stats, null, 200);
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengambil statistik");
    }
  }
}