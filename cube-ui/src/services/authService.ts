import { apiService } from './api';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/auth/login', credentials);
    if (response.code === 200 && response.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      return response.data;
    }

    throw new Error(response.message || 'Login failed');
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUserInfo(): any {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};