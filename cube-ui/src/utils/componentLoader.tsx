import React, { lazy, Suspense } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

// 组件缓存,避免重复创建lazy组件
const componentCache = new Map<string, React.LazyExoticComponent<React.ComponentType<any>>>();

// 加载组件的loading组件
const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      minHeight: '200px',
    }}
  >
    <CircularProgress />
  </Box>
);

// 错误组件
const ErrorComponent: React.FC<{ componentPath: string; errorMessage: string }> = ({
  componentPath,
  errorMessage,
}) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">
        {t('common.componentLoadFailed', { path: componentPath })}
        <Box sx={{ mt: 1, fontSize: '12px', fontFamily: 'monospace' }}>
          {errorMessage}
        </Box>
      </Alert>
    </Box>
  );
};

/**
 * 根据component路径动态加载组件
 * @param componentPath 组件路径
 *   支持格式: "Dashboard", "system/User", "/pages/Dashboard", "../pages/Dashboard"
 * @returns React元素
 */
export const loadComponent = (componentPath: string): React.ReactElement => {
  // 如果component为空,返回空组件
  if (!componentPath || componentPath.trim() === '') {
    return <Box sx={{ p: 3 }} />;
  }

  // 从缓存中获取或创建新的lazy组件
  let LazyComponent = componentCache.get(componentPath);

  if (!LazyComponent) {
    // 动态创建import路径
    LazyComponent = lazy(() => {
      // 规范化路径
      let normalizedPath = componentPath;

      // 如果路径以 /pages/ 开头,移除开头的 /
      if (normalizedPath.startsWith('/pages/')) {
        normalizedPath = normalizedPath.substring(1); // "/pages/Dashboard" -> "pages/Dashboard"
      }

      // 如果路径以 pages/ 开头,添加 ../
      if (normalizedPath.startsWith('pages/')) {
        normalizedPath = `../${normalizedPath}`; // "pages/Dashboard" -> "../pages/Dashboard"
      }
      // 如果路径不包含 pages/,添加 ../pages/
      else if (!normalizedPath.includes('pages/')) {
        normalizedPath = `../pages/${normalizedPath}`; // "Dashboard" -> "../pages/Dashboard"
      }

      return import(/* @vite-ignore */ normalizedPath).catch((error) => {
        console.error(`Failed to load component: ${componentPath} (${normalizedPath})`, error);
        // 返回一个错误组件
        return {
          default: () => (
            <ErrorComponent componentPath={componentPath} errorMessage={error.message} />
          ),
        };
      });
    });

    componentCache.set(componentPath, LazyComponent);
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <LazyComponent />
    </Suspense>
  );
};
