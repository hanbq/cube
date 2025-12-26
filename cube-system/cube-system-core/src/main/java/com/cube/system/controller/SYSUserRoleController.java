package com.cube.system.controller;

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
     * 查询所有用户角色关联
     *
     * @return 用户角色关联列表
     */
    @GetMapping
    public CubeResponse<List<SYSUserRole>> getAllUserRoles() {
        LOG.info("Getting all user-role associations");
        try {
            List<SYSUserRole> userRoles = userRoleService.getAllUserRoles();
            LOG.info("Retrieved {} user-role associations", userRoles.size());
            return CubeResponse.success(userRoles, "User-role associations retrieved successfully");
        } catch (Exception e) {
            LOG.error("Error getting all user-role associations", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to get user-role associations: " + errorMsg);
        }
    }

    /**
     * 根据用户ID查询角色关联
     *
     * @param userId 用户ID
     * @return 用户角色关联列表
     */
    @GetMapping("/user/{userId}")
    public CubeResponse<List<SYSUserRole>> getUserRolesByUserId(@PathVariable Long userId) {
        LOG.info("Getting user-role associations for user ID: {}", userId);
        try {
            List<SYSUserRole> userRoles = userRoleService.getUserRolesByUserId(userId);
            LOG.info("Retrieved {} user-role associations for user", userRoles.size());
            return CubeResponse.success(userRoles, "User-role associations retrieved successfully");
        } catch (Exception e) {
            LOG.error("Error getting user-role associations by user ID", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to get user-role associations: " + errorMsg);
        }
    }

    /**
     * 根据角色ID查询用户关联
     *
     * @param roleId 角色ID
     * @return 用户角色关联列表
     */
    @GetMapping("/role/{roleId}")
    public CubeResponse<List<SYSUserRole>> getUserRolesByRoleId(@PathVariable Long roleId) {
        LOG.info("Getting user-role associations for role ID: {}", roleId);
        try {
            List<SYSUserRole> userRoles = userRoleService.getUserRolesByRoleId(roleId);
            LOG.info("Retrieved {} user-role associations for role", userRoles.size());
            return CubeResponse.success(userRoles, "User-role associations retrieved successfully");
        } catch (Exception e) {
            LOG.error("Error getting user-role associations by role ID", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to get user-role associations: " + errorMsg);
        }
    }

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
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to insert user-role associations: " + errorMsg);
        }
    }

    /**
     * 批量删除用户角色关联（物理删除）
     *
     * @param ids ID列表
     * @return 删除的数量
     */
    @DeleteMapping("/batch")
    public CubeResponse<Integer> batchDeleteUserRoles(@RequestBody List<Long> ids) {
        LOG.info("Batch deleting {} user-role associations", ids.size());
        try {
            int deletedCount = userRoleService.batchDeleteUserRoles(ids);
            LOG.info("{} user-role associations deleted successfully", deletedCount);
            return CubeResponse.success(deletedCount, deletedCount + " user-role associations deleted successfully");
        } catch (Exception e) {
            LOG.error("Error batch deleting user-role associations", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to delete user-role associations: " + errorMsg);
        }
    }

    /**
     * 为用户分配角色
     *
     * @param userId 用户ID
     * @param roleId 角色ID
     * @return 分配结果
     */
    @PostMapping("/assign")
    public CubeResponse<Long> assignRoleToUser(
            @RequestParam Long userId,
            @RequestParam Long roleId) {
        LOG.info("Assigning role {} to user {}", roleId, userId);
        try {
            Long id = userRoleService.assignRoleToUser(userId, roleId);
            LOG.info("Role assigned successfully, ID: {}", id);
            return CubeResponse.success(id, "Role assigned successfully");
        } catch (Exception e) {
            LOG.error("Error assigning role to user", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to assign role: " + errorMsg);
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
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to remove role: " + errorMsg);
        }
    }
}
