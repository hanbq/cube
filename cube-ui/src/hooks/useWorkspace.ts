import { useState, useEffect } from 'react';
import { workspaceService } from '../services/workspaceService';
import type { Workspace } from '../types/workspace';

export const useWorkspace = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 获取所有工作区
  const fetchWorkspaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workspaceService.getAllWorkspaces();
      setWorkspaces(data);
      
      // 如果没有当前工作区，设置默认工作区
      if (!currentWorkspace && data.length > 0) {
        const defaultWorkspace = data.find(w => w.isDefault) || data[0];
        setCurrentWorkspace(defaultWorkspace);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch workspaces:', err);
    } finally {
      setLoading(false);
    }
  };

  // 根据ID获取工作区
  const fetchWorkspaceById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await workspaceService.getWorkspaceById(id);
      setCurrentWorkspace(data);
      return data;
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch workspace:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 创建新工作区
  const createWorkspace = async (workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newWorkspace = await workspaceService.createWorkspace(workspace);
      setWorkspaces([...workspaces, newWorkspace]);
      return newWorkspace;
    } catch (err) {
      setError(err as Error);
      console.error('Failed to create workspace:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 更新工作区
  const updateWorkspace = async (id: string, workspace: Partial<Workspace>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedWorkspace = await workspaceService.updateWorkspace(id, workspace);
      setWorkspaces(workspaces.map(w => w.id === id ? updatedWorkspace : w));
      if (currentWorkspace?.id === id) {
        setCurrentWorkspace(updatedWorkspace);
      }
      return updatedWorkspace;
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
      await workspaceService.deleteWorkspace(id);
      setWorkspaces(workspaces.filter(w => w.id !== id));
      if (currentWorkspace?.id === id) {
        // 如果删除的是当前工作区，切换到默认工作区或第一个可用工作区
        const remainingWorkspaces = workspaces.filter(w => w.id !== id);
        const newCurrent = remainingWorkspaces.find(w => w.isDefault) || remainingWorkspaces[0] || null;
        setCurrentWorkspace(newCurrent);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Failed to delete workspace:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 初始化时获取工作区
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return {
    workspaces,
    currentWorkspace,
    loading,
    error,
    fetchWorkspaces,
    fetchWorkspaceById,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setCurrentWorkspace
  };
};