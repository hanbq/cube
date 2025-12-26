package com.cube.system.controller;

import com.cube.common.entity.CubeResponse;
import com.cube.system.entity.SYSMenuRole;
import com.cube.system.service.SYSMenuRoleService;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 菜单角色关联Controller
 * 处理菜单角色关联的查询、批量插入、批量删除请求
 *
 * @author cube
 * @since 2025-12-26
 */
@RestController
@RequestMapping("/api/menu-roles")
public class SYSMenuRoleController {

    private static final Logger LOG = LoggerFactory.getLogger(SYSMenuRoleController.class);

    @Resource
    private SYSMenuRoleService menuRoleService;

    /**
     * 查询所有菜单角色关联
     *
     * @return 菜单角色关联列表
     */
    @GetMapping
    public CubeResponse<List<SYSMenuRole>> getAllMenuRoles() {
        LOG.info("Getting all menu-role associations");
        try {
            List<SYSMenuRole> menuRoles = menuRoleService.getAllMenuRoles();
            LOG.info("Retrieved {} menu-role associations", menuRoles.size());
            return CubeResponse.success(menuRoles, "Menu-role associations retrieved successfully");
        } catch (Exception e) {
            LOG.error("Error getting all menu-role associations", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to get menu-role associations: " + errorMsg);
        }
    }

    /**
     * 根据菜单ID查询角色关联
     *
     * @param menuId 菜单ID
     * @return 菜单角色关联列表
     */
    @GetMapping("/menu/{menuId}")
    public CubeResponse<List<SYSMenuRole>> getMenuRolesByMenuId(@PathVariable Long menuId) {
        LOG.info("Getting menu-role associations for menu ID: {}", menuId);
        try {
            List<SYSMenuRole> menuRoles = menuRoleService.getMenuRolesByMenuId(menuId);
            LOG.info("Retrieved {} menu-role associations for menu", menuRoles.size());
            return CubeResponse.success(menuRoles, "Menu-role associations retrieved successfully");
        } catch (Exception e) {
            LOG.error("Error getting menu-role associations by menu ID", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to get menu-role associations: " + errorMsg);
        }
    }

    /**
     * 根据角色ID查询菜单关联
     *
     * @param roleId 角色ID
     * @return 菜单角色关联列表
     */
    @GetMapping("/role/{roleId}")
    public CubeResponse<List<SYSMenuRole>> getMenuRolesByRoleId(@PathVariable Long roleId) {
        LOG.info("Getting menu-role associations for role ID: {}", roleId);
        try {
            List<SYSMenuRole> menuRoles = menuRoleService.getMenuRolesByRoleId(roleId);
            LOG.info("Retrieved {} menu-role associations for role", menuRoles.size());
            return CubeResponse.success(menuRoles, "Menu-role associations retrieved successfully");
        } catch (Exception e) {
            LOG.error("Error getting menu-role associations by role ID", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to get menu-role associations: " + errorMsg);
        }
    }

    /**
     * 批量插入菜单角色关联
     *
     * @param menuRoles 菜单角色关联列表
     * @return 插入的数量
     */
    @PostMapping("/batch")
    public CubeResponse<Integer> batchInsertMenuRoles(@RequestBody List<SYSMenuRole> menuRoles) {
        LOG.info("Batch inserting {} menu-role associations", menuRoles.size());
        try {
            int insertedCount = menuRoleService.batchInsertMenuRoles(menuRoles);
            LOG.info("{} menu-role associations inserted successfully", insertedCount);
            return CubeResponse.success(insertedCount, insertedCount + " menu-role associations inserted successfully");
        } catch (Exception e) {
            LOG.error("Error batch inserting menu-role associations", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to insert menu-role associations: " + errorMsg);
        }
    }

    /**
     * 批量删除菜单角色关联（物理删除）
     *
     * @param ids ID列表
     * @return 删除的数量
     */
    @DeleteMapping("/batch")
    public CubeResponse<Integer> batchDeleteMenuRoles(@RequestBody List<Long> ids) {
        LOG.info("Batch deleting {} menu-role associations", ids.size());
        try {
            int deletedCount = menuRoleService.batchDeleteMenuRoles(ids);
            LOG.info("{} menu-role associations deleted successfully", deletedCount);
            return CubeResponse.success(deletedCount, deletedCount + " menu-role associations deleted successfully");
        } catch (Exception e) {
            LOG.error("Error batch deleting menu-role associations", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to delete menu-role associations: " + errorMsg);
        }
    }

    /**
     * 为角色分配菜单
     *
     * @param menuId 菜单ID
     * @param roleId 角色ID
     * @return 分配结果
     */
    @PostMapping("/assign")
    public CubeResponse<Long> assignMenuToRole(
            @RequestParam Long menuId,
            @RequestParam Long roleId) {
        LOG.info("Assigning menu {} to role {}", menuId, roleId);
        try {
            Long id = menuRoleService.assignMenuToRole(menuId, roleId);
            LOG.info("Menu assigned successfully, ID: {}", id);
            return CubeResponse.success(id, "Menu assigned successfully");
        } catch (Exception e) {
            LOG.error("Error assigning menu to role", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to assign menu: " + errorMsg);
        }
    }

    /**
     * 移除角色的菜单
     *
     * @param menuId 菜单ID
     * @param roleId 角色ID
     * @return 移除结果
     */
    @DeleteMapping("/remove")
    public CubeResponse<Boolean> removeMenuFromRole(
            @RequestParam Long menuId,
            @RequestParam Long roleId) {
        LOG.info("Removing menu {} from role {}", menuId, roleId);
        try {
            boolean success = menuRoleService.removeMenuFromRole(menuId, roleId);
            if (success) {
                LOG.info("Menu removed successfully");
                return CubeResponse.success(true, "Menu removed successfully");
            } else {
                LOG.warn("Failed to remove menu");
                return CubeResponse.failed("Failed to remove menu");
            }
        } catch (Exception e) {
            LOG.error("Error removing menu from role", e);
            String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            return CubeResponse.failed("Failed to remove menu: " + errorMsg);
        }
    }
}
