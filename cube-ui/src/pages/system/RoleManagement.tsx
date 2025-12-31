import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  TextField,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useRole } from '../../hooks/useRole';
import type { SYSRole, RoleFormData } from '../../types/role';

export default function RoleManagement() {
  const { t } = useTranslation();
  const {
    roles,
    total,
    loading,
    error,
    searchRoles,
    createRole,
    updateRole,
    deleteRole,
    batchDeleteRoles,
  } = useRole();

  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<SYSRole | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    roleName: '',
    description: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // 查询和分页状态
  const [queryState, setQueryState] = useState({
    searchRoleId: '',
    searchRoleName: '',
    page: 0,
    rowsPerPage: 20,
  });

  // 执行搜索
  const performSearch = async (pageNum: number, pageSize: number) => {
    const param = {
      pageNum: pageNum + 1, // 后端从1开始，前端从0开始
      pageSize: pageSize,
      roleId: queryState.searchRoleId ? Number(queryState.searchRoleId) : undefined,
      roleName: queryState.searchRoleName || undefined,
    };
    await searchRoles(param);
  };

  // 查询按钮
  const handleSearch = async () => {
    setQueryState(prev => ({ ...prev, page: 0 }));
    await performSearch(0, queryState.rowsPerPage);
  };

  // 处理分页变化
  const handleChangePage = async (_event: unknown, newPage: number) => {
    setQueryState(prev => ({ ...prev, page: newPage }));
    await performSearch(newPage, queryState.rowsPerPage);
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setQueryState(prev => ({ ...prev, rowsPerPage: newRowsPerPage, page: 0 }));
    await performSearch(0, newRowsPerPage);
  };

  // 初始加载
  React.useEffect(() => {
    performSearch(0, queryState.rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 处理全选(只选中当前页)
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const currentPageIds = roles
        .filter((role) => role.roleId)
        .map((role) => role.roleId!);
      const newSelected = [...new Set([...selectedRoles, ...currentPageIds])];
      setSelectedRoles(newSelected);
    } else {
      const currentPageIds = roles
        .filter((role) => role.roleId)
        .map((role) => role.roleId!);
      setSelectedRoles(selectedRoles.filter(id => !currentPageIds.includes(id)));
    }
  };

  // 处理单选
  const handleSelectOne = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  // 打开新建对话框
  const handleOpenCreate = () => {
    setEditingRole(null);
    setFormData({ roleName: '', description: '' });
    setDialogOpen(true);
  };

  // 打开编辑对话框
  const handleOpenEdit = (role: SYSRole) => {
    setEditingRole(role);
    setFormData({
      roleName: role.roleName,
      description: role.description || '',
    });
    setDialogOpen(true);
  };

  // 关闭对话框
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRole(null);
    setFormData({ roleName: '', description: '' });
  };

  // 保存角色
  const handleSaveRole = async () => {
    try {
      if (editingRole && editingRole.roleId) {
        await updateRole(editingRole.roleId, formData);
        setSnackbar({
          open: true,
          message: t('roleManagement.updateSuccess'),
          severity: 'success',
        });
      } else {
        await createRole(formData);
        setSnackbar({
          open: true,
          message: t('roleManagement.createSuccess'),
          severity: 'success',
        });
      }
      handleCloseDialog();
      await performSearch(queryState.page, queryState.rowsPerPage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  // 删除单个角色
  const handleDeleteRole = async (roleId: number) => {
    if (window.confirm(t('roleManagement.confirmDelete'))) {
      try {
        await deleteRole(roleId);
        setSnackbar({
          open: true,
          message: t('roleManagement.deleteSuccess'),
          severity: 'success',
        });
        await performSearch(queryState.page, queryState.rowsPerPage);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
      }
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRoles.length === 0) {
      setSnackbar({
        open: true,
        message: t('roleManagement.selectFirst'),
        severity: 'error',
      });
      return;
    }

    if (window.confirm(t('roleManagement.confirmBatchDelete', { count: selectedRoles.length }))) {
      try {
        await batchDeleteRoles(selectedRoles);
        setSelectedRoles([]);
        setSnackbar({
          open: true,
          message: t('roleManagement.batchDeleteSuccess'),
          severity: 'success',
        });
        await performSearch(queryState.page, queryState.rowsPerPage);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
      }
    }
  };

  return (
    <Box sx={{ 
      m: -3, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Paper sx={{ 
        p: 3, 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* 工具栏 */}
        <Box 
          sx={{ 
            mb: 3,
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            backgroundColor: 'background.paper'
          }}
        >
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center" 
            justifyContent="flex-start"
            flexWrap="wrap"
            sx={{ gap: 2 }}
          >
            <TextField
              label={t('roleManagement.roleId')}
              size="small"
              value={queryState.searchRoleId}
              onChange={(e) => setQueryState(prev => ({ ...prev, searchRoleId: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ width: 180 }}
            />
            <TextField
              label={t('roleManagement.roleName')}
              size="small"
              value={queryState.searchRoleName}
              onChange={(e) => setQueryState(prev => ({ ...prev, searchRoleName: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ width: 180 }}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              {t('roleManagement.search')}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
            >
              {t('roleManagement.create')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBatchDelete}
              disabled={selectedRoles.length === 0}
            >
              {t('roleManagement.batchDelete')}
            </Button>
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ 
            flex: 1,
            minHeight: 400,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <TableContainer sx={{ 
              flex: 1, 
              overflow: 'auto',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1
            }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          roles.some(role => selectedRoles.includes(role.roleId!)) &&
                          !roles.every(role => selectedRoles.includes(role.roleId!))
                        }
                        checked={
                          roles.length > 0 &&
                          roles.every(role => selectedRoles.includes(role.roleId!))
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>{t('roleManagement.roleId')}</TableCell>
                    <TableCell>{t('roleManagement.roleName')}</TableCell>
                    <TableCell>{t('roleManagement.description')}</TableCell>
                    <TableCell>{t('roleManagement.isSystem')}</TableCell>
                    <TableCell>{t('roleManagement.createdTime')}</TableCell>
                    <TableCell align="right">{t('roleManagement.operations')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        {t('roleManagement.noData')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    roles.map((role) => (
                      <TableRow key={role.roleId} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedRoles.includes(role.roleId!)}
                            onChange={() => handleSelectOne(role.roleId!)}
                          />
                        </TableCell>
                        <TableCell>{role.roleId}</TableCell>
                        <TableCell>{role.roleName}</TableCell>
                        <TableCell>{role.description || '-'}</TableCell>
                        <TableCell>
                          {role.isSystem ? t('roleManagement.yes') : t('roleManagement.no')}
                        </TableCell>
                        <TableCell>
                          {role.createdTime
                            ? new Date(role.createdTime).toLocaleString()
                            : '-'}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title={t('roleManagement.edit')}>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEdit(role)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('roleManagement.delete')}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteRole(role.roleId!)}
                              disabled={role.isSystem}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[20, 50, 100]}
              component="div"
              count={total}
              rowsPerPage={queryState.rowsPerPage}
              page={queryState.page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={t('roleManagement.rowsPerPage')}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} ${t('common.of')} ${count !== -1 ? count : `${to}+`} ${t('common.items')}`
              }
            />
          </Box>
        )}
      </Paper>

      {/* 新建/编辑对话框 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRole ? t('roleManagement.editRole') : t('roleManagement.createRole')}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={t('roleManagement.roleName')}
              required
              fullWidth
              value={formData.roleName}
              onChange={(e) =>
                setFormData({ ...formData, roleName: e.target.value })
              }
            />
            <TextField
              label={t('roleManagement.description')}
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<ClearIcon />}
            onClick={handleCloseDialog}
          >
            {t('roleManagement.cancel')}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveRole}
            disabled={!formData.roleName.trim()}
          >
            {t('roleManagement.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 消息提示 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}