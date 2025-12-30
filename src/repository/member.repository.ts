import type { Member, Prisma, PrismaClient } from "../generated/client";

export interface IMemberRepository {
  list(
    skip: number,
    take: number,
    where: Prisma.MemberWhereInput,
    orderBy: Prisma.MemberOrderByWithRelationInput,
    include?: Prisma.MemberInclude
  ): Promise<Member[]>;
  countAll(where: Prisma.MemberWhereInput): Promise<number>;
  findById(id: string, include?: Prisma.MemberInclude): Promise<Member | null>;
  findByEmail(email: string): Promise<Member | null>;
  create(data: Prisma.MemberCreateInput): Promise<Member>;
  update(id: string, data: Prisma.MemberUpdateInput): Promise<Member>;
  softDelete(id: string): Promise<Member>;
  
  // HANYA TAMBAH 3 METHOD INI (SAMA DENGAN PRODUCT):
  findComplex(email: string): Promise<Member[]>;
  getStats(): Promise<
    Prisma.GetMemberAggregateType<{
      _count: { id: true };
    }>
  >;
  getMembersByMonthStats(): Promise<(Prisma.PickEnumerable<Prisma.MemberGroupByOutputType, ["createdAt"]> & {
    _count: { id: number };
  })[]>;
}

export class MemberRepository implements IMemberRepository {
  constructor(private prisma: PrismaClient) {}

  async list(
    skip: number,
    take: number,
    where: Prisma.MemberWhereInput,
    orderBy: Prisma.MemberOrderByWithRelationInput,
    include?: Prisma.MemberInclude
  ): Promise<Member[]> {
    return await this.prisma.member.findMany({
      skip,
      take,
      where: { ...where, deletedAt: null },
      orderBy,
      include: include || {
        borrowRecords: {
          include: {
            items: {
              include: { book: true },
            },
          },
        },
      },
    });
  }

  async countAll(where: Prisma.MemberWhereInput): Promise<number> {
    return await this.prisma.member.count({ 
      where: { ...where, deletedAt: null } 
    });
  }

  async findById(id: string, include?: Prisma.MemberInclude): Promise<Member | null> {
    return await this.prisma.member.findUnique({
      where: { id, deletedAt: null },
      include: include || {
        borrowRecords: {
          include: {
            items: { include: { book: true } },
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<Member | null> {
    return await this.prisma.member.findUnique({
      where: { email, deletedAt: null },
    });
  }

  async create(data: Prisma.MemberCreateInput): Promise<Member> {
    return await this.prisma.member.create({ 
      data,
      include: {
        borrowRecords: {
          include: {
            items: { include: { book: true } },
          },
        },
      }
    });
  }

  async update(id: string, data: Prisma.MemberUpdateInput): Promise<Member> {
    return await this.prisma.member.update({
      where: { id, deletedAt: null },
      data,
      include: {
        borrowRecords: {
          include: {
            items: { include: { book: true } },
          },
        },
      }
    });
  }

  async softDelete(id: string): Promise<Member> {
    return await this.prisma.member.update({
      where: { id, deletedAt: null },
      data: { 
        deletedAt: new Date(),
        updatedAt: new Date()
      },
    });
  }

  // HANYA TAMBAH 3 METHOD INI (SAMA PERSIS DENGAN PRODUCT):

  // 1. Filter Kompleks
  async findComplex(email: string): Promise<Member[]> {
    return await this.prisma.member.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                email: {
                  contains: email,
                  mode: 'insensitive',
                },
              },
              {
                borrowRecords: {
                  some: {}
                },
              },
            ],
          },
          { name: { contains: email, mode: 'insensitive' } },
        ],
        deletedAt: null,
      },
    });
  }

  // 2. Aggregation
  async getStats() {
    return await this.prisma.member.aggregate({
      where: { deletedAt: null },
      _count: {
        id: true,
      },
    });
  }

  // 3. Group By (SIMPLE)
  async getMembersByMonthStats() {
    return await this.prisma.member.groupBy({
      where: { deletedAt: null },
      by: ["createdAt"],
      _count: {
        id: true,
      },
    });
  }
}