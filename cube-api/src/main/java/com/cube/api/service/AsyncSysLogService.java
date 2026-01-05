package com.cube.api.service;

import com.cube.system.entity.SYSSysLog;
import com.cube.system.service.SYSSysLogService;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * 异步系统日志服务
 * 用于异步保存系统日志到数据库
 *
 * @author system
 */
@Service
public class AsyncSysLogService {

    private static final Logger logger = LoggerFactory.getLogger(AsyncSysLogService.class);

    @Resource
    private SYSSysLogService sysLogService;

    /**
     * 异步保存系统日志
     *
     * @param sysLog 系统日志对象
     */
    @Async
    public void saveSysLogAsync(SYSSysLog sysLog) {
        try {
            sysLogService.createSysLog(sysLog);
            logger.debug("sys log save success: {}", sysLog.getOperation());
        } catch (Exception e) {
            logger.error("sys log save fail: {}", sysLog.getOperation(), e);
        }
    }
}