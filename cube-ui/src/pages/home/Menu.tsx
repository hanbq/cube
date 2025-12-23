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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { MENU_ITEMS } from '../../constants/menu';
import { useTranslation } from 'react-i18next';

interface MenuProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
  onCollapseChange?: (collapsed: boolean) => void;
  t?: any;
}

interface MenuState {
  selectedItem: string;
  collapsed: boolean;
}

class MenuClass extends React.Component<MenuProps, MenuState> {
  constructor(props: MenuProps) {
    super(props);
    this.state = {
      selectedItem: 'dashboard',
      collapsed: false,
    };
  }

  componentDidMount() {
    if (this.props.currentPath) {
      const currentItem = MENU_ITEMS.find(item => this.props.currentPath?.includes(item.id));
      if (currentItem) {
        this.setState({ selectedItem: currentItem.id });
      }
    }
  }

  componentDidUpdate(prevProps: MenuProps) {
    if (prevProps.currentPath !== this.props.currentPath && this.props.currentPath) {
      const currentItem = MENU_ITEMS.find(item => this.props.currentPath?.includes(item.id));
      if (currentItem && currentItem.id !== this.state.selectedItem) {
        this.setState({ selectedItem: currentItem.id });
      }
    }
  }

  handleMenuItemClick = (id: string, path: string) => {
    this.setState({ selectedItem: id });
    if (this.props.onNavigate) {
      this.props.onNavigate(path);
    }
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

  render() {
    const { selectedItem, collapsed } = this.state;
    const { t } = this.props;

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
        <List sx={{ pt: 2, px: collapsed ? 0.5 : 1, flexGrow: 1 }}>
          {MENU_ITEMS.map((item) => {
            const IconComponent = item.icon as React.ElementType;
            const isSelected = selectedItem === item.id;
            const label = t?.(`menu.${item.id}`) || item.label;
            const menuItem = (
              <ListItemButton
                key={item.id}
                selected={isSelected}
                onClick={() => this.handleMenuItemClick(item.id, item.path)}
                sx={{
                  mb: 0.5,
                  borderRadius: 1,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  px: collapsed ? 1 : 2,
                }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 40 }}>
                  <IconComponent
                    sx={{
                      color: isSelected ? 'primary.main' : 'text.secondary',
                    }}
                  />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={label}
                    slotProps={{
                      primary: {
                        fontSize: '0.875rem',
                        fontWeight: isSelected ? 600 : 400,
                      },
                    }}
                  />
                )}
              </ListItemButton>
            );

            return collapsed ? (
              <Tooltip key={item.id} title={label} placement="right">
                {menuItem}
              </Tooltip>
            ) : (
              menuItem
            );
          })}
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

export default function Menu(props: Omit<MenuProps, 't'>) {
  const { t } = useTranslation();
  return <MenuClass {...props} t={t} />;
}
