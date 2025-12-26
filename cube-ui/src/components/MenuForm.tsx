import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  Stack,
} from '@mui/material';
import type { SYSMenu, MenuFormData } from '../types/menu';

interface MenuFormProps {
  open: boolean;
  menu: SYSMenu | null;
  parentMenus: SYSMenu[];
  onClose: () => void;
  onSubmit: (data: MenuFormData) => Promise<void>;
}

export const MenuForm: React.FC<MenuFormProps> = ({
  open,
  menu,
  parentMenus,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<MenuFormData>({
    menuName: '',
    path: '',
    iconCls: '',
    parentId: null,
    sort: 0,
    component: '',
  });
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (menu) {
      // 编辑模式
      setFormData({
        menuId: menu.menuId,
        menuName: menu.menuName,
        path: menu.path,
        iconCls: menu.iconCls,
        parentId: menu.parentId || null,
        sort: menu.sort,
        component: menu.component,
      });
    } else {
      // 新建模式
      setFormData({
        menuName: '',
        path: '',
        iconCls: '',
        parentId: null,
        sort: 0,
        component: '',
      });
    }
    setError('');
  }, [menu, open]);

  const handleChange = (field: keyof MenuFormData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'sort' ? Number(value) : field === 'parentId' ? (value === '' ? null : Number(value)) : value,
    }));
  };

  const handleSubmit = async () => {
    // 验证
    if (!formData.menuName.trim()) {
      setError(t('menuManagement.form.menuNameRequired'));
      return;
    }
    if (!formData.path.trim()) {
      setError(t('menuManagement.form.menuPathRequired'));
      return;
    }
    if (!formData.component.trim()) {
      setError(t('menuManagement.form.componentRequired'));
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError((err as Error).message || '操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 获取可选的父菜单列表(排除自己和自己的子菜单)
  const getAvailableParentMenus = () => {
    if (!menu?.menuId) return parentMenus;

    const excludeIds = new Set<number>([menu.menuId]);
    const collectChildIds = (m: SYSMenu) => {
      if (m.children) {
        m.children.forEach(child => {
          if (child.menuId) excludeIds.add(child.menuId);
          collectChildIds(child);
        });
      }
    };
    collectChildIds(menu);

    return parentMenus.filter(m => m.menuId && !excludeIds.has(m.menuId));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{menu ? t('menuManagement.editMenu') : t('menuManagement.createMenu')}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label={t('menuManagement.form.menuName')}
              value={formData.menuName}
              onChange={handleChange('menuName')}
              required
              disabled={submitting}
            />
            <TextField
              fullWidth
              label={t('menuManagement.form.menuPath')}
              value={formData.path}
              onChange={handleChange('path')}
              placeholder={t('menuManagement.form.menuPathPlaceholder')}
              required
              disabled={submitting}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label={t('menuManagement.form.iconCls')}
              value={formData.iconCls}
              onChange={handleChange('iconCls')}
              placeholder={t('menuManagement.form.iconClsPlaceholder')}
              disabled={submitting}
            />
            <FormControl fullWidth disabled={submitting}>
              <InputLabel>{t('menuManagement.form.parentMenu')}</InputLabel>
              <Select
                value={formData.parentId ?? ''}
                onChange={handleChange('parentId') as any}
                label={t('menuManagement.form.parentMenu')}
              >
                <MenuItem value="">
                  <em>{t('menuManagement.form.noParent')}</em>
                </MenuItem>
                {getAvailableParentMenus().map((m) => (
                  <MenuItem key={m.menuId} value={m.menuId}>
                    {m.menuName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              label={t('menuManagement.form.sort')}
              type="number"
              value={formData.sort}
              onChange={handleChange('sort') as any}
              disabled={submitting}
            />
            <TextField
              fullWidth
              label={t('menuManagement.form.component')}
              value={formData.component}
              onChange={handleChange('component')}
              placeholder={t('menuManagement.form.componentPlaceholder')}
              required
              disabled={submitting}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          {t('common.cancel')}
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {submitting ? t('menuManagement.form.submitting') : t('menuManagement.form.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
