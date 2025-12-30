import type { Author, Prisma, PrismaClient } from "../generated/client";

export interface IAuthorRepository {
  list(
    skip: number,
    take: number,
    where: Prisma.AuthorWhereInput,
    orderBy: Prisma.AuthorOrderByWithRelationInput,
    include?: Prisma.AuthorInclude
  ): Promise<Author[]>;
  countAll(where: Prisma.AuthorWhereInput): Promise<number>;
  findById(id: string, include?: Prisma.AuthorInclude): Promise<Author | null>;
  create(data: Prisma.AuthorCreateInput): Promise<Author>;
  update(id: string, data: Prisma.AuthorUpdateInput): Promise<Author>;
  softDelete(id: string): Promise<Author>;
  
  // HANYA TAMBAH 3 METHOD INI:
  findComplex(name: string, nationality?: string): Promise<Author[]>;
  getStats(): Promise<
    Prisma.GetAuthorAggregateType<{
      _count: { id: true };
    }>
  >;
  getAuthorsByNationalityStats(): Promise<(Prisma.PickEnumerable<Prisma.AuthorGroupByOutputType, ["nationality"]> & {
    _count: { id: number };
  })[]>;
}

export class AuthorRepository implements IAuthorRepository {
  constructor(private prisma: PrismaClient) {}

  async list(
    skip: number,
    take: number,
    where: Prisma.AuthorWhereInput,
    orderBy: Prisma.AuthorOrderByWithRelationInput,
    include?: Prisma.AuthorInclude
  ): Promise<Author[]> {
    return await this.prisma.author.findMany({
      skip,
      take,
      where: { ...where, deletedAt: null },
      orderBy,
      include: include || { books: true },
    });
  }

  async countAll(where: Prisma.AuthorWhereInput): Promise<number> {
    return await this.prisma.author.count({ 
      where: { ...where, deletedAt: null } 
    });
  }

  async findById(id: string, include?: Prisma.AuthorInclude): Promise<Author | null> {
    return await this.prisma.author.findUnique({
      where: { id, deletedAt: null },
      include: include || { books: { where: { deletedAt: null } } },
    });
  }

  async create(data: Prisma.AuthorCreateInput): Promise<Author> {
    return await this.prisma.author.create({ 
      data,
      include: { books: true }
    });
  }

  async update(id: string, data: Prisma.AuthorUpdateInput): Promise<Author> {
    return await this.prisma.author.update({ 
      where: { id, deletedAt: null }, 
      data,
      include: { books: true }
    });
  }

  async softDelete(id: string): Promise<Author> {
    return await this.prisma.author.update({
      where: { id, deletedAt: null },
      data: { 
        deletedAt: new Date(),
        updatedAt: new Date()
      },
    });
  }

  // HANYA TAMBAH 3 METHOD INI:

  // 1. Filter Kompleks (SAMA DENGAN PRODUCT)
  async findComplex(name: string, nationality?: string): Promise<Author[]> {
    return await this.prisma.author.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                name: {
                  contains: name,
                  mode: 'insensitive',
                },
              },
              nationality ? {
                nationality: {
                  contains: nationality,
                  mode: 'insensitive',
                },
              } : {},
            ],
          },
          { nationality: "Indonesia" },
        ],
        deletedAt: null,
      },
    });
  }

  // 2. Aggregation (SAMA DENGAN PRODUCT)
  async getStats() {
    return await this.prisma.author.aggregate({
      where: { deletedAt: null },
      _count: {
        id: true,
      },
    });
  }

  // 3. Group By (SAMA DENGAN PRODUCT)
  async getAuthorsByNationalityStats() {
    return await this.prisma.author.groupBy({
      where: { deletedAt: null },
      by: ["nationality"],
      _count: {
        id: true,
      },
    });
  }
}