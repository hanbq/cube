import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  AppBar,
  Toolbar,
  useTheme,
  alpha,
  FormControl,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, Dashboard as DashboardIcon, Edit as EditWorkspaceIcon, Delete as DeleteWorkspaceIcon } from '@mui/icons-material';
import WorkspaceDialog from './WorkspaceDialog';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import Widget from './Widget';
import AddWidgetDialog from './AddWidgetDialog';
import EditWidgetDialog from './EditWidgetDialog';
import type { Widget as WidgetType } from './WorkspaceTypes';
import { useWorkspace } from '../../hooks/useWorkspace';
import type { Workspace } from '../../types/workspace';

export default function Workspace() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { 
    workspaces, 
    currentWorkspace, 
    setCurrentWorkspace, 
    loading, 
    updateWorkspace, 
    createWorkspace, 
    deleteWorkspace,
    fetchWorkspaces 
  } = useWorkspace();
  
  // 工作区管理状态
  const [workspaceDialogOpen, setWorkspaceDialogOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [workspaceFormData, setWorkspaceFormData] = useState({
    name: '',
    description: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // 使用当前工作区的小部件，如果没有则使用默认小部件
  const [widgets, setWidgets] = useState<WidgetType[]>([
    { id: 'widget-1', type: 'statistic', title: t('dashboard.totalUsers'), size: 'small', data: { value: '1,234', description: t('dashboard.totalUsersDesc') } },
    { id: 'widget-2', type: 'statistic', title: t('dashboard.totalWorkflows'), size: 'small', data: { value: '56', description: t('dashboard.totalWorkflowsDesc') } },
    { id: 'widget-3', type: 'statistic', title: t('dashboard.activeTasks'), size: 'small', data: { value: '89', description: t('dashboard.activeTasksDesc') } },
    { id: 'widget-4', type: 'statistic', title: t('dashboard.completionRate'), size: 'small', data: { value: '92%', description: t('dashboard.completionRateDesc') } },
  ]);

  // 当当前工作区变化时，更新小部件
  useEffect(() => {
    if (currentWorkspace && currentWorkspace.widgets && currentWorkspace.widgets.length > 0) {
      setWidgets(currentWorkspace.widgets);
    }
  }, [currentWorkspace]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<WidgetType | null>(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragStart = (event: any) => setActiveId(event.active.id);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) { setActiveId(null); return; }
    if (active.id !== over.id) {
      const newWidgets = arrayMove(widgets, widgets.findIndex((item) => item.id === active.id), widgets.findIndex((item) => item.id === over.id));
      setWidgets(newWidgets);
      
      // 更新当前工作区的小部件
      if (currentWorkspace) {
        updateWorkspace(currentWorkspace.id, { widgets: newWidgets }).catch(err => {
          console.error('Failed to update workspace widgets:', err);
        });
      }
    }
    setActiveId(null);
  };

  const handleAddWidget = (widget: WidgetType) => {
    const newWidgets = [...widgets, widget];
    setWidgets(newWidgets);
    
    // 更新当前工作区的小部件
    if (currentWorkspace) {
      updateWorkspace(currentWorkspace.id, { widgets: newWidgets }).catch(err => {
        console.error('Failed to update workspace widgets:', err);
      });
    }
  };
  
  const handleEditWidget = (widget: WidgetType) => { 
    setEditingWidget(widget); 
    setEditDialogOpen(true); 
  };
  
  const handleUpdateWidget = (updatedWidget: WidgetType) => {
    const newWidgets = widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w);
    setWidgets(newWidgets);
    
    // 更新当前工作区的小部件
    if (currentWorkspace) {
      updateWorkspace(currentWorkspace.id, { widgets: newWidgets }).catch(err => {
        console.error('Failed to update workspace widgets:', err);
      });
    }
  };
  
  const handleDeleteWidget = (id: string) => {
    const newWidgets = widgets.filter(w => w.id !== id);
    setWidgets(newWidgets);
    
    // 更新当前工作区的小部件
    if (currentWorkspace) {
      updateWorkspace(currentWorkspace.id, { widgets: newWidgets }).catch(err => {
        console.error('Failed to update workspace widgets:', err);
      });
    }
  };

  const handleWorkspaceChange = (event: any) => {
    const workspaceId = event.target.value;
    const selectedWorkspace = workspaces.find(w => w.id === workspaceId);
    if (selectedWorkspace) {
      setCurrentWorkspace(selectedWorkspace);
    }
  };

  // 工作区管理处理函数
  const handleOpenWorkspaceDialog = (workspace?: Workspace) => {
    if (workspace) {
      setEditingWorkspace(workspace);
      setWorkspaceFormData({
        name: workspace.name,
        description: workspace.description || '',
      });
    } else {
      setEditingWorkspace(null);
      setWorkspaceFormData({
        name: '',
        description: '',
      });
    }
    setWorkspaceDialogOpen(true);
  };

  const handleCloseWorkspaceDialog = () => {
    setWorkspaceDialogOpen(false);
    setEditingWorkspace(null);
    setWorkspaceFormData({
      name: '',
      description: '',
    });
  };

  const handleSaveWorkspace = async () => {
    try {
      if (editingWorkspace) {
        await updateWorkspace(editingWorkspace.id, workspaceFormData);
      } else {
        await createWorkspace({
          ...workspaceFormData,
          isDefault: false,
          widgets: [],
        });
      }
      await fetchWorkspaces();
      handleCloseWorkspaceDialog();
    } catch (err) {
      console.error('Failed to save workspace:', err);
    }
  };

  const handleDeleteWorkspace = () => {
    if (!currentWorkspace || currentWorkspace.isDefault) return;
    setDeleteDialogOpen(true);
  };

  const confirmDeleteWorkspace = async () => {
    if (!currentWorkspace) return;
    
    try {
      await deleteWorkspace(currentWorkspace.id);
      await fetchWorkspaces();
      // 切换到默认工作区
      const defaultWorkspace = workspaces.find(w => w.isDefault);
      if (defaultWorkspace) {
        setCurrentWorkspace(defaultWorkspace);
      }
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Failed to delete workspace:', err);
    }
  };

  const cancelDeleteWorkspace = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: 0, 
      bgcolor: alpha(theme.palette.background.default, 0.5),
      minHeight: '100vh'
    }}>
      {/* 顶部工具栏 */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          mb: 1.5, 
          borderRadius: 1,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <Toolbar variant="dense" sx={{ gap: 2 }}>
          <DashboardIcon color="primary" />
          
          {/* 工作区标题和下拉框 */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            
            
            {/* 工作区切换下拉框 */}
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select
                value={currentWorkspace?.id || ''}
                onChange={handleWorkspaceChange}
                displayEmpty
                renderValue={(value) => {
                  if (!value) return t('workspace.selectWorkspace');
                  const workspace = workspaces.find(w => w.id === value);
                  return workspace ? workspace.name : t('workspace.noWorkspace');
                }}
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                  }
                }}
                disabled={loading}
              >
                {workspaces.length === 0 ? (
                  <MenuItem disabled>
                    <Typography variant="body2">
                      {loading ? t('workspace.loading') : t('workspace.noWorkspace')}
                    </Typography>
                  </MenuItem>
                ) : (
                  workspaces.map((workspace) => (
                    <MenuItem key={workspace.id} value={workspace.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          {workspace.name}
                        </Typography>
                        {workspace.isDefault && (
                          <Chip 
                            label={t('workspace.defaultWorkspace')} 
                            color="primary" 
                            sx={{ ml: 1, height: 20, fontSize: '0.6rem' }} 
                          />
                        )}
                      </Box>
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            
            {/* 工作区编辑和删除按钮 */}
            <Tooltip title={t('common.edit')}>
              <IconButton 
                size="small" 
                onClick={() => handleOpenWorkspaceDialog(currentWorkspace || undefined)}
                disabled={!currentWorkspace}
                sx={{ ml: 1 }}
              >
                <EditWorkspaceIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={t('common.delete')}>
              <IconButton 
                size="small" 
                onClick={handleDeleteWorkspace}
                disabled={!currentWorkspace || currentWorkspace.isDefault}
                sx={{ ml: 0.5 }}
              >
                <DeleteWorkspaceIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={t('common.add')}>
              <IconButton 
                size="small" 
                onClick={() => handleOpenWorkspaceDialog()}
                sx={{ ml: 0.5 }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
            sx={{
              px: 1,
              py: 0.75,
              boxShadow: (theme) => theme.shadows[2],
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: (theme) => theme.shadows[4],
              }
            }}
          >
            {t('workspace.addWidget')}
          </Button>
        </Toolbar>
      </AppBar>

      {/* 小部件网格 */}
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
          <Grid container spacing={1.5}>
            {widgets.map(w => {
              const col = w.size === 'small' ? 4 : w.size === 'medium' ? 8 : 12;
              return (
                <Grid size={col} key={w.id}>
                  <Widget widget={w} onEdit={handleEditWidget} onDelete={handleDeleteWidget} />
                </Grid>
              );
            })}
          </Grid>
        </SortableContext>

        <DragOverlay>
          {activeId ? (
            <Paper 
              sx={{ 
                p: 2, 
                opacity: 0.9,
                boxShadow: theme.shadows[8],
                transform: 'rotate(2deg)',
                borderRadius: 2
              }}
            >
              <Typography variant="h6">
                {widgets.find(w => w.id === activeId)?.title}
              </Typography>
            </Paper>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddWidgetDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onAdd={handleAddWidget} />
      <EditWidgetDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} widget={editingWidget} onUpdate={handleUpdateWidget} />
      
      <WorkspaceDialog
        open={workspaceDialogOpen}
        onClose={handleCloseWorkspaceDialog}
        workspace={editingWorkspace}
        formData={workspaceFormData}
        onFormDataChange={setWorkspaceFormData}
        onSave={handleSaveWorkspace}
      />
      
      {/* 删除确认对话框 */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={cancelDeleteWorkspace}
        PaperProps={{ sx: { minWidth: '300px' } }}
      >
        <DialogTitle>{t('common.confirm')}</DialogTitle>
        <DialogContent>
          {t('workspace.delete.content', { name: currentWorkspace?.name })}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteWorkspace}>{t('common.cancel')}</Button>
          <Button onClick={confirmDeleteWorkspace} color="error" variant="contained">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}