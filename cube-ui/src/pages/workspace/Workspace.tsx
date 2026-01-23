import { useState } from 'react';
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
import ResizeWidgetDialog from './ResizeWidgetDialog';
import type { Widget as WidgetType } from '../../types/workspace';
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
    fetchWorkspaces,
    // Widget methods
    addWidget,
    updateWidget,
    deleteWidget,
    updateWidgetPositions,
  } = useWorkspace();
  
  // 工作区管理状态
  const [workspaceDialogOpen, setWorkspaceDialogOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [workspaceFormData, setWorkspaceFormData] = useState({
    name: '',
    description: '',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // 小部件状态直接使用currentWorkspace.widgets，不需要本地状态
  const widgets = currentWorkspace?.widgets || [];

  const [activeId, setActiveId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<WidgetType | null>(null);
  const [resizeDialogOpen, setResizeDialogOpen] = useState(false);
  const [resizingWidget, setResizingWidget] = useState<WidgetType | null>(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragStart = (event: any) => setActiveId(event.active.id.toString());

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) { setActiveId(null); return; }
    if (active.id !== over.id) {
      const newWidgets = arrayMove(widgets, widgets.findIndex((item) => item.id === active.id), widgets.findIndex((item) => item.id === over.id));
      
      // 更新position属性以反映新的顺序
      const updatedWidgetsWithPosition = newWidgets.map((widget, index) => ({
        ...widget,
        position: index
      }));
      
      // 调用API更新小部件位置
      if (currentWorkspace) {
        const positionUpdates = updatedWidgetsWithPosition.map(widget => ({
          id: widget.id,
          position: widget.position
        }));
        
        updateWidgetPositions(currentWorkspace.id, positionUpdates).catch((err: any) => {
          console.error('Failed to update widget positions:', err);
          // 如果API调用失败，回滚到本地状态
          const finalUpdatedWorkspace = { ...currentWorkspace, widgets: updatedWidgetsWithPosition };
          setCurrentWorkspace(finalUpdatedWorkspace);
        });
      }
    }
    setActiveId(null);
  };

  const handleAddWidget = (widget: Omit<WidgetType, 'id'>) => {
    // 确保新添加的小部件有 position 属性
    const newWidget = {
      ...widget,
      position: widgets.length,
    };
    
    // 使用新的addWidget方法添加小部件
    if (currentWorkspace) {
      addWidget(currentWorkspace.id, newWidget).catch(err => {
        console.error('Failed to add widget:', err);
      });
    }
  };
  
  const handleEditWidget = (widget: WidgetType) => { 
    setEditingWidget(widget); 
    setEditDialogOpen(true); 
  };
  
  const handleUpdateWidget = (updatedWidget: WidgetType) => {
    // 使用新的updateWidget方法更新小部件
    if (currentWorkspace) {
      updateWidget(currentWorkspace.id, updatedWidget.id, updatedWidget).catch(err => {
        console.error('Failed to update widget:', err);
      });
    }
  };
  
  const handleResizeWidget = async (widget: WidgetType) => {
    setResizingWidget(widget);
    setResizeDialogOpen(true);
  };
  
  const handleConfirmResize = async (widget: WidgetType, size: 'small' | 'medium' | 'large') => {
    if (!currentWorkspace) return;
    const updatedWidget = { ...widget, size };
    updateWidget(currentWorkspace.id, updatedWidget.id, updatedWidget).catch(err => {
      console.error('Failed to resize widget:', err);
    });
    setResizeDialogOpen(false);
    setResizingWidget(null);
  };
  
  const handleDeleteWidget = (id: string) => {
    // 使用新的deleteWidget方法删除小部件
    if (currentWorkspace) {
      deleteWidget(currentWorkspace.id, id).catch(err => {
        console.error('Failed to delete widget:', err);
      });
    }
  };

  const handleWorkspaceChange = async (event: any) => {
    const workspaceId = event.target.value;
    const selectedWorkspace = workspaces.find(w => w.id === workspaceId);
    if (selectedWorkspace) {
      await setCurrentWorkspace(selectedWorkspace);
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
        const workspaceId = await createWorkspace({
          ...workspaceFormData,
          isDefault: false,
          widgets: [],
        });
        
        // 创建新工作区后，刷新工作区列表
        await fetchWorkspaces();
        
        // 使用新创建的工作区ID构建一个临时工作区对象
        // 这样可以立即切换到新工作区，而不需要等待状态更新
        const newWorkspace = {
          id: workspaceId,
          name: workspaceFormData.name,
          description: workspaceFormData.description,
          isDefault: false,
          widgets: [],
          createdTime: new Date().toISOString(),
          updatedTime: new Date().toISOString(),
        };
        
        // 立即设置新工作区为当前工作区
        await setCurrentWorkspace(newWorkspace);
      }
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
      // 不需要重新获取所有工作区，因为deleteWorkspace内部已经处理了
      // 切换到默认工作区
      const defaultWorkspace = workspaces.find(w => w.isDefault);
      if (defaultWorkspace) {
        await setCurrentWorkspace(defaultWorkspace);
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
                value={workspaces.find(w => w.id === currentWorkspace?.id)?.id || ''}
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
              <span>
                <IconButton 
                  size="small" 
                  onClick={() => handleOpenWorkspaceDialog(currentWorkspace || undefined)}
                  disabled={!currentWorkspace}
                  sx={{ ml: 1 }}
                >
                  <EditWorkspaceIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            
            <Tooltip title={t('common.delete')}>
              <span>
                <IconButton 
                  size="small" 
                  onClick={handleDeleteWorkspace}
                  disabled={!currentWorkspace || currentWorkspace.isDefault}
                  sx={{ ml: 0.5 }}
                >
                  <DeleteWorkspaceIcon fontSize="small" />
                </IconButton>
              </span>
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
            {widgets.length === 0 ? (
              <Grid size={12}>
                <Paper 
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    border: `2px dashed ${alpha(theme.palette.divider, 0.5)}`,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {t('workspace.noWidgets')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t('workspace.noWidgetsDescription')}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddDialogOpen(true)}
                  >
                    {t('workspace.addWidget')}
                  </Button>
                </Paper>
              </Grid>
            ) : (
              widgets.map(w => {
                const col = w.size === 'small' ? 4 : w.size === 'medium' ? 8 : 12;
                return (
                  <Grid size={col} key={w.id}>
                    <Widget widget={w} onEdit={handleEditWidget} onDelete={handleDeleteWidget} onResize={handleResizeWidget} />
                  </Grid>
                );
              })
            )}
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
      <ResizeWidgetDialog 
        open={resizeDialogOpen} 
        onClose={() => setResizeDialogOpen(false)} 
        widget={resizingWidget} 
        onResize={handleConfirmResize} 
      />
      
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