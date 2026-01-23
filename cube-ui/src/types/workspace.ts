export interface Workspace {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  widgets: Widget[];
  createdTime: string;
  updatedTime: string;
}

export interface Widget {
  id: string;
  type: 'statistic' | 'chart' | 'table' | 'text';
  title: string;
  size: 'small' | 'medium' | 'large';
  data?: any;
  position: number;
  workspaceId?: string;
  [key: string]: any;
}

export interface WidgetContentProps {
  widget: Widget;
  [key: string]: any;
}

export interface WidgetEditProps {
  data: any;
  onChange: (data: any) => void;
  disabled?: boolean;
  [key: string]: any;
}

export type WidgetContentComponent = React.ComponentType<WidgetContentProps>;

export type WidgetEditComponent = React.ComponentType<WidgetEditProps>;

export interface WidgetConfig {
  type: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  defaultSize: 'small' | 'medium' | 'large';
  defaultData: any;
  contentComponent: WidgetContentComponent;
  editComponent: WidgetEditComponent;
}