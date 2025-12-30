import type { BorrowItem, Prisma, PrismaClient } from "../generated/client";
export interface IBorrowItemRepository {
    create(data: Prisma.BorrowItemCreateInput): Promise<BorrowItem>;
    createMany(data: Prisma.BorrowItemCreateManyInput[]): Promise<{
        count: number;
    }>;
    findByBorrowRecordId(borrowRecordId: string): Promise<BorrowItem[]>;
    update(id: string, data: Prisma.BorrowItemUpdateInput): Promise<BorrowItem>;
    deleteByBorrowRecordId(borrowRecordId: string): Promise<{
        count: number;
    }>;
    delete(id: string): Promise<BorrowItem>;
}
export declare class BorrowItemRepository implements IBorrowItemRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    create(data: Prisma.BorrowItemCreateInput): Promise<BorrowItem>;
    createMany(data: Prisma.BorrowItemCreateManyInput[]): Promise<{
        count: number;
    }>;
    findByBorrowRecordId(borrowRecordId: string): Promise<BorrowItem[]>;
    update(id: string, data: Prisma.BorrowItemUpdateInput): Promise<BorrowItem>;
    deleteByBorrowRecordId(borrowRecordId: string): Promise<{
        count: number;
    }>;
    delete(id: string): Promise<BorrowItem>;
}
//# sourceMappingURL=borrowItem.repository.d.ts.map