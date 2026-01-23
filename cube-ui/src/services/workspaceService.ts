import type { Workspace, Widget } from '../types/workspace';
import { apiService } from './api';

export const workspaceService = {
  // Get all workspaces for current user
  getAllWorkspaces: async (): Promise<Workspace[]> => {
    try {
      const response = await apiService.get('/workspaces');
      return response.data as Workspace[];
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
      throw error;
    }
  },

  // Create a new workspace
  createWorkspace: async (workspace: Omit<Workspace, 'id' | 'createdTime' | 'updatedTime'>): Promise<string> => {
    try {
      const response = await apiService.post('/workspaces', workspace);
      // 后端返回的是创建后的工作区ID
      return response.data as string;
    } catch (error) {
      console.error('Failed to create workspace:', error);
      throw error;
    }
  },

  // Update an existing workspace
  updateWorkspace: async (id: string, workspace: Partial<Omit<Workspace, 'id'>>): Promise<boolean> => {
    try {
      // 设置工作区ID
      const workspaceWithId = { ...workspace, id };
      const response = await apiService.put(`/workspaces/${id}`, workspaceWithId);
      return response.data as boolean;
    } catch (error) {
      console.error(`Failed to update workspace with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a workspace
  deleteWorkspace: async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.delete(`/workspaces/${id}`);
      return response.data as boolean;
    } catch (error) {
      console.error(`Failed to delete workspace with ID ${id}:`, error);
      throw error;
    }
  },

  // Get widgets by workspace ID
  getWidgetsByWorkspaceId: async (workspaceId: string): Promise<Widget[]> => {
    try {
      const response = await apiService.get(`/workspaces/${workspaceId}/widgets`);
      return response.data as Widget[];
    } catch (error) {
      console.error(`Failed to fetch widgets for workspace ${workspaceId}:`, error);
      throw error;
    }
  },

  // Widget related methods
  
  // Create a widget
  createWidget: async (widget: Omit<Widget, 'id'>): Promise<string> => {
    try {
      const response = await apiService.post('/workspaces/widgets', widget);
      // 后端返回的是创建后的小组件ID
      return response.data as string;
    } catch (error) {
      console.error('Failed to create widget:', error);
      throw error;
    }
  },

  // Update a widget
  updateWidget: async (widget: Partial<Widget>): Promise<boolean> => {
    try {
      const response = await apiService.put('/workspaces/widgets', widget);
      return response.data as boolean;
    } catch (error) {
      console.error(`Failed to update widget:`, error);
      throw error;
    }
  },

  // Delete a widget
  deleteWidget: async (id: string): Promise<boolean> => {
    try {
      const response = await apiService.delete(`/workspaces/widgets/${id}`);
      return response.data as boolean;
    } catch (error) {
      console.error(`Failed to delete widget with ID ${id}:`, error);
      throw error;
    }
  },

  // Update widget positions
  updateWidgetPositions: async (workspaceId: string, widgets: { id: string; position: number }[]): Promise<boolean> => {
    try {
      // 转换数据格式以匹配后端期望的SYSWidgetPosition结构
      const widgetPositions = widgets.map(widget => ({
        widgetId: widget.id,
        position: widget.position
      }));
      
      const response = await apiService.put(`/workspaces/${workspaceId}/widgets/positions`, widgetPositions);
      return response.data as boolean;
    } catch (error) {
      console.error(`Failed to update widget positions for workspace ${workspaceId}:`, error);
      throw error;
    }
  },
};