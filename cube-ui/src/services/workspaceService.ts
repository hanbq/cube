import { apiService } from './api';
import type { Workspace } from '../types/workspace';

// 模拟数据，用于演示
const mockWorkspaces: Workspace[] = [
  {
    id: 'workspace-1',
    name: '默认工作区',
    description: '系统默认工作区，不可删除',
    isDefault: true,
    widgets: [
      { id: 'widget-1', type: 'statistic', title: '总用户数', size: 'small', data: { value: '1,234', description: '系统注册用户总数' } },
      { id: 'widget-2', type: 'statistic', title: '工作流数量', size: 'small', data: { value: '56', description: '已创建的工作流总数' } },
      { id: 'widget-3', type: 'statistic', title: '活跃任务', size: 'small', data: { value: '89', description: '当前正在执行的任务' } },
      { id: 'widget-4', type: 'statistic', title: '完成率', size: 'small', data: { value: '92%', description: '任务完成率' } },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'workspace-2',
    name: '数据分析',
    description: '用于数据分析的工作区',
    isDefault: false,
    widgets: [
      { id: 'widget-5', type: 'chart', title: '用户增长趋势', size: 'medium', data: { chartType: 'line' } },
      { id: 'widget-6', type: 'table', title: '最新用户', size: 'large', data: { columns: ['ID', '姓名', '注册时间'], rows: [] } },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'workspace-3',
    name: '项目管理',
    description: '项目管理相关的工作区',
    isDefault: false,
    widgets: [
      { id: 'widget-7', type: 'statistic', title: '项目总数', size: 'small', data: { value: '23', description: '当前进行中的项目' } },
      { id: 'widget-8', type: 'chart', title: '项目进度', size: 'medium', data: { chartType: 'bar' } },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const workspaceService = {
  // 获取所有工作区
  getAllWorkspaces: async (): Promise<Workspace[]> => {
    try {
      const response = await apiService.get<Workspace[]>('/workspaces');
      return response.data;
    } catch (error) {
      // 如果API调用失败，返回模拟数据
      console.warn('API调用失败，使用模拟数据:', error);
      return mockWorkspaces;
    }
  },

  // 根据ID获取工作区
  getWorkspaceById: async (id: string): Promise<Workspace> => {
    try {
      const response = await apiService.get<Workspace>(`/workspaces/${id}`);
      return response.data;
    } catch (error) {
      // 如果API调用失败，从模拟数据中查找
      console.warn('API调用失败，使用模拟数据:', error);
      const workspace = mockWorkspaces.find(w => w.id === id);
      if (!workspace) {
        throw new Error(`Workspace with id ${id} not found`);
      }
      return workspace;
    }
  },

  // 创建新工作区
  createWorkspace: async (workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workspace> => {
    try {
      const response = await apiService.post<Workspace>('/workspaces', workspace);
      return response.data;
    } catch (error) {
      // 如果API调用失败，创建模拟工作区
      console.warn('API调用失败，创建模拟工作区:', error);
      const newWorkspace: Workspace = {
        ...workspace,
        id: `workspace-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockWorkspaces.push(newWorkspace);
      return newWorkspace;
    }
  },

  // 更新工作区
  updateWorkspace: async (id: string, workspace: Partial<Workspace>): Promise<Workspace> => {
    try {
      const response = await apiService.put<Workspace>(`/workspaces/${id}`, workspace);
      return response.data;
    } catch (error) {
      // 如果API调用失败，更新模拟数据
      console.warn('API调用失败，更新模拟数据:', error);
      const index = mockWorkspaces.findIndex(w => w.id === id);
      if (index === -1) {
        throw new Error(`Workspace with id ${id} not found`);
      }
      mockWorkspaces[index] = { ...mockWorkspaces[index], ...workspace, updatedAt: new Date().toISOString() };
      return mockWorkspaces[index];
    }
  },

  // 删除工作区
  deleteWorkspace: async (id: string): Promise<void> => {
    try {
      await apiService.delete<void>(`/workspaces/${id}`);
    } catch (error) {
      // 如果API调用失败，从模拟数据中删除
      console.warn('API调用失败，删除模拟数据:', error);
      const index = mockWorkspaces.findIndex(w => w.id === id);
      if (index === -1) {
        throw new Error(`Workspace with id ${id} not found`);
      }
      mockWorkspaces.splice(index, 1);
    }
  },

  // 初始化默认工作区
  initializeDefaultWorkspace: async (): Promise<void> => {
    try {
      // 检查是否已有工作区
      const workspaces = await workspaceService.getAllWorkspaces();
      const hasDefaultWorkspace = workspaces.some(workspace => workspace.isDefault);
      
      if (!hasDefaultWorkspace) {
        // 创建默认工作区
        await workspaceService.createWorkspace({
          name: '默认工作区',
          description: '系统默认工作区，不可删除',
          isDefault: true,
          widgets: [
            { id: 'widget-1', type: 'statistic', title: '总用户数', size: 'small', data: { value: '1,234', description: '系统注册用户总数' } },
            { id: 'widget-2', type: 'statistic', title: '工作流数量', size: 'small', data: { value: '56', description: '已创建的工作流总数' } },
            { id: 'widget-3', type: 'statistic', title: '活跃任务', size: 'small', data: { value: '89', description: '当前正在执行的任务' } },
            { id: 'widget-4', type: 'statistic', title: '完成率', size: 'small', data: { value: '92%', description: '任务完成率' } },
          ],
        });
        console.log('默认工作区已创建');
      }
    } catch (error) {
      console.error('初始化默认工作区失败:', error);
    }
  },
};