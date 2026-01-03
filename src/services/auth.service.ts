import type { IAuthRepository } from "../repository/auth.repository";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../utils/env';
import type { Prisma, PrismaClient } from "../generated/client"; // ← TAMBAH INI

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
    profileId?: number;
    memberId?: string;
  };
  token: string;
}

interface RegisterResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  profileId?: number;
  memberId?: string;
}

export interface IAuthService {
  register(data: RegisterData): Promise<RegisterResponse>;
  login(data: LoginData): Promise<LoginResponse>;
}

export class AuthService implements IAuthService {
  constructor(
    private authRepo: IAuthRepository,
    private prisma: PrismaClient
  ) {}

  async register(data: RegisterData): Promise<RegisterResponse> {
    const validRoles = ['USER', 'ADMIN'];
    const role = data.role && validRoles.includes(data.role.toUpperCase()) 
      ? data.role.toUpperCase() 
      : 'USER';

    // Cek apakah user sudah ada
    const existingUser = await this.authRepo.findUserByEmail(data.email);
    
    if (existingUser) {
      throw new Error("Email sudah terdaftar");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Buat user dengan profile dan member (jika role USER)
    const userData: Prisma.UserCreateInput = {
      email: data.email,
      username: data.name.split(' ')[0] || data.name, // username dari nama
      password_hash: hashedPassword,
      role: role as any,
      profile: {
        create: {
          name: data.name
        }
      }
    };

    // Jika role USER, buat member record juga
    if (role === 'USER') {
      userData.member = {
        create: {
          name: data.name,
          email: data.email
        }
      };
    }

    // Buat user dengan transaction
    const user = await this.prisma.$transaction(async (tx) => {
      return await tx.user.create({
        data: userData,
        include: {
          profile: true,
          member: true
        }
      });
    });

    return {
      id: user.id,
      email: user.email,
      name: user.profile?.name || data.name,
      role: user.role,
      profileId: user.profile?.id,
      memberId: user.member?.id
    };
  }

  async login(data: LoginData): Promise<LoginResponse> {
    const user = await this.authRepo.findUserByEmail(data.email);
    
    if (!user) {
      throw new Error("Email atau password salah");
    }

    // Validasi password
    const isValid = await bcrypt.compare(data.password, user.password_hash);
    if (!isValid) {
      throw new Error("Email atau password salah");
    }

    // Get profile dan member
    const userWithDetails = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
        member: true
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        username: user.username 
      },
      config.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    return { 
      user: {
        id: user.id,
        email: user.email,
        name: userWithDetails?.profile?.name || user.username,
        role: user.role,
        profileId: userWithDetails?.profile?.id,
        memberId: userWithDetails?.member?.id
      }, 
      token 
    };
  }
}