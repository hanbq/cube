import { apiService } from './api';

interface UserRole {
  userId: number;
  roleId: number;
}

interface SYSUserRole {
  id: number;
  userId: number;
  roleId: number;
}

export const userRoleService = {
  // 批量添加用户角色关联
  batchInsertUserRoles: async (userRoles: UserRole[]): Promise<void> => {
    await apiService.post('/user-roles/batch', userRoles);
  },

  // 批量删除用户角色关联
  batchDeleteUserRoles: async (userRoles: UserRole[]): Promise<void> => {
    // 遍历每个用户角色关联，逐个删除
    const deletePromises = userRoles.map(({ userId, roleId }) =>
      apiService.delete(`/user-roles/remove?userId=${userId}&roleId=${roleId}`)
    );
    await Promise.all(deletePromises);
  },

  // 根据角色ID查询用户角色关联
  getUserRolesByRoleId: async (roleId: number): Promise<SYSUserRole[]> => {
    const response = await apiService.get<SYSUserRole[]>(`/user-roles/role/${roleId}`);
    return response.data;
  },
};
