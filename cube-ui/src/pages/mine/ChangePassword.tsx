import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock as LockIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { userService } from '../../services/userService';

interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<ChangePasswordFormData>>({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name as keyof ChangePasswordFormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
    // Clear API error when user makes any change
    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ChangePasswordFormData> = {};

    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = t('changePassword.oldPasswordRequired');
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = t('changePassword.newPasswordRequired');
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t('changePassword.newPasswordMinLength');
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = t('changePassword.confirmPasswordRequired');
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('changePassword.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError(null);
    setSuccess(false);
    
    try {
      const result = await userService.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmPassword,
      });
      if (result) {
        setSuccess(true);
        // Reset form after successful password change
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setApiError(t('changePassword.changeFailed', { error: '' }));
      }
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    switch (field) {
      case 'old':
        setShowOldPassword(!showOldPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t('changePassword.title')}
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {t('changePassword.changeSuccess')}
            </Alert>
          )}

          {apiError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {apiError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              name="oldPassword"
              label={t('changePassword.oldPassword')}
              type={showOldPassword ? 'text' : 'password'}
              id="oldPassword"
              autoComplete="current-password"
              value={formData.oldPassword}
              onChange={handleInputChange}
              error={!!errors.oldPassword}
              helperText={errors.oldPassword}
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => togglePasswordVisibility('old')}
                        edge="end"
                        disabled={loading}
                      >
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label={t('changePassword.newPassword')}
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              autoComplete="new-password"
              value={formData.newPassword}
              onChange={handleInputChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => togglePasswordVisibility('new')}
                        edge="end"
                        disabled={loading}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label={t('changePassword.confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => togglePasswordVisibility('confirm')}
                        edge="end"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? t('common.loading') : t('changePassword.changeButton')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePassword;