export interface Workspace {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  widgets: Widget[];
  createdAt: string;
  updatedAt: string;
}

export interface Widget {
  id: string;
  type: 'statistic' | 'chart' | 'table' | 'text';
  title: string;
  content?: any;
  size: 'small' | 'medium' | 'large';
  data?: any;
}