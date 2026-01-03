import type { IAuthRepository } from "../repository/auth.repository.js";
interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: string;
}
interface LoginData {
    email: string;
    password: string;
}
interface LoginResponse {
    user: {
        id: number;
        email: string;
        name: string;
        role: string;
    };
    token: string;
}
interface RegisterResponse {
    id: number;
    email: string;
    name: string;
    role: string;
    memberId?: string;
}
export interface IAuthService {
    register(data: RegisterData): Promise<RegisterResponse>;
    login(data: LoginData): Promise<LoginResponse>;
}
export declare class AuthService implements IAuthService {
    private authRepo;
    constructor(authRepo: IAuthRepository);
    register(data: RegisterData): Promise<RegisterResponse>;
    login(data: LoginData): Promise<LoginResponse>;
}
export {};
//# sourceMappingURL=auth.service.d.ts.map
