import { successResponse } from "../utils/response";
export class MemberController {
    memberService;
    constructor(memberService) {
        this.memberService = memberService;
        // SESUAI PRODUCT: Bind di constructor controller
        this.list = this.list.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
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
            const sortOrder = req.query.sortOrder || "asc";
            const result = await this.memberService.list({
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
            successResponse(res, "Member berhasil diambil", result.members, pagination);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengambil member");
        }
    }
    async getById(req, res) {
        try {
            if (!req.params.id) {
                throw new Error("ID member tidak ditemukan");
            }
            const member = await this.memberService.getById(req.params.id);
            successResponse(res, "Member berhasil diambil", member);
        }
        catch (error) {
            throw new Error(error.message || "Member tidak ditemukan");
        }
    }
    async create(req, res) {
        try {
            const { email, name, phone, address } = req.body;
            if (!email || !name) {
                throw new Error("Email dan nama wajib diisi");
            }
            const data = {
                email: email.toString(),
                name: name.toString(),
                phone: phone || undefined,
                address: address || undefined,
            };
            const member = await this.memberService.create(data);
            successResponse(res, "Member berhasil ditambahkan", member, null, 201);
        }
        catch (error) {
            throw new Error(error.message || "Gagal menambahkan member");
        }
    }
    async update(req, res) {
        try {
            if (!req.params.id) {
                throw new Error("ID member tidak ditemukan");
            }
            const { email, name, phone, address } = req.body;
            const updateData = {};
            if (email !== undefined)
                updateData.email = email;
            if (name !== undefined)
                updateData.name = name;
            if (phone !== undefined)
                updateData.phone = phone;
            if (address !== undefined)
                updateData.address = address;
            const member = await this.memberService.update(req.params.id, updateData);
            successResponse(res, "Member berhasil diupdate", member);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengupdate member");
        }
    }
    async delete(req, res) {
        try {
            if (!req.params.id) {
                throw new Error("ID member tidak ditemukan");
            }
            const deleted = await this.memberService.delete(req.params.id);
            successResponse(res, "Member berhasil dihapus", deleted);
        }
        catch (error) {
            throw new Error(error.message || "Gagal menghapus member");
        }
    }
    // HANYA TAMBAH 1 METHOD INI (SAMA DENGAN PRODUCT):
    async getStats(_req, res) {
        try {
            const stats = await this.memberService.exec();
            successResponse(res, "Statistik member berhasil diambil", stats, null, 200);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengambil statistik");
        }
    }
}
//# sourceMappingURL=member.controller.js.map