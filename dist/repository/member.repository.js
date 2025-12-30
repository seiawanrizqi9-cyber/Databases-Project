export class MemberRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy, include) {
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
    async countAll(where) {
        return await this.prisma.member.count({
            where: { ...where, deletedAt: null }
        });
    }
    async findById(id, include) {
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
    async findByEmail(email) {
        return await this.prisma.member.findUnique({
            where: { email, deletedAt: null },
        });
    }
    async create(data) {
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
    async update(id, data) {
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
    async softDelete(id) {
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
    async findComplex(email) {
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
//# sourceMappingURL=member.repository.js.map