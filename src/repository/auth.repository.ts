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

export class AuthRepository implements IAuthRepository {
  constructor(private prisma: PrismaClient) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ 
      where: { email, deletedAt: null } 
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateUserPassword(id: number, passwordHash: string): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: { password_hash: passwordHash },
    });
  }

  async findMemberByEmail(email: string): Promise<any | null> {
    return await this.prisma.member.findUnique({
      where: { email, deletedAt: null }
    });
  }

  async createMember(data: Prisma.MemberCreateInput): Promise<any> {
    return await this.prisma.member.create({
      data
    });
  }

  async updateMember(id: string, data: Prisma.MemberUpdateInput): Promise<any> {
    return await this.prisma.member.update({
      where: { id },
      data
    });
  }
}