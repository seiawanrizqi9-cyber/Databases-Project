import { successResponse } from "../utils/response";
export class BorrowController {
    borrowService;
    constructor(borrowService) {
        this.borrowService = borrowService;
        this.list = this.list.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.returnBooks = this.returnBooks.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.getStats = this.getStats.bind(this);
    }
    async list(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search;
            const sortBy = req.query.sortBy;
            const sortOrder = req.query.sortOrder || "desc";
            const result = await this.borrowService.list({
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
            successResponse(res, "Riwayat peminjaman berhasil diambil", result.borrowRecords, pagination);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengambil riwayat peminjaman");
        }
    }
    async getById(req, res) {
        try {
            if (!req.params.id) {
                throw new Error("ID peminjaman tidak ditemukan");
            }
            const borrowRecord = await this.borrowService.getById(req.params.id);
            successResponse(res, "Data peminjaman berhasil diambil", borrowRecord);
        }
        catch (error) {
            throw new Error(error.message || "Peminjaman tidak ditemukan");
        }
    }
    async create(req, res) {
        try {
            if (!req.user) {
                throw new Error("Unauthorized");
            }
            const { items, dueDate } = req.body;
            // Validasi items
            if (!Array.isArray(items) || items.length === 0) {
                throw new Error("Minimal pinjam 1 buku");
            }
            // Cari member berdasarkan email user
            const member = await this.borrowService.prisma.member.findFirst({
                where: {
                    email: req.user.email,
                    deletedAt: null,
                },
            });
            if (!member) {
                throw new Error("Member tidak ditemukan. Silakan daftar sebagai member terlebih dahulu.");
            }
            const data = {
                memberId: member.id,
                items: items.map((item) => ({
                    bookId: item.bookId.toString(),
                    quantity: Number(item.quantity) || 1,
                })),
                dueDate: new Date(dueDate),
            };
            const borrowRecord = await this.borrowService.create(data);
            successResponse(res, "Peminjaman berhasil dibuat", borrowRecord, null, 201);
        }
        catch (error) {
            throw new Error(error.message || "Gagal membuat peminjaman");
        }
    }
    async returnBooks(req, res) {
        try {
            if (!req.user) {
                throw new Error("Unauthorized");
            }
            const { borrowRecordId, returnItems } = req.body;
            if (!borrowRecordId || !Array.isArray(returnItems)) {
                throw new Error("Data pengembalian tidak valid");
            }
            const data = {
                borrowRecordId: borrowRecordId.toString(),
                returnItems: returnItems.map((item) => ({
                    borrowItemId: item.borrowItemId.toString(),
                    quantity: Number(item.quantity) || 1,
                })),
            };
            const result = await this.borrowService.returnBooks(data);
            successResponse(res, "Buku berhasil dikembalikan", result);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengembalikan buku");
        }
    }
    async update(req, res) {
        try {
            if (!req.params.id) {
                throw new Error("ID peminjaman tidak ditemukan");
            }
            const borrowRecord = await this.borrowService.update(req.params.id, req.body);
            successResponse(res, "Peminjaman berhasil diupdate", borrowRecord);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengupdate peminjaman");
        }
    }
    async delete(req, res) {
        try {
            if (!req.params.id) {
                throw new Error("ID peminjaman tidak ditemukan");
            }
            const deleted = await this.borrowService.delete(req.params.id);
            successResponse(res, "Peminjaman berhasil dihapus", deleted);
        }
        catch (error) {
            throw new Error(error.message || "Gagal menghapus peminjaman");
        }
    }
    async getStats(_req, res) {
        try {
            const stats = await this.borrowService.exec();
            successResponse(res, "Statistik peminjaman berhasil diambil", stats, null, 200);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengambil statistik");
        }
    }
}
//# sourceMappingURL=borrow.controller.js.map