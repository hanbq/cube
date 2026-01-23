// 导出类型
export type {
  Widget,
  WidgetContentProps,
  WidgetEditProps,
  WidgetContentComponent,
  WidgetEditComponent,
  WidgetConfig,
} from '../../../types/workspace';

// 导出小部件内容组件
export { default as StatisticWidget } from './StatisticWidget';
export { default as ChartWidget } from './ChartWidget';
export { default as TableWidget } from './TableWidget';
export { default as TextWidget } from './TextWidget';

// 导出小部件编辑组件
export { default as StatisticWidgetEdit } from './StatisticWidgetEdit';
export { default as ChartWidgetEdit } from './ChartWidgetEdit';
export { default as TableWidgetEdit } from './TableWidgetEdit';
export { default as TextWidgetEdit } from './TextWidgetEdit';

// 导出小部件框架组件
export { default as WidgetFrame } from './WidgetFrame';

// 导出小部件注册表相关函数
export {
  getAllWidgetConfigs,
  getWidgetConfig,
  getWidgetComponent,
  getWidgetEditComponent,
  registerWidget,
  unregisterWidget,
} from './WidgetRegistry';

// 导出默认的widgetRegistry
export { default as widgetRegistry } from './WidgetRegistry';