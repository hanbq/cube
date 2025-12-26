package com.cube.system.service;

import com.cube.system.dao.SYSUserRoleDao;
import com.cube.system.entity.SYSUserRole;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 用户角色关联Service
 *
 * @author cube
 * @since 2025-12-26
 */
@Service
@Transactional
public class SYSUserRoleService {

    private final SYSUserRoleDao userRoleDao;

    public SYSUserRoleService(SYSUserRoleDao userRoleDao) {
        this.userRoleDao = userRoleDao;
    }

    /**
     * 查询所有用户角色关联
     *
     * @return 用户角色关联列表
     */
    @Transactional(readOnly = true)
    public List<SYSUserRole> getAllUserRoles() {
        return userRoleDao.findAll();
    }

    /**
     * 根据用户ID查询角色关联
     *
     * @param userId 用户ID
     * @return 用户角色关联列表
     */
    @Transactional(readOnly = true)
    public List<SYSUserRole> getUserRolesByUserId(Long userId) {
        return userRoleDao.findByUserId(userId);
    }

    /**
     * 根据角色ID查询用户关联
     *
     * @param roleId 角色ID
     * @return 用户角色关联列表
     */
    @Transactional(readOnly = true)
    public List<SYSUserRole> getUserRolesByRoleId(Long roleId) {
        return userRoleDao.findByRoleId(roleId);
    }

    /**
     * 批量插入用户角色关联
     *
     * @param userRoles 用户角色关联列表
     * @return 插入的数量
     */
    public int batchInsertUserRoles(List<SYSUserRole> userRoles) {
        return userRoleDao.batchInsert(userRoles);
    }

    /**
     * 批量物理删除用户角色关联
     *
     * @param ids ID列表
     * @return 删除的数量
     */
    public int batchDeleteUserRoles(List<Long> ids) {
        return userRoleDao.physicalDeleteByIds(ids);
    }

    /**
     * 为用户分配角色
     *
     * @param userId 用户ID
     * @param roleId 角色ID
     * @return 插入后的主键ID
     */
    public Long assignRoleToUser(Long userId, Long roleId) {
        return userRoleDao.insert(userId, roleId);
    }

    /**
     * 移除用户的角色
     *
     * @param userId 用户ID
     * @param roleId 角色ID
     * @return 是否删除成功
     */
    public boolean removeRoleFromUser(Long userId, Long roleId) {
        return userRoleDao.physicalDeleteByUserIdAndRoleId(userId, roleId) > 0;
    }
}
