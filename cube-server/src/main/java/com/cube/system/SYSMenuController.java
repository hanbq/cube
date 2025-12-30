package com.cube.system;

import com.cube.common.entity.CubeResponse;
import com.cube.gateway.annotation.SysLog;
import com.cube.gateway.entity.UserPrincipal;
import com.cube.system.entity.SYSMenu;
import com.cube.system.service.SYSMenuService;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 菜单Controller
 * 处理菜单的增删改查请求
 *
 * @author cube
 * @since 2025-12-25
 */
@RestController
@RequestMapping("/api/menus")
public class SYSMenuController {

    private static final Logger LOG = LoggerFactory.getLogger(SYSMenuController.class);

    @Resource
    private SYSMenuService menuService;

    /**
     * 创建菜单
     *
     * @param menu 菜单对象
     * @return 创建后的菜单ID
     */
    @PostMapping
    @SysLog(value = "创建菜单", operation = "CREATE_MENU", saveRequestData = true)
    public CubeResponse<Long> createMenu(@RequestBody SYSMenu menu) {
        LOG.info("Received menu: {}", menu.getMenuName());
        try {
            // 设置 children 为 null，确保不处理子菜单
            menu.setChildren(null);
            LOG.info("Calling menuService.createMenu...");
            Long menuId = menuService.createMenu(menu);
            LOG.info("Menu created successfully with ID: {}", menuId);
            return CubeResponse.success(menuId, "Menu created successfully");
        } catch (Exception e) {
            LOG.error("Error creating menu", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 更新菜单
     *
     * @param id   菜单ID
     * @param menu 菜单对象
     * @return 更新结果
     */
    @PutMapping("/{id}")
    @SysLog(value = "更新菜单", operation = "UPDATE_MENU", saveRequestData = true)
    public CubeResponse<Boolean> updateMenu(@PathVariable Long id, @RequestBody SYSMenu menu) {
        try {
            // 设置菜单ID
            menu.setMenuId(id);
            // 设置 children 为 null，确保不处理子菜单
            menu.setChildren(null);
            boolean success = menuService.updateMenu(menu);
            if (success) {
                return CubeResponse.success(true, "Menu updated successfully");
            } else {
                return CubeResponse.failed("Menu not found or update failed");
            }
        } catch (Exception e) {
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 删除菜单（软删除）
     *
     * @param id 菜单ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    @SysLog(value = "删除菜单", operation = "DELETE_MENU")
    public CubeResponse<Boolean> deleteMenu(@PathVariable Long id) {
        try {
            boolean success = menuService.deleteMenu(id);
            if (success) {
                return CubeResponse.success(true, "Menu deleted successfully");
            } else {
                return CubeResponse.failed("Menu not found or delete failed");
            }
        } catch (Exception e) {
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 查询菜单树（包含子菜单）
     * 根据当前登录用户的权限返回菜单树
     *
     * @return 用户有权限的菜单树
     */
    @GetMapping("/tree")
    public CubeResponse<List<SYSMenu>> getMenuTree() {
        try {
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            // 获取当前用户ID
            assert authentication != null;
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            assert principal != null;
            Long userId = principal.userId();

            // 根据用户权限构建菜单树
            List<SYSMenu> menuTree = menuService.buildMenuTreeByUserId(userId);
            return CubeResponse.success(menuTree);
        } catch (Exception e) {
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 根据角色ID查询所有菜单并标记是否被选中
     *
     * @param roleId 角色ID
     * @return 所有菜单列表，每个菜单包含isSelected标记
     */
    @GetMapping("/role/{roleId}/with-selection")
    public CubeResponse<List<SYSMenu>> getAllMenusWithSelection(@PathVariable Long roleId) {
        try {
            List<SYSMenu> menus = menuService.getAllMenusWithSelectedFlag(roleId);
            return CubeResponse.success(menus, "All menus with selection status retrieved successfully");
        } catch (Exception e) {
            return CubeResponse.failed(e.getMessage());
        }
    }

}