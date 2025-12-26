import React from 'react';
import { Box, Breadcrumbs, Typography, Link } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useTranslation } from 'react-i18next';
import { useMenuStore } from '../../store/menuStore';
import type { SYSMenu } from '../../types/menu';

interface MainProps {
  location?: ReturnType<typeof useLocation>;
  navigate?: ReturnType<typeof useNavigate>;
  t?: any;
  i18n?: any;
  getMenuByPath?: (path: string) => SYSMenu | undefined;
}

class MainClass extends React.Component<MainProps> {
  getMenuLabel = (menu: SYSMenu) => {
    const { i18n } = this.props;
    if (i18n && i18n.language === 'en-US') {
      return menu.menuNameEng;
    }
    return menu.menuName;
  };

  getBreadcrumbs = () => {
    const pathname = this.props.location?.pathname || '';
    const { t, getMenuByPath } = this.props;

    const breadcrumbs: Array<{
      label: string;
      path: string;
      icon?: React.ReactElement;
    }> = [
      {
        label: t?.('breadcrumb.home') || '首页',
        path: '/home',
        icon: <HomeIcon sx={{ fontSize: 16, mr: 0.5 }} />
      }
    ];

    if (getMenuByPath) {
      const menu = getMenuByPath(pathname);
      if (menu) {
        breadcrumbs.push({
          label: this.getMenuLabel(menu),
          path: menu.path
        });
      }
    }

    return breadcrumbs;
  };

  handleNavigate = (path: string) => {
    if (this.props.navigate) {
      this.props.navigate(path);
    }
  };

  render() {
    const breadcrumbs = this.getBreadcrumbs();
    const isLastItem = (index: number) => index === breadcrumbs.length - 1;

    return (
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: 'background.default',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
            aria-label="breadcrumb"
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = isLastItem(index);

              return isLast ? (
                <Typography
                  key={crumb.path}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'primary.main',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  {crumb.icon}
                  {crumb.label}
                </Typography>
              ) : (
                <Link
                  key={crumb.path}
                  underline="hover"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text.secondary',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                  onClick={() => this.handleNavigate(crumb.path)}
                >
                  {crumb.icon}
                  {crumb.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    );
  }
}

export default function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { getMenuByPath } = useMenuStore();

  return (
    <MainClass
      location={location}
      navigate={navigate}
      t={t}
      i18n={i18n}
      getMenuByPath={getMenuByPath}
    />
  );
}
