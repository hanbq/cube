package com.cube.system.service;

import com.cube.common.exception.DataException;
import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;
import com.cube.system.bean.SYSUser;
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

    public SYSUserService(SYSUserDao userDao) {
        this.userDao = userDao;
    }

    /**
     * 创建用户
     *
     * @param user 用户对象
     * @return 创建后的用户ID
     */
    public Long createUser(SYSUser user) {
        // 验证用户名是否已存在
        if (user.getUserName() != null && userDao.findByUserName(user.getUserName()).isPresent()) {
            throw new DataException("Username already exists: " + user.getUserName());
        }

        // 验证邮箱是否已存在
        if (user.getEmail() != null && userDao.findByEmail(user.getEmail()).isPresent()) {
            throw new DataException("Email already exists: " + user.getEmail());
        }

        return userDao.insert(user);
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
     * 根据邮箱查询用户
     *
     * @param email 邮箱
     * @return 用户对象
     */
    @Transactional(readOnly = true)
    public Optional<SYSUser> getUserByEmail(String email) {
        return userDao.findByEmail(email);
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
     * 根据状态查询用户列表
     *
     * @param status 状态
     * @return 用户列表
     */
    @Transactional(readOnly = true)
    public List<SYSUser> getUsersByStatus(String status) {
        return userDao.findByStatus(status);
    }

    /**
     * 分页查询用户
     *
     * @param pageRequest 分页请求
     * @return 分页结果
     */
    @Transactional(readOnly = true)
    public PageResult<SYSUser> getUserPage(PageRequest pageRequest) {
        return userDao.findPage(pageRequest);
    }

    /**
     * 更新用户状态
     *
     * @param userId 用户ID
     * @param status 新状态
     * @return 是否更新成功
     */
    public boolean updateUserStatus(Long userId, String status) {
        return userDao.updateStatus(userId, status) > 0;
    }

    /**
     * 更新用户密码
     *
     * @param userId 用户ID
     * @param newPassword 新密码
     * @return 是否更新成功
     */
    public boolean updateUserPassword(Long userId, String newPassword) {
        return userDao.updatePassword(userId, newPassword) > 0;
    }

    /**
     * 统计用户数量
     *
     * @return 用户总数
     */
    @Transactional(readOnly = true)
    public long countUsers() {
        return userDao.count();
    }
}