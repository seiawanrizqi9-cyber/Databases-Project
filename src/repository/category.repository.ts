import type { Category, Prisma, PrismaClient } from "../generated/client";

export interface ICategoryRepository {
  list(
    skip: number,
    take: number,
    where: Prisma.CategoryWhereInput,
    orderBy: Prisma.CategoryOrderByWithRelationInput
  ): Promise<Category[]>;
  countAll(where: Prisma.CategoryWhereInput): Promise<number>;
  findById(id: number): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  create(data: Prisma.CategoryCreateInput): Promise<Category>;
  update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category>;
  delete(id: number): Promise<Category>;
  assignBookToCategory(bookId: string, categoryId: number): Promise<any>;
  removeBookFromCategory(bookId: string, categoryId: number): Promise<any>;
  
  // HANYA TAMBAH 3 METHOD INI (SAMA DENGAN PRODUCT):
  findComplex(name: string): Promise<Category[]>;
  getStats(): Promise<
    Prisma.GetCategoryAggregateType<{
      _count: { id: true };
    }>
  >;
  getCategoriesByNameStats(): Promise<(Prisma.PickEnumerable<Prisma.CategoryGroupByOutputType, ["name"]> & {
    _count: { id: number };
  })[]>;
}

export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async list(
    skip: number,
    take: number,
    where: Prisma.CategoryWhereInput,
    orderBy: Prisma.CategoryOrderByWithRelationInput
  ): Promise<Category[]> {
    return await this.prisma.category.findMany({
      skip,
      take,
      where, 
      orderBy,
      include: { books: { include: { book: true } } },
    });
  }

  async countAll(where: Prisma.CategoryWhereInput): Promise<number> {
    return await this.prisma.category.count({ where });
  }

  async findById(id: number): Promise<Category | null> {
    return await this.prisma.category.findUnique({
      where: { id }, 
      include: { books: { include: { book: true } } },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return await this.prisma.category.findUnique({ where: { name } });
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return await this.prisma.category.create({ 
      data,
      include: { books: { include: { book: true } } }
    });
  }

  async update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return await this.prisma.category.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
      include: { books: { include: { book: true } } }
    });
  }

  async delete(id: number): Promise<Category> {
    return await this.prisma.category.delete({
      where: { id },
      include: { books: { include: { book: true } } }
    });
  }

  async assignBookToCategory(bookId: string, categoryId: number): Promise<any> {
    return await this.prisma.bookCategory.create({
      data: { bookId, categoryId },
      include: { book: true, category: true },
    });
  }

  async removeBookFromCategory(bookId: string, categoryId: number): Promise<any> {
    return await this.prisma.bookCategory.delete({
      where: { bookId_categoryId: { bookId, categoryId } },
    });
  }

  // HANYA TAMBAH 3 METHOD INI (SAMA PERSIS DENGAN PRODUCT):

  // 1. Filter Kompleks
  async findComplex(name: string): Promise<Category[]> {
    return await this.prisma.category.findMany({
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
              {
                books: {
                  some: {}
                },
              },
            ],
          },
          { name: "Fiction" },
        ],
      },
    });
  }

  // 2. Aggregation
  async getStats() {
    return await this.prisma.category.aggregate({
      _count: {
        id: true,
      },
    });
  }

  // 3. Group By (SIMPLE - SAMA DENGAN PRODUCT)
  async getCategoriesByNameStats() {
    return await this.prisma.category.groupBy({
      by: ["name"],
      _count: {
        id: true,
      },
    });
  }
}