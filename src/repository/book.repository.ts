import type { Decimal } from "@prisma/client/runtime/client";
import type { Book, Prisma, PrismaClient } from "../generated/client";

export interface IBookRepository {
  list(
    skip: number,
    take: number,
    where: Prisma.BookWhereInput,
    orderBy: Prisma.BookOrderByWithRelationInput,
    include?: Prisma.BookInclude
  ): Promise<Book[]>;
  countAll(where: Prisma.BookWhereInput): Promise<number>;
  findById(id: string, include?: Prisma.BookInclude): Promise<Book | null>;
  create(data: Prisma.BookCreateInput): Promise<Book>;
  update(id: string, data: Prisma.BookUpdateInput): Promise<Book>;
  softDelete(id: string): Promise<Book>;
  updateStock(id: string, change: number): Promise<Book>;
  
  // HANYA TAMBAH 3 METHOD INI:
  findComplex(genre: string, maxPrice: number): Promise<Book[]>;
  getStats(): Promise<
    Prisma.GetBookAggregateType<{
      _count: { id: true };
      _avg: { price: true };
      _sum: { price: true };
      _min: { price: true };
      _max: { price: true };
    }>
  >;
  getBooksByGenreStats(): Promise<(Prisma.PickEnumerable<Prisma.BookGroupByOutputType, ["genre"]> & {
    _avg: { price: Decimal | null };
    _count: { id: number };
  })[]>;
}

export class BookRepository implements IBookRepository {
  constructor(private prisma: PrismaClient) {}

  async list(
    skip: number,
    take: number,
    where: Prisma.BookWhereInput,
    orderBy: Prisma.BookOrderByWithRelationInput,
    include?: Prisma.BookInclude
  ): Promise<Book[]> {
    return await this.prisma.book.findMany({
      skip,
      take,
      where,
      orderBy,
      include: include || { author: true },
    });
  }

  async countAll(where: Prisma.BookWhereInput): Promise<number> {
    return await this.prisma.book.count({ where });
  }

  async findById(id: string, include?: Prisma.BookInclude): Promise<Book | null> {
    return await this.prisma.book.findUnique({
      where: { id, deletedAt: null },
      include: include || { 
        author: true, 
        borrowItems: { include: { borrowRecord: true } } 
      },
    });
  }

  async create(data: Prisma.BookCreateInput): Promise<Book> {
    return await this.prisma.book.create({ 
      data,
      include: { author: true }
    });
  }

  async update(id: string, data: Prisma.BookUpdateInput): Promise<Book> {
    return await this.prisma.book.update({ 
      where: { id, deletedAt: null }, 
      data,
      include: { author: true }
    });
  }

  async softDelete(id: string): Promise<Book> {
    return await this.prisma.book.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  async updateStock(id: string, change: number): Promise<Book> {
    return await this.prisma.book.update({
      where: { id, deletedAt: null },
      data: { stock: { increment: change } },
    });
  }

  // HANYA TAMBAH 3 METHOD INI:

  // 1. Filter Kompleks
  async findComplex(genre: string, maxPrice: number): Promise<Book[]> {
    return await this.prisma.book.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                genre: {
                  contains: genre,
                  mode: 'insensitive',
                },
              },
              {
                price: {
                  lte: maxPrice,
                },
              },
            ],
          },
          { genre: "Fiction" },
        ],
        deletedAt: null,
      },
    });
  }

  // 2. Aggregation
  async getStats() {
    return await this.prisma.book.aggregate({
      where: { deletedAt: null },
      _count: {
        id: true,
      },
      _avg: {
        price: true,
      },
      _sum: {
        price: true,
      },
      _min: {
        price: true,
      },
      _max: {
        price: true,
      },
    });
  }

  // 3. Group By
  async getBooksByGenreStats() {
    return await this.prisma.book.groupBy({
      where: { deletedAt: null },
      by: ["genre"],
      _count: {
        id: true,
      },
      _avg: {
        price: true,
      },
    });
  }
}