import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  List,
  ListItem,
  Collapse,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Refresh as RefreshIcon,
  Folder as FolderIcon,
  Article as ArticleIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useMenu } from '../../hooks/useMenu';
import type { SYSMenu, MenuFormData } from '../../types/menu';

export default function MenuManagement() {
  const { t } = useTranslation();
  const {
    menus,
    loading,
    error,
    loadMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    getFlatMenus,
  } = useMenu();

  const [selectedMenu, setSelectedMenu] = useState<SYSMenu | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<SYSMenu | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // 表单数据
  const [formData, setFormData] = useState<MenuFormData>({
    menuName: '',
    menuNameEng: '',
    path: '',
    iconCls: '',
    parentId: null,
    sort: 0,
    component: '',
  });
  const [formError, setFormError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [isNewMenu, setIsNewMenu] = useState(true);

  // 选择菜单节点
  const handleSelectMenu = (menu: SYSMenu) => {
    setSelectedMenu(menu);
    setIsNewMenu(false);
    setFormData({
      menuId: menu.menuId,
      menuName: menu.menuName,
      menuNameEng: menu.menuNameEng,
      path: menu.path,
      iconCls: menu.iconCls,
      parentId: menu.parentId || null,
      sort: menu.sort,
      component: menu.component || '',
    });
    setFormError('');
  };

  // 新建菜单
  const handleAdd = () => {
    setSelectedMenu(null);
    setIsNewMenu(true);
    setFormData({
      menuName: '',
      menuNameEng: '',
      path: '',
      iconCls: '',
      parentId: null,
      sort: 0,
      component: '',
    });
    setFormError('');
  };

  // 添加子节点
  const handleAddChild = (parentMenu: SYSMenu, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedMenu(null);
    setIsNewMenu(true);
    setFormData({
      menuName: '',
      menuNameEng: '',
      path: '',
      iconCls: '',
      parentId: parentMenu.menuId || null,
      sort: 0,
      component: '',
    });
    setFormError('');
  };

  // 清空表单
  const handleClear = () => {
    setSelectedMenu(null);
    setIsNewMenu(true);
    setFormData({
      menuName: '',
      menuNameEng: '',
      path: '',
      iconCls: '',
      parentId: null,
      sort: 0,
      component: '',
    });
    setFormError('');
  };

  // 打开删除确认对话框
  const handleDeleteClick = (menu: SYSMenu, event: React.MouseEvent) => {
    event.stopPropagation();
    setMenuToDelete(menu);
    setDeleteDialogOpen(true);
  };

  // 确认删除
  const handleDeleteConfirm = async () => {
    if (!menuToDelete?.menuId) return;

    try {
      await deleteMenu(menuToDelete.menuId);
      setSnackbar({
        open: true,
        message: t('menuManagement.message.deleteSuccess'),
        severity: 'success',
      });
      // 如果删除的是当前选中的菜单,清空表单
      if (selectedMenu?.menuId === menuToDelete.menuId) {
        handleClear();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: t('menuManagement.message.deleteFailed') + ': ' + (err as Error).message,
        severity: 'error',
      });
    } finally {
      setDeleteDialogOpen(false);
      setMenuToDelete(null);
    }
  };

  // 表单提交
  const handleSubmit = async () => {
    // 验证
    if (!formData.menuName.trim()) {
      setFormError(t('menuManagement.form.menuNameRequired'));
      return;
    }
    if (!formData.menuNameEng.trim()) {
      setFormError(t('menuManagement.form.menuNameEngRequired'));
      return;
    }
    if (!formData.path.trim()) {
      setFormError(t('menuManagement.form.menuPathRequired'));
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      if (isNewMenu) {
        await createMenu(formData);
        setSnackbar({
          open: true,
          message: t('menuManagement.message.createSuccess'),
          severity: 'success',
        });
        handleClear();
      } else if (selectedMenu?.menuId) {
        await updateMenu(selectedMenu.menuId, formData);
        setSnackbar({
          open: true,
          message: t('menuManagement.message.updateSuccess'),
          severity: 'success',
        });
      }
    } catch (err) {
      setFormError((err as Error).message || t('menuManagement.message.createFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  // 切换节点展开/折叠
  const toggleNode = (menuId: number) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  // 表单字段变更
  const handleChange = (field: keyof MenuFormData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'sort' ? Number(value) : field === 'parentId' ? (value === '' ? null : Number(value)) : value,
    }));
  };

  // 获取可选的父菜单列表(排除自己和自己的子菜单)
  const getAvailableParentMenus = () => {
    if (!selectedMenu?.menuId || isNewMenu) return getFlatMenus();

    const excludeIds = new Set<number>([selectedMenu.menuId]);
    const collectChildIds = (m: SYSMenu) => {
      if (m.children) {
        m.children.forEach(child => {
          if (child.menuId) excludeIds.add(child.menuId);
          collectChildIds(child);
        });
      }
    };
    collectChildIds(selectedMenu);

    return getFlatMenus().filter(m => m.menuId && !excludeIds.has(m.menuId));
  };

  // 渲染树节点
  const renderTree = (nodes: SYSMenu[], level = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = node.menuId ? expandedNodes.has(node.menuId) : false;
      const isSelected = selectedMenu?.menuId === node.menuId;

      return (
        <React.Fragment key={node.menuId}>
          <ListItem
            onClick={() => handleSelectMenu(node)}
            sx={{
              pl: level * 3 + 2,
              borderLeft: level > 0 ? '1px solid' : 'none',
              borderColor: 'divider',
              cursor: 'pointer',
              bgcolor: isSelected ? 'action.selected' : 'transparent',
              '&:hover': {
                bgcolor: isSelected ? 'action.selected' : 'action.hover',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                gap: 1,
              }}
            >
              {hasChildren ? (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    node.menuId && toggleNode(node.menuId);
                  }}
                >
                  {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                </IconButton>
              ) : (
                <Box sx={{ width: 40 }} />
              )}

              {hasChildren ? (
                <FolderIcon color="primary" fontSize="small" />
              ) : (
                <ArticleIcon color="action" fontSize="small" />
              )}

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: hasChildren ? 600 : 400 }} noWrap>
                  {node.menuName}
                </Typography>
              </Box>

              <Tooltip title={t('menuManagement.addChild')}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => handleAddChild(node, e)}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title={t('common.delete')}>
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => handleDeleteClick(node, e)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </ListItem>

          {hasChildren && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List disablePadding>
                {renderTree(node.children!, level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', gap: 1, m: -3 }}>
      {/* 左侧树形菜单 */}
      <Paper sx={{ width: '40%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} elevation={0}>
        <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={loadMenus}
              disabled={loading}
            >
              {t('menuManagement.refresh')}
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              {t('menuManagement.createMenu')}
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {t('menuManagement.title')}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ m: 1 }}>
            {t('menuManagement.loadError', { message: error.message })}
          </Alert>
        )}

        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {loading && menus.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={32} />
            </Box>
          ) : menus.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3, px: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                {t('menuManagement.noData')}
              </Typography>
            </Box>
          ) : (
            <List dense>
              {renderTree(menus)}
            </List>
          )}
        </Box>
      </Paper>

      {/* 右侧编辑表单 */}
      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} elevation={1}>
        <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
            {isNewMenu ? t('menuManagement.createMenu') : t('menuManagement.editMenu')}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <Stack spacing={2}>
            <TextField
              fullWidth
              label={t('menuManagement.form.menuName')}
              value={formData.menuName}
              onChange={handleChange('menuName')}
              required
              disabled={submitting}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              fullWidth
              label={t('menuManagement.form.menuNameEng')}
              value={formData.menuNameEng}
              onChange={handleChange('menuNameEng')}
              required
              disabled={submitting}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              fullWidth
              label={t('menuManagement.form.menuPath')}
              value={formData.path}
              onChange={handleChange('path')}
              placeholder={t('menuManagement.form.menuPathPlaceholder')}
              required
              disabled={submitting}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              fullWidth
              label={t('menuManagement.form.iconCls')}
              value={formData.iconCls}
              onChange={handleChange('iconCls')}
              placeholder={t('menuManagement.form.iconClsPlaceholder')}
              disabled={submitting}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <FormControl fullWidth disabled={submitting} size="small">
              <InputLabel shrink>{t('menuManagement.form.parentMenu')}</InputLabel>
              <Select
                value={formData.parentId ?? ''}
                onChange={handleChange('parentId') as any}
                label={t('menuManagement.form.parentMenu')}
                notched
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

            <TextField
              fullWidth
              label={t('menuManagement.form.sort')}
              type="number"
              value={formData.sort}
              onChange={handleChange('sort') as any}
              disabled={submitting}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              fullWidth
              label={t('menuManagement.form.component')}
              value={formData.component}
              onChange={handleChange('component')}
              placeholder={t('menuManagement.form.componentPlaceholder')}
              disabled={submitting}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
        </Box>

        <Divider />

        <Box sx={{ p: 1.5, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button
            size="small"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            disabled={submitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? t('menuManagement.form.submitting') : t('common.save')}
          </Button>
        </Box>
      </Paper>

      {/* 删除确认对话框 */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            minWidth: '260px'
          }
        }}
      >
        <DialogTitle>{t('menuManagement.confirmDelete')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('menuManagement.deleteWarning')}
            {menuToDelete?.children && menuToDelete.children.length > 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {t('menuManagement.deleteWithChildren', { count: menuToDelete.children.length })}
              </Alert>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {t('menuManagement.confirmDelete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 提示消息 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}