export class BookRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy, include) {
        return await this.prisma.book.findMany({
            skip,
            take,
            where,
            orderBy,
            include: include || { author: true },
        });
    }
    async countAll(where) {
        return await this.prisma.book.count({ where });
    }
    async findById(id, include) {
        return await this.prisma.book.findUnique({
            where: { id, deletedAt: null },
            include: include || {
                author: true,
                borrowItems: { include: { borrowRecord: true } }
            },
        });
    }
    async create(data) {
        return await this.prisma.book.create({
            data,
            include: { author: true }
        });
    }
    async update(id, data) {
        return await this.prisma.book.update({
            where: { id, deletedAt: null },
            data,
            include: { author: true }
        });
    }
    async softDelete(id) {
        return await this.prisma.book.update({
            where: { id, deletedAt: null },
            data: { deletedAt: new Date() },
        });
    }
    async updateStock(id, change) {
        return await this.prisma.book.update({
            where: { id, deletedAt: null },
            data: { stock: { increment: change } },
        });
    }
    // HANYA TAMBAH 3 METHOD INI:
    // 1. Filter Kompleks
    async findComplex(genre, maxPrice) {
        return await this.prisma.book.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            {
                                genre: {
                                    contains: genre,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                price: {
                                    lte: maxPrice,
                                },
                            },
                        ],
                    },
                    { genre: "Fiction" },
                ],
                deletedAt: null,
            },
        });
    }
    // 2. Aggregation
    async getStats() {
        return await this.prisma.book.aggregate({
            where: { deletedAt: null },
            _count: {
                id: true,
            },
            _avg: {
                price: true,
            },
            _sum: {
                price: true,
            },
            _min: {
                price: true,
            },
            _max: {
                price: true,
            },
        });
    }
    // 3. Group By
    async getBooksByGenreStats() {
        return await this.prisma.book.groupBy({
            where: { deletedAt: null },
            by: ["genre"],
            _count: {
                id: true,
            },
            _avg: {
                price: true,
            },
        });
    }
}
//# sourceMappingURL=book.repository.js.map