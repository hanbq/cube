import React, { useState, useCallback } from 'react';
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
import { useTheme } from '@mui/material/styles';
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

export default function Register() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUsernameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }, []);

  const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }, []);

  const handleConfirmPasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  }, []);

  const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }, []);

  const handleDescriptionChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  }, []);

  const handleTogglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleToggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword(prev => !prev);
  }, []);

  const validateForm = useCallback(() => {
    if (!username || !password || !confirmPassword || !email) {
      setError(t?.('register.validationError') );
      return false;
    }

    if (username.length < 3) {
      setError(t?.('register.usernameError') );
      return false;
    }

    if (password.length < 6) {
      setError(t?.('register.passwordError') );
      return false;
    }

    if (password !== confirmPassword) {
      setError(t?.('register.passwordMismatchError') );
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t?.('register.emailError'));
      return false;
    }

    return true;
  }, [username, password, confirmPassword, email, t]);

  const handleRegister = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const registerData: RegisterRequest = {
        username,
        password,
        confirmPassword,
        email,
        description,
      };

      await authService.register(registerData);
      setSuccess(true);
      setLoading(false);
    } catch (error: any) {
      console.error('Registration failed:', error);
      let errorMessage = t?.('register.registerError');
      
      // 处理特定的错误消息
      if (error.message.includes('用户名已存在')) {
        errorMessage = t?.('register.usernameExistsError');
      } else if (error.message.includes('邮箱已被注册')) {
        errorMessage = t?.('register.emailExistsError');
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  }, [username, password, confirmPassword, email, description, validateForm, t]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleRegister();
    }
  }, [handleRegister]);

  const handleBackToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

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
          background: theme.palette.login?.background,
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
            background: theme.palette.login?.cardBackground,
            backdropFilter: 'blur(20px)',
            border: '2px solid',
            borderImage: theme.palette.login?.cardBorder,
            textAlign: 'center',
          }}
        >
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <ViewInArIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          </Box>
          
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            {t?.('register.registerSuccess')}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            您的账户已创建成功，现在可以登录了。
          </Typography>
          
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleBackToLogin}
            sx={{
              py: 1.5,
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 600,
              letterSpacing: '1px',
              background: theme.palette.login?.buttonGradient,
              boxShadow: '0 6px 20px rgba(45, 80, 22, 0.35)',
            }}
          >
            {t?.('register.backToLogin')}
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
        background: theme.palette.login?.background ,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.palette.login?.backgroundRadial,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: theme.palette.login?.backgroundLinear,
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
          background: theme.palette.login?.cardBackground ,
          backdropFilter: 'blur(20px)',
          border: '2px solid',
          borderImage: theme.palette.login?.cardBorder ,
        }}
      >
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton onClick={handleBackToLogin} sx={{ color: 'primary.main' }}>
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
            {t?.('register.title') }
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
          {t?.('register.subtitle') }
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label={t?.('register.username')}
            value={username}
            onChange={handleUsernameChange}
            onKeyDown={handleKeyPress}
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
                background: theme.palette.login?.inputBackground,
                borderRadius: '12px',
                '& fieldset': {
                  borderColor: theme.palette.login?.inputBorder,
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.login?.inputBorderHover,
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
            label={t?.('register.email') }
            type="email"
            value={email}
            onChange={handleEmailChange}
            onKeyDown={handleKeyPress}
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
                background: theme.palette.login?.inputBackground ,
                borderRadius: '12px',
                '& fieldset': {
                  borderColor: theme.palette.login?.inputBorder ,
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.login?.inputBorderHover,
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
            label={t?.('register.password') }
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            onKeyDown={handleKeyPress}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: theme.palette.login?.inputBackground  ,
                borderRadius: '12px',
                '& fieldset': {
                  borderColor: theme.palette.login?.inputBorder ,
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.login?.inputBorderHover ,
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
            label={t?.('register.confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onKeyDown={handleKeyPress}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleConfirmPassword} edge="end">
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: theme.palette.login?.inputBackground ,
                borderRadius: '12px',
                '& fieldset': {
                  borderColor: theme.palette.login?.inputBorder,
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.login?.inputBorderHover ,
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
            label={t?.('register.description')}
            value={description}
            onChange={handleDescriptionChange}
            onKeyDown={handleKeyPress}
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
                background: theme.palette.login?.inputBackground ,
                borderRadius: '12px',
                '& fieldset': {
                  borderColor: theme.palette.login?.inputBorder ,
                  borderWidth: '2px',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.login?.inputBorderHover ,
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
            onClick={handleRegister}
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 600,
              letterSpacing: '1px',
              background: theme.palette.login?.buttonGradient ,
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
                background: theme.palette.login?.buttonHoverGradient,
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
              t?.('register.registerButton')
            )}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}