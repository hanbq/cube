export interface SYSRole {
  roleId?: number;
  roleName: string;
  description?: string;
  // BaseBean 字段
  createdTime?: string;
  createdBy?: string;
  updatedTime?: string;
  updatedBy?: string;
  deleted?: boolean;
}

export interface RoleFormData {
  roleName: string;
  description?: string;
}

export interface SYSRoleParam {
  pageNum: number;
  pageSize: number;
  roleId?: number;
  roleName?: string;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}
