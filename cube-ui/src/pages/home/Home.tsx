import React from 'react';
import Header from './Header';
import Main from './Main';
import Menu from './Menu';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenuStore } from '../../store/menuStore';
import { userMenuService } from '../../services/userMenuService';
import { authService } from '../../services/authService';

interface HomeProps {
  navigate?: (path: string) => void;
  currentPath?: string;
  menusLoading?: boolean;
}

class HomeClass extends React.Component<HomeProps> {
  handleLogout = async () => {
    try {
      console.log('退出登录中...');
      // 调用后端 logout 接口并清除本地存储
      await authService.logout();
      console.log('退出登录成功');
      // 跳转到登录页
      if (this.props.navigate) {
        this.props.navigate('/login');
      }
    } catch (error) {
      console.error('退出登录失败:', error);
      // 即使出错也跳转到登录页（因为 authService.logout 已经清除了本地存储）
      if (this.props.navigate) {
        this.props.navigate('/login');
      }
    }
  };

  handleNavigate = (path: string) => {
    if (this.props.navigate) {
      this.props.navigate(path);
    }
  };

  render() {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ flexShrink: 0 }}>
          <Header userName="Admin" notificationCount={3} onLogout={this.handleLogout} />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #e8ede3 0%, #f0f4ed 20%, #f5f8f0 40%, #fafcf8 50%, #f5f8f0 60%, #f0f4ed 80%, #e8ede3 100%)',
          }}
        >
          <Box sx={{ flexShrink: 0, overflow: 'auto' }}>
            <Menu onNavigate={this.handleNavigate} currentPath={this.props.currentPath} />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              background: 'linear-gradient(135deg, rgba(136, 176, 75, 0.12) 0%, rgba(109, 143, 58, 0.15) 15%, rgba(163, 197, 103, 0.18) 30%, rgba(136, 176, 75, 0.08) 50%, rgba(163, 197, 103, 0.18) 70%, rgba(109, 143, 58, 0.15) 85%, rgba(136, 176, 75, 0.12) 100%)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(ellipse at 20% 20%, rgba(136, 176, 75, 0.2) 0%, rgba(163, 197, 103, 0.15) 25%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(163, 197, 103, 0.18) 0%, rgba(136, 176, 75, 0.12) 25%, transparent 50%)',
                pointerEvents: 'none',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent 0%, rgba(136, 176, 75, 0.08) 25%, transparent 50%, rgba(163, 197, 103, 0.1) 75%, transparent 100%)',
                pointerEvents: 'none',
              },
            }}
          >
            <Main />
          </Box>
        </Box>
      </Box>
    );
  }
}

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setMenus, setLoading, setError, loading } = useMenuStore();

  // 检查认证状态
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('[Home] 未找到 token，重定向到登录页');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // 在函数组件中直接使用 useEffect 加载菜单
  React.useEffect(() => {
    const loadMenus = async () => {
      // 再次检查 token，确保有效
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      try {
        console.log('[Home] 开始加载菜单数据...');
        setLoading(true);
        const menus = await userMenuService.getUserMenus();
        console.log('[Home] 菜单数据加载成功:', menus.length, '个顶级菜单项');
        console.log('[Home] 菜单数据:', menus);
        setMenus(menus);
        console.log('[Home] 已调用 setMenus 更新 store');
      } catch (error) {
        console.error('[Home] 加载菜单失败:', error);
        setError(error as Error);
        // 如果是认证错误，会由 axios interceptor 处理跳转
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, [setMenus, setLoading, setError]);

  return (
    <HomeClass
      navigate={navigate}
      currentPath={location.pathname}
      menusLoading={loading}
    />
  );
}