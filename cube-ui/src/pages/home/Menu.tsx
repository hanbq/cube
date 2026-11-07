import React from 'react';
import {
  Box,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Tooltip,
  Popper,
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
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
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
  hoveredMenuId: number | null;
  hoverAnchorEl: HTMLElement | null;
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
  PersonIcon,
  LockIcon,
};

class MenuClass extends React.Component<MenuProps, MenuState> {
  private hoverPanelElement: HTMLElement | null = null;

  constructor(props: MenuProps) {
    super(props);
    // 初始化时如果提供了currentPath，则使用它
    this.state = {
      selectedPath: props.currentPath || '',
      collapsed: false,
      expandedMenus: new Set(),
      hoveredMenuId: null,
      hoverAnchorEl: null,
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
    if (prevProps.currentPath !== this.props.currentPath && this.props.currentPath) {
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
          if (menu.path && currentPath.startsWith(menu.path + '/')) {
            // 只有当找到更深层级的匹配时才更新
            if (level > bestMatchLevel) {
              bestMatch = menu;
              bestMatchLevel = level;
            }
          }
          
          // 递归搜索子菜单
          if (menu.children) {
            const currentParents = menu.menuId ? [...parents, menu.menuId] : parents;
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
      this.setState({ selectedPath: foundMenu.path || '' });
      
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
    if (this.state.collapsed) {
      if (menu.children && menu.children.length > 0) {
        return;
      }

      this.setState({ selectedPath: menu.path || '' });
      if (this.props.onNavigate && menu.path) {
        this.props.onNavigate(menu.path);
      }
      return;
    }

    // 如果有子菜单,切换展开状态
    if (menu.children && menu.children.length > 0) {
      if (menu.menuId) {
        this.toggleExpand(menu.menuId);
      }
      // 如果父菜单没有component,不导航
      if (!menu.component) return;
    }

    this.setState({ selectedPath: menu.path || '' });
    if (this.props.onNavigate && menu.path) {
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
      (prevState) => ({ collapsed: !prevState.collapsed, hoveredMenuId: null, hoverAnchorEl: null }),
      () => {
        if (this.props.onCollapseChange) {
          this.props.onCollapseChange(this.state.collapsed);
        }
      }
    );
  };

  handleMenuHover = (menu: SYSMenu, event: React.MouseEvent<HTMLElement>) => {
    if (!menu.menuId) {
      return;
    }

    if (!this.state.collapsed) {
      return;
    }

    if (menu.children && menu.children.length > 0) {
      this.setState({ hoveredMenuId: menu.menuId, hoverAnchorEl: event.currentTarget });
    } else if (this.state.hoveredMenuId !== null) {
      this.setState({ hoveredMenuId: null, hoverAnchorEl: null });
    }
  };

  handleMenuLeave = (menu: SYSMenu, event: React.MouseEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget;
    const movingWithinMenu = nextTarget instanceof Node && (
      this.state.hoverAnchorEl?.contains(nextTarget) ||
      this.hoverPanelElement?.contains(nextTarget) ||
      (nextTarget instanceof Element && nextTarget.closest('[data-menu-item]') !== null)
    );

    if (!movingWithinMenu && this.state.hoveredMenuId === menu.menuId) {
      this.setState({ hoveredMenuId: null, hoverAnchorEl: null });
    }
  };

  getMenuLabel = (menu: SYSMenu) => {
    const { i18n } = this.props;
    if (i18n && i18n.language === 'en-US') {
      return menu.menuNameEng || menu.menuName;
    }
    return menu.menuName;
  };

  renderChildMenuItem = (menu: SYSMenu, level = 0): React.ReactNode => {
    const IconComponent = menu.iconCls && iconMap[menu.iconCls]
      ? iconMap[menu.iconCls]
      : DashboardIcon;
    const isSelected = this.state.selectedPath === menu.path;

    return (
      <ListItemButton
        key={menu.menuId || menu.path || Math.random()}
        selected={isSelected}
        onClick={() => this.handleMenuItemClick(menu)}
        sx={{
          minHeight: 36,
          px: 1.5,
          py: 0.75,
          borderRadius: 1,
          pl: 1.5 + level * 1.5,
        }}
      >
        <ListItemIcon sx={{ minWidth: 32 }}>
          {React.isValidElement(IconComponent) ? (
            IconComponent
          ) : (
            <IconComponent fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText
          primary={this.getMenuLabel(menu)}
          slotProps={{
            primary: {
              fontSize: '0.875rem',
            },
          }}
        />
      </ListItemButton>
    );
  };

  renderMenuItems = (menus: SYSMenu[], level = 0): React.ReactNode => {
    const { selectedPath, collapsed, expandedMenus, hoveredMenuId, hoverAnchorEl } = this.state;

    return menus.map(menu => {
      const IconComponent = menu.iconCls && iconMap[menu.iconCls]
        ? iconMap[menu.iconCls]
        : DashboardIcon;

      const hasChildren = menu.children && menu.children.length > 0;
      const isExpanded = menu.menuId ? expandedMenus.has(menu.menuId) : false;
      const isSelected = selectedPath === menu.path;
      const label = this.getMenuLabel(menu);
      const shouldRenderChildren = hasChildren && !collapsed && isExpanded;

      const menuItem = (
        <Box
          key={menu.menuId || menu.path || Math.random()}
          data-menu-item
          onMouseEnter={(event) => this.handleMenuHover(menu, event)}
          onMouseLeave={(event) => this.handleMenuLeave(menu, event)}
          sx={{ position: 'relative' }}
        >
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
              {React.isValidElement(IconComponent) ? (
                IconComponent
              ) : (
                <IconComponent
                  sx={{
                    fontSize: level > 0 ? '1.2rem' : '1.5rem',
                  }}
                />
              )}
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

          {shouldRenderChildren && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {this.renderMenuItems(menu.children || [], level + 1)}
              </List>
            </Collapse>
          )}

          {collapsed && hasChildren && menu.menuId && hoveredMenuId === menu.menuId && hoverAnchorEl && (
            <Popper
              open
              anchorEl={hoverAnchorEl}
              placement="right-start"
              modifiers={[{ name: 'offset', options: { offset: [0, 1] } }]}
              ref={(element: HTMLElement | null) => {
                this.hoverPanelElement = element;
              }}
              onMouseLeave={(event: React.MouseEvent<HTMLElement>) => this.handleMenuLeave(menu, event)}
              sx={{ zIndex: 1300 }}
            >
              <Paper elevation={2} sx={{ minWidth: 180, p: 0.5, borderRadius: 2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)' }}>
                <List component="div" disablePadding>
                  {(menu.children || []).map(child => this.renderChildMenuItem(child, 1))}
                </List>
              </Paper>
            </Popper>
          )}
        </Box>
      );

      if (collapsed && level > 0) {
        return null;
      }

      if (collapsed && level === 0 && !hasChildren) {
        return (
          <Tooltip key={menu.menuId || menu.path || Math.random()} title={label} placement="right">
            {menuItem}
          </Tooltip>
        );
      }

      return menuItem;
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
        className="menu-paper"
        sx={{
          height: '100%',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s',
          width: collapsed ? '60px' : '200px',
          position: 'relative',
          boxShadow: '2px 0 8px rgba(45, 80, 22, 0.15)',
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