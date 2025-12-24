package com.cube.system.service;

import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;
import com.cube.system.entity.SYSSysLog;
import com.cube.system.dao.SYSSysLogDao;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 系统日志Service
 *
 * @author cube
 * @since 2025-12-24
 */
@Service
@Transactional
public class SYSSysLogService {

    private final SYSSysLogDao sysLogDao;

    public SYSSysLogService(SYSSysLogDao sysLogDao) {
        this.sysLogDao = sysLogDao;
    }

    /**
     * 记录日志
     *
     * @param log 日志对象
     * @return 日志ID
     */
    public Long logOperation(SYSSysLog log) {
        return sysLogDao.insert(log);
    }

    /**
     * 根据ID查询日志
     *
     * @param logId 日志ID
     * @return 日志对象
     */
    @Transactional(readOnly = true)
    public Optional<SYSSysLog> getLogById(Long logId) {
        return sysLogDao.findById(logId);
    }

    /**
     * 查询所有日志
     *
     * @return 日志列表
     */
    @Transactional(readOnly = true)
    public List<SYSSysLog> getAllLogs() {
        return sysLogDao.findAll();
    }

    /**
     * 分页查询日志
     *
     * @param pageRequest 分页请求
     * @return 分页结果
     */
    @Transactional(readOnly = true)
    public PageResult<SYSSysLog> getLogPage(PageRequest pageRequest) {
        return sysLogDao.findPage(pageRequest);
    }

    /**
     * 根据用户名查询日志列表
     *
     * @param userName 用户名
     * @return 日志列表
     */
    @Transactional(readOnly = true)
    public List<SYSSysLog> getLogsByUserName(String userName) {
        return sysLogDao.findByUserName(userName);
    }

    /**
     * 根据操作类型查询日志列表
     *
     * @param operation 操作类型
     * @return 日志列表
     */
    @Transactional(readOnly = true)
    public List<SYSSysLog> getLogsByOperation(String operation) {
        return sysLogDao.findByOperation(operation);
    }

    /**
     * 根据IP查询日志列表
     *
     * @param ip IP地址
     * @return 日志列表
     */
    @Transactional(readOnly = true)
    public List<SYSSysLog> getLogsByIp(String ip) {
        return sysLogDao.findByIp(ip);
    }

    /**
     * 删除指定时间之前的日志
     *
     * @param beforeTime 截止时间
     * @return 删除的日志数量
     */
    public int cleanupOldLogs(ZonedDateTime beforeTime) {
        return sysLogDao.deleteBefore(beforeTime);
    }

    /**
     * 统计日志数量
     *
     * @return 日志总数
     */
    @Transactional(readOnly = true)
    public long countLogs() {
        return sysLogDao.count();
    }
}
