import React from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

interface LoginState {
  username: string;
  password: string;
  showPassword: boolean;
  loading: boolean;
  error: string | null;
  rememberMe: boolean;
}

class LoginClass extends React.Component<{ navigate: (path: string) => void; t?: any; setAuth: (token: string, userInfo: any) => void }, LoginState> {
  constructor(props: { navigate: (path: string) => void; t?: any; setAuth: (token: string, userInfo: any) => void }) {
    super(props);
    
    const savedUsername = localStorage.getItem('savedUsername') || '';
    const savedPassword = localStorage.getItem('savedPassword') || '';
    const savedRememberMe = localStorage.getItem('savedRememberMe') === 'true';
    
    this.state = {
      username: savedUsername,
      password: savedPassword,
      showPassword: false,
      loading: false,
      error: null,
      rememberMe: savedRememberMe,
    };
  }

  handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  handleTogglePassword = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  handleRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ rememberMe: event.target.checked });
  };

  handleLogin = async () => {
    const { username, password, rememberMe } = this.state;
    const { t } = this.props;

    if (!username || !password) {
      this.setState({ error: t?.('login.validationError') || '请输入用户名和密码' });
      return;
    }

    this.setState({ loading: true, error: null });

    try {
      const response = await authService.login({ username, password });

      if (rememberMe) {
        localStorage.setItem('savedUsername', username);
        localStorage.setItem('savedPassword', password);
        localStorage.setItem('savedRememberMe', 'true');
      } else {
        localStorage.removeItem('savedUsername');
        localStorage.removeItem('savedPassword');
        localStorage.removeItem('savedRememberMe');
      }

      this.props.setAuth(response.token, response.userInfo);

      this.props.navigate('/');
    } catch (error: any) {
      console.error('Login failed:', error);
      this.setState({
        error: error.message || t?.('login.loginError') || '登录失败，请检查用户名和密码',
        loading: false,
      });
    }
  };

  handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      this.handleLogin();
    }
  };

  render() {
    const { username, password, showPassword, loading, error, rememberMe } = this.state;
    const { t } = this.props;

    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #e8ede3 0%, #f0f4ed 15%, #d5e0cc 30%, #88b04b 50%, #d5e0cc 70%, #f0f4ed 85%, #e8ede3 100%)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(ellipse at 30% 20%, rgba(136, 176, 75, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(163, 197, 103, 0.25) 0%, transparent 50%)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 0%, rgba(45, 80, 22, 0.08) 25%, transparent 50%, rgba(136, 176, 75, 0.1) 75%, transparent 100%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
          <LanguageSwitcher color="primary" />
        </Box>
        <Card
          elevation={8}
          sx={{
            width: '420px',
            padding: '48px 40px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(250, 252, 248, 0.95) 0%, rgba(245, 248, 240, 0.98) 50%, rgba(250, 252, 248, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid',
            borderImage: 'linear-gradient(135deg, rgba(136, 176, 75, 0.4) 0%, rgba(45, 80, 22, 0.6) 50%, rgba(136, 176, 75, 0.4) 100%) 1',
            boxShadow: '0 12px 40px rgba(45, 80, 22, 0.25), inset 0 2px 0 rgba(255, 255, 255, 0.8)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 0%, rgba(136, 176, 75, 0.15) 0%, transparent 70%)',
              borderRadius: '16px',
              pointerEvents: 'none',
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
            <ViewInArIcon
              sx={{
                fontSize: 72,
                color: 'primary.main',
                mb: 2.5,
                filter: 'drop-shadow(0 4px 12px rgba(45, 80, 22, 0.35))',
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #88b04b 0%, #2d5016 50%, #88b04b 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '1.5px',
                mb: 1.5,
              }}
            >
              Cube
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                letterSpacing: '0.8px',
                fontSize: '1.1rem',
              }}
            >

            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label={t?.('login.username') || '用户名'}
              value={username}
              onChange={this.handleUsernameChange}
              onKeyDown={this.handleKeyPress}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'rgba(45, 80, 22, 0.2)',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(136, 176, 75, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                },
              }}
            />

            <TextField
              fullWidth
              label={t?.('login.password') || '密码'}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={this.handlePasswordChange}
              onKeyDown={this.handleKeyPress}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={this.handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: 'rgba(45, 80, 22, 0.2)',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(136, 176, 75, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'primary.main',
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={this.handleRememberMeChange}
                  sx={{
                    color: 'primary.main',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                  }}
                />
              }
              label={t?.('login.rememberMe') || '记住我'}
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.9rem',
                  color: 'text.secondary',
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={this.handleLogin}
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 600,
                letterSpacing: '1px',
                background: 'linear-gradient(135deg, #88b04b 0%, #6d8f3a 25%, #2d5016 50%, #6d8f3a 75%, #88b04b 100%)',
                boxShadow: '0 6px 20px rgba(45, 80, 22, 0.35)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #a3c567 0%, #88b04b 25%, #2d5016 50%, #88b04b 75%, #a3c567 100%)',
                  boxShadow: '0 8px 24px rgba(45, 80, 22, 0.45)',
                  '&::before': {
                    left: '100%',
                  },
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(136, 176, 75, 0.5)',
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                t?.('login.loginButton') || '登录'
              )}
            </Button>
          </Box>

          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: '1px solid rgba(45, 80, 22, 0.15)',
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                cursor: 'pointer',
                transition: 'color 0.3s',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {t?.('login.forgotPassword') || '忘记密码？'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(45, 80, 22, 0.3)' }}>
              |
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                cursor: 'pointer',
                transition: 'color 0.3s',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {t?.('login.register') || '注册账号'}
            </Typography>
          </Box>
        </Card>
      </Box>
    );
  }
}

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const setAuth = useAuthStore((state) => state.setAuth);
  return <LoginClass navigate={navigate} t={t} setAuth={setAuth} />;
}
