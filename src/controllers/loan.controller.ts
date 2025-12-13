import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response";
import {
  getAllLoans,
  getLoanById,
  searchLoans,
  createLoan,
  updateLoan,
  returnLoan,
  deleteLoan,
} from "../services/loan.service";

export const getAll = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllLoans(page, limit);

    successResponse(res, "Daftar peminjaman berhasil diambil", {
      loans: result.loans,
      pagination: {
        page: result.page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    errorResponse(res, error.message || "Gagal mengambil daftar peminjaman", 500);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const loan = await getLoanById(req.params.id!);
    successResponse(res, "Peminjaman berhasil ditemukan", loan);
  } catch (error: any) {
    errorResponse(res, error.message, 404);
  }
};

export const search = async (req: Request, res: Response) => {
  try {
    const { bookTitle, memberEmail, status, page, limit } = req.query;

    const result = await searchLoans(
      bookTitle?.toString(),
      memberEmail?.toString(),
      status?.toString(),
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined
    );

    successResponse(res, "Pencarian peminjaman berhasil", result);
  } catch (error: any) {
    errorResponse(res, error.message || "Gagal mencari peminjaman", 500);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { bookId, memberId, dueDate } = req.body;

    const newLoan = await createLoan(bookId, memberId, new Date(dueDate));
    successResponse(res, "Peminjaman berhasil dibuat", newLoan, 201);
  } catch (error: any) {
    errorResponse(res, error.message || "Gagal membuat peminjaman", 400);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const loan = await updateLoan(req.params.id!, req.body);
    successResponse(res, "Peminjaman berhasil diperbarui", loan);
  } catch (error: any) {
    errorResponse(res, error.message, 404);
  }
};

export const returnBook = async (req: Request, res: Response) => {
  try {
    const loan = await returnLoan(req.params.id!);
    successResponse(res, "Buku berhasil dikembalikan", loan);
  } catch (error: any) {
    errorResponse(res, error.message, 400);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteLoan(req.params.id!);
    successResponse(res, "Peminjaman berhasil dihapus", deleted);
  } catch (error: any) {
    errorResponse(res, error.message, 404);
  }
};