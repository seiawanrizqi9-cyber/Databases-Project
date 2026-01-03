import type { Category, Prisma, PrismaClient } from "../generated/client";
import type { ICategoryRepository } from "../repository/category.repository.js";
interface FindAllParams {
    page: number;
    limit: number;
    search?: {
        name?: string;
    };
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
    exec(): Promise<{
        overview: any;
        byBookCount: any;
    }>;
}
export declare class CategoryService implements ICategoryService {
    private categoryRepo;
    private prisma;
    constructor(categoryRepo: ICategoryRepository, prisma: PrismaClient);
    list(params: FindAllParams): Promise<CategoryListResponse>;
    getById(id: string): Promise<CategoryWithBooks>;
    create(name: string): Promise<CategoryWithBooks>;
    update(id: string, name: string): Promise<CategoryWithBooks>;
    delete(id: string): Promise<CategoryWithBooks>;
    assignBook(bookId: string, categoryId: number): Promise<any>;
    removeBook(bookId: string, categoryId: number): Promise<any>;
    exec(): Promise<{
        overview: Prisma.GetCategoryAggregateType<{
            _count: {
                id: true;
            };
        }>;
        byBookCount: (Prisma.PickEnumerable<Prisma.CategoryGroupByOutputType, [
            "name"
        ]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
}
export {};
//# sourceMappingURL=category.service.d.ts.map
