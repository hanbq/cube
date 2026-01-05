import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import type { IMenuItem } from '../types/common';

export const MENU_ITEMS: IMenuItem[] = [
  {
    id: 'dashboard',
    label: '仪表盘',
    icon: DashboardIcon,
    path: '/home/dashboard'
  },
  {
    id: 'workflow',
    label: '工作流管理',
    icon: AccountTreeIcon,
    path: '/home/workflow'
  },
  {
    id: 'user',
    label: '用户管理',
    icon: PeopleIcon,
    path: '/home/user'
  },
  {
    id: 'settings',
    label: '系统设置',
    icon: SettingsIcon,
    path: '/home/settings'
  },
  {
    id: 'menu_management',
    label: '菜单管理',
    icon: SettingsIcon,
    path: '/home/menu_management'
  }
];
