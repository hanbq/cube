package com.cube.system.controller;

import com.cube.common.entity.CubeResponse;
import com.cube.system.entity.SYSMenu;
import com.cube.system.service.SYSMenuService;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private final static Logger LOG = LoggerFactory.getLogger(SYSMenuController.class);

    @Resource
    private SYSMenuService menuService;

    /**
     * 创建菜单
     *
     * @param menu 菜单对象
     * @return 创建后的菜单ID
     */
    @PostMapping
    public CubeResponse<Long> createMenu(@RequestBody SYSMenu menu) {
        LOG.info("=== createMenu called ===");
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
     * 根据ID查询菜单
     *
     * @param id 菜单ID
     * @return 菜单对象
     */
    @GetMapping("/{id}")
    public CubeResponse<SYSMenu> getMenuById(@PathVariable Long id) {
        try {
            return menuService.getMenuById(id)
                    .map(menu -> CubeResponse.success(menu, "Menu found"))
                    .orElse(CubeResponse.failed("Menu not found"));
        } catch (Exception e) {
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 查询所有菜单（不包含树形结构）
     *
     * @return 菜单列表
     */
    @GetMapping
    public CubeResponse<List<SYSMenu>> getAllMenus() {
        try {
            List<SYSMenu> menus = menuService.getAllMenus();
            return CubeResponse.success(menus, "Menus retrieved successfully");
        } catch (Exception e) {
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 查询菜单树（包含子菜单）
     *
     * @return 菜单树
     */
    @GetMapping("/tree")
    public CubeResponse<List<SYSMenu>> getMenuTree() {
        try {
            List<SYSMenu> menuTree = menuService.buildMenuTree();
            return CubeResponse.success(menuTree, "Menu tree retrieved successfully");
        } catch (Exception e) {
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 根据父菜单ID查询子菜单列表
     *
     * @param parentId 父菜单ID
     * @return 子菜单列表
     */
    @GetMapping("/parent/{parentId}")
    public CubeResponse<List<SYSMenu>> getMenusByParentId(@PathVariable Long parentId) {
        try {
            List<SYSMenu> menus = menuService.getMenusByParentId(parentId);
            return CubeResponse.success(menus, "Child menus retrieved successfully");
        } catch (Exception e) {
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 查询根菜单列表（parent_id为NULL）
     *
     * @return 根菜单列表
     */
    @GetMapping("/root")
    public CubeResponse<List<SYSMenu>> getRootMenus() {
        try {
            List<SYSMenu> menus = menuService.getRootMenus();
            return CubeResponse.success(menus, "Root menus retrieved successfully");
        } catch (Exception e) {
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 根据角色ID查询菜单列表
     *
     * @param roleId 角色ID
     * @return 菜单列表
     */
    @GetMapping("/role/{roleId}")
    public CubeResponse<List<SYSMenu>> getMenusByRoleId(@PathVariable Long roleId) {
        try {
            List<SYSMenu> menus = menuService.getMenusByRoleId(roleId);
            return CubeResponse.success(menus, "Menus for role retrieved successfully");
        } catch (Exception e) {
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 统计菜单数量
     *
     * @return 菜单总数
     */
    @GetMapping("/count")
    public CubeResponse<Long> countMenus() {
        try {
            long count = menuService.countMenus();
            return CubeResponse.success(count, "Menu count retrieved successfully");
        } catch (Exception e) {
            return CubeResponse.failed(e.getMessage());
        }
    }
}