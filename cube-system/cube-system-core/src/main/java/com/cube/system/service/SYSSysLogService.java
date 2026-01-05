package com.cube.system.service;

import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;
import com.cube.system.dao.SYSSysLogDao;
import com.cube.system.entity.SYSSysLog;
import com.cube.system.param.SYSLogParam;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 系统日志Service
 *
 * @author system
 */
@Service
@Transactional
public class SYSSysLogService {

    private final SYSSysLogDao sysLogDao;

    public SYSSysLogService(SYSSysLogDao sysLogDao) {
        this.sysLogDao = sysLogDao;
    }

    /**
     * 创建系统日志
     *
     * @param sysLog 日志对象
     */
    public void createSysLog(SYSSysLog sysLog) {
        sysLogDao.insert(sysLog);
    }

    /**
     * 根据ID删除系统日志
     *
     * @param logId 日志ID
     * @return 是否删除成功
     */
    public boolean deleteSysLog(Long logId) {
        return sysLogDao.deleteById(logId) > 0;
    }

    /**
     * 批量删除系统日志
     *
     * @param logIds 日志ID列表
     * @return 删除的数量
     */
    public int deleteSysLogs(List<Long> logIds) {
        return sysLogDao.deleteByIds(logIds);
    }

    /**
     * 根据参数动态查询系统日志列表（分页）
     *
     * @param param 查询参数（包含分页参数）
     * @return 分页结果
     */
    @Transactional(readOnly = true)
    public PageResult<SYSSysLog> getSysLogsByParamWithPage(SYSLogParam param) {
        // 从param中提取分页参数，如果没有则使用默认值
        Integer pageNumObj = (param != null) ? param.getPageNum() : null;
        Integer pageSizeObj = (param != null) ? param.getPageSize() : null;

        int pageNum = (pageNumObj != null) ? pageNumObj : 1;
        int pageSize = (pageSizeObj != null) ? pageSizeObj : 10;

        PageRequest pageRequest = new PageRequest(pageNum, pageSize);
        return sysLogDao.findByParamWithPage(param, pageRequest);
    }
}