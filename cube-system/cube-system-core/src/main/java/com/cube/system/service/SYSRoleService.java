package com.cube.system.service;

import com.cube.common.exception.DataException;
import com.cube.system.entity.SYSRole;
import com.cube.system.dao.SYSRoleDao;
import com.cube.system.dao.SYSUserRoleDao;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 角色Service
 *
 * @author cube
 * @since 2025-12-24
 */
@Service
@Transactional
public class SYSRoleService {

    private final SYSRoleDao roleDao;
    private final SYSUserRoleDao userRoleDao;

    public SYSRoleService(SYSRoleDao roleDao, SYSUserRoleDao userRoleDao) {
        this.roleDao = roleDao;
        this.userRoleDao = userRoleDao;
    }

    /**
     * 创建角色
     *
     * @param role 角色对象
     * @return 创建后的角色ID
     */
    public Long createRole(SYSRole role) {
        // 验证角色名是否已存在
        if (role.getRoleName() != null && roleDao.findByRoleName(role.getRoleName()).isPresent()) {
            throw new DataException("Role name already exists: " + role.getRoleName());
        }
        return roleDao.insert(role);
    }

    /**
     * 更新角色
     *
     * @param role 角色对象
     * @return 是否更新成功
     */
    public boolean updateRole(SYSRole role) {
        return roleDao.update(role) > 0;
    }

    /**
     * 删除角色
     *
     * @param roleId 角色ID
     * @return 是否删除成功
     */
    public boolean deleteRole(Long roleId) {
        return roleDao.deleteById(roleId) > 0;
    }

    /**
     * 根据ID查询角色
     *
     * @param roleId 角色ID
     * @return 角色对象
     */
    @Transactional(readOnly = true)
    public Optional<SYSRole> getRoleById(Long roleId) {
        return roleDao.findById(roleId);
    }

    /**
     * 根据角色名查询角色
     *
     * @param roleName 角色名
     * @return 角色对象
     */
    @Transactional(readOnly = true)
    public Optional<SYSRole> getRoleByName(String roleName) {
        return roleDao.findByRoleName(roleName);
    }

    /**
     * 查询所有角色
     *
     * @return 角色列表
     */
    @Transactional(readOnly = true)
    public List<SYSRole> getAllRoles() {
        return roleDao.findAll();
    }

    /**
     * 根据用户ID查询角色列表
     *
     * @param userId 用户ID
     * @return 角色列表
     */
    @Transactional(readOnly = true)
    public List<SYSRole> getRolesByUserId(Long userId) {
        return roleDao.findByUserId(userId);
    }

    /**
     * 统计角色数量
     *
     * @return 角色总数
     */
    @Transactional(readOnly = true)
    public long countRoles() {
        return roleDao.count();
    }

    /**
     * 为用户分配角色
     *
     * @param userId 用户ID
     * @param roleId 角色ID
     * @return 是否分配成功
     */
    public boolean assignRoleToUser(Long userId, Long roleId) {
        return userRoleDao.insert(userId, roleId) != null;
    }

    /**
     * 移除用户的角色
     *
     * @param userId 用户ID
     * @param roleId 角色ID
     * @return 是否移除成功
     */
    public boolean removeRoleFromUser(Long userId, Long roleId) {
        return userRoleDao.deleteByUserIdAndRoleId(userId, roleId) > 0;
    }
}