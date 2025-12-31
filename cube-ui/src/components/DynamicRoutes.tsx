import { Route, Navigate } from 'react-router-dom';
import { loadComponent } from '../utils/componentLoader';
import type { SYSMenu } from '../types/menu';

/**
 * 根据菜单数据生成动态路由元素
 * 这是一个纯函数,不是React组件
 */
export const generateDynamicRoutes = (flatMenus: SYSMenu[]) => {
  if (!flatMenus || flatMenus.length === 0) {
    // 如果还没有加载菜单,返回空数组
    return [];
  }

  // 找到第一个有component的菜单作为默认路由
  const firstMenuWithComponent = flatMenus.find(menu => menu.component);
  const routes: React.ReactElement[] = [];

  // 添加默认路由
  if (firstMenuWithComponent) {
    const defaultPath = firstMenuWithComponent.path
      .replace('/home/', '')
      .replace('/home', '');
    routes.push(
      <Route key="default-route" index element={<Navigate to={defaultPath} replace />} />
    );
  }

  // 生成所有菜单路由
  flatMenus
    .filter(menu => menu.component) // 只有配置了component的菜单才生成路由
    .forEach(menu => {
      // 从完整路径中提取相对于/home的路径
      // 例如: /home/system/user -> system/user
      let relativePath = menu.path;
      if (relativePath.startsWith('/home/')) {
        relativePath = relativePath.substring(6); // 去掉 '/home/'
      } else if (relativePath === '/home') {
        relativePath = '';
      }

      routes.push(
        <Route
          key={menu.menuId || menu.path}
          path={relativePath}
          element={loadComponent(menu.component!)}
        />
      );
    });

  return routes;
};
