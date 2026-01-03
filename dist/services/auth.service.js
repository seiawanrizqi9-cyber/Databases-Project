import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../utils/env.js";
export class AuthService {
    authRepo;
    constructor(authRepo
    // HAPUS: private prisma: PrismaClient // Tidak digunakan
    ) {
        this.authRepo = authRepo;
    }
    async register(data) {
        const validRoles = ["USER", "ADMIN"];
        const role = data.role && validRoles.includes(data.role.toUpperCase())
            ? data.role.toUpperCase()
            : "USER";
        // Cek apakah user sudah ada
        const existingUser = await this.authRepo.findUserByEmail(data.email);
        if (existingUser) {
            throw new Error("Email sudah terdaftar");
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        // Cek apakah email sudah terdaftar sebagai member
        const existingMember = await this.authRepo.findMemberByEmail(data.email);
        let memberId;
        // Jika member belum ada, buat member baru
        if (!existingMember) {
            const newMember = await this.authRepo.createMember({
                name: data.name,
                email: data.email,
                // phone dan address bisa null
            });
            memberId = newMember.id;
        }
        else {
            memberId = existingMember.id;
            // Update nama member jika berbeda
            if (existingMember.name !== data.name && memberId) {
                // PASTIKAN memberId tidak undefined sebelum digunakan
                await this.authRepo.updateMember(memberId, { name: data.name });
            }
        }
        // Buat user
        const user = await this.authRepo.createUser({
            email: data.email,
            username: data.name,
            password_hash: hashedPassword,
            role: role,
        });
        return {
            id: user.id,
            email: user.email,
            name: user.username,
            role: user.role,
            memberId: memberId
        };
    }
    async login(data) {
        const user = await this.authRepo.findUserByEmail(data.email);
        if (!user) {
            throw new Error("Email atau password salah");
        }
        // Validasi password
        const isValid = await bcrypt.compare(data.password, user.password_hash);
        if (!isValid) {
            throw new Error("Email atau password salah");
        }
        // Generate JWT token
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role,
            username: user.username
        }, config.JWT_SECRET, { expiresIn: "24h" });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.username,
                role: user.role
            },
            token
        };
    }
}
//# sourceMappingURL=auth.service.js.map
