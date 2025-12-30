import type { Request, Response } from "express";
import { successResponse } from "../utils/response";
import type { IProfileService } from "../services/profile.service";

export interface IProfileController {
  list: (req: Request, res: Response) => Promise<void>;
  getById: (req: Request, res: Response) => Promise<void>;
  getByUserId: (req: Request, res: Response) => Promise<void>;
  create: (req: Request, res: Response) => Promise<void>;
  update: (req: Request, res: Response) => Promise<void>;
  delete: (req: Request, res: Response) => Promise<void>;
  
  // HANYA TAMBAH 1 METHOD INI (SAMA DENGAN PRODUCT):
  getStats: (req: Request, res: Response) => Promise<void>;
}

export class ProfileController implements IProfileController {
  constructor(private profileService: IProfileService) {
    // SESUAI PRODUCT: Bind di constructor controller
    this.list = this.list.bind(this);
    this.getById = this.getById.bind(this);
    this.getByUserId = this.getByUserId.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getStats = this.getStats.bind(this);
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as any;
      const sortBy = req.query.sortBy as string;
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

      const result = await this.profileService.list({
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

      successResponse(res, "Profile berhasil diambil", result.profiles, pagination);
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengambil profile");
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("ID profile tidak ditemukan");
      }

      const profile = await this.profileService.getById(req.params.id);
      successResponse(res, "Profile berhasil diambil", profile);
    } catch (error: any) {
      throw new Error(error.message || "Profile tidak ditemukan");
    }
  }

  async getByUserId(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.userId) {
        throw new Error("User ID tidak ditemukan");
      }

      const userId = Number(req.params.userId);
      const profile = await this.profileService.getByUserId(userId);
      successResponse(res, "Profile berhasil diambil", profile);
    } catch (error: any) {
      throw new Error(error.message || "Profile tidak ditemukan");
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file;
      const { user_id, name, gender, address } = req.body;

      if (!user_id || !name) {
        throw new Error("User ID dan nama wajib diisi");
      }

      const data = {
        user_id: Number(user_id),
        name: name.toString(),
        gender: gender || undefined,
        address: address || undefined,
        profile_picture_url: file ? `/profiles/${file.filename}` : undefined,
      };

      const profile = await this.profileService.create(data);
      successResponse(res, "Profile berhasil dibuat", profile, null, 201);
    } catch (error: any) {
      throw new Error(error.message || "Gagal membuat profile");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("ID profile tidak ditemukan");
      }

      const file = req.file;
      const { name, gender, address } = req.body;
      const updateData: any = {};

      if (name !== undefined) updateData.name = name;
      if (gender !== undefined) updateData.gender = gender;
      if (address !== undefined) updateData.address = address;
      if (file) updateData.profile_picture_url = `/profiles/${file.filename}`;

      const profile = await this.profileService.update(req.params.id, updateData);
      successResponse(res, "Profile berhasil diupdate", profile);
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengupdate profile");
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("ID profile tidak ditemukan");
      }

      const deleted = await this.profileService.delete(req.params.id);
      successResponse(res, "Profile berhasil dihapus", deleted);
    } catch (error: any) {
      throw new Error(error.message || "Gagal menghapus profile");
    }
  }

  // HANYA TAMBAH 1 METHOD INI (SAMA DENGAN PRODUCT):
  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.profileService.exec();
      successResponse(res, "Statistik profile berhasil diambil", stats, null, 200);
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengambil statistik");
    }
  }
}