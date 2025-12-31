import React from 'react';
import {
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Tooltip,
  Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SchemaIcon from '@mui/icons-material/Schema';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { useTranslation } from 'react-i18next';
import { useMenuStore } from '../../store/menuStore';
import type { SYSMenu } from '../../types/menu';

interface MenuProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
  onCollapseChange?: (collapsed: boolean) => void;
  t?: any;
  i18n?: any;
  menus?: SYSMenu[];
}

interface MenuState {
  selectedPath: string;
  collapsed: boolean;
  expandedMenus: Set<number>;
}

// 图标映射表
const iconMap: Record<string, any> = {
  DashboardIcon,
  SettingsIcon,
  PeopleIcon,
  SecurityIcon,
  MenuIcon,
  AccountTreeIcon,
  SchemaIcon,
  PlayArrowIcon,
  SettingsApplicationsIcon,
};

class MenuClass extends React.Component<MenuProps, MenuState> {
  constructor(props: MenuProps) {
    super(props);
    // 初始化时如果提供了currentPath，则使用它
    this.state = {
      selectedPath: props.currentPath || '',
      collapsed: false,
      expandedMenus: new Set(),
    };
  }

  componentDidMount() {
    // 如果初始化时没有currentPath，则尝试从props获取
    if (!this.state.selectedPath && this.props.currentPath) {
      this.updateSelectedPath(this.props.currentPath);
    } else if (this.state.selectedPath) {
      // 如果已经有selectedPath，确保菜单展开状态正确
      this.updateSelectedPath(this.state.selectedPath);
    }
  }

  componentDidUpdate(prevProps: MenuProps) {
    // 当currentPath变化时更新选中状态
    if (prevProps.currentPath !== this.props.currentPath) {
      this.updateSelectedPath(this.props.currentPath);
    }
    
    // 当菜单数据加载完成时，重新设置选中状态
    if ((!prevProps.menus || prevProps.menus.length === 0) && 
        this.props.menus && this.props.menus.length > 0 && 
        this.props.currentPath) {
      this.updateSelectedPath(this.props.currentPath);
    }
  }

  // 更新选中路径
  updateSelectedPath = (currentPath: string) => {
    if (!currentPath || !this.props.menus) return;

    // 存储需要展开的父菜单ID
    const parentMenusToExpand: number[] = [];
    
    // 递归查找菜单项
    const findMenuByPath = (menuList: SYSMenu[]): SYSMenu | null => {
      let bestMatch: SYSMenu | null = null;
      let bestMatchLevel = -1;

      // 递归搜索函数，返回匹配的菜单项
      const searchMenu = (menuList: SYSMenu[], parents: number[] = [], level = 0): SYSMenu | null => {
        for (const menu of menuList) {
          // 精确匹配当前路径
          if (currentPath === menu.path) {
            // 收集所有父菜单ID
            parentMenusToExpand.push(...parents);
            return menu;
          }
          
          // 如果当前路径以菜单路径开头，记录为可能的匹配项
          if (currentPath.startsWith(menu.path + '/')) {
            // 只有当找到更深层级的匹配时才更新
            if (level > bestMatchLevel) {
              bestMatch = menu;
              bestMatchLevel = level;
            }
          }
          
          // 递归搜索子菜单
          if (menu.children) {
            const currentParents = [...parents, menu.menuId!];
            const found = searchMenu(menu.children, currentParents, level + 1);
            if (found) {
              // 如果在子菜单中找到精确匹配，直接返回
              if (currentPath === found.path) {
                return found;
              }
            }
          }
        }
        return null;
      };

      // 先尝试找到精确匹配
      const exactMatch = searchMenu(menuList);
      if (exactMatch) {
        return exactMatch;
      }
      
      // 如果没有精确匹配，返回最佳匹配（最深层级）
      return bestMatch;
    };

    const foundMenu = findMenuByPath(this.props.menus);
    if (foundMenu) {
      this.setState({ selectedPath: foundMenu.path });
      
      // 展开所有父菜单
      if (parentMenusToExpand.length > 0) {
        this.setState(prevState => {
          const newExpanded = new Set(prevState.expandedMenus);
          parentMenusToExpand.forEach(menuId => {
            newExpanded.add(menuId);
          });
          return { expandedMenus: newExpanded };
        });
      }
    }
  };

  handleMenuItemClick = (menu: SYSMenu) => {
    // 如果有子菜单,切换展开状态
    if (menu.children && menu.children.length > 0) {
      this.toggleExpand(menu.menuId!);
      // 如果父菜单没有component,不导航
      if (!menu.component) return;
    }

    this.setState({ selectedPath: menu.path });
    if (this.props.onNavigate) {
      this.props.onNavigate(menu.path);
    }
  };

