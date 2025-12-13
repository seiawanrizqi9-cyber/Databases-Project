import { getPrisma } from "../prisma";

const prisma = getPrisma();

// GET ALL
export const getAllAuthors = async (page?: number, limit?: number) => {
  const pageNum = page || 1;
  const limitNum = limit || 10;
  const skip = (pageNum - 1) * limitNum;

  const [authors, total] = await Promise.all([
    prisma.author.findMany({
      where: { deletedAt: null },
      include: { books: true },
      skip,
      take: limitNum,
      orderBy: { name: "asc" },
    }),
    prisma.author.count({ where: { deletedAt: null } }),
  ]);

  return { authors, total, page: pageNum, totalPages: Math.ceil(total / limitNum) };
};

// GET BY ID
export const getAuthorById = async (id: string) => {
  const author = await prisma.author.findUnique({
    where: { id, deletedAt: null },
    include: { books: { where: { deletedAt: null } } },
  });

  if (!author) throw new Error("Author tidak ditemukan");
  return author;
};

// SEARCH - SEDERHANA
export const searchAuthors = async (
  name?: string,
  nationality?: string,
  page?: number,
  limit?: number
) => {
  const pageNum = page || 1;
  const limitNum = limit || 10;
  const skip = (pageNum - 1) * limitNum;

  const where: any = { deletedAt: null };

  if (name) where.name = { contains: name, mode: "insensitive" };
  if (nationality) where.nationality = { contains: nationality, mode: "insensitive" };

  const [authors, total] = await Promise.all([
    prisma.author.findMany({
      where,
      include: { books: true },
      skip,
      take: limitNum,
      orderBy: { name: "asc" },
    }),
    prisma.author.count({ where }),
  ]);

  return { authors, total, page: pageNum, totalPages: Math.ceil(total / limitNum) };
};

// CREATE
export const createAuthor = async (
  name: string,
  bio?: string,
  nationality?: string
) => {
  return await prisma.author.create({
    data: {
      name,
      bio: bio || null,
      nationality: nationality || null,
    },
  });
};

// UPDATE
export const updateAuthor = async (id: string, data: any) => {
  await getAuthorById(id);
  return await prisma.author.update({
    where: { id, deletedAt: null },
    data,
  });
};

// DELETE
export const deleteAuthor = async (id: string) => {
  return await prisma.author.update({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
  });
};