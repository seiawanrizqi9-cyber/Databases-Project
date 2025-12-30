import type { BorrowRecord, Prisma, PrismaClient } from "../generated/client";

export interface IBorrowRecordRepository {
  list(
    skip: number,
    take: number,
    where: Prisma.BorrowRecordWhereInput,
    orderBy: Prisma.BorrowRecordOrderByWithRelationInput,
    include?: Prisma.BorrowRecordInclude
  ): Promise<BorrowRecord[]>;
  countAll(where: Prisma.BorrowRecordWhereInput): Promise<number>;
  findById(
    id: string,
    include?: Prisma.BorrowRecordInclude
  ): Promise<BorrowRecord | null>;
  findByMemberId(
    memberId: string,
    include?: Prisma.BorrowRecordInclude
  ): Promise<BorrowRecord[]>;
  create(data: Prisma.BorrowRecordCreateInput): Promise<BorrowRecord>;
  update(
    id: string,
    data: Prisma.BorrowRecordUpdateInput
  ): Promise<BorrowRecord>;
  softDelete(id: string): Promise<BorrowRecord>;
  findComplex(status: string): Promise<BorrowRecord[]>;
  getStats(): Promise<
    Prisma.GetBorrowRecordAggregateType<{
      _count: { id: true };
    }>
  >;
  getBorrowRecordsByStatusStats(): Promise<
    (Prisma.PickEnumerable<Prisma.BorrowRecordGroupByOutputType, ["status"]> & {
      _count: { id: number };
    })[]
  >;
}

export class BorrowRecordRepository implements IBorrowRecordRepository {
  constructor(private prisma: PrismaClient) {}

  async list(
    skip: number,
    take: number,
    where: Prisma.BorrowRecordWhereInput,
    orderBy: Prisma.BorrowRecordOrderByWithRelationInput,
    include?: Prisma.BorrowRecordInclude
  ): Promise<BorrowRecord[]> {
    return await this.prisma.borrowRecord.findMany({
      skip,
      take,
      where: { ...where, deletedAt: null },
      orderBy,
      include: include || {
        member: true,
        items: { include: { book: true } },
      },
    });
  }

  async countAll(where: Prisma.BorrowRecordWhereInput): Promise<number> {
    return await this.prisma.borrowRecord.count({
      where: { ...where, deletedAt: null },
    });
  }

  async findById(
    id: string,
    include?: Prisma.BorrowRecordInclude
  ): Promise<BorrowRecord | null> {
    return await this.prisma.borrowRecord.findUnique({
      where: { id, deletedAt: null },
      include: include || {
        member: true,
        items: { include: { book: true } },
      },
    });
  }

  async findByMemberId(
    memberId: string,
    include?: Prisma.BorrowRecordInclude
  ): Promise<BorrowRecord[]> {
    return await this.prisma.borrowRecord.findMany({
      where: { memberId, deletedAt: null },
      include: include || {
        member: true,
        items: { include: { book: true } },
      },
      orderBy: { borrowDate: "desc" },
    });
  }

  async create(data: Prisma.BorrowRecordCreateInput): Promise<BorrowRecord> {
    return await this.prisma.borrowRecord.create({
      data,
      include: {
        member: true,
        items: { include: { book: true } },
      },
    });
  }

  async update(
    id: string,
    data: Prisma.BorrowRecordUpdateInput
  ): Promise<BorrowRecord> {
    return await this.prisma.borrowRecord.update({
      where: { id, deletedAt: null },
      data,
      include: {
        member: true,
        items: { include: { book: true } },
      },
    });
  }

  async softDelete(id: string): Promise<BorrowRecord> {
    return await this.prisma.borrowRecord.update({
      where: { id, deletedAt: null },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  // HANYA TAMBAH 3 METHOD INI (SAMA PERSIS DENGAN PRODUCT):

  // 1. Filter Kompleks
  async findComplex(status: string): Promise<BorrowRecord[]> {
    return await this.prisma.borrowRecord.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                status: status as any, // CAST ke any karena enum
              },
              {
                items: {
                  some: {},
                },
              },
            ],
          },
          { status: "ACTIVE" as any }, // CAST ke any
        ],
        deletedAt: null,
      },
    });
  }

  // 2. Aggregation
  async getStats() {
    return await this.prisma.borrowRecord.aggregate({
      where: { deletedAt: null },
      _count: {
        id: true,
      },
    });
  }

  // 3. Group By (SIMPLE)
  async getBorrowRecordsByStatusStats() {
    return await this.prisma.borrowRecord.groupBy({
      where: { deletedAt: null },
      by: ["status"],
      _count: {
        id: true,
      },
    });
  }
}
