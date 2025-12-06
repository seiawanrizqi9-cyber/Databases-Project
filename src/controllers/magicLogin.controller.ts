import type { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response";
import { MockMagicLoginService } from "../services/mockMagicLogin.service";

const magicService = new MockMagicLoginService();

// 1. Request Magic Link
export const requestMagicLink = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !email.includes('@')) {
      return errorResponse(res, "Email tidak valid", 400);
    }

    const result = await magicService.requestMagicLink(email, name);
    
    if (result.success) {
      successResponse(
        res,
        "Magic link berhasil dibuat",
        {
          email,
          token: result.token, // For testing only
          message: "Token tersedia di console untuk testing"
        }
      );
    } else {
      errorResponse(res, "Gagal membuat magic link", 500);
    }
  } catch (error: any) {
    errorResponse(res, "Terjadi kesalahan server", 500);
  }
};

// 2. Verify Magic Token
export const verifyMagicToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return errorResponse(res, "Token diperlukan", 400);
    }

    const result = await magicService.verifyMagicToken(token);
    
    if (result.success) {
      successResponse(
        res,
        "Login berhasil!",
        {
          user: result.user,
          token: result.authToken,
          expiresIn: '7 hari'
        }
      );
    } else {
      errorResponse(res, "Token tidak valid atau telah kadaluarsa", 400);
    }
  } catch (error: any) {
    errorResponse(res, "Terjadi kesalahan server", 500);
  }
};

// 3. Validate Session
export const validateSession = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return errorResponse(res, "Token tidak tersedia", 401);
    }

    const result = await magicService.validateSession(token);
    
    if (result.success) {
      successResponse(
        res,
        "Session valid",
        {
          user: result.user,
          valid: true
        }
      );
    } else {
      errorResponse(res, "Session tidak valid", 401);
    }
  } catch (error: any) {
    errorResponse(res, "Terjadi kesalahan server", 500);
  }
};

// 4. Get User Profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return errorResponse(res, "Email diperlukan", 400);
    }

    const result = await magicService.getUserProfile(email);
    
    if (result.success) {
      successResponse(
        res,
        "Profil user ditemukan",
        result.user
      );
    } else {
      errorResponse(res, "User tidak ditemukan", 404);
    }
  } catch (error: any) {
    errorResponse(res, "Terjadi kesalahan server", 500);
  }
};

// 5. Get All Users (Admin)
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await magicService.getAllUsers();
    
    successResponse(
      res,
      "Daftar user berhasil diambil",
      {
        users,
        total: users.length
      }
    );
  } catch (error: any) {
    errorResponse(res, "Terjadi kesalahan server", 500);
  }
};

// 6. Update User Profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const updates = req.body;
    
    if (!email) {
      return errorResponse(res, "Email diperlukan", 400);
    }

    const result = await magicService.updateUserProfile(email, updates);
    
    if (result.success) {
      successResponse(
        res,
        "Profil berhasil diperbarui",
        result.user
      );
    } else {
      errorResponse(res, "User tidak ditemukan", 404);
    }
  } catch (error: any) {
    errorResponse(res, "Terjadi kesalahan server", 500);
  }
};

// 7. Logout (Optional)
export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      await magicService.logout(token);
    }
    
    successResponse(
      res,
      "Logout berhasil"
    );
  } catch (error: any) {
    errorResponse(res, "Terjadi kesalahan server", 500);
  }
};