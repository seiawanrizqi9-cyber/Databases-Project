import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response";
import {
  getAllBooks,
  getBookById,
  searchBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../services/book.service";

export const getAll = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllBooks(page, limit);

    successResponse(res, "Daftar buku berhasil diambil", {
      books: result.books,
      pagination: {
        page: result.page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    errorResponse(res, error.message || "Gagal mengambil daftar buku", 500);
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const book = await getBookById(req.params.id!);
    successResponse(res, "Buku berhasil ditemukan", book);
  } catch (error: any) {
    errorResponse(res, error.message, 404);
  }
};

export const search = async (req: Request, res: Response) => {
  try {
    const {
      title,
      author,
      genre,
      min_price,
      max_price,
      min_year,
      max_year,
      page,
      limit,
    } = req.query;

    // SAMA PERSIS dengan product controller kemarin
    const result = await searchBooks(
      title?.toString(),
      author?.toString(),
      genre?.toString(),
      min_price ? Number(min_price) : undefined,
      max_price ? Number(max_price) : undefined,
      min_year ? Number(min_year) : undefined,
      max_year ? Number(max_year) : undefined,
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined
    );

    successResponse(res, "Pencarian buku berhasil", result);
  } catch (error: any) {
    errorResponse(res, error.message || "Gagal mencari buku", 500);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { title, authorId, description, year, genre, price, stock } = req.body;

    const newBook = await createBook(
      title,
      authorId,
      description,
      year ? Number(year) : undefined,
      genre,
      price ? Number(price) : undefined,
      stock ? Number(stock) : undefined
    );

    successResponse(res, "Buku berhasil ditambahkan", newBook, 201);
  } catch (error: any) {
    errorResponse(res, error.message || "Gagal menambahkan buku", 400);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const book = await updateBook(req.params.id!, req.body);
    successResponse(res, "Buku berhasil diperbarui", book);
  } catch (error: any) {
    errorResponse(res, error.message, 404);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const deletedBook = await deleteBook(req.params.id!);
    successResponse(res, "Buku berhasil dihapus", deletedBook);
  } catch (error: any) {
    errorResponse(res, error.message, 404);
  }
};