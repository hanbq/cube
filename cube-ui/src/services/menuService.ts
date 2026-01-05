import { apiService } from './api';
import type { SYSMenu, MenuFormData } from '../types/menu';

export const menuService = {
  // 获取菜单树
  getMenuTree: async (): Promise<SYSMenu[]> => {
    const response = await apiService.get<SYSMenu[]>('/menus/tree');
    return response.data;
  },

  // 根据角色ID查询所有菜单并标记是否被选中
  getAllMenusWithSelection: async (roleId: number): Promise<SYSMenu[]> => {
    const response = await apiService.get<SYSMenu[]>(`/menus/role/${roleId}/with-selection`);
    return response.data;
  },

  // 创建新菜单
  createMenu: async (menu: MenuFormData): Promise<SYSMenu> => {
    const response = await apiService.post<SYSMenu>('/menus', menu);
    return response.data;
  },

  // 更新菜单
  updateMenu: async (menuId: number, menu: MenuFormData): Promise<SYSMenu> => {
    const response = await apiService.put<SYSMenu>(`/menus/${menuId}`, menu);
    return response.data;
  },

  // 删除菜单
  deleteMenu: async (menuId: number): Promise<void> => {
    await apiService.delete<void>(`/menus/${menuId}`);
  },

};
