import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  Avatar,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import type { UserInfo } from '../../types/auth';
import type { UserFormData } from '../../types/user';

const UserProfile: React.FC = () => {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const currentUserInfo = authService.getUserInfo();
        if (currentUserInfo) {
          setUserInfo(currentUserInfo);
          setFormData({
            username: currentUserInfo.username,
            email: currentUserInfo.email || '',
            description: currentUserInfo.description || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        setSnackbar({
          open: true,
          message: t('userProfile.updateFailed', { error: 'Unknown error' }),
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // 处理表单字段变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 开始编辑
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 取消编辑
  const handleCancel = () => {
    if (userInfo) {
      setFormData({
        username: userInfo.username,
        email: userInfo.email || '',
        description: userInfo.description || '',
      });
    }
    setIsEditing(false);
  };

  // 保存用户信息
  const handleSave = async () => {
    try {
      setLoading(true);
      // 调用后端接口更新用户信息
      const success = await userService.updateProfile(formData);
      
      if (success) {
        // 更新本地存储的用户信息
        const updatedUserInfo = {
          ...userInfo,
          email: formData.email,
          description: formData.description,
        };
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        setUserInfo(updatedUserInfo as UserInfo);

        setSnackbar({
          open: true,
          message: t('userProfile.updateSuccess'),
          severity: 'success',
        });
        setIsEditing(false);
      } else {
        setSnackbar({
          open: true,
          message: t('userProfile.updateFailed', { error: 'Update failed' }),
          severity: 'error',
        });
      }
    } catch (error: any) {
      console.error('Failed to update user info:', error);
      setSnackbar({
        open: true,
        message: t('userProfile.updateFailed', { error: error.message || 'Unknown error' }),
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // 关闭提示消息
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>{t('userProfile.loading')}</Typography>
      </Box>
    );
  }

  if (!userInfo) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Alert severity="error">{t('userProfile.updateFailed', { error: 'Cannot fetch user info' })}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1">
              {t('userProfile.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('userProfile.description')}
            </Typography>
          </Box>
          <Box>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                {t('userProfile.edit')}
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                >
                  {t('userProfile.save')}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                >
                  {t('userProfile.cancel')}
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={t('userProfile.username')}
              name="username"
              value={formData.username}
              disabled
              helperText={t('userProfile.usernameNotEditable')}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={t('userProfile.password')}
              type="password"
              value="********"
              disabled
              helperText={t('userProfile.passwordNotEditable')}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label={t('userProfile.email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label={t('userProfile.description')}
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder={t('userProfile.description')}
            />
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;