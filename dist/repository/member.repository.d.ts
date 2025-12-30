import type { Member, Prisma, PrismaClient } from "../generated/client";
export interface IMemberRepository {
    list(skip: number, take: number, where: Prisma.MemberWhereInput, orderBy: Prisma.MemberOrderByWithRelationInput, include?: Prisma.MemberInclude): Promise<Member[]>;
    countAll(where: Prisma.MemberWhereInput): Promise<number>;
    findById(id: string, include?: Prisma.MemberInclude): Promise<Member | null>;
    findByEmail(email: string): Promise<Member | null>;
    create(data: Prisma.MemberCreateInput): Promise<Member>;
    update(id: string, data: Prisma.MemberUpdateInput): Promise<Member>;
    softDelete(id: string): Promise<Member>;
    findComplex(email: string): Promise<Member[]>;
    getStats(): Promise<Prisma.GetMemberAggregateType<{
        _count: {
            id: true;
        };
    }>>;
    getMembersByMonthStats(): Promise<(Prisma.PickEnumerable<Prisma.MemberGroupByOutputType, ["createdAt"]> & {
        _count: {
            id: number;
        };
    })[]>;
}
export declare class MemberRepository implements IMemberRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.MemberWhereInput, orderBy: Prisma.MemberOrderByWithRelationInput, include?: Prisma.MemberInclude): Promise<Member[]>;
    countAll(where: Prisma.MemberWhereInput): Promise<number>;
    findById(id: string, include?: Prisma.MemberInclude): Promise<Member | null>;
    findByEmail(email: string): Promise<Member | null>;
    create(data: Prisma.MemberCreateInput): Promise<Member>;
    update(id: string, data: Prisma.MemberUpdateInput): Promise<Member>;
    softDelete(id: string): Promise<Member>;
    findComplex(email: string): Promise<Member[]>;
    getStats(): Promise<Prisma.GetMemberAggregateType<{
        where: {
            deletedAt: null;
        };
        _count: {
            id: true;
        };
    }>>;
    getMembersByMonthStats(): Promise<(Prisma.PickEnumerable<Prisma.MemberGroupByOutputType, "createdAt"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
//# sourceMappingURL=member.repository.d.ts.map