package com.cube.system.entity;

import com.cube.api.entity.BaseEntity;
import com.cube.common.annotation.SensitiveField;
import com.cube.common.utils.SensitiveDataMasker.SensitiveType;

import java.util.List;


public class SYSUser extends BaseEntity {
    Long userId;
    String username;

    @SensitiveField(SensitiveType.PASSWORD)
    String password;

    String description;

    @SensitiveField(SensitiveType.EMAIL)
    String email;

    String status;
    Boolean isSuperAdmin;
    List<SYSRole> roles;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public List<SYSRole> getRoles() {
        return roles;
    }

    public void setRoles(List<SYSRole> roles) {
        this.roles = roles;
    }


}