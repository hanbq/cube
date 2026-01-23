
import { useState, useEffect, useRef } from 'react';
import { workspaceService } from '../services/workspaceService';
import type { Workspace, Widget } from '../types/workspace';
import { useLoading } from '../contexts/LoadingContext';

export const useWorkspace = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { setLoading: setGlobalLoading, setLoadingProgress } = useLoading();

  // 获取所有工作区
  const fetchWorkspaces = async () => {
    setLoading(true);
    setGlobalLoading(true);
    setLoadingProgress(10);
    setError(null);
    try {
      setLoadingProgress(30);
      const data = await workspaceService.getAllWorkspaces();
      setWorkspaces(data);
      setLoadingProgress(60);
      // 如果有工作区但没有当前工作区，设置默认工作区
      if (data.length > 0 && !currentWorkspace) {
        const defaultWorkspace = data.find(w => w.isDefault) || data[0];
        setLoadingProgress(80);
        // 获取默认工作区的小部件列表
        const widgets = await workspaceService.getWidgetsByWorkspaceId(defaultWorkspace.id);
        const workspaceWithWidgets = { ...defaultWorkspace, widgets };
        setCurrentWorkspace(workspaceWithWidgets);
        setLoadingProgress(100);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch workspaces:', err);
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  // 根据ID获取工作区 - 已移除此方法，因为后端没有提供对应接口
  // const fetchWorkspaceById = async (id: string) => { ... };

  // 创建新工作区
  const createWorkspace = async (workspace: Omit<Workspace, 'id' | 'createdTime' | 'updatedTime'>) => {
    setLoading(true);
    setError(null);
    try {
      const workspaceId = await workspaceService.createWorkspace(workspace);
      return workspaceId;
    } catch (err) {
      setError(err as Error);
      console.error('Failed to create workspace:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 更新工作区
  const updateWorkspace = async (id: string, workspace: Partial<Omit<Workspace, 'id'>>) => {
    setLoading(true);
    setError(null);
    try {
      const success = await workspaceService.updateWorkspace(id, workspace);
      return success;
    } catch (err) {
      setError(err as Error);
      console.error('Failed to update workspace:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 删除工作区
  const deleteWorkspace = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await workspaceService.deleteWorkspace(id);
      if (success) {
        setWorkspaces(workspaces.filter(w => w.id !== id));
        if (currentWorkspace?.id === id) {
          // 如果删除的是当前工作区，切换到默认工作区或第一个可用工作区
          const remainingWorkspaces = workspaces.filter(w => w.id !== id);
          const newCurrent = remainingWorkspaces.find(w => w.isDefault) || remainingWorkspaces[0] || null;
          if (newCurrent) {
            // 获取新工作区的小部件列表
            const widgets = await workspaceService.getWidgetsByWorkspaceId(newCurrent.id);
            const workspaceWithWidgets = { ...newCurrent, widgets };
            setCurrentWorkspace(workspaceWithWidgets);
          } else {
            setCurrentWorkspace(null);
          }
        }
      }
      return success;
    } catch (err) {
      setError(err as Error);
      console.error('Failed to delete workspace:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Widget related methods
  
  // 添加小部件到工作区
  const addWidget = async (workspaceId: string, widget: Omit<Widget, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      // 将workspaceId作为widget对象的属性
      const widgetWithWorkspaceId = { ...widget, workspaceId };
      const widgetId = await workspaceService.createWidget(widgetWithWorkspaceId);
      // 创建成功后，直接更新当前工作区的小部件列表
      if (currentWorkspace?.id === workspaceId) {
        // 确保新创建的widget对象包含所有必需的属性
        const newWidget: Widget = {
          ...widgetWithWorkspaceId,
          id: widgetId,
          // 确保必需的属性存在，如果没有则使用默认值
          type: widget.type || 'statistic',
          title: widget.title || 'New Widget',
          size: widget.size || 'medium',
          position: widget.position || 0,
        };
        const updatedWidgets = [...(currentWorkspace.widgets || []), newWidget];
        const updatedWorkspace = { ...currentWorkspace, widgets: updatedWidgets };
        
        // 先更新当前工作区
        setCurrentWorkspace(updatedWorkspace);
        
        // 然后更新工作区列表
        setWorkspaces(prev => {
          const newWorkspaces = prev.map(w => w.id === workspaceId ? updatedWorkspace : w);
          return newWorkspaces;
        });
      }
      return widgetId;
    } catch (err) {
      setError(err as Error);
      console.error('Failed to add widget:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 更新工作区中的小部件
  const updateWidget = async (workspaceId: string, widgetId: string, updates: Partial<Widget>) => {
    setLoading(true);
    setError(null);
    try {
      // 构建更新对象，包含id和所有更新字段
      const updateObject = { ...updates, id: widgetId };
      const success = await workspaceService.updateWidget(updateObject);
      // 更新成功后，直接更新当前工作区的小部件列表
      if (success && currentWorkspace?.id === workspaceId) {
        const updatedWidgets = currentWorkspace.widgets.map(w => 
          w.id === widgetId ? { ...w, ...updates } : w
        );
        const updatedWorkspace = { ...currentWorkspace, widgets: updatedWidgets };
        
        // 先更新当前工作区
        setCurrentWorkspace(updatedWorkspace);
        
        // 然后更新工作区列表
        setWorkspaces(prev => {
          const newWorkspaces = prev.map(w => w.id === workspaceId ? updatedWorkspace : w);
          return newWorkspaces;
        });
      }
      return success;
    } catch (err) {
      setError(err as Error);
      console.error('Failed to update widget:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 删除工作区中的小部件
  const deleteWidget = async (workspaceId: string, widgetId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await workspaceService.deleteWidget(widgetId);
      if (success) {
        // 删除成功后，直接更新当前工作区的小部件列表
        if (currentWorkspace?.id === workspaceId) {
          const updatedWidgets = (currentWorkspace.widgets || []).filter(w => w.id !== widgetId);
          const updatedWorkspace = { ...currentWorkspace, widgets: updatedWidgets };
          
          // 先更新当前工作区
          setCurrentWorkspace(updatedWorkspace);
          
          // 然后更新工作区列表
          setWorkspaces(prev => {
            const newWorkspaces = prev.map(w => w.id === workspaceId ? updatedWorkspace : w);
            return newWorkspaces;
          });
        }
      }
      return success;
    } catch (err) {
      setError(err as Error);
      console.error('Failed to delete widget:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 更新小部件位置
  const updateWidgetPositions = async (workspaceId: string, widgets: { id: string; position: number }[]) => {
    setLoading(true);
    setError(null);
    try {
      const success = await workspaceService.updateWidgetPositions(workspaceId, widgets);
      if (success && currentWorkspace?.id === workspaceId) {
        // 更新成功后，更新当前工作区的小部件列表
        const updatedWidgets = (currentWorkspace.widgets || []).map(widget => {
          const positionUpdate = widgets.find(w => w.id === widget.id);
          return positionUpdate ? { ...widget, position: positionUpdate.position } : widget;
        }).sort((a, b) => a.position - b.position);
        
        const updatedWorkspace = { ...currentWorkspace, widgets: updatedWidgets };
        
        // 先更新当前工作区
        setCurrentWorkspace(updatedWorkspace);
        
        // 然后更新工作区列表
        setWorkspaces(prev => {
          const newWorkspaces = prev.map(w => w.id === workspaceId ? updatedWorkspace : w);
          return newWorkspaces;
        });
      }
      return success;
    } catch (err) {
      setError(err as Error);
      console.error('Failed to update widget positions:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 设置当前工作区
  const setCurrentWorkspaceWithWidgets = async (workspace: Workspace | null) => {
    if (workspace) {
      try {
        setGlobalLoading(true);
        setLoadingProgress(30);
        // 获取该工作区的最新widget列表
        const widgets = await workspaceService.getWidgetsByWorkspaceId(workspace.id);
        setLoadingProgress(80);
        const workspaceWithWidgets = { ...workspace, widgets };
        setCurrentWorkspace(workspaceWithWidgets);
        setLoadingProgress(100);
      } catch (error) {
        console.error(`Failed to fetch widgets for workspace ${workspace.id}:`, error);
        // 如果获取widget失败，仍然设置工作区，但使用可能过时的widget列表
        setCurrentWorkspace(workspace);
      } finally {
        setGlobalLoading(false);
      }
    } else {
      setCurrentWorkspace(null);
    }
  };

  // 设置当前工作区（不获取小部件）
  const setCurrentWorkspaceOnly = (workspace: Workspace | null) => {
    setCurrentWorkspace(workspace);
  };

  // 初始化时获取工作区
  const hasFetched = useRef(false);
  useEffect(() => {
    if (!hasFetched.current) {
      fetchWorkspaces();
      hasFetched.current = true;
    }
  }, []);

  return {
    workspaces,
    currentWorkspace,
    loading,
    error,
    fetchWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setCurrentWorkspace: setCurrentWorkspaceWithWidgets,
    setCurrentWorkspaceOnly,
    // Widget methods
    addWidget,
    updateWidget,
    deleteWidget,
    updateWidgetPositions,
  };
};