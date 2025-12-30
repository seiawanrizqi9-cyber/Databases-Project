import type { BorrowRecord, Prisma, PrismaClient } from "../generated/client";
export interface IBorrowRecordRepository {
    list(skip: number, take: number, where: Prisma.BorrowRecordWhereInput, orderBy: Prisma.BorrowRecordOrderByWithRelationInput, include?: Prisma.BorrowRecordInclude): Promise<BorrowRecord[]>;
    countAll(where: Prisma.BorrowRecordWhereInput): Promise<number>;
    findById(id: string, include?: Prisma.BorrowRecordInclude): Promise<BorrowRecord | null>;
    findByMemberId(memberId: string, include?: Prisma.BorrowRecordInclude): Promise<BorrowRecord[]>;
    create(data: Prisma.BorrowRecordCreateInput): Promise<BorrowRecord>;
    update(id: string, data: Prisma.BorrowRecordUpdateInput): Promise<BorrowRecord>;
    softDelete(id: string): Promise<BorrowRecord>;
    findComplex(status: string): Promise<BorrowRecord[]>;
    getStats(): Promise<Prisma.GetBorrowRecordAggregateType<{
        _count: {
            id: true;
        };
    }>>;
    getBorrowRecordsByStatusStats(): Promise<(Prisma.PickEnumerable<Prisma.BorrowRecordGroupByOutputType, ["status"]> & {
        _count: {
            id: number;
        };
    })[]>;
}
export declare class BorrowRecordRepository implements IBorrowRecordRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.BorrowRecordWhereInput, orderBy: Prisma.BorrowRecordOrderByWithRelationInput, include?: Prisma.BorrowRecordInclude): Promise<BorrowRecord[]>;
    countAll(where: Prisma.BorrowRecordWhereInput): Promise<number>;
    findById(id: string, include?: Prisma.BorrowRecordInclude): Promise<BorrowRecord | null>;
    findByMemberId(memberId: string, include?: Prisma.BorrowRecordInclude): Promise<BorrowRecord[]>;
    create(data: Prisma.BorrowRecordCreateInput): Promise<BorrowRecord>;
    update(id: string, data: Prisma.BorrowRecordUpdateInput): Promise<BorrowRecord>;
    softDelete(id: string): Promise<BorrowRecord>;
    findComplex(status: string): Promise<BorrowRecord[]>;
    getStats(): Promise<Prisma.GetBorrowRecordAggregateType<{
        where: {
            deletedAt: null;
        };
        _count: {
            id: true;
        };
    }>>;
    getBorrowRecordsByStatusStats(): Promise<(Prisma.PickEnumerable<Prisma.BorrowRecordGroupByOutputType, "status"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
//# sourceMappingURL=borrowRecord.repository.d.ts.map