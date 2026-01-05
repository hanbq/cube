import { createTheme } from '@mui/material/styles';

// Linear.app 风格主题
const linearTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0070f3',      // Linear 主色调 (bright blue)
      light: '#66a3ff',     // 浅蓝色
      dark: '#004db3',      // 深蓝色
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7928ca',      // 紫色 (purple)
      light: '#a855f7',     // 浅紫色
      dark: '#5b21b6',      // 深紫色
    },
    background: {
      default: '#0d1117',   // 深黑色 (Linear 背景色)
      paper: '#161b22',     // 纸张背景色
    },
    text: {
      primary: '#f0f6fc',   // 主要文字颜色
      secondary: '#8b949e', // 次要文字颜色
    },
    divider: 'rgba(56, 139, 253, 0.1)',
    error: {
      main: '#f85149',      // 错误红色
    },
    success: {
      main: '#238636',      // 成功绿色
    },
    warning: {
      main: '#ff9234',      // 警告橙色
    },
    info: {
      main: '#79c0ff',      // 信息蓝色
    },
    // 登录/注册页面自定义颜色
    // @ts-ignore - 添加自定义 login 颜色配置
    login: {
      background: 'linear-gradient(135deg, #0d1117 0%, #161b22 15%, #0d1117 30%, #0070f3 50%, #0d1117 70%, #161b22 85%, #0d1117 100%)',
      backgroundRadial: 'radial-gradient(ellipse at 30% 20%, rgba(0, 112, 243, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(121, 40, 202, 0.25) 0%, transparent 50%)',
      backgroundLinear: 'linear-gradient(45deg, transparent 0%, rgba(0, 112, 243, 0.08) 25%, transparent 50%, rgba(0, 112, 243, 0.1) 75%, transparent 100%)',
      cardBackground: 'linear-gradient(135deg, rgba(22, 27, 34, 0.95) 0%, rgba(13, 17, 23, 0.98) 50%, rgba(22, 27, 34, 0.95) 100%)',
      cardBorder: 'linear-gradient(135deg, rgba(0, 112, 243, 0.4) 0%, rgba(121, 40, 202, 0.6) 50%, rgba(0, 112, 243, 0.4) 100%)',
      buttonGradient: 'linear-gradient(135deg, #0070f3 0%, #0051cc 25%, #7928ca 50%, #0051cc 75%, #0070f3 100%)',
      buttonHoverGradient: 'linear-gradient(135deg, #66a3ff 0%, #0070f3 25%, #a855f7 50%, #0070f3 75%, #66a3ff 100%)',
      inputBackground: 'rgba(13, 17, 23, 0.7)',
      inputBorder: 'rgba(0, 112, 243, 0.2)',
      inputBorderHover: 'rgba(0, 112, 243, 0.5)',
      borderTop: 'rgba(0, 112, 243, 0.15)',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      letterSpacing: '0em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '0em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0em',
      textTransform: 'none',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#161b22',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(240, 246, 252, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#161b22',
          boxShadow: '0 1px 0 rgba(240, 246, 252, 0.1)',
          borderBottom: '1px solid rgba(240, 246, 252, 0.1)',
          position: 'relative',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          padding: '8px 16px',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 112, 243, 0.3)',
          },
        },
        containedPrimary: {
          backgroundColor: '#0070f3',
          '&:hover': {
            backgroundColor: '#0051cc',
          },
        },
        outlinedPrimary: {
          borderColor: 'rgba(0, 112, 243, 0.3)',
          '&:hover': {
            borderColor: '#0070f3',
            backgroundColor: 'rgba(0, 112, 243, 0.05)',
          },
        },
        textPrimary: {
          '&:hover': {
            backgroundColor: 'rgba(0, 112, 243, 0.05)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            backgroundColor: '#0d1117',
            borderColor: 'rgba(240, 246, 252, 0.1)',
            '&:hover fieldset': {
              borderColor: 'rgba(0, 112, 243, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0070f3',
              boxShadow: '0 0 0 3px rgba(0, 112, 243, 0.1)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          background: '#161b22',
          border: '1px solid rgba(240, 246, 252, 0.1)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: '2px 4px',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 112, 243, 0.1)',
            '& .MuiListItemIcon-root': {
              color: '#0070f3',
            },
            '& .MuiListItemText-primary': {
              color: '#f0f6fc',
              fontWeight: 500,
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(240, 246, 252, 0.05)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          '&:hover': {
            backgroundColor: 'rgba(240, 246, 252, 0.05)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(240, 246, 252, 0.1)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#161b22',
          border: '1px solid rgba(240, 246, 252, 0.1)',
          borderRadius: 6,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#f85149',
          color: '#ffffff',
          fontWeight: 600,
          borderRadius: 10,
          minWidth: 20,
          height: 20,
          padding: '0 4px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: 'rgba(0, 112, 243, 0.1)',
          color: '#0070f3',
        },
      },
    },
  },
});

// 全局样式
linearTheme.components = linearTheme.components || {};
linearTheme.components.MuiCssBaseline = {
  styleOverrides: {
    body: {
      backgroundColor: '#0d1117',
      color: '#f0f6fc',
      fontSize: '14px',
      lineHeight: 1.5,
    },
    '.menu-paper': {
      background: '#161b22',
      border: '1px solid rgba(240, 246, 252, 0.1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    '.breadcrumb-container': {
      backgroundColor: '#161b22',
      borderBottom: '1px solid rgba(240, 246, 252, 0.1)',
      '& .MuiBreadcrumbs-separator': {
        color: '#8b949e',
      },
      '& .MuiTypography-root:last-child': {
        color: '#f0f6fc',
        fontWeight: 500,
      },
      '& .MuiLink-root': {
        color: '#8b949e',
        '&:hover': {
          color: '#0070f3',
        },
      },
    },
    // Linear 风格的滚动条
    '::-webkit-scrollbar': {
      width: 8,
      height: 8,
    },
    '::-webkit-scrollbar-track': {
      background: '#0d1117',
    },
    '::-webkit-scrollbar-thumb': {
      background: '#30363d',
      borderRadius: 4,
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: '#484f58',
    },
  },
};

export default linearTheme;
