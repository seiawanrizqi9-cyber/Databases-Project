import { getPrisma } from "../prisma";

const prisma = getPrisma();

// GET ALL
export const getAllLoans = async (page?: number, limit?: number) => {
  const pageNum = page || 1;
  const limitNum = limit || 10;
  const skip = (pageNum - 1) * limitNum;

  const [loans, total] = await Promise.all([
    prisma.loan.findMany({
      where: { deletedAt: null },
      include: { book: true, member: true },
      skip,
      take: limitNum,
      orderBy: { loanDate: "desc" },
    }),
    prisma.loan.count({ where: { deletedAt: null } }),
  ]);

  return { loans, total, page: pageNum, totalPages: Math.ceil(total / limitNum) };
};

// GET BY ID
export const getLoanById = async (id: string) => {
  const loan = await prisma.loan.findUnique({
    where: { id, deletedAt: null },
    include: { book: true, member: true },
  });

  if (!loan) throw new Error("Peminjaman tidak ditemukan");
  return loan;
};

// SEARCH - SEDERHANA
export const searchLoans = async (
  bookTitle?: string,
  memberEmail?: string,
  status?: string,
  page?: number,
  limit?: number
) => {
  const pageNum = page || 1;
  const limitNum = limit || 10;
  const skip = (pageNum - 1) * limitNum;

  const where: any = { deletedAt: null };

  if (bookTitle) {
    where.book = {
      title: { contains: bookTitle, mode: "insensitive" },
      deletedAt: null,
    };
  }

  if (memberEmail) {
    where.member = {
      email: { contains: memberEmail, mode: "insensitive" },
      deletedAt: null,
    };
  }

  if (status) where.status = status;

  const [loans, total] = await Promise.all([
    prisma.loan.findMany({
      where,
      include: { book: true, member: true },
      skip,
      take: limitNum,
      orderBy: { loanDate: "desc" },
    }),
    prisma.loan.count({ where }),
  ]);

  return { loans, total, page: pageNum, totalPages: Math.ceil(total / limitNum) };
};

// CREATE dengan transaction
export const createLoan = async (
  bookId: string,
  memberId: string,
  dueDate: Date
) => {
  return await prisma.$transaction(async (tx) => {
    // Cek buku dan member
    const [book, member] = await Promise.all([
      tx.book.findUnique({ where: { id: bookId, deletedAt: null } }),
      tx.member.findUnique({ where: { id: memberId, deletedAt: null } }),
    ]);

    if (!book) throw new Error("Buku tidak ditemukan");
    if (!member) throw new Error("Member tidak ditemukan");
    if (book.stock < 1) throw new Error("Stok buku habis");

    // Kurangi stok
    await tx.book.update({
      where: { id: bookId },
      data: { stock: { decrement: 1 } },
    });

    // Buat loan
    return await tx.loan.create({
      data: {
        bookId,
        memberId,
        dueDate,
      },
      include: { book: true, member: true },
    });
  });
};

// UPDATE
export const updateLoan = async (id: string, data: any) => {
  await getLoanById(id);
  return await prisma.loan.update({
    where: { id, deletedAt: null },
    data,
    include: { book: true, member: true },
  });
};

// RETURN buku
export const returnLoan = async (id: string) => {
  const loan = await getLoanById(id);
  
  if (loan.status === "RETURNED") {
    throw new Error("Buku sudah dikembalikan");
  }

  return await prisma.$transaction(async (tx) => {
    // Update loan
    const updatedLoan = await tx.loan.update({
      where: { id },
      data: { 
        status: "RETURNED",
        returnDate: new Date(),
      },
    });

    // Tambah stok kembali
    await tx.book.update({
      where: { id: loan.bookId },
      data: { stock: { increment: 1 } },
    });

    return updatedLoan;
  });
};

// DELETE
export const deleteLoan = async (id: string) => {
  return await prisma.loan.update({
    where: { id, deletedAt: null },
    data: { deletedAt: new Date() },
  });
};