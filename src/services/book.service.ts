import type { Book, Prisma, PrismaClient } from "../generated/client";
import type { IBookRepository } from "../repository/book.repository";

// Interface yang sudah ada TETAP SAMA...
interface FindAllBooksParams {
  page: number;
  limit: number;
  search?: {
    title?: string;
    authorName?: string;
    genre?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
  };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface BookListResponse {
  books: Book[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface IBookService {
  // SEMUA METHOD YANG SUDAH ADA TETAP SAMA...
  list(params: FindAllBooksParams): Promise<BookListResponse>;
  getById(id: string): Promise<Book>;
  create(data: {
    title: string;
    authorId: string;
    description?: string;
    year: number;
    genre: string;
    price: number;
    stock: number;
    image_url?: string;
  }): Promise<Book>;
  update(id: string, data: Partial<Book>): Promise<Book>;
  delete(id: string): Promise<Book>;
  checkStock(id: string): Promise<boolean>;
  updateStock(id: string, change: number): Promise<Book>;
  
  // HANYA TAMBAHKAN 1 METHOD INI (SESUAI REFERENSI):
  exec(): Promise<{ overview: any; byGenre: any }>;
}

export class BookService implements IBookService {
  constructor(
    private bookRepo: IBookRepository,
    private prisma: PrismaClient
  ) {}

  // SEMUA METHOD YANG SUDAH ADA TETAP SAMA PERSIS...
  async list(params: FindAllBooksParams): Promise<BookListResponse> {
    // KODE YANG SUDAH ADA TETAP SAMA...
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.BookWhereInput = {
      deletedAt: null,
    };

    if (search?.title) {
      whereClause.title = {
        contains: search.title,
        mode: "insensitive",
      };
    }

    if (search?.genre) {
      whereClause.genre = {
        contains: search.genre,
        mode: "insensitive",
      };
    }

    if (search?.minPrice !== undefined) {
      whereClause.price = {
        gte: search.minPrice,
      };
    }

    if (search?.maxPrice !== undefined) {
      whereClause.price = {
        lte: search.maxPrice,
      };
    }

    if (search?.minYear !== undefined) {
      whereClause.year = {
        gte: search.minYear,
      };
    }

    if (search?.maxYear !== undefined) {
      whereClause.year = {
        lte: search.maxYear,
      };
    }

    if (search?.authorName) {
      whereClause.author = {
        name: {
          contains: search.authorName,
          mode: "insensitive",
        },
        deletedAt: null,
      };
    }

    const sortCriteria: Prisma.BookOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || "desc" }
      : { createdAt: "desc" };

    const books = await this.bookRepo.list(
      skip,
      limit,
      whereClause,
      sortCriteria
    );

    const total = await this.bookRepo.countAll(whereClause);

    return {
      books,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getById(id: string): Promise<Book> {
    const book = await this.bookRepo.findById(id);

    if (!book) {
      throw new Error("Buku tidak ditemukan");
    }

    return book;
  }

  async create(data: {
    title: string;
    authorId: string;
    description?: string;
    year: number;
    genre: string;
    price: number;
    stock: number;
    image_url?: string;
  }): Promise<Book> {
    const author = await this.prisma.author.findUnique({
      where: { id: data.authorId, deletedAt: null },
    });

    if (!author) {
      throw new Error("Author tidak ditemukan");
    }

    const createData: Prisma.BookCreateInput = {
      title: data.title,
      description: data.description,
      year: data.year,
      genre: data.genre,
      price: data.price,
      stock: data.stock,
      author: {
        connect: { id: data.authorId }
      }
    };

    if (data.image_url) {
      createData.image_url = data.image_url;
    }

    return await this.bookRepo.create(createData);
  }

  async update(id: string, data: Partial<Book>): Promise<Book> {
    await this.getById(id);

    if (data.authorId) {
      const author = await this.prisma.author.findUnique({
        where: { id: data.authorId, deletedAt: null },
      });

      if (!author) {
        throw new Error("Author tidak ditemukan");
      }
    }

    return await this.bookRepo.update(id, data as Prisma.BookUpdateInput);
  }

  async delete(id: string): Promise<Book> {
    return await this.bookRepo.softDelete(id);
  }

  async checkStock(id: string): Promise<boolean> {
    const book = await this.getById(id);
    return book.stock > 0;
  }

  async updateStock(id: string, change: number): Promise<Book> {
    return await this.bookRepo.updateStock(id, change);
  }

  async exec() {
    const overview = await this.bookRepo.getStats();
    const byGenre = await this.bookRepo.getBooksByGenreStats();

    return { overview, byGenre };
  }
}