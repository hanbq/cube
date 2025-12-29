package com.cube.system.service;

import com.cube.system.entity.SYSMenu;
import com.cube.system.entity.SYSMenuRole;
import com.cube.system.entity.SYSUser;
import com.cube.system.dao.SYSMenuDao;
import com.cube.system.dao.SYSMenuRoleDao;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
    private final SYSUserService userService;

    public SYSMenuService(SYSMenuDao menuDao, SYSMenuRoleDao menuRoleDao, SYSUserService userService) {
        this.menuDao = menuDao;
        this.menuRoleDao = menuRoleDao;
        this.userService = userService;
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
     * 构建所有菜单树（私有方法，供内部调用）
     * 一次性查询所有菜单，在内存中构建树形结构，避免N+1查询问题
     *
     * @return 菜单树
     */
    private List<SYSMenu> buildAllMenuTree() {
        // 一次性查询所有菜单
        List<SYSMenu> allMenus = menuDao.findAll();

        // 在内存中构建树形结构
        return buildTreeFromList(allMenus);
    }

    /**
     * 从菜单列表中构建树形结构
     *
     * @param menuList 菜单列表
     * @return 菜单树（只包含根节点）
     */
    private List<SYSMenu> buildTreeFromList(List<SYSMenu> menuList) {
        // 使用Map加速查找，key是menuId，value是菜单对象
        java.util.Map<Long, SYSMenu> menuMap = new java.util.HashMap<>();
        for (SYSMenu menu : menuList) {
            menuMap.put(menu.getMenuId(), menu);
        }

        // 构建树形结构
        List<SYSMenu> rootMenus = new java.util.ArrayList<>();
        for (SYSMenu menu : menuList) {
            Long parentId = menu.getParentId();
            if (parentId == null) {
                // 根节点
                rootMenus.add(menu);
            } else {
                // 子节点，添加到父节点的children列表中
                SYSMenu parent = menuMap.get(parentId);
                if (parent != null) {
                    if (parent.getChildren() == null) {
                        parent.setChildren(new java.util.ArrayList<>());
                    }
                    parent.getChildren().add(menu);
                }
            }
        }

        return rootMenus;
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

    /**
     * 根据角色ID查询所有菜单并标记是否被选中
     *
     * @param roleId 角色ID
     * @return 所有菜单列表，每个菜单包含isSelected标记
     */
    @Transactional(readOnly = true)
    public List<SYSMenu> getAllMenusWithSelectedFlag(Long roleId) {
        // 查询所有菜单
        List<SYSMenu> allMenus = menuDao.findAll();

        // 查询该角色关联的所有菜单ID
        List<SYSMenuRole> menuRoles = menuRoleDao.findByRoleId(roleId);
        Set<Long> selectedMenuIds = menuRoles.stream()
                .map(SYSMenuRole::getMenuId)
                .collect(Collectors.toSet());

        // 为每个菜单设置isSelected标记
        for (SYSMenu menu : allMenus) {
            menu.setIsSelected(selectedMenuIds.contains(menu.getMenuId()));
        }

        return allMenus;
    }

    /**
     * 根据用户ID构建该用户有权限的菜单树
     * 如果用户是超级管理员，返回所有菜单；否则返回该用户有权限的菜单
     * 一次性查询所有数据，在内存中构建树形结构，避免N+1查询问题
     *
     * @param userId 用户ID
     * @return 用户有权限的菜单树
     */
    @Transactional(readOnly = true)
    public List<SYSMenu> buildMenuTreeByUserId(Long userId) {
        // 查询用户信息，判断是否是超级管理员
        Optional<SYSUser> userOptional = userService.getUserById(userId);

        // 如果用户是超级管理员，返回所有菜单树
        if (userOptional.isPresent() && Boolean.TRUE.equals(userOptional.get().getIsSuperAdmin())) {
            return buildAllMenuTree();
        }

        // 普通用户：一次性查询该用户有权限的所有菜单
        List<SYSMenu> userMenus = menuDao.findByUserId(userId);

        // 在内存中构建树形结构
        return buildTreeFromList(userMenus);
    }
}
