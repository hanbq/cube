import type { SYSMenu } from '../types/menu';
import { apiService } from './api';

/**
 * 获取当前用户有权限的菜单
 */
export const userMenuService = {
  // 获取用户菜单(树形结构)
  getUserMenus: async (): Promise<SYSMenu[]> => {
    const response = await apiService.get<SYSMenu[]>('/menus/tree');
    console.log('[userMenuService] getUserMenus response:', response);
    return response.data;
  },
};
