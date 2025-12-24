package com.cube.system.entity;

import com.cube.bean.BaseBean;

import java.util.List;


public class SYSUser extends BaseBean {
    Long userId;
    String userName;
    String password;
    String description;
    String email;
    String status;
    List<SYSRole> roles;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
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

    public List<SYSRole> getRoles() {
        return roles;
    }

    public void setRoles(List<SYSRole> roles) {
        this.roles = roles;
    }


}