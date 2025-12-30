import type { Author, Prisma, PrismaClient } from "../generated/client";
export interface IAuthorRepository {
    list(skip: number, take: number, where: Prisma.AuthorWhereInput, orderBy: Prisma.AuthorOrderByWithRelationInput, include?: Prisma.AuthorInclude): Promise<Author[]>;
    countAll(where: Prisma.AuthorWhereInput): Promise<number>;
    findById(id: string, include?: Prisma.AuthorInclude): Promise<Author | null>;
    create(data: Prisma.AuthorCreateInput): Promise<Author>;
    update(id: string, data: Prisma.AuthorUpdateInput): Promise<Author>;
    softDelete(id: string): Promise<Author>;
    findComplex(name: string, nationality?: string): Promise<Author[]>;
    getStats(): Promise<Prisma.GetAuthorAggregateType<{
        _count: {
            id: true;
        };
    }>>;
    getAuthorsByNationalityStats(): Promise<(Prisma.PickEnumerable<Prisma.AuthorGroupByOutputType, ["nationality"]> & {
        _count: {
            id: number;
        };
    })[]>;
}
export declare class AuthorRepository implements IAuthorRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.AuthorWhereInput, orderBy: Prisma.AuthorOrderByWithRelationInput, include?: Prisma.AuthorInclude): Promise<Author[]>;
    countAll(where: Prisma.AuthorWhereInput): Promise<number>;
    findById(id: string, include?: Prisma.AuthorInclude): Promise<Author | null>;
    create(data: Prisma.AuthorCreateInput): Promise<Author>;
    update(id: string, data: Prisma.AuthorUpdateInput): Promise<Author>;
    softDelete(id: string): Promise<Author>;
    findComplex(name: string, nationality?: string): Promise<Author[]>;
    getStats(): Promise<Prisma.GetAuthorAggregateType<{
        where: {
            deletedAt: null;
        };
        _count: {
            id: true;
        };
    }>>;
    getAuthorsByNationalityStats(): Promise<(Prisma.PickEnumerable<Prisma.AuthorGroupByOutputType, "nationality"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
//# sourceMappingURL=author.repository.d.ts.map