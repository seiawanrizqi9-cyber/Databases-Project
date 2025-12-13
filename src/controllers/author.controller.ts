import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response";
import {
  getAllAuthors,
  getAuthorById,
  searchAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../services/author.service";

export const getAll = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllAuthors(page, limit);

    successResponse(res, "Daftar author berhasil diambil", {
      authors: result.authors,
      pagination: {
        page: result.page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    errorResponse(res, error.message || "Gagal mengambil daftar author", 500);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const author = await getAuthorById(req.params.id!);
    successResponse(res, "Author berhasil ditemukan", author);
  } catch (error: any) {
    errorResponse(res, error.message, 404);
  }
};

export const search = async (req: Request, res: Response) => {
  try {
    const { name, nationality, page, limit } = req.query;

    // SEDERHANA seperti project kemarin
    const result = await searchAuthors(
      name?.toString(),
      nationality?.toString(),
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined
    );

    successResponse(res, "Pencarian author berhasil", result);
  } catch (error: any) {
    errorResponse(res, error.message || "Gagal mencari author", 500);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { name, bio, nationality } = req.body;

    const newAuthor = await createAuthor(name, bio, nationality);
    successResponse(res, "Author berhasil ditambahkan", newAuthor, 201);
  } catch (error: any) {
    errorResponse(res, error.message || "Gagal menambahkan author", 400);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const author = await updateAuthor(req.params.id!, req.body);
    successResponse(res, "Author berhasil diperbarui", author);
  } catch (error: any) {
    errorResponse(res, error.message, 404);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteAuthor(req.params.id!);
    successResponse(res, "Author berhasil dihapus", deleted);
  } catch (error: any) {
    errorResponse(res, error.message, 404);
  }
};