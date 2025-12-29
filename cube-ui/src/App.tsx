import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Box, CircularProgress } from '@mui/material'
import Login from './pages/Login'
import Home from './pages/home/Home'
import { generateDynamicRoutes } from './components/DynamicRoutes'
import { useMenuStore } from './store/menuStore'
import { useEffect } from 'react'

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
  const { flatMenus, initialized } = useMenuStore();

  useEffect(() => {
    console.log('[App] flatMenus 更新:', flatMenus.length, '个菜单项');
    console.log('[App] flatMenus 数据:', flatMenus);
  }, [flatMenus]);

  console.log('[App] 渲染中, flatMenus.length =', flatMenus.length, 'initialized =', initialized);

  // 检查是否有 token 来决定默认路由
  const getDefaultRoute = () => {
    const token = localStorage.getItem('token');
    return token ? '/home' : '/login';
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />}>
          {/* 菜单初始化完成后才生成动态路由，否则显示loading */}
          {initialized ? (
            generateDynamicRoutes(flatMenus)
          ) : (
            <Route path="*" element={<LoadingPlaceholder />} />
          )}
        </Route>
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
