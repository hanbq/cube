package com.cube.system.service;

import com.cube.common.exception.DataException;
import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;
import com.cube.system.entity.SYSRole;
import com.cube.system.param.SYSRoleParam;
import com.cube.system.dao.SYSRoleDao;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    public SYSRoleService(SYSRoleDao roleDao) {
        this.roleDao = roleDao;
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
     * 查询所有角色
     *
     * @return 角色列表
     */
    @Transactional(readOnly = true)
    public List<SYSRole> getAllRoles() {
        return roleDao.findAll();
    }

    /**
     * 根据用户ID查询角色列表（通过JOIN查询，性能优化）
     *
     * @param userId 用户ID
     * @return 角色列表
     */
    @Transactional(readOnly = true)
    public List<SYSRole> getRolesByUserId(Long userId) {
        return roleDao.findByUserId(userId);
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