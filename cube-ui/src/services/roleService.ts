import type { SYSRole, RoleFormData, SYSRoleParam, PageResult } from '../types/role';
import { apiService } from './api';

export const roleService = {
  // 获取所有角色
  getAllRoles: async (): Promise<SYSRole[]> => {
    const response = await apiService.get<SYSRole[]>('/roles');
    return response.data;
  },

  // 分页查询角色
  searchRoles: async (param: SYSRoleParam): Promise<PageResult<SYSRole>> => {
    const response = await apiService.post<PageResult<SYSRole>>('/roles/search', param);
    return response.data;
  },

  // 创建角色
  createRole: async (role: RoleFormData): Promise<SYSRole> => {
    const response = await apiService.post<SYSRole>('/roles', role);
    return response.data;
  },

  // 更新角色
  updateRole: async (roleId: number, role: RoleFormData): Promise<SYSRole> => {
    const response = await apiService.put<SYSRole>(`/roles/${roleId}`, role);
    return response.data;
  },

  // 删除角色
  deleteRole: async (roleId: number): Promise<void> => {
    await apiService.delete(`/roles/${roleId}`);
  },

  // 批量删除角色
  batchDeleteRoles: async (roleIds: number[]): Promise<void> => {
    await apiService.delete('/roles/batch', { data: roleIds });
  },
};
