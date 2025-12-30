package com.cube.system.service;

import com.cube.system.dao.SYSMenuRoleDao;
import com.cube.system.entity.SYSMenuRole;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 菜单角色关联Service
 *
 * @author cube
 * @since 2025-12-26
 */
@Service
@Transactional
public class SYSMenuRoleService {

    private final SYSMenuRoleDao menuRoleDao;

    public SYSMenuRoleService(SYSMenuRoleDao menuRoleDao) {
        this.menuRoleDao = menuRoleDao;
    }

    /**
     * 批量保存角色的菜单关联
     * 先删除该角色的所有菜单关联（物理删除），再批量插入新的关联
     *
     * @param roleId 角色ID
     * @param menuRoles 新的菜单角色关联列表
     * @return 插入的数量
     */
    public int batchSaveMenuRolesByRoleId(Long roleId, List<SYSMenuRole> menuRoles) {
        // 1. 先物理删除该角色的所有菜单关联
        menuRoleDao.physicalDeleteByRoleId(roleId);

        // 2. 如果新的菜单列表为空，则直接返回0
        if (menuRoles == null || menuRoles.isEmpty()) {
            return 0;
        }

        // 3. 批量插入新的菜单关联
        return menuRoleDao.batchInsert(menuRoles);
    }
}
