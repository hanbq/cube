package com.cube.system;

import com.cube.common.entity.CubeResponse;
import com.cube.common.page.PageResult;
import com.cube.gateway.annotation.SysLog;
import com.cube.system.entity.SYSRole;
import com.cube.system.param.SYSRoleParam;
import com.cube.system.service.SYSRoleService;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 角色Controller
 * 处理角色的增删改查请求
 *
 * @author cube
 * @since 2025-12-26
 */
@RestController
@RequestMapping("/api/roles")
public class SYSRoleController {

    private static final Logger LOG = LoggerFactory.getLogger(SYSRoleController.class);

    @Resource
    private SYSRoleService roleService;

    /**
     * 创建角色
     *
     * @param role 角色对象
     * @return 创建结果
     */
    @PostMapping
    @SysLog(value = "创建角色", operation = "CREATE_ROLE", saveRequestData = true)
    public CubeResponse<Boolean> createRole(@RequestBody SYSRole role) {
        LOG.info("Creating role: {}", role.getRoleName());
        try {
            roleService.createRole(role);
            LOG.info("Role created successfully: {}", role.getRoleName());
            return CubeResponse.success(true, "Role created successfully");
        } catch (Exception e) {
            LOG.error("Error updating role", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 更新角色
     *
     * @param id   角色ID
     * @param role 角色对象
     * @return 更新结果
     */
    @PutMapping("/{id}")
    @SysLog(value = "更新角色", operation = "UPDATE_ROLE", saveRequestData = true)
    public CubeResponse<Boolean> updateRole(@PathVariable Long id, @RequestBody SYSRole role) {
        LOG.info("Updating role with ID: {}", id);
        try {
            role.setRoleId(id);
            boolean success = roleService.updateRole(role);
            if (success) {
                LOG.info("Role updated successfully");
                return CubeResponse.success(true, "Role updated successfully");
            } else {
                LOG.warn("Role not found or update failed");
                return CubeResponse.failed("Role not found or update failed");
            }
        } catch (Exception e) {
            LOG.error("Error updating role", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 删除角色
     *
     * @param id 角色ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    @SysLog(value = "删除角色", operation = "DELETE_ROLE")
    public CubeResponse<Boolean> deleteRole(@PathVariable Long id) {
        LOG.info("Deleting role with ID: {}", id);
        try {
            boolean success = roleService.deleteRole(id);
            if (success) {
                LOG.info("Role deleted successfully");
                return CubeResponse.success(true, "Role deleted successfully");
            } else {
                LOG.warn("Role not found or delete failed");
                return CubeResponse.failed("Role not found or delete failed");
            }
        } catch (Exception e) {
            LOG.error("Error deleting role", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 批量删除角色
     *
     * @param roleIds 角色ID列表
     * @return 删除结果
     */
    @DeleteMapping("/batch")
    @SysLog(value = "批量删除角色", operation = "BATCH_DELETE_ROLES", saveRequestData = true)
    public CubeResponse<Integer> deleteRoles(@RequestBody List<Long> roleIds) {
        LOG.info("Batch deleting {} roles", roleIds.size());
        try {
            int deletedCount = roleService.deleteRoles(roleIds);
            LOG.info("{} roles deleted successfully", deletedCount);
            return CubeResponse.success(deletedCount, deletedCount + " roles deleted successfully");
        } catch (Exception e) {
            LOG.error("Error batch deleting roles", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 查询所有角色
     *
     * @return 角色列表
     */
    @GetMapping
    public CubeResponse<List<SYSRole>> getAllRoles() {
        LOG.info("Getting all roles");
        try {
            List<SYSRole> roles = roleService.getAllRoles();
            LOG.info("Retrieved {} roles", roles.size());
            return CubeResponse.success(roles, "Roles retrieved successfully");
        } catch (Exception e) {
            LOG.error("Error getting all roles", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 根据参数查询角色列表（分页）
     * 如果参数属性为空，则不作为查询条件
     * 角色名称忽略大小写并支持模糊查询
     *
     * @param param 查询参数（包含分页参数pageNum和pageSize）
     * @return 分页结果
     */
    @PostMapping("/search")
    public CubeResponse<PageResult<SYSRole>> searchRoles(@RequestBody(required = false) SYSRoleParam param) {
        LOG.info("Searching roles with param: {}", param);
        try {
            PageResult<SYSRole> result = roleService.getRolesByParamWithPage(param);
            LOG.info("Found {} roles in total, current page has {} roles",
                    result.getTotal(), result.getRecords().size());
            return CubeResponse.success(result, "Roles found successfully");
        } catch (Exception e) {
            LOG.error("Error searching roles", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

}