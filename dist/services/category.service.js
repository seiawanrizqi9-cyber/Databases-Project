export class CategoryService {
    categoryRepo;
    prisma;
    constructor(categoryRepo, prisma) {
        this.categoryRepo = categoryRepo;
        this.prisma = prisma;
    }
    async list(params) {
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (search?.name) {
            whereClause.name = { contains: search.name, mode: "insensitive" };
        }
        const sortCriteria = sortBy
            ? { [sortBy]: sortOrder || "desc" }
            : { createdAt: "desc" };
        const categories = await this.categoryRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.categoryRepo.countAll(whereClause);
        return {
            categories,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }
    async getById(id) {
        const numId = parseInt(id);
        const category = await this.categoryRepo.findById(numId);
        if (!category)
            throw new Error("Kategori tidak ditemukan");
        return category;
    }
    async create(name) {
        const existingCategory = await this.categoryRepo.findByName(name);
        if (existingCategory)
            throw new Error("Nama kategori sudah ada");
        return await this.categoryRepo.create({ name });
    }
    async update(id, name) {
        const numId = parseInt(id);
        const category = await this.categoryRepo.findById(numId);
        if (!category)
            throw new Error("Kategori tidak ditemukan");
        const existingCategory = await this.categoryRepo.findByName(name);
        if (existingCategory && existingCategory.id !== numId) {
            throw new Error("Nama kategori sudah digunakan");
        }
        return await this.categoryRepo.update(numId, { name });
    }
    async delete(id) {
        const numId = parseInt(id);
        const category = await this.categoryRepo.findById(numId);
        if (!category)
            throw new Error("Kategori tidak ditemukan");
        const categoryWithBooks = category;
        if (categoryWithBooks.books && categoryWithBooks.books.length > 0) {
            throw new Error("Tidak dapat menghapus kategori yang masih memiliki buku");
        }
        return await this.categoryRepo.delete(numId);
    }
    async assignBook(bookId, categoryId) {
        const book = await this.prisma.book.findUnique({
            where: { id: bookId, deletedAt: null },
        });
        if (!book)
            throw new Error("Buku tidak ditemukan");
        const category = await this.categoryRepo.findById(categoryId);
        if (!category)
            throw new Error("Kategori tidak ditemukan");
        const existingRelation = await this.prisma.bookCategory.findUnique({
            where: { bookId_categoryId: { bookId, categoryId } },
        });
        if (existingRelation)
            throw new Error("Buku sudah ada di kategori ini");
        return await this.categoryRepo.assignBookToCategory(bookId, categoryId);
    }
    async removeBook(bookId, categoryId) {
        const existingRelation = await this.prisma.bookCategory.findUnique({
            where: { bookId_categoryId: { bookId, categoryId } },
        });
        if (!existingRelation)
            throw new Error("Relasi buku-kategori tidak ditemukan");
        return await this.categoryRepo.removeBookFromCategory(bookId, categoryId);
    }
    // HANYA TAMBAH 1 METHOD INI:
    async exec() {
        const overview = await this.categoryRepo.getStats();
        const byBookCount = await this.categoryRepo.getCategoriesByNameStats();
        return { overview, byBookCount };
    }
}
//# sourceMappingURL=category.service.js.map