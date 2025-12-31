import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Grid,
  Tabs,
  Tab,
  Typography,
  Alert,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Save as SaveIcon,
  Folder as FolderIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { roleService } from '../../services/roleService';
import { userService } from '../../services/userService';
import { menuService } from '../../services/menuService';
import { userRoleService } from '../../services/userRoleService';
import { menuRoleService } from '../../services/menuRoleService';
import type { SYSRole } from '../../types/role';
import type { SYSUser } from '../../types/user';
import type { SYSMenu } from '../../types/menu';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`permission-tabpanel-${index}`} aria-labelledby={`permission-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function PermissionManagement() {
  const { t } = useTranslation();

  const [roles, setRoles] = useState<SYSRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<SYSRole | null>(null);
  const [allUsers, setAllUsers] = useState<SYSUser[]>([]);
  const [roleUsers, setRoleUsers] = useState<SYSUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [allMenus, setAllMenus] = useState<SYSMenu[]>([]);
  const [checkedMenuIds, setCheckedMenuIds] = useState<number[]>([]);
  const [originalMenuIds, setOriginalMenuIds] = useState<number[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<SYSUser[]>([]);

  const loadRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roleService.getAllRoles();
      setRoles(data);
      if (data.length > 0 && !selectedRole) {
        setSelectedRole(data[0]);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Failed to load roles:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setAllUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const loadAllMenus = async () => {
    try {
      const data = await menuService.getMenuTree();
      setAllMenus(data);
    } catch (err) {
      console.error('Failed to load menus:', err);
    }
  };

  const loadRoleUsers = async (roleId: number) => {
    try {
      const users = await userService.getUsersByRoleId(roleId);
      setRoleUsers(users);
    } catch (err) {
      console.error('Failed to load role users:', err);
    }
  };

  const loadRoleMenus = async (roleId: number) => {
    try {
      const menusWithSelection = await menuService.getAllMenusWithSelection(roleId);
      const selectedMenuIds = menusWithSelection
        .filter(menu => menu.isSelected)
        .map(menu => menu.menuId!)
        .filter(id => id !== undefined);
      setCheckedMenuIds(selectedMenuIds);
      setOriginalMenuIds(selectedMenuIds);
    } catch (err) {
      console.error('Failed to load role menus:', err);
    }
  };

  const getAllMenuIds = (menus: SYSMenu[]): number[] => {
    let ids: number[] = [];
    menus.forEach(menu => {
      if (menu.menuId) ids.push(menu.menuId);
      if (menu.children && menu.children.length > 0) {
        ids = ids.concat(getAllMenuIds(menu.children));
      }
    });
    return ids;
  };

  useEffect(() => {
    loadRoles();
    loadAllUsers();
    loadAllMenus();
  }, []);

  useEffect(() => {
    if (selectedRole && selectedRole.roleId) {
      loadRoleUsers(selectedRole.roleId);
      loadRoleMenus(selectedRole.roleId);
    }
  }, [selectedRole]);

  const handleRoleSelect = (role: SYSRole) => {
    setSelectedRole(role);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedUsers(roleUsers.map(user => user.userId!));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleAddUser = () => {
    const available = allUsers.filter(
      user => !roleUsers.find(ru => ru.userId === user.userId)
    );
    setAvailableUsers(available);
    setOpenAddUserDialog(true);
  };

  const handleConfirmAddUsers = async () => {
    if (!selectedRole || !selectedRole.roleId || selectedUsers.length === 0) return;

    try {
      const userRoles = selectedUsers.map(userId => ({ userId, roleId: selectedRole.roleId! }));
      await userRoleService.batchInsertUserRoles(userRoles);
      setOpenAddUserDialog(false);
      setSelectedUsers([]);
      setSnackbar({
        open: true,
        message: t('permissionManagement.saveSuccess'),
        severity: 'success',
      });
      await loadRoleUsers(selectedRole.roleId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const handleDeleteUsers = async () => {
    if (!selectedRole || !selectedRole.roleId || selectedUsers.length === 0) return;

    try {
      const userRoles = selectedUsers.map(userId => ({ userId, roleId: selectedRole.roleId! }));
      await userRoleService.batchDeleteUserRoles(userRoles);
      setSnackbar({
        open: true,
        message: t('permissionManagement.deleteSuccess'),
        severity: 'success',
      });
      setSelectedUsers([]);
      await loadRoleUsers(selectedRole.roleId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const findMenuById = (menus: SYSMenu[], menuId: number): SYSMenu | null => {
    for (const menu of menus) {
      if (menu.menuId === menuId) return menu;
      if (menu.children && menu.children.length > 0) {
        const found = findMenuById(menu.children, menuId);
        if (found) return found;
      }
    }
    return null;
  };

  const handleToggleMenu = (menuId: number) => {
    const menu = findMenuById(allMenus, menuId);
    if (!menu) return;

    const isCurrentlyChecked = checkedMenuIds.includes(menuId);

    // 获取当前节点及其所有子节点的ID
    const idsToToggle = [menuId, ...getChildrenMenuIds(menu)];

    setCheckedMenuIds(prev => {
      if (isCurrentlyChecked) {
        // 如果当前是选中状态，则取消选中自己和所有子节点
        return prev.filter(id => !idsToToggle.includes(id));
      } else {
        // 如果当前是未选中状态，则选中自己和所有子节点
        const newIds = [...prev];
        idsToToggle.forEach(id => {
          if (!newIds.includes(id)) {
            newIds.push(id);
          }
        });
        return newIds;
      }
    });
  };

  const handleCancelMenus = () => {
    setCheckedMenuIds([...originalMenuIds]);
  };

  const handleSaveMenus = async () => {
    if (!selectedRole || !selectedRole.roleId) return;

    try {
      await menuRoleService.batchSaveMenuRolesByRoleId(selectedRole.roleId, checkedMenuIds);
      setSnackbar({
        open: true,
        message: t('permissionManagement.saveSuccess'),
        severity: 'success',
      });
      await loadRoleMenus(selectedRole.roleId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const renderRoleList = () => {
    return (
      <Box sx={{ height: '100%', overflow: 'auto' }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          {t('permissionManagement.roleList')}
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {roles.map((role) => (
              <ListItem key={role.roleId} disablePadding>
                <ListItemButton
                  selected={selectedRole?.roleId === role.roleId}
                  onClick={() => handleRoleSelect(role)}
                >
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={role.roleName}
                    secondary={role.description}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    );
  };

  const renderUserTree = () => {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddUser}
              disabled={!selectedRole}
            >
              {t('permissionManagement.addUsers')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteUsers}
              disabled={!selectedRole || selectedUsers.length === 0}
            >
              {t('permissionManagement.deleteSelected')}
            </Button>
          </Stack>
        </Box>

        <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedUsers.length > 0 && selectedUsers.length < roleUsers.length}
                    checked={roleUsers.length > 0 && selectedUsers.length === roleUsers.length}
                    onChange={handleSelectAllUsers}
                  />
                </TableCell>
                <TableCell>{t('userManagement.username')}</TableCell>
                <TableCell>{t('userManagement.email')}</TableCell>
                <TableCell>{t('userManagement.description')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roleUsers.map((user) => (
                <TableRow
                  key={user.userId}
                  hover
                  selected={selectedUsers.includes(user.userId!)}
                  onClick={() => handleSelectUser(user.userId!)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedUsers.includes(user.userId!)} />
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openAddUserDialog} onClose={() => setOpenAddUserDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t('permissionManagement.addUsers')}</DialogTitle>
          <DialogContent>
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {availableUsers.map((user) => (
                <ListItem key={user.userId} disablePadding>
                  <ListItemButton onClick={() => handleSelectUser(user.userId!)}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedUsers.includes(user.userId!)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                    <ListItemText
                      primary={user.username}
                      secondary={user.email || user.description}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddUserDialog(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleConfirmAddUsers} variant="contained">{t('common.save')}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  const getChildrenMenuIds = (menu: SYSMenu): number[] => {
    let ids: number[] = [];
    if (menu.children && menu.children.length > 0) {
      menu.children.forEach(child => {
        if (child.menuId) ids.push(child.menuId);
        ids = ids.concat(getChildrenMenuIds(child));
      });
    }
    return ids;
  };

  const isMenuIndeterminate = (menu: SYSMenu): boolean => {
    if (!menu.children || menu.children.length === 0) return false;

    const childrenIds = getChildrenMenuIds(menu);
    const checkedCount = childrenIds.filter(id => checkedMenuIds.includes(id)).length;

    return checkedCount > 0 && checkedCount < childrenIds.length;
  };

  const isMenuChecked = (menu: SYSMenu): boolean => {
    const isCurrentChecked = checkedMenuIds.includes(menu.menuId!);

    if (!menu.children || menu.children.length === 0) {
      return isCurrentChecked;
    }

    const childrenIds = getChildrenMenuIds(menu);
    const allChildrenChecked = childrenIds.length > 0 && childrenIds.every(id => checkedMenuIds.includes(id));

    return isCurrentChecked && allChildrenChecked;
  };

  const renderMenuTreeItems = (menus: SYSMenu[], level: number = 0): React.ReactNode[] => {
    const items: React.ReactNode[] = [];

    menus.forEach((menu) => {
      items.push(
        <ListItem key={menu.menuId} disablePadding>
          <ListItemButton
            onClick={() => handleToggleMenu(menu.menuId!)}
            sx={{ pl: 2 + level * 4 }}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={isMenuChecked(menu)}
                indeterminate={isMenuIndeterminate(menu)}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <MenuIcon sx={{ mr: 1, color: 'action.active' }} />
            <ListItemText
              primary={menu.menuName}
              secondary={menu.path}
            />
          </ListItemButton>
        </ListItem>
      );

      if (menu.children && menu.children.length > 0) {
        items.push(...renderMenuTreeItems(menu.children, level + 1));
      }
    });

    return items;
  };

  const renderMenuTree = () => {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <List sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 'calc(100vh - 350px)' }}>
          {renderMenuTreeItems(allMenus)}
        </List>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveMenus}
              disabled={!selectedRole}
            >
              {t('common.save')}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancelMenus}
              disabled={!selectedRole}
            >
              {t('common.cancel')}
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ m: -3, height: 'calc(100vh - 105px)' }}>
      <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t('permissionManagement.title')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ flexGrow: 1, overflow: 'hidden'}}>
          <Grid size={3} >
            <Paper variant="outlined" sx={{ height: '100%', overflow: 'auto' }}>
              {renderRoleList()}
            </Paper>
          </Grid>

          <Grid size={9} >
            <Paper variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label={t('permissionManagement.userTab')} />
                  <Tab label={t('permissionManagement.menuTab')} />
                </Tabs>
              </Box>

              <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <TabPanel value={tabValue} index={0}>
                  {renderUserTree()}
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  {renderMenuTree()}
                </TabPanel>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

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
