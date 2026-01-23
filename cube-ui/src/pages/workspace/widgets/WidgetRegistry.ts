import type { WidgetConfig } from '../../../types/workspace';
import StatisticWidget from './StatisticWidget';
import ChartWidget from './ChartWidget';
import TableWidget from './TableWidget';
import TextWidget from './TextWidget';
import StatisticWidgetEdit from './StatisticWidgetEdit';
import ChartWidgetEdit from './ChartWidgetEdit';
import TableWidgetEdit from './TableWidgetEdit';
import TextWidgetEdit from './TextWidgetEdit';

// 小部件注册表
const widgetRegistry: Record<string, WidgetConfig> = {
  statistic: {
    type: 'statistic',
    name: 'statistic',
    description: 'statistic',
    icon: '📊',
    category: 'statistics',
    defaultSize: 'medium',
    defaultData: { value: '0', description: '' },
    contentComponent: StatisticWidget,
    editComponent: StatisticWidgetEdit,
  },
  chart: {
    type: 'chart',
    name: 'chart',
    description: 'chart',
    icon: '📈',
    category: 'charts',
    defaultSize: 'medium',
    defaultData: {},
    contentComponent: ChartWidget,
    editComponent: ChartWidgetEdit,
  },
  table: {
    type: 'table',
    name: 'table',
    description: 'table',
    icon: '📋',
    category: 'reports',
    defaultSize: 'large',
    defaultData: {},
    contentComponent: TableWidget,
    editComponent: TableWidgetEdit,
  },
  text: {
    type: 'text',
    name: 'text',
    description: 'text',
    icon: '📝',
    category: 'other',
    defaultSize: 'medium',
    defaultData: { text: '' },
    contentComponent: TextWidget,
    editComponent: TextWidgetEdit,
  },
};

// 获取所有小部件配置
export function getAllWidgetConfigs(): WidgetConfig[] {
  return Object.values(widgetRegistry);
}

// 根据类型获取小部件配置
export function getWidgetConfig(type: string): WidgetConfig | undefined {
  return widgetRegistry[type];
}

// 获取小部件内容组件
export function getWidgetComponent(type: string) {
  const config = getWidgetConfig(type);
  return config?.contentComponent;
}

// 获取小部件编辑组件
export function getWidgetEditComponent(type: string) {
  const config = getWidgetConfig(type);
  return config?.editComponent;
}

// 注册新的小部件类型
export function registerWidget(config: WidgetConfig): void {
  widgetRegistry[config.type] = config;
}

// 取消注册小部件类型
export function unregisterWidget(type: string): void {
  delete widgetRegistry[type];
}

export default widgetRegistry;