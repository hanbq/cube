package com.cube.system.service;

import com.cube.common.exception.DataException;
import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;
import com.cube.system.dao.SYSUserRoleDao;
import com.cube.system.entity.SYSChangePassword;
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
     * 更新用户个人信息（不允许修改用户名和密码）
     *
     * @param user 用户对象
     * @return 是否更新成功
     */
    public boolean updateProfile(SYSUser user) {
        // 从数据库中获取当前用户信息
        Optional<SYSUser> existingUserOptional = userDao.findById(user.getUserId());
        if (existingUserOptional.isEmpty()) {
            throw new DataException("User not found with ID: " + user.getUserId());
        }
        SYSUser existingUser = existingUserOptional.get();

        // 不允许修改用户名
        user.setUsername(existingUser.getUsername());
        // 不允许修改密码
        user.setPassword(existingUser.getPassword());

        return userDao.update(user) > 0;
    }

    /**
     * 修改密码
     *
     * @param userId      用户ID
     * @param params 旧密码、 新密码
     * @return 是否修改成功
     */
    public boolean changePassword(Long userId, SYSChangePassword params) {
        // 验证新密码和确认密码是否一致
        if (!params.getNewPassword().equals(params.getConfirmNewPassword())) {
            throw new DataException("The new password and confirm password do not match");
        }

        // 从数据库中获取当前用户信息
        Optional<SYSUser> existingUserOptional = userDao.findById(userId);
        if (existingUserOptional.isEmpty()) {
            throw new DataException("User not found with ID: " + userId);
        }
        SYSUser existingUser = existingUserOptional.get();

        // 验证旧密码
        if (!existingUser.getPassword().equals(params.getOldPassword())) {
            throw new DataException("Incorrect old password");
        }

        // 更新密码
        existingUser.setPassword(params.getNewPassword());
        return userDao.update(existingUser) > 0;
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