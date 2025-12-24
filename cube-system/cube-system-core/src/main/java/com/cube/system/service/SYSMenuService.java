package com.cube.system.service;

import com.cube.system.bean.SYSMenu;
import com.cube.system.dao.SYSMenuDao;
import com.cube.system.dao.SYSMenuRoleDao;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 菜单Service
 *
 * @author cube
 * @since 2025-12-24
 */
@Service
@Transactional
public class SYSMenuService {

    private final SYSMenuDao menuDao;
    private final SYSMenuRoleDao menuRoleDao;

    public SYSMenuService(SYSMenuDao menuDao, SYSMenuRoleDao menuRoleDao) {
        this.menuDao = menuDao;
        this.menuRoleDao = menuRoleDao;
    }

    /**
     * 创建菜单
     *
     * @param menu 菜单对象
     * @return 创建后的菜单ID
     */
    public Long createMenu(SYSMenu menu) {
        return menuDao.insert(menu);
    }

    /**
     * 更新菜单
     *
     * @param menu 菜单对象
     * @return 是否更新成功
     */
    public boolean updateMenu(SYSMenu menu) {
        return menuDao.update(menu) > 0;
    }

    /**
     * 删除菜单（软删除）
     *
     * @param menuId 菜单ID
     * @return 是否删除成功
     */
    public boolean deleteMenu(Long menuId) {
        return menuDao.softDeleteById(menuId) > 0;
    }

    /**
     * 根据ID查询菜单
     *
     * @param menuId 菜单ID
     * @return 菜单对象
     */
    @Transactional(readOnly = true)
    public Optional<SYSMenu> getMenuById(Long menuId) {
        return menuDao.findById(menuId);
    }

    /**
     * 查询所有菜单
     *
     * @return 菜单列表
     */
    @Transactional(readOnly = true)
    public List<SYSMenu> getAllMenus() {
        return menuDao.findAll();
    }

    /**
     * 根据父菜单ID查询子菜单列表
     *
     * @param parentId 父菜单ID
     * @return 子菜单列表
     */
    @Transactional(readOnly = true)
    public List<SYSMenu> getMenusByParentId(Long parentId) {
        return menuDao.findByParentId(parentId);
    }

    /**
     * 查询根菜单列表
     *
     * @return 根菜单列表
     */
    @Transactional(readOnly = true)
    public List<SYSMenu> getRootMenus() {
        return menuDao.findRootMenus();
    }

    /**
     * 根据角色ID查询菜单列表
     *
     * @param roleId 角色ID
     * @return 菜单列表
     */
    @Transactional(readOnly = true)
    public List<SYSMenu> getMenusByRoleId(Long roleId) {
        return menuDao.findByRoleId(roleId);
    }

    /**
     * 构建菜单树
     *
     * @return 菜单树
     */
    @Transactional(readOnly = true)
    public List<SYSMenu> buildMenuTree() {
        List<SYSMenu> rootMenus = menuDao.findRootMenus();
        for (SYSMenu rootMenu : rootMenus) {
            buildChildren(rootMenu);
        }
        return rootMenus;
    }

    /**
     * 递归构建子菜单
     *
     * @param parent 父菜单
     */
    private void buildChildren(SYSMenu parent) {
        List<SYSMenu> children = menuDao.findByParentId(parent.getMenuId());
        parent.setChildren(children);
        for (SYSMenu child : children) {
            buildChildren(child);
        }
    }

    /**
     * 统计菜单数量
     *
     * @return 菜单总数
     */
    @Transactional(readOnly = true)
    public long countMenus() {
        return menuDao.count();
    }

    /**
     * 为角色分配菜单
     *
     * @param menuId 菜单ID
     * @param roleId 角色ID
     * @return 是否分配成功
     */
    public boolean assignMenuToRole(Long menuId, Long roleId) {
        return menuRoleDao.insert(menuId, roleId) != null;
    }

    /**
     * 移除角色的菜单
     *
     * @param menuId 菜单ID
     * @param roleId 角色ID
     * @return 是否移除成功
     */
    public boolean removeMenuFromRole(Long menuId, Long roleId) {
        return menuRoleDao.deleteByMenuIdAndRoleId(menuId, roleId) > 0;
    }
}
