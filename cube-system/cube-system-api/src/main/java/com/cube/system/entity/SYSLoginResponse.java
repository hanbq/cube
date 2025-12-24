package com.cube.system.entity;


/**
 * 登录响应DTO
 *
 * @author cube
 * @since 2025-12-24
 */
public class SYSLoginResponse {

    /**
     * JWT Token
     */
    private String token;

    /**
     * Token类型（默认Bearer）
     */
    private String tokenType;

    /**
     * Token过期时间（毫秒时间戳）
     */
    private Long expiresAt;

    /**
     * 用户信息
     */
    private UserInfo userInfo;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Long expiresAt) {
        this.expiresAt = expiresAt;
    }

    public UserInfo getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
    }

    /**
     * 用户信息内部类
     */
    public static class UserInfo {
        /**
         * 用户ID
         */
        private Long userId;

        /**
         * 用户名
         */
        private String userName;

        /**
         * 邮箱
         */
        private String email;

        /**
         * 描述
         */
        private String description;

        /**
         * 状态
         */
        private String status;

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

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public static UserInfoBuilder builder() {
            return new UserInfoBuilder();
        }

        public static class UserInfoBuilder {
            private Long userId;
            private String userName;
            private String email;
            private String description;
            private String status;

            public UserInfoBuilder userId(Long userId) {
                this.userId = userId;
                return this;
            }

            public UserInfoBuilder userName(String userName) {
                this.userName = userName;
                return this;
            }

            public UserInfoBuilder email(String email) {
                this.email = email;
                return this;
            }

            public UserInfoBuilder description(String description) {
                this.description = description;
                return this;
            }

            public UserInfoBuilder status(String status) {
                this.status = status;
                return this;
            }

            public UserInfo build() {
                UserInfo userInfo = new UserInfo();
                userInfo.setUserId(userId);
                userInfo.setUserName(userName);
                userInfo.setEmail(email);
                userInfo.setDescription(description);
                userInfo.setStatus(status);
                return userInfo;
            }
        }
    }

    public static SYSLoginResponseBuilder builder() {
        return new SYSLoginResponseBuilder();
    }

    public static class SYSLoginResponseBuilder {
        private String token;
        private String tokenType;
        private Long expiresAt;
        private UserInfo userInfo;

        public SYSLoginResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public SYSLoginResponseBuilder tokenType(String tokenType) {
            this.tokenType = tokenType;
            return this;
        }

        public SYSLoginResponseBuilder expiresAt(Long expiresAt) {
            this.expiresAt = expiresAt;
            return this;
        }

        public SYSLoginResponseBuilder userInfo(UserInfo userInfo) {
            this.userInfo = userInfo;
            return this;
        }

        public SYSLoginResponse build() {
            SYSLoginResponse response = new SYSLoginResponse();
            response.setToken(token);
            response.setTokenType(tokenType);
            response.setExpiresAt(expiresAt);
            response.setUserInfo(userInfo);
            return response;
        }
    }
}