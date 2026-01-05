import { apiService } from './api';

export interface MenuRole {
  menuId: number;
  roleId: number;
}

export const menuRoleService = {
  // 批量保存角色的菜单关联
  batchSaveMenuRolesByRoleId: async (roleId: number, menuIds: number[]): Promise<number> => {
    const menuRoles: MenuRole[] = menuIds.map(menuId => ({ menuId, roleId }));
    const response = await apiService.post<number>(`/menu-roles/role/${roleId}/batch-save`, menuRoles);
    return response.data;
  },
};
