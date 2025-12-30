import type { Category, Prisma, PrismaClient } from "../generated/client";
export interface ICategoryRepository {
    list(skip: number, take: number, where: Prisma.CategoryWhereInput, orderBy: Prisma.CategoryOrderByWithRelationInput): Promise<Category[]>;
    countAll(where: Prisma.CategoryWhereInput): Promise<number>;
    findById(id: number): Promise<Category | null>;
    findByName(name: string): Promise<Category | null>;
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
    update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category>;
    delete(id: number): Promise<Category>;
    assignBookToCategory(bookId: string, categoryId: number): Promise<any>;
    removeBookFromCategory(bookId: string, categoryId: number): Promise<any>;
    findComplex(name: string): Promise<Category[]>;
    getStats(): Promise<Prisma.GetCategoryAggregateType<{
        _count: {
            id: true;
        };
    }>>;
    getCategoriesByNameStats(): Promise<(Prisma.PickEnumerable<Prisma.CategoryGroupByOutputType, ["name"]> & {
        _count: {
            id: number;
        };
    })[]>;
}
export declare class CategoryRepository implements ICategoryRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.CategoryWhereInput, orderBy: Prisma.CategoryOrderByWithRelationInput): Promise<Category[]>;
    countAll(where: Prisma.CategoryWhereInput): Promise<number>;
    findById(id: number): Promise<Category | null>;
    findByName(name: string): Promise<Category | null>;
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
    update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category>;
    delete(id: number): Promise<Category>;
    assignBookToCategory(bookId: string, categoryId: number): Promise<any>;
    removeBookFromCategory(bookId: string, categoryId: number): Promise<any>;
    findComplex(name: string): Promise<Category[]>;
    getStats(): Promise<Prisma.GetCategoryAggregateType<{
        _count: {
            id: true;
        };
    }>>;
    getCategoriesByNameStats(): Promise<(Prisma.PickEnumerable<Prisma.CategoryGroupByOutputType, "name"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
//# sourceMappingURL=category.repository.d.ts.map