import { createTheme } from '@mui/material/styles';

// 墨绿色与抹茶色 Elegant Style
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2d5016',      // 墨绿色 (dark forest green)
      light: '#88b04b',     // 抹茶色 (matcha green)
      dark: '#1a3d0a',      // 深墨绿色
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#88b04b',      // 抹茶色
      light: '#a3c567',     // 浅抹茶色
      dark: '#6d8f3a',      // 深抹茶色
    },
    background: {
      default: '#f0f4ed',   // 淡雅绿白色
      paper: '#fafcf8',     // 纸白色
    },
    text: {
      primary: '#1a3d0a',   // 深墨绿色文字
      secondary: '#2d5016', // 墨绿色文字
    },
    divider: 'rgba(45, 80, 22, 0.12)',
    error: {
      main: '#c9463d',
    },
    success: {
      main: '#88b04b',
    },
    warning: {
      main: '#d4a574',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Georgia", "Times New Roman", serif',
    h6: {
      fontSize: '1.375rem',
      fontWeight: 600,
      letterSpacing: '0.8px',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.5px',
    },
  },
  spacing: 4,
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '3px',
          paddingRight: '3px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#fafcf8',
          boxShadow: '0 3px 12px rgba(45, 80, 22, 0.1)',
          border: '1px solid rgba(45, 80, 22, 0.15)',
          padding: '3px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #88b04b 0%, #6d8f3a 15%, #2d5016 40%, #1a3d0a 60%, #2d5016 85%, #88b04b 100%)',
          boxShadow: '0 4px 20px rgba(45, 80, 22, 0.35), 0 1px 0 rgba(136, 176, 75, 0.4) inset',
          borderBottom: '2px solid rgba(136, 176, 75, 0.4)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(136, 176, 75, 0.15) 50%, transparent 100%)',
            pointerEvents: 'none',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '0px',
          margin: '4px 0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: 'none',
          position: 'relative',
          overflow: 'hidden',
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, rgba(45, 80, 22, 0.35) 0%, rgba(88, 176, 75, 0.45) 20%, rgba(109, 143, 58, 0.48) 40%, rgba(136, 176, 75, 0.5) 60%, rgba(163, 197, 103, 0.42) 80%, rgba(136, 176, 75, 0.38) 100%)',
            borderLeft: '5px solid',
            borderImage: 'linear-gradient(180deg, #a3c567 0%, #88b04b 25%, #2d5016 50%, #88b04b 75%, #a3c567 100%) 1',
            paddingLeft: '11px',
            boxShadow: 'none',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, rgba(45, 80, 22, 0.15) 0%, rgba(136, 176, 75, 0.25) 50%, rgba(45, 80, 22, 0.15) 100%)',
              pointerEvents: 'none',
            },
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(45, 80, 22, 0.42) 0%, rgba(88, 176, 75, 0.52) 20%, rgba(109, 143, 58, 0.55) 40%, rgba(136, 176, 75, 0.58) 60%, rgba(163, 197, 103, 0.5) 80%, rgba(136, 176, 75, 0.45) 100%)',
              boxShadow: 'none',
            },
          },
          '&:hover': {
            background: 'linear-gradient(90deg, rgba(136, 176, 75, 0.18) 0%, rgba(136, 176, 75, 0.3) 35%, rgba(109, 143, 58, 0.32) 50%, rgba(136, 176, 75, 0.3) 65%, rgba(136, 176, 75, 0.18) 100%)',
            borderLeft: '3px solid rgba(45, 80, 22, 0.4)',
            paddingLeft: '13px',
            boxShadow: 'none',
          },
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