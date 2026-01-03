import { successResponse } from "../utils/response.js";
export class AuthorController {
    authorService;
    constructor(authorService) {
        this.authorService = authorService;
        this.getStats = this.getStats.bind(this);
    }
    async list(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search;
            const sortBy = req.query.sortBy;
            const sortOrder = req.query.sortOrder || "asc";
            const result = await this.authorService.list({
                page,
                limit,
                search,
                sortBy,
                sortOrder,
            });
            const pagination = {
                page: result.currentPage,
                limit,
                total: result.total,
                totalPages: result.totalPages,
            };
            successResponse(res, "Author berhasil diambil", result.authors, pagination);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengambil author");
        }
    }
    async getById(req, res) {
        try {
            if (!req.params.id) {
                throw new Error("ID author tidak ditemukan");
            }
            const author = await this.authorService.getById(req.params.id);
            successResponse(res, "Author berhasil diambil", author);
        }
        catch (error) {
            throw new Error(error.message || "Author tidak ditemukan");
        }
    }
    async create(req, res) {
        try {
            const { name, bio, nationality } = req.body;
            if (!name) {
                throw new Error("Nama author wajib diisi");
            }
            const data = {
                name: name.toString(),
                bio: bio || undefined,
                nationality: nationality || undefined,
            };
            const author = await this.authorService.create(data);
            successResponse(res, "Author berhasil ditambahkan", author, null, 201);
        }
        catch (error) {
            throw new Error(error.message || "Gagal menambahkan author");
        }
    }
    async update(req, res) {
        try {
            if (!req.params.id) {
                throw new Error("ID author tidak ditemukan");
            }
            const { name, bio, nationality } = req.body;
            const updateData = {};
            if (name !== undefined)
                updateData.name = name;
            if (bio !== undefined)
                updateData.bio = bio;
            if (nationality !== undefined)
                updateData.nationality = nationality;
            const author = await this.authorService.update(req.params.id, updateData);
            successResponse(res, "Author berhasil diupdate", author);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengupdate author");
        }
    }
    async delete(req, res) {
        try {
            if (!req.params.id) {
                throw new Error("ID author tidak ditemukan");
            }
            const deleted = await this.authorService.delete(req.params.id);
            successResponse(res, "Author berhasil dihapus", deleted);
        }
        catch (error) {
            throw new Error(error.message || "Gagal menghapus author");
        }
    }
    async getStats(_req, res) {
        try {
            const stats = await this.authorService.exec();
            successResponse(res, "Statistik author berhasil diambil", stats, null, 200);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengambil statistik");
        }
    }
}
//# sourceMappingURL=author.controller.js.map
