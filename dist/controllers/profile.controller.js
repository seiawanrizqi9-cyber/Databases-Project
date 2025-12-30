import { successResponse } from "../utils/response";
export class ProfileController {
    profileService;
    constructor(profileService) {
        this.profileService = profileService;
        // SESUAI PRODUCT: Bind di constructor controller
        this.list = this.list.bind(this);
        this.getById = this.getById.bind(this);
        this.getByUserId = this.getByUserId.bind(this);
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
            const sortOrder = req.query.sortOrder || "desc";
            const result = await this.profileService.list({
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
            successResponse(res, "Profile berhasil diambil", result.profiles, pagination);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengambil profile");
        }
    }
    async getById(req, res) {
        try {
            if (!req.params.id) {
                throw new Error("ID profile tidak ditemukan");
            }
            const profile = await this.profileService.getById(req.params.id);
            successResponse(res, "Profile berhasil diambil", profile);
        }
        catch (error) {
            throw new Error(error.message || "Profile tidak ditemukan");
        }
    }
    async getByUserId(req, res) {
        try {
            if (!req.params.userId) {
                throw new Error("User ID tidak ditemukan");
            }
            const userId = Number(req.params.userId);
            const profile = await this.profileService.getByUserId(userId);
            successResponse(res, "Profile berhasil diambil", profile);
        }
        catch (error) {
            throw new Error(error.message || "Profile tidak ditemukan");
        }
    }
    async create(req, res) {
        try {
            const file = req.file;
            const { user_id, name, gender, address } = req.body;
            if (!user_id || !name) {
                throw new Error("User ID dan nama wajib diisi");
            }
            const data = {
                user_id: Number(user_id),
                name: name.toString(),
                gender: gender || undefined,
                address: address || undefined,
                profile_picture_url: file ? `/profiles/${file.filename}` : undefined,
            };
            const profile = await this.profileService.create(data);
            successResponse(res, "Profile berhasil dibuat", profile, null, 201);
        }
        catch (error) {
            throw new Error(error.message || "Gagal membuat profile");
        }
    }
    async update(req, res) {
        try {
            if (!req.params.id) {
                throw new Error("ID profile tidak ditemukan");
            }
            const file = req.file;
            const { name, gender, address } = req.body;
            const updateData = {};
            if (name !== undefined)
                updateData.name = name;
            if (gender !== undefined)
                updateData.gender = gender;
            if (address !== undefined)
                updateData.address = address;
            if (file)
                updateData.profile_picture_url = `/profiles/${file.filename}`;
            const profile = await this.profileService.update(req.params.id, updateData);
            successResponse(res, "Profile berhasil diupdate", profile);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengupdate profile");
        }
    }
    async delete(req, res) {
        try {
            if (!req.params.id) {
                throw new Error("ID profile tidak ditemukan");
            }
            const deleted = await this.profileService.delete(req.params.id);
            successResponse(res, "Profile berhasil dihapus", deleted);
        }
        catch (error) {
            throw new Error(error.message || "Gagal menghapus profile");
        }
    }
    // HANYA TAMBAH 1 METHOD INI (SAMA DENGAN PRODUCT):
    async getStats(_req, res) {
        try {
            const stats = await this.profileService.exec();
            successResponse(res, "Statistik profile berhasil diambil", stats, null, 200);
        }
        catch (error) {
            throw new Error(error.message || "Gagal mengambil statistik");
        }
    }
}
//# sourceMappingURL=profile.controller.js.map