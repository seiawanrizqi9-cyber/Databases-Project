import type { Decimal } from "@prisma/client/runtime/client";
import type { Book, Prisma, PrismaClient } from "../generated/client";
export interface IBookRepository {
    list(skip: number, take: number, where: Prisma.BookWhereInput, orderBy: Prisma.BookOrderByWithRelationInput, include?: Prisma.BookInclude): Promise<Book[]>;
    countAll(where: Prisma.BookWhereInput): Promise<number>;
    findById(id: string, include?: Prisma.BookInclude): Promise<Book | null>;
    create(data: Prisma.BookCreateInput): Promise<Book>;
    update(id: string, data: Prisma.BookUpdateInput): Promise<Book>;
    softDelete(id: string): Promise<Book>;
    updateStock(id: string, change: number): Promise<Book>;
    findComplex(genre: string, maxPrice: number): Promise<Book[]>;
    getStats(): Promise<Prisma.GetBookAggregateType<{
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
    }>>;
    getBooksByGenreStats(): Promise<(Prisma.PickEnumerable<Prisma.BookGroupByOutputType, ["genre"]> & {
        _avg: {
            price: Decimal | null;
        };
        _count: {
            id: number;
        };
    })[]>;
}
export declare class BookRepository implements IBookRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.BookWhereInput, orderBy: Prisma.BookOrderByWithRelationInput, include?: Prisma.BookInclude): Promise<Book[]>;
    countAll(where: Prisma.BookWhereInput): Promise<number>;
    findById(id: string, include?: Prisma.BookInclude): Promise<Book | null>;
    create(data: Prisma.BookCreateInput): Promise<Book>;
    update(id: string, data: Prisma.BookUpdateInput): Promise<Book>;
    softDelete(id: string): Promise<Book>;
    updateStock(id: string, change: number): Promise<Book>;
    findComplex(genre: string, maxPrice: number): Promise<Book[]>;
    getStats(): Promise<Prisma.GetBookAggregateType<{
        where: {
            deletedAt: null;
        };
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
    }>>;
    getBooksByGenreStats(): Promise<(Prisma.PickEnumerable<Prisma.BookGroupByOutputType, "genre"[]> & {
        _count: {
            id: number;
        };
        _avg: {
            price: Decimal | null;
        };
    })[]>;
}
//# sourceMappingURL=book.repository.d.ts.map