import type { SYSMenu } from '../types/menu';
import { apiService } from './api';

/**
 * 获取当前用户有权限的菜单
 */
export const userMenuService = {
  // 获取用户菜单(树形结构)
  getUserMenus: async (): Promise<SYSMenu[]> => {
    const response = await apiService.get<SYSMenu[]>('/menus/tree');
    
    // 添加"我的"菜单项
    const mineMenu: SYSMenu = {
      menuId: -1, // 使用负数避免与后端ID冲突
      menuName: '我的',
      menuNameEng: 'Mine',
      path: '/mine',
      iconCls: 'PersonIcon',
      parentId: null,
      sort: 999, // 排在最后
      component: '',
      children: [
        {
          menuId: -2,
          menuName: '用户信息',
          menuNameEng: 'User Profile',
          path: '/profile',
          iconCls: 'PersonIcon',
          parentId: -1,
          sort: 1,
          component: '../pages/mine/UserProfile',
        },
        {
          menuId: -3,
          menuName: '修改密码',
          menuNameEng: 'Change Password',
          path: '/change-password',
          iconCls: 'LockIcon',
          parentId: -1,
          sort: 2,
          component: '../pages/mine/ChangePassword',
        }
      ]
    };
    
    // 将"我的"菜单添加到菜单列表中
    return [...response.data, mineMenu];
  },
};