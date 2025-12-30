export class ProfileService {
    profileRepo;
    prisma;
    constructor(profileRepo, prisma) {
        this.profileRepo = profileRepo;
        this.prisma = prisma;
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
        if (search?.gender) {
            whereClause.gender = search.gender.toUpperCase();
        }
        if (search?.address) {
            whereClause.address = {
                contains: search.address,
                mode: "insensitive",
            };
        }
        const sortCriteria = sortBy
            ? { [sortBy]: sortOrder || "desc" }
            : { createdAt: "desc" };
        const profiles = await this.profileRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.profileRepo.countAll(whereClause);
        return {
            profiles: profiles,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }
    async getById(id) {
        const numId = parseInt(id);
        const profile = await this.profileRepo.findById(numId);
        if (!profile) {
            throw new Error("Profile tidak ditemukan");
        }
        return profile;
    }
    async getByUserId(userId) {
        const profile = await this.profileRepo.findByUserId(userId);
        if (!profile) {
            throw new Error("Profile tidak ditemukan");
        }
        return profile;
    }
    async create(data) {
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
        const createData = {
            user: { connect: { id: data.user_id } },
            name: data.name,
            gender: data.gender ? data.gender.toUpperCase() : null,
            address: data.address || null,
            profile_picture_url: data.profile_picture_url || null,
        };
        return await this.profileRepo.create(createData);
    }
    async update(id, data) {
        const numId = parseInt(id);
        const profile = await this.profileRepo.findById(numId);
        if (!profile) {
            throw new Error("Profile tidak ditemukan");
        }
        const updateData = {
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
        return await this.profileRepo.update(numId, updateData);
    }
    async delete(id) {
        const numId = parseInt(id);
        const profile = await this.profileRepo.findById(numId);
        if (!profile) {
            throw new Error("Profile tidak ditemukan");
        }
        return await this.profileRepo.softDelete(numId);
    }
    // HANYA TAMBAH 1 METHOD INI (SAMA DENGAN PRODUCT):
    async exec() {
        const overview = await this.profileRepo.getStats();
        const byGender = await this.profileRepo.getProfilesByGenderStats();
        return { overview, byGender };
    }
}
//# sourceMappingURL=profile.service.js.map