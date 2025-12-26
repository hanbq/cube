import { useState, useEffect, useCallback } from 'react';
import { menuService } from '../services/menuService';
//import { menuServiceMock as menuService } from '../services/menuServiceMock'; // 使用Mock数据
import type { SYSMenu, MenuFormData } from '../types/menu';

export const useMenu = () => {
  const [menus, setMenus] = useState<SYSMenu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 加载菜单列表
  const loadMenus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await menuService.getAllMenus();
      setMenus(data);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load menus:', err);
      // 如果API失败,设置空数组以便页面能正常显示
      setMenus([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 创建菜单
  const createMenu = useCallback(async (menu: MenuFormData) => {
    setLoading(true);
    setError(null);
    try {
      const newMenu = await menuService.createMenu(menu);
      const data = await menuService.getAllMenus();
      setMenus(data);
      return newMenu;
    } catch (err) {
      setError(err as Error);
      console.error('Failed to create menu:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新菜单
  const updateMenu = useCallback(async (menuId: number, menu: MenuFormData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedMenu = await menuService.updateMenu(menuId, menu);
      const data = await menuService.getAllMenus();
      setMenus(data);
      return updatedMenu;
    } catch (err) {
      setError(err as Error);
      console.error('Failed to update menu:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 删除菜单
  const deleteMenu = useCallback(async (menuId: number) => {
    setLoading(true);
    setError(null);
    try {
      await menuService.deleteMenu(menuId);
      const data = await menuService.getAllMenus();
      setMenus(data);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to delete menu:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 批量删除菜单
  const batchDeleteMenus = useCallback(async (menuIds: number[]) => {
    setLoading(true);
    setError(null);
    try {
      await menuService.batchDeleteMenus(menuIds);
      const data = await menuService.getAllMenus();
      setMenus(data);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to batch delete menus:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新菜单排序
  const updateMenuSort = useCallback(async (menuId: number, sort: number) => {
    setLoading(true);
    setError(null);
    try {
      await menuService.updateMenuSort(menuId, sort);
      const data = await menuService.getAllMenus();
      setMenus(data);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to update menu sort:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 获取扁平化的菜单列表(用于父级菜单选择)
  const getFlatMenus = useCallback((menuList: SYSMenu[] = menus): SYSMenu[] => {
    const result: SYSMenu[] = [];
    const traverse = (items: SYSMenu[]) => {
      items.forEach(item => {
        result.push(item);
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      });
    };
    traverse(menuList);
    return result;
  }, [menus]);

  // 根据ID查找菜单
  const findMenuById = useCallback((menuId: number, menuList: SYSMenu[] = menus): SYSMenu | null => {
    for (const menu of menuList) {
      if (menu.menuId === menuId) {
        return menu;
      }
      if (menu.children && menu.children.length > 0) {
        const found = findMenuById(menuId, menu.children);
        if (found) return found;
      }
    }
    return null;
  }, [menus]);

  // 初始加载
  useEffect(() => {
    loadMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    menus,
    loading,
    error,
    loadMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    batchDeleteMenus,
    updateMenuSort,
    getFlatMenus,
    findMenuById,
  };
};
