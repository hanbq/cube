package com.cube.system.param;

import com.cube.common.page.PageRequest;

/**
 * 角色查询参数
 *
 * @author cube
 * @since 2025-12-26
 */
public class SYSRoleParam extends PageRequest {

    Long roleId;
    String roleName;

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    @Override
    public String toString() {
        return "SYSRoleParam{" +
                "roleId=" + roleId +
                ", roleName='" + roleName + '\'' +
                '}';
    }
}
