export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  description?: string;
}

export interface LoginResponse {
  token: string;
  tokenType?: string;
  expiresAt?: number;
  userInfo: UserInfo;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: number;
  username?: string;
}

export interface RefreshTokenResponse {
  token: string;
}

export interface UserInfo {
  id: string;
  username: string;
  email?: string;
  role?: string;
  isSuperAdmin?: boolean;
  [key: string]: any;
}