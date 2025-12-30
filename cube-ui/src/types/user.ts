export interface SYSUser {
  userId?: number;
  username: string;
  password?: string;
  description?: string;
  email?: string;
  status?: string;
  isSuperAdmin?: boolean;
  // BaseBean fields
  createdTime?: string;
  createdBy?: string;
  updatedTime?: string;
  updatedBy?: string;
  deleted?: boolean;
}

export interface UserFormData {
  username: string;
  password?: string;
  description?: string;
  email?: string;
  status?: string;
  isSuperAdmin?: boolean;
}

export interface SYSUserParam {
  pageNum: number;
  pageSize: number;
  userId?: number;
  username?: string;
  status?: string;
  isSuperAdmin?: boolean;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}
