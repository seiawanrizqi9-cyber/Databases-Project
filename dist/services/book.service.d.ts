import type { Book, Prisma, PrismaClient } from "../generated/client";
import type { IBookRepository } from "../repository/book.repository.js";
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
    exec(): Promise<{
        overview: any;
        byGenre: any;
    }>;
}
export declare class BookService implements IBookService {
    private bookRepo;
    private prisma;
    constructor(bookRepo: IBookRepository, prisma: PrismaClient);
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
    exec(): Promise<{
        overview: Prisma.GetBookAggregateType<{
            _count: {
                id: true;
            };
            _avg: {
                price: true;
            };
            _sum: {
                price: true;
            };
            _min: {
                price: true;
            };
            _max: {
                price: true;
            };
        }>;
        byGenre: (Prisma.PickEnumerable<Prisma.BookGroupByOutputType, [
            "genre"
        ]> & {
            _avg: {
                price: Prisma.Decimal | null;
            };
            _count: {
                id: number;
            };
        })[];
    }>;
}
export {};
//# sourceMappingURL=book.service.d.ts.map
