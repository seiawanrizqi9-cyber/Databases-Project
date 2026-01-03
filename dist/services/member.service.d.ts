import type { Member, Prisma } from "../generated/client";
import type { IMemberRepository } from "../repository/member.repository.js";
interface FindAllMembersParams {
    page: number;
    limit: number;
    search?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
interface MemberWithBorrowRecords extends Member {
    borrowRecords?: any[];
}
interface MemberListResponse {
    members: MemberWithBorrowRecords[];
    total: number;
    totalPages: number;
    currentPage: number;
}
export interface IMemberService {
    list(params: FindAllMembersParams): Promise<MemberListResponse>;
    getById(id: string): Promise<MemberWithBorrowRecords>;
    create(data: {
        email: string;
        name: string;
        phone?: string;
        address?: string;
    }): Promise<MemberWithBorrowRecords>;
    update(id: string, data: Partial<Member>): Promise<MemberWithBorrowRecords>;
    delete(id: string): Promise<MemberWithBorrowRecords>;
    exec(): Promise<{
        overview: any;
        byMonth: any;
    }>;
}
export declare class MemberService implements IMemberService {
    private memberRepo;
    constructor(memberRepo: IMemberRepository);
    list(params: FindAllMembersParams): Promise<MemberListResponse>;
    getById(id: string): Promise<MemberWithBorrowRecords>;
    create(data: {
        email: string;
        name: string;
        phone?: string;
        address?: string;
    }): Promise<MemberWithBorrowRecords>;
    update(id: string, data: Partial<Member>): Promise<MemberWithBorrowRecords>;
    delete(id: string): Promise<MemberWithBorrowRecords>;
    exec(): Promise<{
        overview: Prisma.GetMemberAggregateType<{
            _count: {
                id: true;
            };
        }>;
        byMonth: (Prisma.PickEnumerable<Prisma.MemberGroupByOutputType, [
            "createdAt"
        ]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
}
export {};
//# sourceMappingURL=member.service.d.ts.map
