import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Box, CircularProgress } from '@mui/material'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/home/Home'
import { generateDynamicRoutes } from './components/DynamicRoutes'
import { useMenuStore } from './store/menuStore'
import { userMenuService } from './services/userMenuService'
import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import ErrorDisplay from './components/ErrorDisplay'
import { LoadingProvider } from './contexts/LoadingContext'

// 加载中占位组件
const LoadingPlaceholder = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      minHeight: '400px',
    }}
  >
    <CircularProgress />
  </Box>
);

function App() {
  const { flatMenus, initialized, setMenus, setLoading, setError } = useMenuStore();

  // 加载菜单数据
  useEffect(() => {
    const loadMenus = async () => {
      // 检查 token，确保有效
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      try {
        setLoading(true);
        const menus = await userMenuService.getUserMenus();
        setMenus(menus);
      } catch (error) {
        console.error('[App] 加载菜单失败:', error);
        setError(error as Error);
        // 如果是认证错误，会由 axios interceptor 处理跳转
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, [setMenus, setLoading, setError]);

  // 检查是否有 token 来决定默认路由
  const getDefaultRoute = () => {
    const token = localStorage.getItem('token');
    return token ? '/' : '/login';
  };

  // 检查是否已登录
  const isLoggedIn = () => {
    return !!localStorage.getItem('token');
  };

  return (
    <LoadingProvider>
      <I18nextProvider i18n={i18n}>
        <ErrorDisplay />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              isLoggedIn() ? (
                initialized ? (
                  <Home />
                ) : (
                  <LoadingPlaceholder />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }>
              {/* 菜单初始化完成后才生成动态路由，否则显示loading */}
              {initialized ? (
                generateDynamicRoutes(flatMenus)
              ) : (
                <Route path="*" element={<LoadingPlaceholder />} />
              )}
            </Route>
            <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
          </Routes>
        </BrowserRouter>
      </I18nextProvider>
    </LoadingProvider>
  )
}
export default App