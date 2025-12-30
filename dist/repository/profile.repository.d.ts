import type { Profile, Prisma, PrismaClient } from "../generated/client";
export interface IProfileRepository {
    list(skip: number, take: number, where: Prisma.ProfileWhereInput, orderBy: Prisma.ProfileOrderByWithRelationInput, include?: Prisma.ProfileInclude): Promise<Profile[]>;
    countAll(where: Prisma.ProfileWhereInput): Promise<number>;
    findById(id: number, include?: Prisma.ProfileInclude): Promise<Profile | null>;
    findByUserId(userId: number, include?: Prisma.ProfileInclude): Promise<Profile | null>;
    create(data: Prisma.ProfileCreateInput): Promise<Profile>;
    update(id: number, data: Prisma.ProfileUpdateInput): Promise<Profile>;
    softDelete(id: number): Promise<Profile>;
    findComplex(name: string): Promise<Profile[]>;
    getStats(): Promise<Prisma.GetProfileAggregateType<{
        _count: {
            id: true;
        };
    }>>;
    getProfilesByGenderStats(): Promise<(Prisma.PickEnumerable<Prisma.ProfileGroupByOutputType, ["gender"]> & {
        _count: {
            id: number;
        };
    })[]>;
}
export declare class ProfileRepository implements IProfileRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.ProfileWhereInput, orderBy: Prisma.ProfileOrderByWithRelationInput, include?: Prisma.ProfileInclude): Promise<Profile[]>;
    countAll(where: Prisma.ProfileWhereInput): Promise<number>;
    findById(id: number, include?: Prisma.ProfileInclude): Promise<Profile | null>;
    findByUserId(userId: number, include?: Prisma.ProfileInclude): Promise<Profile | null>;
    create(data: Prisma.ProfileCreateInput): Promise<Profile>;
    update(id: number, data: Prisma.ProfileUpdateInput): Promise<Profile>;
    softDelete(id: number): Promise<Profile>;
    findComplex(name: string): Promise<Profile[]>;
    getStats(): Promise<Prisma.GetProfileAggregateType<{
        where: {
            deletedAt: null;
        };
        _count: {
            id: true;
        };
    }>>;
    getProfilesByGenderStats(): Promise<(Prisma.PickEnumerable<Prisma.ProfileGroupByOutputType, "gender"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
//# sourceMappingURL=profile.repository.d.ts.map