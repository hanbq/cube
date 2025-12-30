package com.cube.system.service;

import com.cube.common.exception.DataException;
import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;
import com.cube.system.dao.SYSUserRoleDao;
import com.cube.system.entity.SYSUser;
import com.cube.system.param.SYSUserParam;
import com.cube.system.dao.SYSUserDao;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 用户Service
 *
 * @author cube
 * @since 2025-12-24
 */
@Service
@Transactional
public class SYSUserService {

    private final SYSUserDao userDao;
    private final SYSUserRoleDao userRoleDao;

    public SYSUserService(SYSUserDao userDao, SYSUserRoleDao userRoleDao) {
        this.userDao = userDao;
        this.userRoleDao = userRoleDao;
    }

    /**
     * 创建用户
     *
     * @param user 用户对象
     */
    public void createUser(SYSUser user) {
        // 验证用户名是否已存在
        if (user.getUsername() != null && userDao.findByUserName(user.getUsername()).isPresent()) {
            throw new DataException("Username already exists: " + user.getUsername());
        }

        // 验证邮箱是否已存在
        if (user.getEmail() != null && userDao.findByEmail(user.getEmail()).isPresent()) {
            throw new DataException("Email already exists: " + user.getEmail());
        }

        userDao.insert(user);
    }

    /**
     * 更新用户
     *
     * @param user 用户对象
     * @return 是否更新成功
     */
    public boolean updateUser(SYSUser user) {
        return userDao.update(user) > 0;
    }

    /**
     * 删除用户（软删除）
     *
     * @param userId 用户ID
     * @return 是否删除成功
     */
    public boolean deleteUser(Long userId) {
        userRoleDao.physicalDeleteByUserId(userId);
        return userDao.softDeleteById(userId) > 0;
    }

    /**
     * 根据ID查询用户
     *
     * @param userId 用户ID
     * @return 用户对象
     */
    @Transactional(readOnly = true)
    public Optional<SYSUser> getUserById(Long userId) {
        return userDao.findById(userId);
    }

    /**
     * 根据用户名查询用户
     *
     * @param userName 用户名
     * @return 用户对象
     */
    @Transactional(readOnly = true)
    public Optional<SYSUser> getUserByUserName(String userName) {
        return userDao.findByUserName(userName);
    }

    /**
     * 查询所有用户
     *
     * @return 用户列表
     */
    @Transactional(readOnly = true)
    public List<SYSUser> getAllUsers() {
        return userDao.findAll();
    }

    /**
     * 批量删除用户（软删除）
     *
     * @param userIds 用户ID列表
     * @return 删除的数量
     */
    public int deleteUsers(List<Long> userIds) {
        userRoleDao.physicalDeleteByUserIds(userIds);
        return userDao.deleteByIds(userIds);
    }

    /**
     * 根据参数动态查询用户列表（分页）
     * 如果参数属性为空，则不作为查询条件
     * 用户名忽略大小写查询
     *
     * @param param 查询参数（包含分页参数）
     * @return 分页结果
     */
    @Transactional(readOnly = true)
    public PageResult<SYSUser> getUsersByParamWithPage(SYSUserParam param) {
        // 从param中提取分页参数，如果没有则使用默认值
        Integer pageNumObj = (param != null) ? param.getPageNum() : null;
        Integer pageSizeObj = (param != null) ? param.getPageSize() : null;

        int pageNum = (pageNumObj != null) ? pageNumObj : 1;
        int pageSize = (pageSizeObj != null) ? pageSizeObj : 10;

        PageRequest pageRequest = new PageRequest(pageNum, pageSize);
        return userDao.findByParamWithPage(param, pageRequest);
    }

    /**
     * 根据角色ID查询用户列表
     *
     * @param roleId 角色ID
     * @return 用户列表
     */
    @Transactional(readOnly = true)
    public List<SYSUser> getUsersByRoleId(Long roleId) {
        return userDao.findByRoleId(roleId);
    }
}