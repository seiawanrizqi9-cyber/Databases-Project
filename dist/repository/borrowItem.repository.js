export class BorrowItemRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return await this.prisma.borrowItem.create({
            data,
            include: { book: true, borrowRecord: true },
        });
    }
    async createMany(data) {
        return await this.prisma.borrowItem.createMany({
            data,
        });
    }
    async findByBorrowRecordId(borrowRecordId) {
        return await this.prisma.borrowItem.findMany({
            where: { borrowRecordId, deletedAt: null },
            include: { book: true },
        });
    }
    async update(id, data) {
        return await this.prisma.borrowItem.update({
            where: { id, deletedAt: null },
            data,
            include: { book: true },
        });
    }
    async deleteByBorrowRecordId(borrowRecordId) {
        return await this.prisma.borrowItem.deleteMany({
            where: { borrowRecordId },
        });
    }
    async delete(id) {
        return await this.prisma.borrowItem.delete({
            where: { id },
        });
    }
}
//# sourceMappingURL=borrowItem.repository.js.map