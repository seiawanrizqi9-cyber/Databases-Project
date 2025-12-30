import type { Profile, Prisma, PrismaClient } from "../generated/client";
import type { IProfileRepository } from "../repository/profile.repository";

interface FindAllProfilesParams {
  page: number;
  limit: number;
  search?: {
    name?: string;
    gender?: string;
    address?: string;
  };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ProfileWithUser extends Profile {
  user?: any;
}

interface ProfileListResponse {
  profiles: ProfileWithUser[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface IProfileService {
  list(params: FindAllProfilesParams): Promise<ProfileListResponse>;
  getById(id: string): Promise<ProfileWithUser>;
  getByUserId(userId: number): Promise<ProfileWithUser>;
  create(data: {
    user_id: number;
    name: string;
    gender?: string;
    address?: string;
    profile_picture_url?: string;
  }): Promise<ProfileWithUser>;
  update(id: string, data: Partial<Profile>): Promise<ProfileWithUser>;
  delete(id: string): Promise<ProfileWithUser>;
  
  // HANYA TAMBAH 1 METHOD INI (SAMA DENGAN PRODUCT):
  exec(): Promise<{ overview: any; byGender: any }>;
}

export class ProfileService implements IProfileService {
  constructor(
    private profileRepo: IProfileRepository,
    private prisma: PrismaClient
  ) {}

  async list(params: FindAllProfilesParams): Promise<ProfileListResponse> {
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.ProfileWhereInput = {
      deletedAt: null,
    };

    if (search?.name) {
      whereClause.name = {
        contains: search.name,
        mode: "insensitive",
      };
    }

    if (search?.gender) {
      whereClause.gender = search.gender.toUpperCase();
    }

    if (search?.address) {
      whereClause.address = {
        contains: search.address,
        mode: "insensitive",
      };
    }

    const sortCriteria: Prisma.ProfileOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || "desc" }
      : { createdAt: "desc" };

    const profiles = await this.profileRepo.list(
      skip,
      limit,
      whereClause,
      sortCriteria
    );

    const total = await this.profileRepo.countAll(whereClause);

    return {
      profiles: profiles as ProfileWithUser[],
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getById(id: string): Promise<ProfileWithUser> {
    const numId = parseInt(id);
    const profile = await this.profileRepo.findById(numId);

    if (!profile) {
      throw new Error("Profile tidak ditemukan");
    }

    return profile as ProfileWithUser;
  }

  async getByUserId(userId: number): Promise<ProfileWithUser> {
    const profile = await this.profileRepo.findByUserId(userId);

    if (!profile) {
      throw new Error("Profile tidak ditemukan");
    }

    return profile as ProfileWithUser;
  }

  async create(data: {
    user_id: number;
    name: string;
    gender?: string;
    address?: string;
    profile_picture_url?: string;
  }): Promise<ProfileWithUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: data.user_id, deletedAt: null }
    });
    
    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    const existingProfile = await this.profileRepo.findByUserId(data.user_id);
    if (existingProfile) {
      throw new Error("User sudah memiliki profile");
    }

    const createData: Prisma.ProfileCreateInput = {
      user: { connect: { id: data.user_id } },
      name: data.name,
      gender: data.gender ? data.gender.toUpperCase() : null,
      address: data.address || null,
      profile_picture_url: data.profile_picture_url || null,
    };

    return await this.profileRepo.create(createData) as ProfileWithUser;
  }

  async update(id: string, data: Partial<Profile>): Promise<ProfileWithUser> {
    const numId = parseInt(id);
    
    const profile = await this.profileRepo.findById(numId);
    if (!profile) {
      throw new Error("Profile tidak ditemukan");
    }

    const updateData: Prisma.ProfileUpdateInput = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.gender !== undefined) {
      updateData.gender = data.gender ? data.gender.toUpperCase() : null;
    }

    if (data.address !== undefined) {
      updateData.address = data.address;
    }

    if (data.profile_picture_url !== undefined) {
      updateData.profile_picture_url = data.profile_picture_url;
    }

    return await this.profileRepo.update(numId, updateData) as ProfileWithUser;
  }

  async delete(id: string): Promise<ProfileWithUser> {
    const numId = parseInt(id);
    
    const profile = await this.profileRepo.findById(numId);
    if (!profile) {
      throw new Error("Profile tidak ditemukan");
    }

    return await this.profileRepo.softDelete(numId) as ProfileWithUser;
  }

  // HANYA TAMBAH 1 METHOD INI (SAMA DENGAN PRODUCT):
  async exec() {
    const overview = await this.profileRepo.getStats();
    const byGender = await this.profileRepo.getProfilesByGenderStats();

    return { overview, byGender };
  }
}