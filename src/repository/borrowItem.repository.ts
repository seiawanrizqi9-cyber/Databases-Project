import type { BorrowItem, Prisma, PrismaClient } from "../generated/client";

export interface IBorrowItemRepository {
  create(data: Prisma.BorrowItemCreateInput): Promise<BorrowItem>;
  createMany(
    data: Prisma.BorrowItemCreateManyInput[]
  ): Promise<{ count: number }>;
  findByBorrowRecordId(borrowRecordId: string): Promise<BorrowItem[]>;
  update(id: string, data: Prisma.BorrowItemUpdateInput): Promise<BorrowItem>;
  deleteByBorrowRecordId(borrowRecordId: string): Promise<{ count: number }>;
  delete(id: string): Promise<BorrowItem>;
}

export class BorrowItemRepository implements IBorrowItemRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Prisma.BorrowItemCreateInput): Promise<BorrowItem> {
    return await this.prisma.borrowItem.create({
      data,
      include: { book: true, borrowRecord: true },
    });
  }

  async createMany(
    data: Prisma.BorrowItemCreateManyInput[]
  ): Promise<{ count: number }> {
    return await this.prisma.borrowItem.createMany({
      data,
    });
  }

  async findByBorrowRecordId(borrowRecordId: string): Promise<BorrowItem[]> {
    return await this.prisma.borrowItem.findMany({
      where: { borrowRecordId, deletedAt: null },
      include: { book: true },
    });
  }

  async update(
    id: string,
    data: Prisma.BorrowItemUpdateInput
  ): Promise<BorrowItem> {
    return await this.prisma.borrowItem.update({
      where: { id, deletedAt: null },
      data,
      include: { book: true },
    });
  }

  async deleteByBorrowRecordId(
    borrowRecordId: string
  ): Promise<{ count: number }> {
    return await this.prisma.borrowItem.deleteMany({
      where: { borrowRecordId },
    });
  }

  async delete(id: string): Promise<BorrowItem> {
    return await this.prisma.borrowItem.delete({
      where: { id },
    });
  }
}
