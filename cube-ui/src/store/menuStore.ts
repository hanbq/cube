import { create } from 'zustand';
import type { SYSMenu } from '../types/menu';

interface MenuState {
  menus: SYSMenu[];
  flatMenus: SYSMenu[];
  loading: boolean;
  initialized: boolean; // 是否已完成初始化加载
  error: Error | null;
  setMenus: (menus: SYSMenu[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  clearMenus: () => void;
  getMenuByPath: (path: string) => SYSMenu | undefined;
  getAllPaths: () => string[];
}

// 递归扁平化菜单树
const flattenMenus = (menus: SYSMenu[]): SYSMenu[] => {
  const result: SYSMenu[] = [];
  const flatten = (items: SYSMenu[]) => {
    items.forEach(item => {
      result.push(item);
      if (item.children && item.children.length > 0) {
        flatten(item.children);
      }
    });
  };
  flatten(menus);
  return result;
};

export const useMenuStore = create<MenuState>()((set, get) => ({
  menus: [],
  flatMenus: [],
  loading: false,
  initialized: false,
  error: null,

  setMenus: (menus: SYSMenu[]) => {
    const flatMenus = flattenMenus(menus);
    set({ menus, flatMenus, error: null, initialized: true });
  },

  setLoading: (loading: boolean) => set({ loading }),

  setError: (error: Error | null) => set({ error, loading: false, initialized: true }),

  clearMenus: () => set({ menus: [], flatMenus: [], error: null, initialized: false }),

  getMenuByPath: (path: string) => {
    const { flatMenus } = get();
    return flatMenus.find(menu => menu.path === path);
  },

  getAllPaths: () => {
    const { flatMenus } = get();
    return flatMenus.map(menu => menu.path);
  },
}));
