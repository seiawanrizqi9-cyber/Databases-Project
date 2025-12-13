import { getPrisma } from "../prisma";

const prisma = getPrisma();

// GET ALL dengan pagination
export const getAllBooks = async (page?: number, limit?: number) => {
  const pageNum = page || 1;
  const limitNum = limit || 10;
  const skip = (pageNum - 1) * limitNum;

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where: { deletedAt: null },
      include: { author: true },
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    }),
    prisma.book.count({ where: { deletedAt: null } }),
  ]);

  return { books, total, page: pageNum, totalPages: Math.ceil(total / limitNum) };
};

// GET BY ID
export const getBookById = async (id: string) => {
  const book = await prisma.book.findUnique({
    where: { id, deletedAt: null },
    include: { author: true, loans: { include: { member: true } } },
  });

  if (!book) throw new Error("Buku tidak ditemukan");
  return book;
};

// SEARCH - SEDERHANA seperti project kemarin
export const searchBooks = async (
  title?: string,
  authorName?: string,
  genre?: string,
  minPrice?: number,
  maxPrice?: number,
  minYear?: number,
  maxYear?: number,
  page?: number,
  limit?: number
) => {
  const pageNum = page || 1;
  const limitNum = limit || 10;
  const skip = (pageNum - 1) * limitNum;

  const where: any = { deletedAt: null };

  if (title) where.title = { contains: title, mode: "insensitive" };
  if (genre) where.genre = { contains: genre, mode: "insensitive" };
  if (minPrice !== undefined) where.price = { gte: minPrice };
  if (maxPrice !== undefined) where.price = { lte: maxPrice };
  if (minYear !== undefined) where.year = { gte: minYear };
  if (maxYear !== undefined) where.year = { lte: maxYear };

  if (authorName) {
    where.author = {
      name: { contains: authorName, mode: "insensitive" },
      deletedAt: null,
    };
  }

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      include: { author: true },
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    }),
    prisma.book.count({ where }),
  ]);

  return {
    books,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  };
};

// CREATE
export const createBook = async (
  title: string,
  authorId: string,
  description?: string,
  year?: number,
  genre?: string,
  price?: number,
  stock?: number
) => {
  // Validasi author
  const author = await prisma.author.findUnique({
    where: { id: authorId, deletedAt: null },
  });
  if (!author) throw new Error("Author tidak ditemukan");

  return await prisma.book.create({
    data: {
      title,
      description: description || null,
      year: year || new Date().getFullYear(),
      genre: genre || "Unknown",
      price: price || 0,
      stock: stock || 0,
      authorId,
    },
    include: { author: true },
  });
};

// UPDATE
export const updateBook = async (id: string, data: any) => {
  await getBookById(id); // Validasi exist
  return await prisma.book.update({
    where: { id, deletedAt: null },
    data,
    include: { author: true },
  });
};

// DELETE (soft)
export const deleteBook = async (id: string) => {
  return await prisma.book.update({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
  });
};