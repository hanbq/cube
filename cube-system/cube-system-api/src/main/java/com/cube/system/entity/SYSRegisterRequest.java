package com.cube.system.entity;

import com.cube.common.annotation.SensitiveField;
import com.cube.common.utils.SensitiveDataMasker.SensitiveType;

/**
 * 注册请求DTO
 *
 * @author cube
 * @since 2025-12-24
 */
public class SYSRegisterRequest {

    /**
     * 用户名
     */
    private String username;

    /**
     * 密码
     */
    @SensitiveField(SensitiveType.PASSWORD)
    private String password;

    /**
     * 确认密码
     */
    @SensitiveField(SensitiveType.PASSWORD)
    private String confirmPassword;

    /**
     * 邮箱
     */
    @SensitiveField(SensitiveType.EMAIL)
    private String email;

    /**
     * 描述
     */
    private String description;

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

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}