  toggleExpand = (menuId: number) => {
    this.setState(prevState => {
      const newExpanded = new Set(prevState.expandedMenus);
      if (newExpanded.has(menuId)) {
        newExpanded.delete(menuId);
      } else {
        newExpanded.add(menuId);
      }
      return { expandedMenus: newExpanded };
    });
  };

  handleToggleCollapse = () => {
    this.setState(
      (prevState) => ({ collapsed: !prevState.collapsed }),
      () => {
        if (this.props.onCollapseChange) {
          this.props.onCollapseChange(this.state.collapsed);
        }
      }
    );
  };

  getMenuLabel = (menu: SYSMenu) => {
    const { i18n } = this.props;
    if (i18n && i18n.language === 'en-US') {
      return menu.menuNameEng;
    }
    return menu.menuName;
  };

  renderMenuItems = (menus: SYSMenu[], level = 0): React.ReactNode => {
    const { selectedPath, collapsed, expandedMenus } = this.state;

    return menus.map(menu => {
      const IconComponent = iconMap[menu.iconCls] || DashboardIcon;
      const hasChildren = menu.children && menu.children.length > 0;
      const isExpanded = menu.menuId ? expandedMenus.has(menu.menuId) : false;
      const isSelected = selectedPath === menu.path;
      const label = this.getMenuLabel(menu);

      const menuItem = (
        <React.Fragment key={menu.menuId || menu.path}>
          <ListItemButton
            selected={isSelected}
            onClick={() => this.handleMenuItemClick(menu)}
            sx={{
              mb: 0.5,
              borderRadius: 1,
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1 : 2,
              pl: collapsed ? 1 : 2 + level * 2,
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 40 }}>
              <IconComponent
                sx={{
                  color: isSelected ? 'primary.main' : 'text.secondary',
                  fontSize: level > 0 ? '1.2rem' : '1.5rem',
                }}
              />
            </ListItemIcon>
            {!collapsed && (
              <>
                <ListItemText
                  primary={label}
                  slotProps={{
                    primary: {
                      fontSize: level > 0 ? '0.8125rem' : '0.875rem',
                      fontWeight: isSelected ? 600 : 400,
                    },
                  }}
                />
                {hasChildren && (
                  isExpanded ? <ExpandLess /> : <ExpandMore />
                )}
              </>
            )}
          </ListItemButton>

          {hasChildren && !collapsed && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {this.renderMenuItems(menu.children!, level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );

      return collapsed && level === 0 ? (
        <Tooltip key={menu.menuId || menu.path} title={label} placement="right">
          {menuItem}
        </Tooltip>
      ) : (
        menuItem
      );
    });
  };

  render() {
    const { collapsed } = this.state;
    const { menus } = this.props;

    if (!menus || menus.length === 0) {
      return null;
    }

    return (
      <Paper
        elevation={2}
        sx={{
          height: '100%',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s',
          width: collapsed ? '60px' : '200px',
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(136, 176, 75, 0.28) 0%, rgba(109, 143, 58, 0.35) 8%, rgba(88, 176, 75, 0.4) 15%, rgba(45, 80, 22, 0.45) 30%, rgba(26, 61, 10, 0.5) 45%, rgba(45, 80, 22, 0.45) 60%, rgba(88, 176, 75, 0.4) 75%, rgba(109, 143, 58, 0.35) 88%, rgba(136, 176, 75, 0.28) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '2px 0 8px rgba(45, 80, 22, 0.15)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(0deg, rgba(45, 80, 22, 0.15) 0%, rgba(136, 176, 75, 0.25) 15%, rgba(163, 197, 103, 0.2) 30%, transparent 45%, transparent 55%, rgba(163, 197, 103, 0.2) 70%, rgba(136, 176, 75, 0.25) 85%, rgba(45, 80, 22, 0.15) 100%)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '3px',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(136, 176, 75, 0.3) 0%, rgba(45, 80, 22, 0.5) 15%, rgba(26, 61, 10, 0.6) 30%, rgba(45, 80, 22, 0.7) 50%, rgba(26, 61, 10, 0.6) 70%, rgba(45, 80, 22, 0.5) 85%, rgba(136, 176, 75, 0.3) 100%)',
            pointerEvents: 'none',
          },
        }}
      >
        <List sx={{ pt: 2, px: collapsed ? 0.5 : 1, flexGrow: 1, overflow: 'auto' }}>
          {this.renderMenuItems(menus)}
        </List>
        <Divider />
        <IconButton
          onClick={this.handleToggleCollapse}
          sx={{
            alignSelf: 'center',
            m: 1,
          }}
        >
          <MenuIcon
            sx={{
              transform: collapsed ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          />
        </IconButton>
      </Paper>
    );
  }
}

export default function Menu(props: Omit<MenuProps, 't' | 'i18n' | 'menus'>) {
  const { t, i18n } = useTranslation();
  const { menus } = useMenuStore();

  return <MenuClass {...props} t={t} i18n={i18n} menus={menus} />;
}