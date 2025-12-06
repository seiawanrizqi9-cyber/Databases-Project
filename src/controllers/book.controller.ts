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

export const getAll = (_req: Request, res: Response) => {
  try {
    const { books, total } = getAllBooks();

    successResponse(
      res,
      "Daftar buku berhasil diambil",
      {
        books: books,
        total: total
      }
    );
  } catch (error: any) {
    errorResponse(res, error.message || "Gagal mengambil daftar buku", 500);
  }
};

export const getById = (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return errorResponse(res, "ID buku diperlukan", 400);
    }

    const book = getBookById(req.params.id);

    successResponse(
      res,
      "Buku berhasil ditemukan",
      book
    );
  } catch (error: any) {
    errorResponse(res, error.message, 404);
  }
};

export const search = (req: Request, res: Response) => {
  try {
    const { title, author, genre, min_price, max_price, min_year, max_year } = req.query;

    const result = searchBooks(
      title?.toString(),
      author?.toString(),
      genre?.toString(),
      min_price?.toString(),
      max_price?.toString(),
      min_year?.toString(),
      max_year?.toString()
    );

    successResponse(
      res,
      "Pencarian buku berhasil",
      {
        books: result.books,
        total: result.total,
        filters: result.filters
      }
    );
  } catch (error: any) {
    errorResponse(res, error.message || "Gagal mencari buku", 500);
  }
};

export const create = (req: Request, res: Response) => {
  try {
    const { 
      title, 
      author, 
      description, 
      year,
      genre, 
      price, 
      stock 
    } = req.body;

    const newBook = createBook(
      title, 
      author, 
      description, 
      year,
      genre, 
      price, 
      stock
    );

    successResponse(
      res,
      "Buku berhasil ditambahkan",
      newBook,
    );
  } catch (error: any) {
    errorResponse(res, error.message || "Gagal menambahkan buku", 400);
  }
};

export const update = (req: Request, res: Response) => {
  try {
    const book = updateBook(req.params.id!, req.body);

    successResponse(
      res,
      "Buku berhasil diperbarui",
      book
    );
  } catch (error: any) {
    errorResponse(res, error.message, 404);
  }
};

export const remove = (req: Request, res: Response) => {
  try {
    const deletedBook = deleteBook(req.params.id!);

    successResponse(
      res,
      "Buku berhasil dihapus",
      deletedBook
    );
  } catch (error: any) {
    errorResponse(res, error.message, 404);
  }
};
