export class AuthorService {
    authorRepo;
    prisma;
    constructor(authorRepo, prisma) {
        this.authorRepo = authorRepo;
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
        if (search?.nationality) {
            whereClause.nationality = {
                contains: search.nationality,
                mode: "insensitive",
            };
        }
        const sortCriteria = sortBy
            ? { [sortBy]: sortOrder || "desc" }
            : { name: "asc" };
        const authors = await this.authorRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.authorRepo.countAll(whereClause);
        return {
            authors: authors,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    }
    async getById(id) {
        const author = await this.authorRepo.findById(id);
        if (!author) {
            throw new Error("Author tidak ditemukan");
        }
        return author;
    }
    async create(data) {
        if (data.nationality) {
            const existingAuthor = await this.prisma.author.findFirst({
                where: {
                    name: data.name,
                    nationality: data.nationality,
                    deletedAt: null,
                },
            });
            if (existingAuthor) {
                throw new Error("Author dengan nama dan kebangsaan yang sama sudah ada");
            }
        }
        return await this.authorRepo.create(data);
    }
    async update(id, data) {
        const author = await this.authorRepo.findById(id);
        if (!author) {
            throw new Error("Author tidak ditemukan");
        }
        if (data.name || data.nationality) {
            const nameToCheck = data.name || author.name;
            const nationalityToCheck = data.nationality || author.nationality;
            if (nationalityToCheck) {
                const existingAuthor = await this.prisma.author.findFirst({
                    where: {
                        name: nameToCheck,
                        nationality: nationalityToCheck,
                        deletedAt: null,
                        NOT: { id: id }
                    },
                });
                if (existingAuthor) {
                    throw new Error("Author dengan nama dan kebangsaan yang sama sudah ada");
                }
            }
        }
        return await this.authorRepo.update(id, data);
    }
    async delete(id) {
        const author = await this.authorRepo.findById(id, {
            books: {
                where: { deletedAt: null }
            }
        });
        if (!author) {
            throw new Error("Author tidak ditemukan");
        }
        const authorWithBooks = author;
        if (authorWithBooks.books && authorWithBooks.books.length > 0) {
            throw new Error("Tidak dapat menghapus author yang masih memiliki buku");
        }
        return await this.authorRepo.softDelete(id);
    }
    async exec() {
        const overview = await this.authorRepo.getStats();
        const byNationality = await this.authorRepo.getAuthorsByNationalityStats();
        return { overview, byNationality };
    }
}
//# sourceMappingURL=author.service.js.map