import type { Author, Prisma, PrismaClient } from "../generated/client";
import type { IAuthorRepository } from "../repository/author.repository";

interface FindAllAuthorsParams {
  page: number;
  limit: number;
  search?: {
    name?: string;
    nationality?: string;
  };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface AuthorWithBooks extends Author {
  books?: any[];
}

interface AuthorListResponse {
  authors: AuthorWithBooks[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface IAuthorService {
  list(params: FindAllAuthorsParams): Promise<AuthorListResponse>;
  getById(id: string): Promise<AuthorWithBooks>;
  create(data: {
    name: string;
    bio?: string;
    nationality?: string;
  }): Promise<AuthorWithBooks>;
  update(id: string, data: Partial<Author>): Promise<AuthorWithBooks>;
  delete(id: string): Promise<AuthorWithBooks>;
  
  exec(): Promise<{ overview: any; byNationality: any }>;
}

export class AuthorService implements IAuthorService {
  constructor(
    private authorRepo: IAuthorRepository,
    private prisma: PrismaClient
  ) {}

  async list(params: FindAllAuthorsParams): Promise<AuthorListResponse> {
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.AuthorWhereInput = {
      deletedAt: null,
    };

    if (search?.name) {
      whereClause.name = {
        contains: search.name,
        mode: "insensitive",
      };
    }

    if (search?.nationality) {
      whereClause.nationality = {
        contains: search.nationality,
        mode: "insensitive",
      };
    }

    const sortCriteria: Prisma.AuthorOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || "desc" }
      : { name: "asc" };

    const authors = await this.authorRepo.list(
      skip,
      limit,
      whereClause,
      sortCriteria
    );

    const total = await this.authorRepo.countAll(whereClause);

    return {
      authors: authors as AuthorWithBooks[],
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getById(id: string): Promise<AuthorWithBooks> {
    const author = await this.authorRepo.findById(id);

    if (!author) {
      throw new Error("Author tidak ditemukan");
    }

    return author as AuthorWithBooks;
  }

  async create(data: {
    name: string;
    bio?: string;
    nationality?: string;
  }): Promise<AuthorWithBooks> {
    if (data.nationality) {
      const existingAuthor = await this.prisma.author.findFirst({
        where: {
          name: data.name,
          nationality: data.nationality,
          deletedAt: null,
        },
      });

      if (existingAuthor) {
        throw new Error("Author dengan nama dan kebangsaan yang sama sudah ada");
      }
    }

    return await this.authorRepo.create(data) as AuthorWithBooks;
  }

  async update(id: string, data: Partial<Author>): Promise<AuthorWithBooks> {
    const author = await this.authorRepo.findById(id);
    if (!author) {
      throw new Error("Author tidak ditemukan");
    }

    if (data.name || data.nationality) {
      const nameToCheck = data.name || author.name;
      const nationalityToCheck = data.nationality || (author as any).nationality;

      if (nationalityToCheck) {
        const existingAuthor = await this.prisma.author.findFirst({
          where: {
            name: nameToCheck,
            nationality: nationalityToCheck,
            deletedAt: null,
            NOT: { id: id }
          },
        });

        if (existingAuthor) {
          throw new Error("Author dengan nama dan kebangsaan yang sama sudah ada");
        }
      }
    }

    return await this.authorRepo.update(id, data as Prisma.AuthorUpdateInput) as AuthorWithBooks;
  }

  async delete(id: string): Promise<AuthorWithBooks> {
    const author = await this.authorRepo.findById(id, {
      books: {
        where: { deletedAt: null }
      }
    });

    if (!author) {
      throw new Error("Author tidak ditemukan");
    }

    const authorWithBooks = author as AuthorWithBooks;
    if (authorWithBooks.books && authorWithBooks.books.length > 0) {
      throw new Error("Tidak dapat menghapus author yang masih memiliki buku");
    }

    return await this.authorRepo.softDelete(id) as AuthorWithBooks;
  }

  async exec() {
    const overview = await this.authorRepo.getStats();
    const byNationality = await this.authorRepo.getAuthorsByNationalityStats();

    return { overview, byNationality };
  }
}