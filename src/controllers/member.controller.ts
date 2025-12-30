import type { Request, Response } from "express";
import { successResponse } from "../utils/response";
import type { IMemberService } from "../services/member.service";

export interface IMemberController {
  list: (req: Request, res: Response) => Promise<void>;
  getById: (req: Request, res: Response) => Promise<void>;
  create: (req: Request, res: Response) => Promise<void>;
  update: (req: Request, res: Response) => Promise<void>;
  delete: (req: Request, res: Response) => Promise<void>;
  
  // HANYA TAMBAH 1 METHOD INI (SAMA DENGAN PRODUCT):
  getStats: (req: Request, res: Response) => Promise<void>;
}

export class MemberController implements IMemberController {
  constructor(private memberService: IMemberService) {
    // SESUAI PRODUCT: Bind di constructor controller
    this.list = this.list.bind(this);
    this.getById = this.getById.bind(this);
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
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "asc";

      const result = await this.memberService.list({
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

      successResponse(res, "Member berhasil diambil", result.members, pagination);
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengambil member");
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("ID member tidak ditemukan");
      }

      const member = await this.memberService.getById(req.params.id);
      successResponse(res, "Member berhasil diambil", member);
    } catch (error: any) {
      throw new Error(error.message || "Member tidak ditemukan");
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { email, name, phone, address } = req.body;

      if (!email || !name) {
        throw new Error("Email dan nama wajib diisi");
      }

      const data = {
        email: email.toString(),
        name: name.toString(),
        phone: phone || undefined,
        address: address || undefined,
      };

      const member = await this.memberService.create(data);
      successResponse(res, "Member berhasil ditambahkan", member, null, 201);
    } catch (error: any) {
      throw new Error(error.message || "Gagal menambahkan member");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("ID member tidak ditemukan");
      }

      const { email, name, phone, address } = req.body;
      const updateData: any = {};

      if (email !== undefined) updateData.email = email;
      if (name !== undefined) updateData.name = name;
      if (phone !== undefined) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;

      const member = await this.memberService.update(req.params.id, updateData);
      successResponse(res, "Member berhasil diupdate", member);
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengupdate member");
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      if (!req.params.id) {
        throw new Error("ID member tidak ditemukan");
      }

      const deleted = await this.memberService.delete(req.params.id);
      successResponse(res, "Member berhasil dihapus", deleted);
    } catch (error: any) {
      throw new Error(error.message || "Gagal menghapus member");
    }
  }

  // HANYA TAMBAH 1 METHOD INI (SAMA DENGAN PRODUCT):
  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.memberService.exec();
      successResponse(res, "Statistik member berhasil diambil", stats, null, 200);
    } catch (error: any) {
      throw new Error(error.message || "Gagal mengambil statistik");
    }
  }
}