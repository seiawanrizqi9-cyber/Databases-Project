import type { BorrowRecord, Prisma, PrismaClient } from "../generated/client";
import type { IBorrowRecordRepository } from "../repository/borrowRecord.repository.js";
interface CreateBorrowRecordData {
    memberId: string;
    items: Array<{
        bookId: string;
        quantity: number;
    }>;
    dueDate: Date;
}
interface ReturnBorrowRecordData {
    borrowRecordId: string;
    returnItems: Array<{
        borrowItemId: string;
        quantity: number;
    }>;
}
interface FindAllBorrowRecordsParams {
    page: number;
    limit: number;
    search?: {
        memberEmail?: string;
        bookTitle?: string;
        status?: string;
    };
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
interface BorrowRecordWithDetails extends BorrowRecord {
    member?: any;
    items?: any[];
}
interface BorrowRecordListResponse {
    borrowRecords: BorrowRecordWithDetails[];
    total: number;
    totalPages: number;
    currentPage: number;
}
export interface IBorrowService {
    list(params: FindAllBorrowRecordsParams): Promise<BorrowRecordListResponse>;
    getById(id: string): Promise<BorrowRecordWithDetails>;
    create(data: CreateBorrowRecordData): Promise<BorrowRecordWithDetails>;
    returnBooks(data: ReturnBorrowRecordData): Promise<BorrowRecordWithDetails>;
    update(id: string, data: Partial<BorrowRecord>): Promise<BorrowRecordWithDetails>;
    delete(id: string): Promise<BorrowRecordWithDetails>;
    exec(): Promise<{
        overview: any;
        byStatus: any;
    }>;
}
export declare class BorrowService implements IBorrowService {
    private borrowRecordRepo;
    private prisma;
    constructor(borrowRecordRepo: IBorrowRecordRepository, prisma: PrismaClient);
    list(params: FindAllBorrowRecordsParams): Promise<BorrowRecordListResponse>;
    getById(id: string): Promise<BorrowRecordWithDetails>;
    create(data: CreateBorrowRecordData): Promise<BorrowRecordWithDetails>;
    returnBooks(data: ReturnBorrowRecordData): Promise<BorrowRecordWithDetails>;
    update(id: string, data: Partial<BorrowRecord>): Promise<BorrowRecordWithDetails>;
    delete(id: string): Promise<BorrowRecordWithDetails>;
    exec(): Promise<{
        overview: Prisma.GetBorrowRecordAggregateType<{
            _count: {
                id: true;
            };
        }>;
        byStatus: (Prisma.PickEnumerable<Prisma.BorrowRecordGroupByOutputType, [
            "status"
        ]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
}
export {};
//# sourceMappingURL=borrow.service.d.ts.map
