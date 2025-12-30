import type { Category, Prisma, PrismaClient } from "../generated/client";
import type { ICategoryRepository } from "../repository/category.repository";

interface FindAllParams {
  page: number;
  limit: number;
  search?: { name?: string };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface CategoryWithBooks extends Category {
  books?: any[];
}

interface CategoryListResponse {
  categories: CategoryWithBooks[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface ICategoryService {
  list(params: FindAllParams): Promise<CategoryListResponse>;
  getById(id: string): Promise<CategoryWithBooks>;
  create(name: string): Promise<CategoryWithBooks>;
  update(id: string, name: string): Promise<CategoryWithBooks>;
  delete(id: string): Promise<CategoryWithBooks>;
  assignBook(bookId: string, categoryId: number): Promise<any>;
  removeBook(bookId: string, categoryId: number): Promise<any>;
  
  // HANYA TAMBAH 1 METHOD INI:
  exec(): Promise<{ overview: any; byBookCount: any }>;
}

export class CategoryService implements ICategoryService {
  constructor(
    private categoryRepo: ICategoryRepository,
    private prisma: PrismaClient
  ) {}

  async list(params: FindAllParams): Promise<CategoryListResponse> {
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.CategoryWhereInput = {};
    if (search?.name) {
      whereClause.name = { contains: search.name, mode: "insensitive" };
    }

    const sortCriteria: Prisma.CategoryOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || "desc" }
      : { createdAt: "desc" };

    const categories = await this.categoryRepo.list(skip, limit, whereClause, sortCriteria);
    const total = await this.categoryRepo.countAll(whereClause);

    return {
      categories,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getById(id: string): Promise<CategoryWithBooks> {
    const numId = parseInt(id);
    const category = await this.categoryRepo.findById(numId);
    if (!category) throw new Error("Kategori tidak ditemukan");
    return category as CategoryWithBooks;
  }

  async create(name: string): Promise<CategoryWithBooks> {
    const existingCategory = await this.categoryRepo.findByName(name);
    if (existingCategory) throw new Error("Nama kategori sudah ada");
    return await this.categoryRepo.create({ name }) as CategoryWithBooks;
  }

  async update(id: string, name: string): Promise<CategoryWithBooks> {
    const numId = parseInt(id);
    const category = await this.categoryRepo.findById(numId);
    if (!category) throw new Error("Kategori tidak ditemukan");
    
    const existingCategory = await this.categoryRepo.findByName(name);
    if (existingCategory && existingCategory.id !== numId) {
      throw new Error("Nama kategori sudah digunakan");
    }

    return await this.categoryRepo.update(numId, { name }) as CategoryWithBooks;
  }

  async delete(id: string): Promise<CategoryWithBooks> {
    const numId = parseInt(id);
    const category = await this.categoryRepo.findById(numId);
    if (!category) throw new Error("Kategori tidak ditemukan");
    
    const categoryWithBooks = category as CategoryWithBooks;
    if (categoryWithBooks.books && categoryWithBooks.books.length > 0) {
      throw new Error("Tidak dapat menghapus kategori yang masih memiliki buku");
    }

    return await this.categoryRepo.delete(numId) as CategoryWithBooks;
  }

  async assignBook(bookId: string, categoryId: number): Promise<any> {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId, deletedAt: null },
    });
    if (!book) throw new Error("Buku tidak ditemukan");
    
    const category = await this.categoryRepo.findById(categoryId);
    if (!category) throw new Error("Kategori tidak ditemukan");
    
    const existingRelation = await this.prisma.bookCategory.findUnique({
      where: { bookId_categoryId: { bookId, categoryId } },
    });
    if (existingRelation) throw new Error("Buku sudah ada di kategori ini");

    return await this.categoryRepo.assignBookToCategory(bookId, categoryId);
  }

  async removeBook(bookId: string, categoryId: number): Promise<any> {
    const existingRelation = await this.prisma.bookCategory.findUnique({
      where: { bookId_categoryId: { bookId, categoryId } },
    });
    if (!existingRelation) throw new Error("Relasi buku-kategori tidak ditemukan");

    return await this.categoryRepo.removeBookFromCategory(bookId, categoryId);
  }

  // HANYA TAMBAH 1 METHOD INI:
  async exec() {
    const overview = await this.categoryRepo.getStats();
    const byBookCount = await this.categoryRepo.getCategoriesByNameStats();

    return { overview, byBookCount };
  }
}