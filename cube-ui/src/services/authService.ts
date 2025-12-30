import { apiService } from './api';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, RefreshTokenResponse } from '../types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/auth/login', credentials);
    if (response.code === 200 && response.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
      return response.data;
    }

    throw new Error(response.message || 'Login failed');
  },

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiService.post<RegisterResponse>('/auth/register', userData);
    if (response.code === 200 && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Registration failed');
  },

  async logout(): Promise<void> {
    try {
      // 调用后端 logout 接口
      await apiService.post<void>('/auth/logout');
    } catch (error) {
      // 即使后端调用失败，也要清除本地存储
      console.error('Logout API call failed:', error);
    } finally {
      // 清除本地存储的认证信息
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    }
  },

  async refreshToken(): Promise<string> {
    const currentToken = this.getToken();
    if (!currentToken) {
      throw new Error('No token to refresh');
    }

    try {
      const response = await apiService.post<RefreshTokenResponse>('/auth/refresh', {
        token: currentToken,
      });

      if (response.code === 200 && response.data?.token) {
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        console.log('Token refreshed successfully');
        return newToken;
      }

      throw new Error(response.message || 'Token refresh failed');
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUserInfo(): any {
    const userInfo = localStorage.getItem('userInfo');
    console.log('[authService] localStorage中的userInfo原始值:', userInfo);
    if (!userInfo || userInfo === 'undefined' || userInfo === 'null') {
      console.log('[authService] userInfo为空或无效');
      return null;
    }
    try {
      const parsed = JSON.parse(userInfo);
      console.log('[authService] 解析后的userInfo:', parsed);
      return parsed;
    } catch (error) {
      console.error('[authService] Failed to parse userInfo:', error);
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};