package com.cube.api.controller.system;

import com.cube.common.entity.CubeResponse;
import com.cube.api.annotation.SysLog;
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
     * 批量保存角色的菜单关联
     * 先物理删除该角色的所有菜单关联，再批量插入新的关联
     *
     * @param roleId 角色ID
     * @param menuRoles 新的菜单角色关联列表
     * @return 插入的数量
     */
    @PostMapping("/role/{roleId}/batch-save")
    @SysLog(value = "批量保存角色的菜单关联", operation = "BATCH_SAVE_MENU_ROLES", saveRequestData = true)
    public CubeResponse<Integer> batchSaveMenuRolesByRoleId(
            @PathVariable Long roleId,
            @RequestBody List<SYSMenuRole> menuRoles) {
        LOG.info("Batch saving {} menu-role associations for role ID: {}",
                menuRoles != null ? menuRoles.size() : 0, roleId);
        try {
            int savedCount = menuRoleService.batchSaveMenuRolesByRoleId(roleId, menuRoles);
            LOG.info("{} menu-role associations saved successfully for role ID: {}", savedCount, roleId);
            return CubeResponse.success(savedCount);
        } catch (Exception e) {
            LOG.error("Error batch saving menu-role associations for role ID: {}", roleId, e);
            return CubeResponse.failed(e.getMessage());
        }
    }
}