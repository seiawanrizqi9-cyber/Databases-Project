import { successResponse } from "../utils/response";
export class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
        this.getStats = this.getStats.bind(this);
    }
    async list(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search;
            const sortBy = req.query.sortBy;
            const sortOrder = req.query.sortOrder || "desc";
            const result = await this.categoryService.list({
                page, limit, search, sortBy, sortOrder,
            });
            const pagination = {
                page: result.currentPage, limit,
                total: result.total, totalPages: result.totalPages,
            };
            successResponse(res, "Kategori berhasil diambil", result.categories, pagination);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengambil kategori");
        }
    }
    async getById(req, res) {
        try {
            if (!req.params.id)
                throw new Error("ID kategori tidak ditemukan");
            const category = await this.categoryService.getById(req.params.id);
            successResponse(res, "Kategori berhasil diambil", category);
        }
        catch (error) {
            throw new Error(error.message || "Kategori tidak ditemukan");
        }
    }
    async create(req, res) {
        try {
            const { name } = req.body;
            if (!name)
                throw new Error("Nama kategori wajib diisi");
            const category = await this.categoryService.create(name);
            successResponse(res, "Kategori berhasil ditambahkan", category, null, 201);
        }
        catch (error) {
            throw new Error(error.message || "Gagal menambahkan kategori");
        }
    }
    async update(req, res) {
        try {
            if (!req.params.id)
                throw new Error("ID kategori tidak ditemukan");
            const { name } = req.body;
            if (!name)
                throw new Error("Nama kategori wajib diisi");
            const category = await this.categoryService.update(req.params.id, name);
            successResponse(res, "Kategori berhasil diupdate", category);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengupdate kategori");
        }
    }
    async delete(req, res) {
        try {
            if (!req.params.id)
                throw new Error("ID kategori tidak ditemukan");
            const category = await this.categoryService.delete(req.params.id);
            successResponse(res, "Kategori berhasil dihapus", category);
        }
        catch (error) {
            throw new Error(error.message || "Gagal menghapus kategori");
        }
    }
    async assignBook(req, res) {
        try {
            const { bookId, categoryId } = req.body;
            if (!bookId || !categoryId)
                throw new Error("bookId dan categoryId wajib diisi");
            const result = await this.categoryService.assignBook(bookId, Number(categoryId));
            successResponse(res, "Buku berhasil ditambahkan ke kategori", result);
        }
        catch (error) {
            throw new Error(error.message || "Gagal menambahkan buku ke kategori");
        }
    }
    async removeBook(req, res) {
        try {
            const { bookId, categoryId } = req.body;
            if (!bookId || !categoryId)
                throw new Error("bookId dan categoryId wajib diisi");
            const result = await this.categoryService.removeBook(bookId, Number(categoryId));
            successResponse(res, "Buku berhasil dihapus dari kategori", result);
        }
        catch (error) {
            throw new Error(error.message || "Gagal menghapus buku dari kategori");
        }
    }
    // HANYA TAMBAH 1 METHOD INI:
    async getStats(_req, res) {
        try {
            const stats = await this.categoryService.exec();
            successResponse(res, "Statistik kategori berhasil diambil", stats, null, 200);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengambil statistik");
        }
    }
}
//# sourceMappingURL=category.controller.js.map