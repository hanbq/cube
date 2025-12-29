export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
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