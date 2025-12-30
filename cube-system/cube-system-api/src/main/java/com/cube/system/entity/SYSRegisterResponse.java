package com.cube.system.entity;

/**
 * 注册响应DTO
 *
 * @author cube
 * @since 2025-12-24
 */
public class SYSRegisterResponse {

    /**
     * 注册是否成功
     */
    private boolean success;

    /**
     * 响应消息
     */
    private String message;

    /**
     * 用户ID（注册成功时返回）
     */
    private Long userId;

    /**
     * 用户名（注册成功时返回）
     */
    private String username;

    public SYSRegisterResponse() {
    }

    public SYSRegisterResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public SYSRegisterResponse(boolean success, String message, Long userId, String username) {
        this.success = success;
        this.message = message;
        this.userId = userId;
        this.username = username;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

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
}