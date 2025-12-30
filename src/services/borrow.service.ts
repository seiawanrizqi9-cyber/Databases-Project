import type { BorrowRecord, Prisma, PrismaClient } from "../generated/client";
import type { IBorrowRecordRepository } from "../repository/borrowRecord.repository";

interface CreateBorrowRecordData {
  memberId: string;
  items: Array<{ bookId: string; quantity: number }>;
  dueDate: Date;
}

interface ReturnBorrowRecordData {
  borrowRecordId: string;
  returnItems: Array<{ borrowItemId: string; quantity: number }>;
}

interface FindAllBorrowRecordsParams {
  page: number;
  limit: number;
  search?: {
    memberEmail?: string;
    bookTitle?: string;
    status?: string;
  };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface BorrowRecordWithDetails extends BorrowRecord {
  member?: any;
  items?: any[];
}

interface BorrowRecordListResponse {
  borrowRecords: BorrowRecordWithDetails[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface IBorrowService {
  list(params: FindAllBorrowRecordsParams): Promise<BorrowRecordListResponse>;
  getById(id: string): Promise<BorrowRecordWithDetails>;
  create(data: CreateBorrowRecordData): Promise<BorrowRecordWithDetails>;
  returnBooks(data: ReturnBorrowRecordData): Promise<BorrowRecordWithDetails>;
  update(
    id: string,
    data: Partial<BorrowRecord>
  ): Promise<BorrowRecordWithDetails>;
  delete(id: string): Promise<BorrowRecordWithDetails>;
  exec(): Promise<{ overview: any; byStatus: any }>;
}

export class BorrowService implements IBorrowService {
  constructor(
    private borrowRecordRepo: IBorrowRecordRepository,
    private prisma: PrismaClient
  ) {}

  async list(
    params: FindAllBorrowRecordsParams
  ): Promise<BorrowRecordListResponse> {
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.BorrowRecordWhereInput = {
      deletedAt: null,
    };

    if (search?.memberEmail) {
      whereClause.member = {
        email: {
          contains: search.memberEmail,
          mode: "insensitive",
        },
        deletedAt: null,
      };
    }

    if (search?.bookTitle) {
      whereClause.items = {
        some: {
          book: {
            title: {
              contains: search.bookTitle,
              mode: "insensitive",
            },
            deletedAt: null,
          },
        },
      };
    }

    if (search?.status) {
      whereClause.status = search.status as any;
    }

    const sortCriteria: Prisma.BorrowRecordOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || "desc" }
      : { borrowDate: "desc" };

    const borrowRecords = await this.borrowRecordRepo.list(
      skip,
      limit,
      whereClause,
      sortCriteria
    );

    const total = await this.borrowRecordRepo.countAll(whereClause);

    return {
      borrowRecords: borrowRecords as BorrowRecordWithDetails[],
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getById(id: string): Promise<BorrowRecordWithDetails> {
    const borrowRecord = await this.borrowRecordRepo.findById(id);

    if (!borrowRecord) {
      throw new Error("Peminjaman tidak ditemukan");
    }

    return borrowRecord as BorrowRecordWithDetails;
  }

  async create(data: CreateBorrowRecordData): Promise<BorrowRecordWithDetails> {
    return await this.prisma.$transaction(async (tx: any) => {
      // 1. Cek member exists
      const member = await tx.member.findUnique({
        where: { id: data.memberId, deletedAt: null },
      });

      if (!member) {
        throw new Error("Member tidak ditemukan");
      }

      // 2. Cek dan validasi semua buku sekaligus
      const bookChecks = await Promise.all(
        data.items.map(async (item) => {
          const book = await tx.book.findUnique({
            where: { id: item.bookId, deletedAt: null },
          });

          if (!book) {
            throw new Error(`Buku dengan ID ${item.bookId} tidak ditemukan`);
          }

          if (book.stock < item.quantity) {
            throw new Error(
              `Stok buku "${book.title}" tidak mencukupi. Stok tersedia: ${book.stock}`
            );
          }

          return { book, item };
        })
      );

      // 3. Kurangi stok semua buku
      await Promise.all(
        bookChecks.map(({ item }) =>
          tx.book.update({
            where: { id: item.bookId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      );

      // 4. Buat borrow record dengan items
      const borrowRecord = await tx.borrowRecord.create({
        data: {
          member: { connect: { id: data.memberId } },
          dueDate: data.dueDate,
          items: {
            create: data.items.map((item) => ({
              book: { connect: { id: item.bookId } },
              quantity: item.quantity,
            })),
          },
        },
        include: {
          member: true,
          items: { include: { book: true } },
        },
      });

      return borrowRecord as BorrowRecordWithDetails;
    });
  }

  async returnBooks(
    data: ReturnBorrowRecordData
  ): Promise<BorrowRecordWithDetails> {
    return await this.prisma.$transaction(async (tx: any) => {
      // 1. Cek borrow record
      const borrowRecord = await tx.borrowRecord.findUnique({
        where: { id: data.borrowRecordId, deletedAt: null },
        include: { items: { include: { book: true } } },
      });

      if (!borrowRecord) {
        throw new Error("Peminjaman tidak ditemukan");
      }

      if (borrowRecord.status === "RETURNED") {
        throw new Error("Semua buku sudah dikembalikan");
      }

      // 2. Kembalikan stok untuk setiap item
      const returnPromises = data.returnItems.map(async (returnItem) => {
        const borrowItem = await tx.borrowItem.findUnique({
          where: { id: returnItem.borrowItemId },
          include: { book: true },
        });

        if (!borrowItem) {
          throw new Error(
            `Item peminjaman dengan ID ${returnItem.borrowItemId} tidak ditemukan`
          );
        }

        // Validasi quantity
        if (returnItem.quantity > borrowItem.quantity) {
          throw new Error(
            `Jumlah pengembalian melebihi jumlah peminjaman untuk buku "${borrowItem.book.title}"`
          );
        }

        // Kembalikan stok
        await tx.book.update({
          where: { id: borrowItem.bookId },
          data: { stock: { increment: returnItem.quantity } },
        });

        // Update quantity yang tersisa
        const remainingQuantity = borrowItem.quantity - returnItem.quantity;
        if (remainingQuantity > 0) {
          await tx.borrowItem.update({
            where: { id: borrowItem.id },
            data: { quantity: remainingQuantity },
          });
        } else {
          await tx.borrowItem.delete({
            where: { id: borrowItem.id },
          });
        }
      });

      await Promise.all(returnPromises);

      // 3. Cek apakah semua items sudah dikembalikan
      const remainingItems = await tx.borrowItem.count({
        where: { borrowRecordId: data.borrowRecordId },
      });

      // 4. Update status borrow record
      const updatedRecord = await tx.borrowRecord.update({
        where: { id: data.borrowRecordId },
        data: {
          status: remainingItems === 0 ? "RETURNED" : "ACTIVE",
          returnDate: remainingItems === 0 ? new Date() : null,
        },
        include: {
          member: true,
          items: { include: { book: true } },
        },
      });

      return updatedRecord as BorrowRecordWithDetails;
    });
  }

  async update(
    id: string,
    data: Partial<BorrowRecord>
  ): Promise<BorrowRecordWithDetails> {
    // Validasi borrow record exists
    await this.getById(id);

    return (await this.borrowRecordRepo.update(
      id,
      data as any
    )) as BorrowRecordWithDetails;
  }

  async delete(id: string): Promise<BorrowRecordWithDetails> {
    // Validasi borrow record exists
    const borrowRecord = await this.borrowRecordRepo.findById(id);
    if (!borrowRecord) {
      throw new Error("Peminjaman tidak ditemukan");
    }

    return (await this.borrowRecordRepo.softDelete(
      id
    )) as BorrowRecordWithDetails;
  }

  async exec() {
    const overview = await this.borrowRecordRepo.getStats();
    const byStatus =
      await this.borrowRecordRepo.getBorrowRecordsByStatusStats();

    return { overview, byStatus };
  }
}
