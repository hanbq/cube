import { createTheme } from '@mui/material/styles';

// 渐变主题备份 - 紫粉色梦幻风格
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#a78bfa',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f093fb',
      light: '#fbbff9',
      dark: '#e879f9',
    },
    background: {
      default: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: 'rgba(139, 92, 246, 0.15)',
    error: {
      main: '#f43f5e',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
  },
  typography: {
    fontFamily: '"Roboto", "SF Pro Display", "Segoe UI", sans-serif',
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.3px',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          boxShadow: '0 4px 20px 0 rgba(102, 126, 234, 0.3)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          margin: '6px 10px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.Mui-selected': {
            background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.15) 0%, rgba(240, 147, 251, 0.15) 100%)',
            borderLeft: '4px solid #667eea',
            paddingLeft: '12px',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
            transform: 'translateX(4px)',
            '&:hover': {
              background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.25) 0%, rgba(240, 147, 251, 0.25) 100%)',
              transform: 'translateX(6px)',
            },
          },
          '&:hover': {
            background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.08) 0%, rgba(240, 147, 251, 0.08) 100%)',
            transform: 'translateX(3px)',
            boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(139, 92, 246, 0.1)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#ef4444',
          color: '#ffffff',
          fontWeight: 'bold',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(148, 163, 184, 0.2)',
        },
      },
    },
  },
});

export default theme;
