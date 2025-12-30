import type { SYSSysLog, SYSLogParam, PageResult } from '../types/syslog';
import { apiService } from './api';

export const sysLogService = {
  searchSysLogs: async (param: SYSLogParam): Promise<PageResult<SYSSysLog>> => {
    const response = await apiService.post<PageResult<SYSSysLog>>('/syslog/search', param);
    return response.data;
  },

  deleteSysLog: async (logId: number): Promise<void> => {
    await apiService.delete(`/syslog/${logId}`);
  },

  batchDeleteSysLogs: async (logIds: number[]): Promise<void> => {
    await apiService.delete('/syslog/batch', { data: logIds });
  },
};
