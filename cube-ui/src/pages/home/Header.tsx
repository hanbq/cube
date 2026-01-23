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
  LinearProgress,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useLoading } from '../../contexts/LoadingContext';

interface HeaderProps {
  userName?: string;
  notificationCount?: number;
  onLogout?: () => void;
  t?: any;
  navigate?: (path: string) => void;
  isLoading?: boolean;
  loadingProgress?: number;
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

  handleProfileClick = () => {
    this.handleUserMenuClose();
    if (this.props.navigate) {
      this.props.navigate('/mine/profile');
    }
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
        {this.props.isLoading && (
          <Box sx={{ width: '100%' }}>
            <LinearProgress 
              variant={this.props.loadingProgress && this.props.loadingProgress > 0 ? 'determinate' : 'indeterminate'} 
              value={this.props.loadingProgress} 
            />
          </Box>
        )}
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
              <Avatar sx={{ width: 32, height: 32 }}>
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
            <MenuItem onClick={this.handleProfileClick}>
              {t?.('header.profile')}
            </MenuItem>
            <MenuItem onClick={this.handleLogout}>
              {t?.('header.logout')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    );
  }
}

export default function Header(props: Omit<HeaderProps, 't' | 'navigate' | 'isLoading' | 'loadingProgress'>) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoading, loadingProgress } = useLoading();
  return <HeaderClass {...props} t={t} navigate={navigate} isLoading={isLoading} loadingProgress={loadingProgress} />;
}