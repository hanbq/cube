package com.cube.system.service;

import com.cube.common.exception.DataException;
import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;
import com.cube.system.entity.SYSRole;
import com.cube.system.param.SYSRoleParam;
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
     */
    public void createRole(SYSRole role) {
        // 验证角色名是否已存在
        if (role.getRoleName() != null && roleDao.findByRoleName(role.getRoleName()).isPresent()) {
            throw new DataException("Role name already exists: " + role.getRoleName());
        }
        roleDao.insert(role);
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
     * 删除角色（软删除）
     *
     * @param roleId 角色ID
     * @return 是否删除成功
     */
    public boolean deleteRole(Long roleId) {
        return roleDao.softDeleteById(roleId) > 0;
    }

    /**
     * 批量删除角色（软删除）
     *
     * @param roleIds 角色ID列表
     * @return 删除的数量
     */
    public int deleteRoles(List<Long> roleIds) {
        return roleDao.deleteByIds(roleIds);
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
     * 根据角色名查询角色（忽略大小写）
     *
     * @param roleName 角色名
     * @return 角色对象
     */
    @Transactional(readOnly = true)
    public Optional<SYSRole> getRoleByNameIgnoreCase(String roleName) {
        return roleDao.findByRoleNameIgnoreCase(roleName);
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

    /**
     * 根据参数动态查询角色列表
     * 如果参数属性为空，则不作为查询条件
     * 角色名称忽略大小写查询
     *
     * @param param 查询参数
     * @return 角色列表
     */
    @Transactional(readOnly = true)
    public List<SYSRole> getRolesByParam(SYSRoleParam param) {
        return roleDao.findByParam(param);
    }

    /**
     * 根据参数动态查询角色列表（分页）
     * 如果参数属性为空，则不作为查询条件
     * 角色名称忽略大小写查询
     *
     * @param param 查询参数（包含分页参数）
     * @return 分页结果
     */
    @Transactional(readOnly = true)
    public PageResult<SYSRole> getRolesByParamWithPage(SYSRoleParam param) {
        // 从param中提取分页参数，如果没有则使用默认值
        Integer pageNumObj = (param != null) ? param.getPageNum() : null;
        Integer pageSizeObj = (param != null) ? param.getPageSize() : null;

        int pageNum = (pageNumObj != null) ? pageNumObj : 1;
        int pageSize = (pageSizeObj != null) ? pageSizeObj : 10;

        PageRequest pageRequest = new PageRequest(pageNum, pageSize);
        return roleDao.findByParamWithPage(param, pageRequest);
    }
}