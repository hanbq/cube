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
     * 批量插入用户角色关联
     *
     * @param userRoles 用户角色关联列表
     * @return 插入的数量
     */
    public int batchInsertUserRoles(List<SYSUserRole> userRoles) {
        return userRoleDao.batchInsert(userRoles);
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
