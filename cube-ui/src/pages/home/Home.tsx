import React from 'react';
import Header from './Header';
import Main from './Main';
import Menu from './Menu';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenuStore } from '../../store/menuStore';
import { userMenuService } from '../../services/userMenuService';
import { authService } from '../../services/authService';
import { workspaceService } from '../../services/workspaceService';

interface HomeProps {
  navigate?: (path: string) => void;
  currentPath?: string;
  menusLoading?: boolean;
  userName?: string;
}

class HomeClass extends React.Component<HomeProps> {
  handleLogout = async () => {
    try {
      // 调用后端 logout 接口并清除本地存储
      await authService.logout();
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
    const { userName = 'User' } = this.props;

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
          <Header userName={userName} notificationCount={3} onLogout={this.handleLogout} />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            overflow: 'hidden',
            backgroundColor: 'background.default',
          }}
        >
          <Box sx={{ flexShrink: 0, overflow: 'auto' }}>
            <Menu onNavigate={this.handleNavigate} currentPath={this.props.currentPath} />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              backgroundColor: 'background.paper',
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
  const [userName, setUserName] = React.useState<string>('');

  // 检查认证状态并获取用户信息
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    // 获取用户信息
    try {
      const userInfo = authService.getUserInfo();
      if (userInfo?.username) {
        setUserName(userInfo.username);
      } else {
        console.warn('[Home] 用户信息不完整，使用默认用户名', userInfo);
        setUserName('User');
      }
    } catch (error) {
      console.error('[Home] 获取用户信息失败:', error);
      setUserName('User');
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
        setLoading(true);
        const menus = await userMenuService.getUserMenus();
        setMenus(menus);
        
        // 初始化默认工作区
        await workspaceService.initializeDefaultWorkspace();
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
      userName={userName}
    />
  );
}