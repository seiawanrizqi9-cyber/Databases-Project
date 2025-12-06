import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { MagicUser, MagicToken } from "../types/magicUser.type";

let mockUsers: MagicUser[] = [];
let mockTokens: MagicToken[] = [];

export class MockMagicLoginService {
  constructor() {
    console.log("Mock login service initialized");
  }

  private generateId(): string {
    return `user_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
  }

  private generateToken(): string {
    return crypto.randomBytes(20).toString("hex"); // 40 chars
  }

  // 1. Request Magic Link
  async requestMagicLink(
    email: string,
    name?: string
  ): Promise<{ success: boolean; token?: string }> {
    try {
      const cleanEmail = email.toLowerCase().trim();

      // Find or create user
      let user = mockUsers.find((u) => u.email === cleanEmail);

      if (!user) {
        const newUser: MagicUser = {
          id: this.generateId(),
          email: cleanEmail,
          name: name ?? undefined,
          isVerified: false,
          loginCount: 0,
          createdAt: new Date(),
        };
        mockUsers.push(newUser);
        user = newUser;
      }

      // Create token
      const token = this.generateToken();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      const newToken: MagicToken = {
        id: `token_${Date.now()}`,
        email: cleanEmail,
        token,
        expiresAt,
        used: false,
        createdAt: new Date(),
      };

      mockTokens.push(newToken);

      console.log("🔗 MAGIC TOKEN for testing:", token);

      return { success: true, token };
    } catch (error) {
      console.error("❌ Magic link failed:", error);
      return { success: false };
    }
  }

  // 2. Verify Magic Token
  async verifyMagicToken(token: string): Promise<{
    success: boolean;
    user?: MagicUser;
    authToken?: string;
  }> {
    try {
      const magicToken = mockTokens.find(
        (t) => t.token === token && !t.used && t.expiresAt > new Date()
      );

      if (!magicToken) {
        return { success: false };
      }

      // Mark token as used
      magicToken.used = true;

      // Find user
      let user = mockUsers.find((u) => u.email === magicToken.email);

      if (!user) {
        return { success: false };
      }

      // Update user
      user.isVerified = true;
      user.loginCount += 1;
      user.lastLogin = new Date();

      // Generate JWT
      const authToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET || "library_secret_2025",
        { expiresIn: "7d" }
      );

      return {
        success: true,
        user: { ...user },
        authToken,
      };
    } catch (error) {
      console.error("❌ Token verification failed:", error);
      return { success: false };
    }
  }

  // 3. Validate Session
  async validateSession(authToken: string): Promise<{
    success: boolean;
    user?: any;
  }> {
    try {
      const decoded = jwt.verify(
        authToken,
        process.env.JWT_SECRET || "library_secret_2025"
      ) as { userId: string; email: string };

      const user = mockUsers.find((u) => u.id === decoded.userId);

      if (!user) {
        return { success: false };
      }

      return {
        success: true,
        user: { ...user },
      };
    } catch (error) {
      return { success: false };
    }
  }

  // 4. Get User Profile
  async getUserProfile(email: string): Promise<{
    success: boolean;
    user?: MagicUser;
  }> {
    const user = mockUsers.find((u) => u.email === email.toLowerCase().trim());

    if (!user) {
      return { success: false };
    }

    return {
      success: true,
      user: { ...user },
    };
  }

  // 5. Get All Users (Admin)
  async getAllUsers(): Promise<MagicUser[]> {
    return mockUsers.map((user) => ({
      ...user,
    }));
  }

  // 6. Update User Profile
  async updateUserProfile(
    email: string,
    updates: { name?: string }
  ): Promise<{ success: boolean; user?: MagicUser }> {
    const userIndex = mockUsers.findIndex(
      (u) => u.email === email.toLowerCase().trim()
    );

    if (userIndex === -1) {
      return { success: false };
    }

    const existingUser = mockUsers[userIndex];

    if (!existingUser) {
      return { success: false };
    }

    const updatedUser: MagicUser = {
      id: existingUser.id,
      email: existingUser.email,
      name: updates.name ?? existingUser.name,
      isVerified: existingUser.isVerified,
      lastLogin: existingUser.lastLogin,
      loginCount: existingUser.loginCount,
      createdAt: existingUser.createdAt,
    };

    mockUsers[userIndex] = updatedUser;

    return {
      success: true,
      user: updatedUser,
    };
  }

  // 7. Logout (Optional - Invalidate token on server side if needed)
  async logout(authToken: string): Promise<boolean> {
    return true;
  }
}
