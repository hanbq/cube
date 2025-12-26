export interface SYSMenu {
  menuId?: number;
  menuName: string;
  menuNameEng: string;
  path: string;
  iconCls: string;
  parentId?: number | null;
  sort: number;
  component?: string;
  children?: SYSMenu[];
}

export interface MenuFormData {
  menuId?: number;
  menuName: string;
  menuNameEng: string;
  path: string;
  iconCls: string;
  parentId?: number | null;
  sort: number;
  component?: string;
}

export interface MenuTreeNode extends SYSMenu {
  key: string;
  title: string;
  children?: MenuTreeNode[];
}
