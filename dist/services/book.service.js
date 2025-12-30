export class BookService {
    bookRepo;
    prisma;
    constructor(bookRepo, prisma) {
        this.bookRepo = bookRepo;
        this.prisma = prisma;
    }
    // SEMUA METHOD YANG SUDAH ADA TETAP SAMA PERSIS...
    async list(params) {
        // KODE YANG SUDAH ADA TETAP SAMA...
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const whereClause = {
            deletedAt: null,
        };
        if (search?.title) {
            whereClause.title = {
                contains: search.title,
                mode: "insensitive",
            };
        }
        if (search?.genre) {
            whereClause.genre = {
                contains: search.genre,
                mode: "insensitive",
            };
        }
        if (search?.minPrice !== undefined) {
            whereClause.price = {
                gte: search.minPrice,
            };
        }
        if (search?.maxPrice !== undefined) {
            whereClause.price = {
                lte: search.maxPrice,
            };
        }
        if (search?.minYear !== undefined) {
            whereClause.year = {
                gte: search.minYear,
            };
        }
        if (search?.maxYear !== undefined) {
            whereClause.year = {
                lte: search.maxYear,
            };
        }
        if (search?.authorName) {
            whereClause.author = {
                name: {
                    contains: search.authorName,
                    mode: "insensitive",
                },
                deletedAt: null,
            };
        }
        const sortCriteria = sortBy
            ? { [sortBy]: sortOrder || "desc" }
            : { createdAt: "desc" };
        const books = await this.bookRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.bookRepo.countAll(whereClause);
        return {
            books,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }
    async getById(id) {
        const book = await this.bookRepo.findById(id);
        if (!book) {
            throw new Error("Buku tidak ditemukan");
        }
        return book;
    }
    async create(data) {
        const author = await this.prisma.author.findUnique({
            where: { id: data.authorId, deletedAt: null },
        });
        if (!author) {
            throw new Error("Author tidak ditemukan");
        }
        const createData = {
            title: data.title,
            description: data.description,
            year: data.year,
            genre: data.genre,
            price: data.price,
            stock: data.stock,
            author: {
                connect: { id: data.authorId }
            }
        };
        if (data.image_url) {
            createData.image_url = data.image_url;
        }
        return await this.bookRepo.create(createData);
    }
    async update(id, data) {
        await this.getById(id);
        if (data.authorId) {
            const author = await this.prisma.author.findUnique({
                where: { id: data.authorId, deletedAt: null },
            });
            if (!author) {
                throw new Error("Author tidak ditemukan");
            }
        }
        return await this.bookRepo.update(id, data);
    }
    async delete(id) {
        return await this.bookRepo.softDelete(id);
    }
    async checkStock(id) {
        const book = await this.getById(id);
        return book.stock > 0;
    }
    async updateStock(id, change) {
        return await this.bookRepo.updateStock(id, change);
    }
    async exec() {
        const overview = await this.bookRepo.getStats();
        const byGenre = await this.bookRepo.getBooksByGenreStats();
        return { overview, byGenre };
    }
}
//# sourceMappingURL=book.service.js.map