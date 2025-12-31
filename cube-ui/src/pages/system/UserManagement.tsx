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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useUser } from '../../hooks/useUser';
import type { SYSUser, UserFormData } from '../../types/user';
import { USER_STATUS } from '../../constants/userStatus';

export default function UserManagement() {
  const { t } = useTranslation();
  const {
    users,
    total,
    loading,
    error,
    searchUsers,
    createUser,
    updateUser,
    deleteUser,
    batchDeleteUsers,
  } = useUser();

  // 邮箱格式验证函数
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SYSUser | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    password: '',
    description: '',
    email: '',
    status: USER_STATUS.ACTIVE,
    isSuperAdmin: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // 查询和分页状态
  const [queryState, setQueryState] = useState({
    searchUserId: '',
    searchUserName: '',
    searchStatus: '',
    page: 0,
    rowsPerPage: 20,
  });

  // 执行搜索
  const performSearch = async (pageNum: number, pageSize: number) => {
    const param = {
      pageNum: pageNum + 1,
      pageSize: pageSize,
      userId: queryState.searchUserId ? Number(queryState.searchUserId) : undefined,
      username: queryState.searchUserName || undefined,
      status: queryState.searchStatus || undefined,
    };
    await searchUsers(param);
  };

  // 查询按钮
  const handleSearch = async () => {
    setQueryState(prev => ({ ...prev, page: 0 }));
    await performSearch(0, queryState.rowsPerPage);
  };

  // 处理分页变化
  const handleChangePage = async (event: unknown, newPage: number) => {
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

  // 处理全选
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const currentPageIds = users
        .filter((user) => user.userId)
        .map((user) => user.userId!);
      const newSelected = [...new Set([...selectedUsers, ...currentPageIds])];
      setSelectedUsers(newSelected);
    } else {
      const currentPageIds = users
        .filter((user) => user.userId)
        .map((user) => user.userId!);
      setSelectedUsers(selectedUsers.filter(id => !currentPageIds.includes(id)));
    }
  };

  // 处理单选
  const handleSelectOne = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // 打开新建对话框
  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      description: '',
      email: '',
      status: USER_STATUS.ACTIVE,
      isSuperAdmin: false,
    });
    setDialogOpen(true);
  };

  // 打开编辑对话框
  const handleOpenEdit = (user: SYSUser) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      description: user.description || '',
      email: user.email || '',
      status: user.status || USER_STATUS.ACTIVE,
      isSuperAdmin: user.isSuperAdmin || false,
    });
    setDialogOpen(true);
  };

  // 关闭对话框
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      description: '',
      email: '',
      status: USER_STATUS.ACTIVE,
      isSuperAdmin: false,
    });
  };

  // 保存用户
  const handleSaveUser = async () => {
    try {
      if (editingUser && editingUser.userId) {
        await updateUser(editingUser.userId, formData);
        setSnackbar({
          open: true,
          message: t('userManagement.updateSuccess'),
          severity: 'success',
        });
      } else {
        await createUser(formData);
        setSnackbar({
          open: true,
          message: t('userManagement.createSuccess'),
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

  // 删除单个用户
  const handleDeleteUser = async (userId: number) => {
    if (window.confirm(t('userManagement.confirmDelete'))) {
      try {
        await deleteUser(userId);
        setSnackbar({
          open: true,
          message: t('userManagement.deleteSuccess'),
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
    if (selectedUsers.length === 0) {
      setSnackbar({
        open: true,
        message: t('userManagement.selectFirst'),
        severity: 'error',
      });
      return;
    }

    if (window.confirm(t('userManagement.confirmBatchDelete', { count: selectedUsers.length }))) {
      try {
        await batchDeleteUsers(selectedUsers);
        setSelectedUsers([]);
        setSnackbar({
          open: true,
          message: t('userManagement.batchDeleteSuccess'),
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
    <Box sx={{ m: -3 }}>
      <Paper sx={{ p: 3 }}>
        {/* 工具栏 */}
        <Box 
          sx={{ 
            mb: 3,
            p: 2,
            border: 1,
            borderColor: 'grey.300',
            borderRadius: 1,
            backgroundColor: 'grey.50'
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
              label={t('userManagement.userId')}
              size="small"
              value={queryState.searchUserId}
              onChange={(e) => setQueryState(prev => ({ ...prev, searchUserId: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ width: 150 }}
            />
            <TextField
              label={t('userManagement.username')}
              size="small"
              value={queryState.searchUserName}
              onChange={(e) => setQueryState(prev => ({ ...prev, searchUserName: e.target.value }))}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ width: 180 }}
            />
            <FormControl size="small" sx={{ width: 150 }}>
              <InputLabel>{t('userManagement.status')}</InputLabel>
              <Select
                value={queryState.searchStatus}
                label={t('userManagement.status')}
                onChange={(e) => setQueryState(prev => ({ ...prev, searchStatus: e.target.value }))}
              >
                <MenuItem value="">{t('userManagement.all')}</MenuItem>
                <MenuItem value={USER_STATUS.ACTIVE}>{t('userManagement.active')}</MenuItem>
                <MenuItem value={USER_STATUS.INACTIVE}>{t('userManagement.inactive')}</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
            >
              {t('userManagement.search')}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
            >
              {t('userManagement.create')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleBatchDelete}
              disabled={selectedUsers.length === 0}
            >
              {t('userManagement.batchDelete')}
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
            height: 'calc(100vh - 300px)', 
            minHeight: 400,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <TableContainer sx={{ 
              flex: 1, 
              overflow: 'auto',
              border: '1px solid rgba(224, 224, 224, 1)',
              borderRadius: 1
            }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          users.some(user => selectedUsers.includes(user.userId!)) &&
                          !users.every(user => selectedUsers.includes(user.userId!))
                        }
                        checked={
                          users.length > 0 &&
                          users.every(user => selectedUsers.includes(user.userId!))
                        }
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>{t('userManagement.userId')}</TableCell>
                    <TableCell>{t('userManagement.username')}</TableCell>
                    <TableCell>{t('userManagement.email')}</TableCell>
                    <TableCell>{t('userManagement.status')}</TableCell>
                    <TableCell>{t('userManagement.isSuperAdmin')}</TableCell>
                    <TableCell>{t('userManagement.createdTime')}</TableCell>
                    <TableCell align="right">{t('userManagement.operations')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        {t('userManagement.noData')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.userId} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedUsers.includes(user.userId!)}
                            onChange={() => handleSelectOne(user.userId!)}
                          />
                        </TableCell>
                        <TableCell>{user.userId}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email || '-'}</TableCell>
                        <TableCell>
                          {user.status === USER_STATUS.ACTIVE
                            ? t('userManagement.active')
                            : user.status === USER_STATUS.INACTIVE
                            ? t('userManagement.inactive')
                            : '-'}
                        </TableCell>
                        <TableCell>{user.isSuperAdmin ? t('userManagement.yes') : t('userManagement.no')}</TableCell>
                        <TableCell>
                          {user.createdTime
                            ? new Date(user.createdTime).toLocaleString()
                            : '-'}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title={t('userManagement.edit')}>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEdit(user)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('userManagement.delete')}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteUser(user.userId!)}
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
              labelRowsPerPage={t('userManagement.rowsPerPage')}
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
          {editingUser ? t('userManagement.editUser') : t('userManagement.createUser')}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label={t('userManagement.username')}
              required
              fullWidth
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            <TextField
              label={t('userManagement.password')}
              type="password"
              required={!editingUser}
              fullWidth
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              helperText={editingUser ? t('userManagement.passwordHint') : ''}
            />
            <TextField
              label={t('userManagement.email')}
              type="email"
              required
              fullWidth
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={formData.email && !isValidEmail(formData.email)}
              helperText={formData.email && !isValidEmail(formData.email) ? t('userManagement.invalidEmail') : ''}
            />
            <TextField
              label={t('userManagement.description')}
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <FormControl fullWidth>
              <InputLabel>{t('userManagement.status')}</InputLabel>
              <Select
                value={formData.status || USER_STATUS.ACTIVE}
                label={t('userManagement.status')}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <MenuItem value={USER_STATUS.ACTIVE}>{t('userManagement.active')}</MenuItem>
                <MenuItem value={USER_STATUS.INACTIVE}>{t('userManagement.inactive')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t('userManagement.isSuperAdmin')}</InputLabel>
              <Select
                value={formData.isSuperAdmin ? 'true' : 'false'}
                label={t('userManagement.isSuperAdmin')}
                onChange={(e) =>
                  setFormData({ ...formData, isSuperAdmin: e.target.value === 'true' })
                }
              >
                <MenuItem value="false">{t('userManagement.no')}</MenuItem>
                <MenuItem value="true">{t('userManagement.yes')}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<ClearIcon />}
            onClick={handleCloseDialog}
          >
            {t('userManagement.cancel')}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveUser}
            disabled={
              !formData.username.trim() || 
              (!editingUser && !formData.password?.trim()) ||
              !formData.email.trim() ||
              !isValidEmail(formData.email)
            }
          >
            {t('userManagement.save')}
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