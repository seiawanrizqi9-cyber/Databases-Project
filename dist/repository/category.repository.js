export class CategoryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy) {
        return await this.prisma.category.findMany({
            skip,
            take,
            where,
            orderBy,
            include: { books: { include: { book: true } } },
        });
    }
    async countAll(where) {
        return await this.prisma.category.count({ where });
    }
    async findById(id) {
        return await this.prisma.category.findUnique({
            where: { id },
            include: { books: { include: { book: true } } },
        });
    }
    async findByName(name) {
        return await this.prisma.category.findUnique({ where: { name } });
    }
    async create(data) {
        return await this.prisma.category.create({
            data,
            include: { books: { include: { book: true } } }
        });
    }
    async update(id, data) {
        return await this.prisma.category.update({
            where: { id },
            data: { ...data, updatedAt: new Date() },
            include: { books: { include: { book: true } } }
        });
    }
    async delete(id) {
        return await this.prisma.category.delete({
            where: { id },
            include: { books: { include: { book: true } } }
        });
    }
    async assignBookToCategory(bookId, categoryId) {
        return await this.prisma.bookCategory.create({
            data: { bookId, categoryId },
            include: { book: true, category: true },
        });
    }
    async removeBookFromCategory(bookId, categoryId) {
        return await this.prisma.bookCategory.delete({
            where: { bookId_categoryId: { bookId, categoryId } },
        });
    }
    // HANYA TAMBAH 3 METHOD INI (SAMA PERSIS DENGAN PRODUCT):
    // 1. Filter Kompleks
    async findComplex(name) {
        return await this.prisma.category.findMany({
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
                                books: {
                                    some: {}
                                },
                            },
                        ],
                    },
                    { name: "Fiction" },
                ],
            },
        });
    }
    // 2. Aggregation
    async getStats() {
        return await this.prisma.category.aggregate({
            _count: {
                id: true,
            },
        });
    }
    // 3. Group By (SIMPLE - SAMA DENGAN PRODUCT)
    async getCategoriesByNameStats() {
        return await this.prisma.category.groupBy({
            by: ["name"],
            _count: {
                id: true,
            },
        });
    }
}
//# sourceMappingURL=category.repository.js.map