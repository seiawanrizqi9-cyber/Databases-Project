import { successResponse } from "../utils/response.js";
export class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error("Email dan password wajib diisi");
            }
            const result = await this.authService.login({ email, password });
            successResponse(res, "Login berhasil!", result, null, 200);
        }
        catch (error) {
            throw new Error(error.message || "Login gagal");
        }
    }
    async register(req, res) {
        try {
            const { name, email, password, role } = req.body;
            if (!name || !email || !password) {
                throw new Error("Nama, email, dan password wajib diisi");
            }
            const result = await this.authService.register({
                name,
                email,
                password,
                role
            });
            successResponse(res, "Register berhasil!", result, null, 201);
        }
        catch (error) {
            throw new Error(error.message || "Registrasi gagal");
        }
    }
}
//# sourceMappingURL=auth.controller.js.map
