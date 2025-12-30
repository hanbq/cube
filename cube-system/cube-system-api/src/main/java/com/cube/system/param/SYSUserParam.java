package com.cube.system.param;

import com.cube.common.page.PageRequest;

/**
 * 用户查询参数
 *
 * @author cube
 * @since 2025-12-26
 */
public class SYSUserParam extends PageRequest {

    private Long userId;
    private String username;
    private String status;
    private Boolean isSuperAdmin;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return username;
    }

    public void setUserName(String username) {
        this.username = username;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getIsSuperAdmin() {
        return isSuperAdmin;
    }

    public void setIsSuperAdmin(Boolean isSuperAdmin) {
        this.isSuperAdmin = isSuperAdmin;
    }

    @Override
    public String toString() {
        return "SYSUserParam{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", status='" + status + '\'' +
                ", isSuperAdmin=" + isSuperAdmin +
                ", pageNum=" + getPageNum() +
                ", pageSize=" + getPageSize() +
                '}';
    }
}
