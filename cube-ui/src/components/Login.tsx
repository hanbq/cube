import React from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

interface LoginState {
  username: string;
  password: string;
  showPassword: boolean;
}

class LoginClass extends React.Component<{ navigate: (path: string) => void }, LoginState> {
  constructor(props: { navigate: (path: string) => void }) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showPassword: false,
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

  handleLogin = () => {
    console.log('登录', this.state.username, this.state.password);
    this.props.navigate('/home');
  };

  handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      this.handleLogin();
    }
  };

  render() {
    const { username, password, showPassword } = this.state;

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

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="用户名"
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
              label="密码"
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

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={this.handleLogin}
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
              }}
            >
              登录
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
              忘记密码？
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
              注册账号
            </Typography>
          </Box>
        </Card>
      </Box>
    );
  }
}

export default function Login() {
  const navigate = useNavigate();
  return <LoginClass navigate={navigate} />;
}
