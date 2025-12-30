import type { User, Prisma, PrismaClient } from "../generated/client";
export interface IAuthRepository {
    findUserByEmail(email: string): Promise<User | null>;
    createUser(data: Prisma.UserCreateInput): Promise<User>;
    updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User>;
    updateUserPassword(id: number, passwordHash: string): Promise<User>;
    findMemberByEmail(email: string): Promise<any | null>;
    createMember(data: Prisma.MemberCreateInput): Promise<any>;
    updateMember(id: string, data: Prisma.MemberUpdateInput): Promise<any>;
}
export declare class AuthRepository implements IAuthRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findUserByEmail(email: string): Promise<User | null>;
    createUser(data: Prisma.UserCreateInput): Promise<User>;
    updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User>;
    updateUserPassword(id: number, passwordHash: string): Promise<User>;
    findMemberByEmail(email: string): Promise<any | null>;
    createMember(data: Prisma.MemberCreateInput): Promise<any>;
    updateMember(id: string, data: Prisma.MemberUpdateInput): Promise<any>;
}
//# sourceMappingURL=auth.repository.d.ts.map