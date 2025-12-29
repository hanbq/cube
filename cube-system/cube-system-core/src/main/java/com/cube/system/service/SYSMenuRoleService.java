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
     * 查询所有菜单角色关联
     *
     * @return 菜单角色关联列表
     */
    @Transactional(readOnly = true)
    public List<SYSMenuRole> getAllMenuRoles() {
        return menuRoleDao.findAll();
    }

    /**
     * 根据菜单ID查询角色关联
     *
     * @param menuId 菜单ID
     * @return 菜单角色关联列表
     */
    @Transactional(readOnly = true)
    public List<SYSMenuRole> getMenuRolesByMenuId(Long menuId) {
        return menuRoleDao.findByMenuId(menuId);
    }

    /**
     * 根据角色ID查询菜单关联
     *
     * @param roleId 角色ID
     * @return 菜单角色关联列表
     */
    @Transactional(readOnly = true)
    public List<SYSMenuRole> getMenuRolesByRoleId(Long roleId) {
        return menuRoleDao.findByRoleId(roleId);
    }

    /**
     * 批量插入菜单角色关联
     *
     * @param menuRoles 菜单角色关联列表
     * @return 插入的数量
     */
    public int batchInsertMenuRoles(List<SYSMenuRole> menuRoles) {
        return menuRoleDao.batchInsert(menuRoles);
    }

    /**
     * 批量物理删除菜单角色关联
     *
     * @param ids ID列表
     * @return 删除的数量
     */
    public int batchDeleteMenuRoles(List<Long> ids) {
        return menuRoleDao.physicalDeleteByIds(ids);
    }

    /**
     * 为角色分配菜单
     *
     * @param menuId 菜单ID
     * @param roleId 角色ID
     * @return 插入后的主键ID
     */
    public Long assignMenuToRole(Long menuId, Long roleId) {
        return menuRoleDao.insert(menuId, roleId);
    }

    /**
     * 移除角色的菜单
     *
     * @param menuId 菜单ID
     * @param roleId 角色ID
     * @return 是否删除成功
     */
    public boolean removeMenuFromRole(Long menuId, Long roleId) {
        return menuRoleDao.physicalDeleteByMenuIdAndRoleId(menuId, roleId) > 0;
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
