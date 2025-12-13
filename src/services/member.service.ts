import { getPrisma } from "../prisma";

const prisma = getPrisma();

// GET ALL
export const getAllMembers = async (page?: number, limit?: number) => {
  const pageNum = page || 1;
  const limitNum = limit || 10;
  const skip = (pageNum - 1) * limitNum;

  const [members, total] = await Promise.all([
    prisma.member.findMany({
      where: { deletedAt: null },
      include: { loans: { include: { book: true } } },
      skip,
      take: limitNum,
      orderBy: { name: "asc" },
    }),
    prisma.member.count({ where: { deletedAt: null } }),
  ]);

  return { members, total, page: pageNum, totalPages: Math.ceil(total / limitNum) };
};

// GET BY ID
export const getMemberById = async (id: string) => {
  const member = await prisma.member.findUnique({
    where: { id, deletedAt: null },
    include: { loans: { include: { book: true } } },
  });

  if (!member) throw new Error("Member tidak ditemukan");
  return member;
};

// SEARCH - SEDERHANA
export const searchMembers = async (
  name?: string,
  email?: string,
  page?: number,
  limit?: number
) => {
  const pageNum = page || 1;
  const limitNum = limit || 10;
  const skip = (pageNum - 1) * limitNum;

  const where: any = { deletedAt: null };

  if (name) where.name = { contains: name, mode: "insensitive" };
  if (email) where.email = { contains: email, mode: "insensitive" };

  const [members, total] = await Promise.all([
    prisma.member.findMany({
      where,
      include: { loans: true },
      skip,
      take: limitNum,
      orderBy: { name: "asc" },
    }),
    prisma.member.count({ where }),
  ]);

  return { members, total, page: pageNum, totalPages: Math.ceil(total / limitNum) };
};

// CREATE
export const createMember = async (
  email: string,
  name: string,
  phone?: string
) => {
  // Cek email unik
  const existing = await prisma.member.findUnique({
    where: { email },
  });
  
  if (existing) throw new Error("Email sudah terdaftar");

  return await prisma.member.create({
    data: {
      email,
      name,
      phone: phone || null,
    },
  });
};

// UPDATE
export const updateMember = async (id: string, data: any) => {
  await getMemberById(id);
  return await prisma.member.update({
    where: { id, deletedAt: null },
    data,
  });
};

// DELETE
export const deleteMember = async (id: string) => {
  return await prisma.member.update({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
  });
};