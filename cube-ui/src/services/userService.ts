import type { SYSUser, UserFormData, SYSUserParam, PageResult } from '../types/user';
import { apiService } from './api';

export const userService = {
  // 获取所有用户
  getAllUsers: async (): Promise<SYSUser[]> => {
    const response = await apiService.get<SYSUser[]>('/users');
    return response.data;
  },

  // 分页查询用户
  searchUsers: async (param: SYSUserParam): Promise<PageResult<SYSUser>> => {
    const response = await apiService.post<PageResult<SYSUser>>('/users/search', param);
    return response.data;
  },

  // 创建用户
  createUser: async (user: UserFormData): Promise<number> => {
    const response = await apiService.post<number>('/users', user);
    return response.data;
  },

  // 更新用户
  updateUser: async (userId: number, user: UserFormData): Promise<boolean> => {
    const response = await apiService.put<boolean>(`/users/${userId}`, user);
    return response.data;
  },

  // 删除用户
  deleteUser: async (userId: number): Promise<void> => {
    await apiService.delete(`/users/${userId}`);
  },

  // 批量删除用户
  batchDeleteUsers: async (userIds: number[]): Promise<void> => {
    await apiService.delete('/users/batch', { data: userIds });
  },

  // 更新用户状态
  updateUserStatus: async (userId: number, status: string): Promise<boolean> => {
    const response = await apiService.put<boolean>(`/users/${userId}/status?status=${status}`);
    return response.data;
  },

  // 更新用户密码
  updateUserPassword: async (userId: number, newPassword: string): Promise<boolean> => {
    const response = await apiService.put<boolean>(`/users/${userId}/password?newPassword=${newPassword}`);
    return response.data;
  },

  // 根据角色ID查询用户列表
  getUsersByRoleId: async (roleId: number): Promise<SYSUser[]> => {
    const response = await apiService.get<SYSUser[]>(`/users/role/${roleId}`);
    return response.data;
  },
};
