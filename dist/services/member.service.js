export class MemberService {
    memberRepo;
    constructor(memberRepo) {
        this.memberRepo = memberRepo;
    }
    async list(params) {
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const whereClause = {
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
        const sortCriteria = sortBy
            ? { [sortBy]: sortOrder || "desc" }
            : { createdAt: "desc" };
        const members = await this.memberRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.memberRepo.countAll(whereClause);
        return {
            members: members,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }
    async getById(id) {
        const member = await this.memberRepo.findById(id);
        if (!member) {
            throw new Error("Member tidak ditemukan");
        }
        return member;
    }
    async create(data) {
        const existingMember = await this.memberRepo.findByEmail(data.email);
        if (existingMember) {
            throw new Error("Email sudah terdaftar");
        }
        return await this.memberRepo.create(data);
    }
    async update(id, data) {
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
        return await this.memberRepo.update(id, data);
    }
    async delete(id) {
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
        const memberWithRecords = member;
        if (memberWithRecords.borrowRecords && memberWithRecords.borrowRecords.length > 0) {
            throw new Error("Tidak dapat menghapus member yang masih memiliki pinjaman aktif");
        }
        return await this.memberRepo.softDelete(id);
    }
    // HANYA TAMBAH 1 METHOD INI (SAMA DENGAN PRODUCT):
    async exec() {
        const overview = await this.memberRepo.getStats();
        const byMonth = await this.memberRepo.getMembersByMonthStats();
        return { overview, byMonth };
    }
}
//# sourceMappingURL=member.service.js.map