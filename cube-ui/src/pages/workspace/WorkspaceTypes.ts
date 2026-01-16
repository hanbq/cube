export interface Widget {
  id: string;
  type: 'statistic' | 'chart' | 'table' | 'text';
  title: string;
  content?: any;
  size: 'small' | 'medium' | 'large';
  data?: any;
}
