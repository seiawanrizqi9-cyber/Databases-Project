export class AuthorRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy, include) {
        return await this.prisma.author.findMany({
            skip,
            take,
            where: { ...where, deletedAt: null },
            orderBy,
            include: include || { books: true },
        });
    }
    async countAll(where) {
        return await this.prisma.author.count({
            where: { ...where, deletedAt: null }
        });
    }
    async findById(id, include) {
        return await this.prisma.author.findUnique({
            where: { id, deletedAt: null },
            include: include || { books: { where: { deletedAt: null } } },
        });
    }
    async create(data) {
        return await this.prisma.author.create({
            data,
            include: { books: true }
        });
    }
    async update(id, data) {
        return await this.prisma.author.update({
            where: { id, deletedAt: null },
            data,
            include: { books: true }
        });
    }
    async softDelete(id) {
        return await this.prisma.author.update({
            where: { id, deletedAt: null },
            data: {
                deletedAt: new Date(),
                updatedAt: new Date()
            },
        });
    }
    // HANYA TAMBAH 3 METHOD INI:
    // 1. Filter Kompleks (SAMA DENGAN PRODUCT)
    async findComplex(name, nationality) {
        return await this.prisma.author.findMany({
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
                            nationality ? {
                                nationality: {
                                    contains: nationality,
                                    mode: 'insensitive',
                                },
                            } : {},
                        ],
                    },
                    { nationality: "Indonesia" },
                ],
                deletedAt: null,
            },
        });
    }
    // 2. Aggregation (SAMA DENGAN PRODUCT)
    async getStats() {
        return await this.prisma.author.aggregate({
            where: { deletedAt: null },
            _count: {
                id: true,
            },
        });
    }
    // 3. Group By (SAMA DENGAN PRODUCT)
    async getAuthorsByNationalityStats() {
        return await this.prisma.author.groupBy({
            where: { deletedAt: null },
            by: ["nationality"],
            _count: {
                id: true,
            },
        });
    }
}
//# sourceMappingURL=author.repository.js.map