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
} from '@mui/material';
import {
  Save as SaveIcon,
  Folder as FolderIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { roleService } from '../../services/roleService';
import { userService } from '../../services/userService';
import { menuService } from '../../services/menuService';
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
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`permission-tabpanel-${index}`}
      aria-labelledby={`permission-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function PermissionManagement() {
  const { t } = useTranslation();

  const [roles, setRoles] = useState<SYSRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<SYSRole | null>(null);
  const [allUsers, setAllUsers] = useState<SYSUser[]>([]);
  const [checkedUserIds, setCheckedUserIds] = useState<number[]>([]);
  const [originalUserIds, setOriginalUserIds] = useState<number[]>([]);
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
      setCheckedUserIds([]);
      setOriginalUserIds([]);
    } catch (err) {
      console.error('Failed to load role users:', err);
    }
  };

  const loadRoleMenus = async (roleId: number) => {
    try {
      const menus = await menuService.getMenusByRoleId(roleId);
      const menuIds = getAllMenuIds(menus);
      setCheckedMenuIds(menuIds);
      setOriginalMenuIds(menuIds);
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleToggleUser = (userId: number) => {
    setCheckedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleToggleMenu = (menuId: number) => {
    setCheckedMenuIds(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleCancelUsers = () => {
    setCheckedUserIds([...originalUserIds]);
  };

  const handleCancelMenus = () => {
    setCheckedMenuIds([...originalMenuIds]);
  };

  const handleSaveUsers = async () => {
    if (!selectedRole || !selectedRole.roleId) return;

    try {
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

  const handleSaveMenus = async () => {
    if (!selectedRole || !selectedRole.roleId) return;

    try {
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
        <List sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 'calc(100vh - 350px)' }}>
          {allUsers.map((user) => (
            <ListItem key={user.userId} disablePadding>
              <ListItemButton onClick={() => handleToggleUser(user.userId!)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checkedUserIds.includes(user.userId!)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                <ListItemText
                  primary={user.userName}
                  secondary={user.email || user.description}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveUsers}
              disabled={!selectedRole}
            >
              {t('common.save')}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancelUsers}
              disabled={!selectedRole}
            >
              {t('common.cancel')}
            </Button>
          </Stack>
        </Box>
      </Box>
    );
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
                checked={checkedMenuIds.includes(menu.menuId!)}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <MenuIcon sx={{ mr: 1, color: 'action.active' }} />
            <ListItemText
              primary={menu.menuName}
              secondary={menu.menuPath}
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
    <Box sx={{ m: -3, height: 'calc(100vh - 120px)' }}>
      <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t('permissionManagement.title')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <Grid item xs={3}>
            <Paper variant="outlined" sx={{ height: '100%', overflow: 'auto' }}>
              {renderRoleList()}
            </Paper>
          </Grid>

          <Grid item xs={9}>
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
