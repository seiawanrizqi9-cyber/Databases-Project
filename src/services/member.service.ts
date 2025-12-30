import type { Member, Prisma } from "../generated/client";
import type { IMemberRepository } from "../repository/member.repository";

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
  
  // HANYA TAMBAH 1 METHOD INI (SAMA DENGAN PRODUCT):
  exec(): Promise<{ overview: any; byMonth: any }>;
}

export class MemberService implements IMemberService {
  constructor(
    private memberRepo: IMemberRepository
  ) {}

  async list(params: FindAllMembersParams): Promise<MemberListResponse> {
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.MemberWhereInput = {
      deletedAt: null,
    };

    if (search?.name) {
      whereClause.name = {
        contains: search.name,
        mode: "insensitive",
      };
    }

    if (search?.email) {
      whereClause.email = {
        contains: search.email,
        mode: "insensitive",
      };
    }

    if (search?.phone) {
      whereClause.phone = {
        contains: search.phone,
        mode: "insensitive",
      };
    }

    const sortCriteria: Prisma.MemberOrderByWithRelationInput = sortBy
      ? { [sortBy]: sortOrder || "desc" }
      : { createdAt: "desc" };

    const members = await this.memberRepo.list(
      skip,
      limit,
      whereClause,
      sortCriteria
    );

    const total = await this.memberRepo.countAll(whereClause);

    return {
      members: members as MemberWithBorrowRecords[],
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async getById(id: string): Promise<MemberWithBorrowRecords> {
    const member = await this.memberRepo.findById(id);

    if (!member) {
      throw new Error("Member tidak ditemukan");
    }

    return member as MemberWithBorrowRecords;
  }

  async create(data: {
    email: string;
    name: string;
    phone?: string;
    address?: string;
  }): Promise<MemberWithBorrowRecords> {
    const existingMember = await this.memberRepo.findByEmail(data.email);
    if (existingMember) {
      throw new Error("Email sudah terdaftar");
    }

    return await this.memberRepo.create(data) as MemberWithBorrowRecords;
  }

  async update(id: string, data: Partial<Member>): Promise<MemberWithBorrowRecords> {
    const member = await this.memberRepo.findById(id);
    if (!member) {
      throw new Error("Member tidak ditemukan");
    }

    if (data.email) {
      const existingMember = await this.memberRepo.findByEmail(data.email);
      if (existingMember && existingMember.id !== id) {
        throw new Error("Email sudah digunakan oleh member lain");
      }
    }

    return await this.memberRepo.update(id, data as Prisma.MemberUpdateInput) as MemberWithBorrowRecords;
  }

  async delete(id: string): Promise<MemberWithBorrowRecords> {
    const member = await this.memberRepo.findById(id, {
      borrowRecords: {
        where: { 
          deletedAt: null,
          returnDate: null
        }
      }
    });

    if (!member) {
      throw new Error("Member tidak ditemukan");
    }

    const memberWithRecords = member as MemberWithBorrowRecords;
    if (memberWithRecords.borrowRecords && memberWithRecords.borrowRecords.length > 0) {
      throw new Error("Tidak dapat menghapus member yang masih memiliki pinjaman aktif");
    }

    return await this.memberRepo.softDelete(id) as MemberWithBorrowRecords;
  }

  // HANYA TAMBAH 1 METHOD INI (SAMA DENGAN PRODUCT):
  async exec() {
    const overview = await this.memberRepo.getStats();
    const byMonth = await this.memberRepo.getMembersByMonthStats();

    return { overview, byMonth };
  }
}