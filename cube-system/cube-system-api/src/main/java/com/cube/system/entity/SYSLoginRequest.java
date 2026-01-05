package com.cube.system.entity;

import com.cube.common.annotation.SensitiveField;
import com.cube.common.utils.SensitiveDataMasker.SensitiveType;

/**
 * 登录请求DTO
 *
 * @author cube
 * @since 2025-12-24
 */
public class SYSLoginRequest {

    /**
     * 用户名
     */
    private String username;

    /**
     * 密码
     */
    @SensitiveField(SensitiveType.PASSWORD)
    private String password;

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
}
