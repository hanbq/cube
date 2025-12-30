package com.cube.system;

import com.cube.common.entity.CubeResponse;
import com.cube.system.entity.SYSUserRole;
import com.cube.system.service.SYSUserRoleService;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户角色关联Controller
 * 处理用户角色关联的查询、批量插入、批量删除请求
 *
 * @author cube
 * @since 2025-12-26
 */
@RestController
@RequestMapping("/api/user-roles")
public class SYSUserRoleController {

    private static final Logger LOG = LoggerFactory.getLogger(SYSUserRoleController.class);

    @Resource
    private SYSUserRoleService userRoleService;

    /**
     * 批量插入用户角色关联
     *
     * @param userRoles 用户角色关联列表
     * @return 插入的数量
     */
    @PostMapping("/batch")
    public CubeResponse<Integer> batchInsertUserRoles(@RequestBody List<SYSUserRole> userRoles) {
        LOG.info("Batch inserting {} user-role associations", userRoles.size());
        try {
            int insertedCount = userRoleService.batchInsertUserRoles(userRoles);
            LOG.info("{} user-role associations inserted successfully", insertedCount);
            return CubeResponse.success(insertedCount, insertedCount + " user-role associations inserted successfully");
        } catch (Exception e) {
            LOG.error("Error batch inserting user-role associations", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 移除用户的角色
     *
     * @param userId 用户ID
     * @param roleId 角色ID
     * @return 移除结果
     */
    @DeleteMapping("/remove")
    public CubeResponse<Boolean> removeRoleFromUser(
            @RequestParam Long userId,
            @RequestParam Long roleId) {
        LOG.info("Removing role {} from user {}", roleId, userId);
        try {
            boolean success = userRoleService.removeRoleFromUser(userId, roleId);
            if (success) {
                LOG.info("Role removed successfully");
                return CubeResponse.success(true, "Role removed successfully");
            } else {
                LOG.warn("Failed to remove role");
                return CubeResponse.failed("Failed to remove role");
            }
        } catch (Exception e) {
            LOG.error("Error removing role from user", e);
            return CubeResponse.failed(e.getMessage());
        }
    }
}
