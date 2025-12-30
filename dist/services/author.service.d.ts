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
    exec(): Promise<{
        overview: any;
        byNationality: any;
    }>;
}
export declare class AuthorService implements IAuthorService {
    private authorRepo;
    private prisma;
    constructor(authorRepo: IAuthorRepository, prisma: PrismaClient);
    list(params: FindAllAuthorsParams): Promise<AuthorListResponse>;
    getById(id: string): Promise<AuthorWithBooks>;
    create(data: {
        name: string;
        bio?: string;
        nationality?: string;
    }): Promise<AuthorWithBooks>;
    update(id: string, data: Partial<Author>): Promise<AuthorWithBooks>;
    delete(id: string): Promise<AuthorWithBooks>;
    exec(): Promise<{
        overview: Prisma.GetAuthorAggregateType<{
            _count: {
                id: true;
            };
        }>;
        byNationality: (Prisma.PickEnumerable<Prisma.AuthorGroupByOutputType, ["nationality"]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
}
export {};
//# sourceMappingURL=author.service.d.ts.map