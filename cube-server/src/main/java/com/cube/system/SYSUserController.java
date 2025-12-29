package com.cube.system;

import com.cube.common.entity.CubeResponse;
import com.cube.common.page.PageResult;
import com.cube.system.entity.SYSUser;
import com.cube.system.param.SYSUserParam;
import com.cube.system.service.SYSUserService;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户Controller
 * 处理用户的增删改查请求
 *
 * @author cube
 * @since 2025-12-26
 */
@RestController
@RequestMapping("/api/users")
public class SYSUserController {

    private static final Logger LOG = LoggerFactory.getLogger(SYSUserController.class);

    @Resource
    private SYSUserService userService;

    /**
     * 创建用户
     *
     * @param user 用户对象
     * @return 创建结果
     */
    @PostMapping
    public CubeResponse<Boolean> createUser(@RequestBody SYSUser user) {
        LOG.info("Creating user: {}", user.getUserName());
        try {
            userService.createUser(user);
            LOG.info("User created successfully: {}", user.getUserName());
            return CubeResponse.success(true, "User created successfully");
        } catch (Exception e) {
            LOG.error("Error creating user: {}", user.getUserName(), e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to create user: " + errorMsg);
        }
    }

    /**
     * 更新用户
     *
     * @param id   用户ID
     * @param user 用户对象
     * @return 更新结果
     */
    @PutMapping("/{id}")
    public CubeResponse<Boolean> updateUser(@PathVariable Long id, @RequestBody SYSUser user) {
        LOG.info("Updating user with ID: {}", id);
        try {
            user.setUserId(id);
            boolean success = userService.updateUser(user);
            if (success) {
                LOG.info("User updated successfully");
                return CubeResponse.success(true, "User updated successfully");
            } else {
                LOG.warn("User not found or update failed");
                return CubeResponse.failed("User not found or update failed");
            }
        } catch (Exception e) {
            LOG.error("Error updating user", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to update user: " + errorMsg);
        }
    }

    /**
     * 删除用户（软删除）
     *
     * @param id 用户ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    public CubeResponse<Boolean> deleteUser(@PathVariable Long id) {
        LOG.info("Deleting user with ID: {}", id);
        try {
            boolean success = userService.deleteUser(id);
            if (success) {
                LOG.info("User deleted successfully");
                return CubeResponse.success(true, "User deleted successfully");
            } else {
                LOG.warn("User not found or delete failed");
                return CubeResponse.failed("User not found or delete failed");
            }
        } catch (Exception e) {
            LOG.error("Error deleting user", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to delete user: " + errorMsg);
        }
    }

    /**
     * 批量删除用户（软删除）
     *
     * @param userIds 用户ID列表
     * @return 删除结果
     */
    @DeleteMapping("/batch")
    public CubeResponse<Integer> deleteUsers(@RequestBody List<Long> userIds) {
        LOG.info("Batch deleting {} users", userIds.size());
        try {
            int deletedCount = userService.deleteUsers(userIds);
            LOG.info("{} users deleted successfully", deletedCount);
            return CubeResponse.success(deletedCount, deletedCount + " users deleted successfully");
        } catch (Exception e) {
            LOG.error("Error batch deleting users", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to delete users: " + errorMsg);
        }
    }

    /**
     * 根据ID查询用户
     *
     * @param id 用户ID
     * @return 用户对象
     */
    @GetMapping("/{id}")
    public CubeResponse<SYSUser> getUserById(@PathVariable Long id) {
        LOG.info("Getting user by ID: {}", id);
        try {
            return userService.getUserById(id)
                    .map(user -> {
                        LOG.info("User found: {}", user.getUserName());
                        return CubeResponse.success(user, "User found");
                    })
                    .orElse(CubeResponse.failed("User not found"));
        } catch (Exception e) {
            LOG.error("Error getting user by ID", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to get user: " + errorMsg);
        }
    }

    /**
     * 查询所有用户
     *
     * @return 用户列表
     */
    @GetMapping
    public CubeResponse<List<SYSUser>> getAllUsers() {
        LOG.info("Getting all users");
        try {
            List<SYSUser> users = userService.getAllUsers();
            LOG.info("Retrieved {} users", users.size());
            return CubeResponse.success(users);
        } catch (Exception e) {
            LOG.error("Error getting all users", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 根据参数查询用户列表（分页）
     * 支持按userId、userName（忽略大小写）、status、isSuperAdmin查询
     *
     * @param param 查询参数（包含分页参数pageNum和pageSize）
     * @return 分页结果
     */
    @PostMapping("/search")
    public CubeResponse<PageResult<SYSUser>> searchUsers(@RequestBody(required = false) SYSUserParam param) {
        LOG.info("Searching users with param: {}", param);
        try {
            PageResult<SYSUser> result = userService.getUsersByParamWithPage(param);
            LOG.info("Found {} users in total, current page has {} users",
                    result.getTotal(), result.getRecords().size());
            return CubeResponse.success(result, "Users found successfully");
        } catch (Exception e) {
            LOG.error("Error searching users", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to search users: " + errorMsg);
        }
    }

    /**
     * 根据状态查询用户列表
     *
     * @param status 状态
     * @return 用户列表
     */
    @GetMapping("/status/{status}")
    public CubeResponse<List<SYSUser>> getUsersByStatus(@PathVariable String status) {
        LOG.info("Getting users by status: {}", status);
        try {
            List<SYSUser> users = userService.getUsersByStatus(status);
            LOG.info("Retrieved {} users with status {}", users.size(), status);
            return CubeResponse.success(users);
        } catch (Exception e) {
            LOG.error("Error getting users by status", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 更新用户状态
     *
     * @param id     用户ID
     * @param status 新状态
     * @return 更新结果
     */
    @PutMapping("/{id}/status")
    public CubeResponse<Boolean> updateUserStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        LOG.info("Updating status for user {}: {}", id, status);
        try {
            boolean success = userService.updateUserStatus(id, status);
            if (success) {
                LOG.info("User status updated successfully");
                return CubeResponse.success(true);
            } else {
                LOG.warn("Failed to update user status");
                return CubeResponse.failed("Failed to update user status");
            }
        } catch (Exception e) {
            LOG.error("Error updating user status", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 更新用户密码
     *
     * @param id          用户ID
     * @param newPassword 新密码
     * @return 更新结果
     */
    @PutMapping("/{id}/password")
    public CubeResponse<Boolean> updateUserPassword(
            @PathVariable Long id,
            @RequestParam String newPassword) {
        LOG.info("Updating password for user {}", id);
        try {
            boolean success = userService.updateUserPassword(id, newPassword);
            if (success) {
                LOG.info("User password updated successfully");
                return CubeResponse.success(true);
            } else {
                LOG.warn("Failed to update user password");
                return CubeResponse.failed("Failed to update user password");
            }
        } catch (Exception e) {
            LOG.error("Error updating user password", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 更新用户超级管理员状态
     *
     * @param id           用户ID
     * @param isSuperAdmin 是否是超级管理员
     * @return 更新结果
     */
    @PutMapping("/{id}/super-admin")
    public CubeResponse<Boolean> updateUserSuperAdmin(
            @PathVariable Long id,
            @RequestParam Boolean isSuperAdmin) {
        LOG.info("Updating super admin status for user {}: {}", id, isSuperAdmin);
        try {
            boolean success = userService.updateUserSuperAdmin(id, isSuperAdmin);
            if (success) {
                LOG.info("User super admin status updated successfully");
                return CubeResponse.success(true, "User super admin status updated successfully");
            } else {
                LOG.warn("Failed to update user super admin status");
                return CubeResponse.failed("Failed to update user super admin status");
            }
        } catch (Exception e) {
            LOG.error("Error updating user super admin status", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to update user super admin status: " + errorMsg);
        }
    }

    /**
     * 查询所有超级管理员
     *
     * @return 超级管理员列表
     */
    @GetMapping("/super-admins")
    public CubeResponse<List<SYSUser>> getSuperAdmins() {
        LOG.info("Getting all super admins");
        try {
            List<SYSUser> users = userService.getSuperAdmins();
            LOG.info("Retrieved {} super admins", users.size());
            return CubeResponse.success(users, "Super admins retrieved successfully");
        } catch (Exception e) {
            LOG.error("Error getting super admins", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to get super admins: " + errorMsg);
        }
    }

    /**
     * 统计用户数量
     *
     * @return 用户总数
     */
    @GetMapping("/count")
    public CubeResponse<Long> countUsers() {
        LOG.info("Counting users");
        try {
            long count = userService.countUsers();
            LOG.info("Total users: {}", count);
            return CubeResponse.success(count, "User count retrieved successfully");
        } catch (Exception e) {
            LOG.error("Error counting users", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to count users: " + errorMsg);
        }
    }

    /**
     * 分页查询用户
     *
     * @param pageNum  页码
     * @param pageSize 每页大小
     * @return 分页结果
     */
    @GetMapping("/page")
    public CubeResponse<PageResult<SYSUser>> getUserPage(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize) {
        LOG.info("Getting user page: pageNum={}, pageSize={}", pageNum, pageSize);
        try {
            SYSUserParam param = new SYSUserParam();
            param.setPageNum(pageNum);
            param.setPageSize(pageSize);
            PageResult<SYSUser> result = userService.getUsersByParamWithPage(param);
            LOG.info("Retrieved page {} with {} users", pageNum, result.getRecords().size());
            return CubeResponse.success(result, "Users retrieved successfully");
        } catch (Exception e) {
            LOG.error("Error getting user page", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to get users: " + errorMsg);
        }
    }

    /**
     * 根据角色ID查询用户列表
     *
     * @param roleId 角色ID
     * @return 用户列表
     */
    @GetMapping("/role/{roleId}")
    public CubeResponse<List<SYSUser>> getUsersByRoleId(@PathVariable Long roleId) {
        LOG.info("Getting users by role ID: {}", roleId);
        try {
            List<SYSUser> users = userService.getUsersByRoleId(roleId);
            LOG.info("Retrieved {} users for role ID {}", users.size(), roleId);
            return CubeResponse.success(users, "Users retrieved successfully");
        } catch (Exception e) {
            LOG.error("Error getting users by role ID", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to get users: " + errorMsg);
        }
    }
}
