import type { Widget as WidgetType } from '../../types/workspace';
import { WidgetFrame, getWidgetComponent } from './widgets';

interface WidgetProps {
  widget: WidgetType;
  onEdit: (widget: WidgetType) => void;
  onDelete: (id: string) => void;
  onResize?: (widget: WidgetType) => void;
}

export default function Widget({ widget, onEdit, onDelete, onResize }: WidgetProps) {
  // 获取对应类型的小部件内容组件
  const WidgetContent = getWidgetComponent(widget.type);

  // 如果找不到对应类型的组件，则显示错误信息
  if (!WidgetContent) {
    return (
      <WidgetFrame widget={widget} onEdit={onEdit} onDelete={onDelete} onResize={onResize}>
        <div>Unknown widget type: {widget.type}</div>
      </WidgetFrame>
    );
  }

  return (
    <WidgetFrame widget={widget} onEdit={onEdit} onDelete={onDelete} onResize={onResize}>
      <WidgetContent widget={widget} onEdit={onEdit} />
    </WidgetFrame>
  );
}