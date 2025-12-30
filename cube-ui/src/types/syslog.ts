export interface SYSSysLog {
  logId?: number;
  username?: string;
  operation?: string;
  method?: string;
  params?: string;
  ip?: string;
  createdTime?: string;
}

export interface SYSLogParam {
  pageNum: number;
  pageSize: number;
  username?: string;
  operation?: string;
  method?: string;
  ip?: string;
  createdTimeStart?: string;
  createdTimeEnd?: string;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}
