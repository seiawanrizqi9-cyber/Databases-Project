import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response";
import {
  getAllMembers,
  getMemberById,
  searchMembers,
  createMember,
  updateMember,
  deleteMember,
} from "../services/member.service";

export const getAll = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllMembers(page, limit);

    successResponse(res, "Daftar member berhasil diambil", {
      members: result.members,
      pagination: {
        page: result.page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    errorResponse(res, error.message || "Gagal mengambil daftar member", 500);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const member = await getMemberById(req.params.id!);
    successResponse(res, "Member berhasil ditemukan", member);
  } catch (error: any) {
    errorResponse(res, error.message, 404);
  }
};

export const search = async (req: Request, res: Response) => {
  try {
    const { name, email, page, limit } = req.query;

    const result = await searchMembers(
      name?.toString(),
      email?.toString(),
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined
    );

    successResponse(res, "Pencarian member berhasil", result);
  } catch (error: any) {
    errorResponse(res, error.message || "Gagal mencari member", 500);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { email, name, phone } = req.body;

    const newMember = await createMember(email, name, phone);
    successResponse(res, "Member berhasil ditambahkan", newMember, 201);
  } catch (error: any) {
    errorResponse(res, error.message || "Gagal menambahkan member", 400);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const member = await updateMember(req.params.id!, req.body);
    successResponse(res, "Member berhasil diperbarui", member);
  } catch (error: any) {
    errorResponse(res, error.message, 404);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteMember(req.params.id!);
    successResponse(res, "Member berhasil dihapus", deleted);
  } catch (error: any) {
    errorResponse(res, error.message, 404);
  }
};