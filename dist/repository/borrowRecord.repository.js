export class BorrowRecordRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy, include) {
        return await this.prisma.borrowRecord.findMany({
            skip,
            take,
            where: { ...where, deletedAt: null },
            orderBy,
            include: include || {
                member: true,
                items: { include: { book: true } },
            },
        });
    }
    async countAll(where) {
        return await this.prisma.borrowRecord.count({
            where: { ...where, deletedAt: null },
        });
    }
    async findById(id, include) {
        return await this.prisma.borrowRecord.findUnique({
            where: { id, deletedAt: null },
            include: include || {
                member: true,
                items: { include: { book: true } },
            },
        });
    }
    async findByMemberId(memberId, include) {
        return await this.prisma.borrowRecord.findMany({
            where: { memberId, deletedAt: null },
            include: include || {
                member: true,
                items: { include: { book: true } },
            },
            orderBy: { borrowDate: "desc" },
        });
    }
    async create(data) {
        return await this.prisma.borrowRecord.create({
            data,
            include: {
                member: true,
                items: { include: { book: true } },
            },
        });
    }
    async update(id, data) {
        return await this.prisma.borrowRecord.update({
            where: { id, deletedAt: null },
            data,
            include: {
                member: true,
                items: { include: { book: true } },
            },
        });
    }
    async softDelete(id) {
        return await this.prisma.borrowRecord.update({
            where: { id, deletedAt: null },
            data: {
                deletedAt: new Date(),
                updatedAt: new Date(),
            },
        });
    }
    // HANYA TAMBAH 3 METHOD INI (SAMA PERSIS DENGAN PRODUCT):
    // 1. Filter Kompleks
    async findComplex(status) {
        return await this.prisma.borrowRecord.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            {
                                status: status, // CAST ke any karena enum
                            },
                            {
                                items: {
                                    some: {},
                                },
                            },
                        ],
                    },
                    { status: "ACTIVE" }, // CAST ke any
                ],
                deletedAt: null,
            },
        });
    }
    // 2. Aggregation
    async getStats() {
        return await this.prisma.borrowRecord.aggregate({
            where: { deletedAt: null },
            _count: {
                id: true,
            },
        });
    }
    // 3. Group By (SIMPLE)
    async getBorrowRecordsByStatusStats() {
        return await this.prisma.borrowRecord.groupBy({
            where: { deletedAt: null },
            by: ["status"],
            _count: {
                id: true,
            },
        });
    }
}
//# sourceMappingURL=borrowRecord.repository.js.map