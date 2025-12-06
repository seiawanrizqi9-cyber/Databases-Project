export interface MagicUser {
  id: string;
  email: string;
  name?: string | undefined;  
  isVerified: boolean;
  lastLogin?: Date | undefined;
  loginCount: number;
  createdAt: Date;
}

export interface MagicToken {
  id: string;
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}