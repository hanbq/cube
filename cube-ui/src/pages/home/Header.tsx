import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';

interface HeaderProps {
  userName?: string;
  notificationCount?: number;
  onLogout?: () => void;
  t?: any;
}

interface HeaderState {
  userMenuAnchor: HTMLElement | null;
  notificationMenuAnchor: HTMLElement | null;
}

class HeaderClass extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps) {
    super(props);
    this.state = {
      userMenuAnchor: null,
      notificationMenuAnchor: null,
    };
  }

  handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ userMenuAnchor: event.currentTarget });
  };

  handleUserMenuClose = () => {
    this.setState({ userMenuAnchor: null });
  };

  handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ notificationMenuAnchor: event.currentTarget });
  };

  handleNotificationMenuClose = () => {
    this.setState({ notificationMenuAnchor: null });
  };

  handleLogout = () => {
    this.handleUserMenuClose();
    if (this.props.onLogout) {
      this.props.onLogout();
    }
  };

  render() {
    const { userName = 'Admin', notificationCount = 0, t } = this.props;
    const { userMenuAnchor, notificationMenuAnchor } = this.state;

    return (
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ViewInArIcon sx={{ fontSize: 36 }} />
            <Typography variant="h6" component="div">
              Cube
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageSwitcher color="inherit" />

            <IconButton
              color="inherit"
              onClick={this.handleNotificationMenuOpen}
            >
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              color="inherit"
              onClick={this.handleUserMenuOpen}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={notificationMenuAnchor}
            open={Boolean(notificationMenuAnchor)}
            onClose={this.handleNotificationMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={this.handleNotificationMenuClose}>
              {t?.('header.noNotifications') || '暂无新通知'}
            </MenuItem>
          </Menu>

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={this.handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={this.handleUserMenuClose}>
              {t?.('header.profile') || '个人资料'}
            </MenuItem>
            <MenuItem onClick={this.handleLogout}>
              {t?.('header.logout') || '退出登录'}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    );
  }
}

export default function Header(props: Omit<HeaderProps, 't'>) {
  const { t } = useTranslation();
  return <HeaderClass {...props} t={t} />;
}
