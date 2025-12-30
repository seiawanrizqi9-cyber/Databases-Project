export class ProfileRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy, include) {
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
    async countAll(where) {
        return await this.prisma.profile.count({
            where: { ...where, deletedAt: null }
        });
    }
    async findById(id, include) {
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
    async findByUserId(userId, include) {
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
    async create(data) {
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
    async update(id, data) {
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
    async softDelete(id) {
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
    async findComplex(name) {
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
//# sourceMappingURL=profile.repository.js.map