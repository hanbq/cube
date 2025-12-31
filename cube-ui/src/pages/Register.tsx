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
} from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { authService } from '../services/authService';
import type { RegisterRequest } from '../types/auth';

interface RegisterState {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  description: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  loading: boolean;
  error: string | null;
  success: boolean;
}

class RegisterClass extends React.Component<{ navigate: (path: string) => void; t?: any }, RegisterState> {
  constructor(props: { navigate: (path: string) => void; t?: any }) {
    super(props);
    
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      description: '',
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      error: null,
      success: false,
    };
  }

  handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: event.target.value });
  };

  handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ confirmPassword: event.target.value });
  };

  handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  };

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: event.target.value });
  };

  handleTogglePassword = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  handleToggleConfirmPassword = () => {
    this.setState((prevState) => ({ showConfirmPassword: !prevState.showConfirmPassword }));
  };

  validateForm = () => {
    const { t } = this.props;
    const { username, password, confirmPassword, email } = this.state;

    if (!username || !password || !confirmPassword || !email) {
      this.setState({ error: t?.('register.validationError') || '请填写所有必填字段' });
      return false;
    }

    if (username.length < 3) {
      this.setState({ error: t?.('register.usernameError') || '用户名至少需要3个字符' });
      return false;
    }

    if (password.length < 6) {
      this.setState({ error: t?.('register.passwordError') || '密码至少需要6个字符' });
      return false;
    }

    if (password !== confirmPassword) {
      this.setState({ error: t?.('register.passwordMismatchError') || '两次输入的密码不一致' });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.setState({ error: t?.('register.emailError') || '请输入有效的邮箱地址' });
      return false;
    }

    return true;
  };

  handleRegister = async () => {
    if (!this.validateForm()) {
      return;
    }

    const { t } = this.props;
    const { username, password, confirmPassword, email, description } = this.state;

    this.setState({ loading: true, error: null });

    try {
      const registerData: RegisterRequest = {
        username,
        password,
        confirmPassword,
        email,
        description,
      };

      await authService.register(registerData);
      this.setState({ success: true, loading: false });
    } catch (error: any) {
      console.error('Registration failed:', error);
      let errorMessage = t?.('register.registerError') || '注册失败，请重试';
      
      // 处理特定的错误消息
      if (error.message.includes('用户名已存在')) {
        errorMessage = t?.('register.usernameExistsError') || '用户名已存在';
      } else if (error.message.includes('邮箱已被注册')) {
        errorMessage = t?.('register.emailExistsError') || '邮箱已被注册';
      }
      
      this.setState({
        error: errorMessage,
        loading: false,
      });
    }
  };

  handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      this.handleRegister();
    }
  };

  handleBackToLogin = () => {
    this.props.navigate('/login');
  };

  render() {
    const { 
      username, 
      password, 
      confirmPassword, 
      email, 
      description, 
      showPassword, 
      showConfirmPassword, 
      loading, 
      error, 
      success 
    } = this.state;
    const { t } = this.props;

    if (success) {
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
              textAlign: 'center',
            }}
          >
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <ViewInArIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            </Box>
            
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              {t?.('register.registerSuccess') || '注册成功！'}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              您的账户已创建成功，现在可以登录了。
            </Typography>
            
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={this.handleBackToLogin}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 600,
                letterSpacing: '1px',
                background: 'linear-gradient(135deg, #88b04b 0%, #6d8f3a 25%, #2d5016 50%, #6d8f3a 75%, #88b04b 100%)',
                boxShadow: '0 6px 20px rgba(45, 80, 22, 0.35)',
              }}
            >
              {t?.('register.backToLogin') || '返回登录'}
            </Button>
          </Card>
        </Box>
      );
    }

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
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton onClick={this.handleBackToLogin} sx={{ color: 'primary.main' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              sx={{
                color: 'text.primary',
                letterSpacing: '0.5px',
              }}
            >
              {t?.('register.title') || '注册账号'}
            </Typography>
            <Box sx={{ width: 40 }} /> {/* Empty box for centering */}
          </Box>
          
          <Typography
            variant="body2"
            align="center"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              letterSpacing: '0.8px',
              fontSize: '1.1rem',
              mb: 3,
            }}
          >
            {t?.('register.subtitle') || '创建您的Cube账户'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label={t?.('register.username') || '用户名'}
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
              label={t?.('register.email') || '邮箱'}
              type="email"
              value={email}
              onChange={this.handleEmailChange}
              onKeyDown={this.handleKeyPress}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: 'primary.main' }} />
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
              label={t?.('register.password') || '密码'}
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

            <TextField
              fullWidth
              label={t?.('register.confirmPassword') || '确认密码'}
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={this.handleConfirmPasswordChange}
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
                      <IconButton onClick={this.handleToggleConfirmPassword} edge="end">
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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

            <TextField
              fullWidth
              label={t?.('register.description') || '描述'}
              value={description}
              onChange={this.handleDescriptionChange}
              onKeyDown={this.handleKeyPress}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon sx={{ color: 'primary.main' }} />
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

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={this.handleRegister}
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
                t?.('register.registerButton') || '注册'
              )}
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }
}

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return <RegisterClass navigate={navigate} t={t} />;
}