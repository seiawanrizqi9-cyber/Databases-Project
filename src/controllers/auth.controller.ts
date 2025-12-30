import type { Request, Response } from "express";
import { successResponse } from "../utils/response";
import type { IAuthService } from "../services/auth.service";

export interface IAuthController {
  login: (req: Request, res: Response) => Promise<void>;
  register: (req: Request, res: Response) => Promise<void>;
}

export class AuthController implements IAuthController {
  constructor(private authService: IAuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error("Email dan password wajib diisi");
      }

      const result = await this.authService.login({ email, password });
      successResponse(res, "Login berhasil!", result, null, 200);
    } catch (error: any) {
      throw new Error(error.message || "Login gagal");
    }
  }

  async register(req: Request, res: Response): Promise<void> {
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
    } catch (error: any) {
      throw new Error(error.message || "Registrasi gagal");
    }
  }
}