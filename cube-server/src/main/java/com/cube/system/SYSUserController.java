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
        LOG.info("Creating user: {}", user.getUsername());
        try {
            userService.createUser(user);
            LOG.info("User created successfully: {}", user.getUsername());
            return CubeResponse.success(true, "User created successfully");
        } catch (Exception e) {
            LOG.error("Error creating user: {}", user.getUsername(), e);
            return CubeResponse.failed(e.getMessage());
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
            return CubeResponse.failed(e.getMessage());
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
            return CubeResponse.failed(e.getMessage());
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
            return CubeResponse.success(deletedCount);
        } catch (Exception e) {
            LOG.error("Error batch deleting users", e);
            return CubeResponse.failed(e.getMessage());
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
            return CubeResponse.failed(e.getMessage());
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
            return CubeResponse.failed(e.getMessage());
        }
    }
}
