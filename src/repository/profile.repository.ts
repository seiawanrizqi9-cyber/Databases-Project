import type { Profile, Prisma, PrismaClient } from "../generated/client";

export interface IProfileRepository {
  list(
    skip: number,
    take: number,
    where: Prisma.ProfileWhereInput,
    orderBy: Prisma.ProfileOrderByWithRelationInput,
    include?: Prisma.ProfileInclude
  ): Promise<Profile[]>;
  countAll(where: Prisma.ProfileWhereInput): Promise<number>;
  findById(id: number, include?: Prisma.ProfileInclude): Promise<Profile | null>;
  findByUserId(userId: number, include?: Prisma.ProfileInclude): Promise<Profile | null>;
  create(data: Prisma.ProfileCreateInput): Promise<Profile>;
  update(id: number, data: Prisma.ProfileUpdateInput): Promise<Profile>;
  softDelete(id: number): Promise<Profile>;
  
  // HANYA TAMBAH 3 METHOD INI (SAMA DENGAN PRODUCT):
  findComplex(name: string): Promise<Profile[]>;
  getStats(): Promise<
    Prisma.GetProfileAggregateType<{
      _count: { id: true };
    }>
  >;
  getProfilesByGenderStats(): Promise<(Prisma.PickEnumerable<Prisma.ProfileGroupByOutputType, ["gender"]> & {
    _count: { id: number };
  })[]>;
}

export class ProfileRepository implements IProfileRepository {
  constructor(private prisma: PrismaClient) {}

  async list(
    skip: number,
    take: number,
    where: Prisma.ProfileWhereInput,
    orderBy: Prisma.ProfileOrderByWithRelationInput,
    include?: Prisma.ProfileInclude
  ): Promise<Profile[]> {
    return await this.prisma.profile.findMany({
      skip,
      take,
      where: { ...where, deletedAt: null },
      orderBy,
      include: include || {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    });
  }

  async countAll(where: Prisma.ProfileWhereInput): Promise<number> {
    return await this.prisma.profile.count({ 
      where: { ...where, deletedAt: null } 
    });
  }

  async findById(id: number, include?: Prisma.ProfileInclude): Promise<Profile | null> {
    return await this.prisma.profile.findUnique({
      where: { id, deletedAt: null },
      include: include || {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  async findByUserId(userId: number, include?: Prisma.ProfileInclude): Promise<Profile | null> {
    return await this.prisma.profile.findUnique({
      where: { user_id: userId, deletedAt: null },
      include: include || {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  async create(data: Prisma.ProfileCreateInput): Promise<Profile> {
    return await this.prisma.profile.create({ 
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  async update(id: number, data: Prisma.ProfileUpdateInput): Promise<Profile> {
    return await this.prisma.profile.update({
      where: { id, deletedAt: null },
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  async softDelete(id: number): Promise<Profile> {
    return await this.prisma.profile.update({
      where: { id, deletedAt: null },
      data: { 
        deletedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  // HANYA TAMBAH 3 METHOD INI (SAMA PERSIS DENGAN PRODUCT):

  // 1. Filter Kompleks
  async findComplex(name: string): Promise<Profile[]> {
    return await this.prisma.profile.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                name: {
                  contains: name,
                  mode: 'insensitive',
                },
              },
              {
                gender: "MALE",
              },
            ],
          },
          { name: { contains: name, mode: 'insensitive' } },
        ],
        deletedAt: null,
      },
    });
  }

  // 2. Aggregation
  async getStats() {
    return await this.prisma.profile.aggregate({
      where: { deletedAt: null },
      _count: {
        id: true,
      },
    });
  }

  // 3. Group By (SIMPLE)
  async getProfilesByGenderStats() {
    return await this.prisma.profile.groupBy({
      where: { deletedAt: null },
      by: ["gender"],
      _count: {
        id: true,
      },
    });
  }
}