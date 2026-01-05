package com.cube.api.controller.system;

import com.cube.common.entity.CubeResponse;
import com.cube.common.page.PageResult;
import com.cube.api.annotation.SysLog;
import com.cube.system.entity.SYSSysLog;
import com.cube.system.param.SYSLogParam;
import com.cube.system.service.SYSSysLogService;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 系统日志Controller
 * 处理系统日志的查询请求
 *
 * @author system
 */
@RestController
@RequestMapping("/api/syslog")
public class SYSSysLogController {

    private static final Logger LOG = LoggerFactory.getLogger(SYSSysLogController.class);

    @Resource
    private SYSSysLogService sysLogService;

    /**
     * 根据ID删除系统日志
     *
     * @param id 日志ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    @SysLog(value = "删除系统日志", operation = "DELETE_SYS_LOG")
    public CubeResponse<Boolean> deleteSysLog(@PathVariable Long id) {
        LOG.info("Deleting system log with ID: {}", id);
        try {
            boolean success = sysLogService.deleteSysLog(id);
            if (success) {
                LOG.info("System log deleted successfully");
                return CubeResponse.success(true, "System log deleted successfully");
            } else {
                LOG.warn("System log not found or delete failed");
                return CubeResponse.failed("System log not found or delete failed");
            }
        } catch (Exception e) {
            LOG.error("Error deleting system log", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 批量删除系统日志
     *
     * @param ids 日志ID列表
     * @return 删除结果
     */
    @DeleteMapping("/batch")
    @SysLog(value = "批量删除系统日志", operation = "BATCH_DELETE_SYS_LOG", saveRequestData = true)
    public CubeResponse<Integer> deleteSysLogs(@RequestBody List<Long> ids) {
        LOG.info("Batch deleting {} system logs", ids.size());
        try {
            int deletedCount = sysLogService.deleteSysLogs(ids);
            LOG.info("{} system logs deleted successfully", deletedCount);
            return CubeResponse.success(deletedCount);
        } catch (Exception e) {
            LOG.error("Error batch deleting system logs", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 根据参数查询系统日志列表（分页）
     * 支持按username（模糊+忽略大小写）、operation（忽略大小写）、method（忽略大小写）、ip地址、createdTime时间范围查询
     *
     * @param param 查询参数（包含分页参数pageNum和pageSize）
     * @return 分页结果
     */
    @PostMapping("/search")
    public CubeResponse<PageResult<SYSSysLog>> searchSysLogs(@RequestBody(required = false) SYSLogParam param) {
        LOG.info("Searching system logs with param: {}", param);
        try {
            PageResult<SYSSysLog> result = sysLogService.getSysLogsByParamWithPage(param);
            LOG.info("Found {} system logs in total, current page has {} logs",
                    result.getTotal(), result.getRecords().size());
            return CubeResponse.success(result, "System logs found successfully");
        } catch (Exception e) {
            LOG.error("Error searching system logs", e);
            return CubeResponse.failed(e.getMessage());
        }
    }
}