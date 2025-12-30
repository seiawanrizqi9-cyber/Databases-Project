export class AuthRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findUserByEmail(email) {
        return await this.prisma.user.findUnique({
            where: { email, deletedAt: null }
        });
    }
    async createUser(data) {
        return await this.prisma.user.create({ data });
    }
    async updateUser(id, data) {
        return await this.prisma.user.update({
            where: { id },
            data,
        });
    }
    async updateUserPassword(id, passwordHash) {
        return await this.prisma.user.update({
            where: { id },
            data: { password_hash: passwordHash },
        });
    }
    async findMemberByEmail(email) {
        return await this.prisma.member.findUnique({
            where: { email, deletedAt: null }
        });
    }
    async createMember(data) {
        return await this.prisma.member.create({
            data
        });
    }
    async updateMember(id, data) {
        return await this.prisma.member.update({
            where: { id },
            data
        });
    }
}
//# sourceMappingURL=auth.repository.js.map