package com.cube.system.service;

import com.cube.system.utils.SYSJwtUtil;
import com.cube.system.entity.SYSUser;
import com.cube.system.dao.SYSUserDao;
import com.cube.system.entity.SYSLoginRequest;
import com.cube.system.entity.SYSLoginResponse;
import com.cube.system.exception.SYSAuthException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * 认证Service
 * 处理用户登录、Token验证等功能
 *
 * @author cube
 * @since 2025-12-24
 */
@Service
@Transactional
public class SYSAuthService {

    private final SYSUserDao userDao;
    private final SYSJwtUtil jwtUtil;

    /**
     * Token有效期（24小时，单位：毫秒）
     */
    private static final long TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

    public SYSAuthService(SYSUserDao userDao, SYSJwtUtil jwtUtil) {
        this.userDao = userDao;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 用户登录
     *
     * @param loginRequest 登录请求
     * @return 登录响应（包含token和用户信息）
     */
    @Transactional(readOnly = true)
    public SYSLoginResponse login(SYSLoginRequest loginRequest) {
        // Validate request parameters
        if (loginRequest.getUsername() == null || loginRequest.getUsername().trim().isEmpty()) {
            throw new SYSAuthException("Username is required");
        }
        if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
            throw new SYSAuthException("Password is required");
        }

        // Find user by username
        Optional<SYSUser> userOptional = userDao.findByUserName(loginRequest.getUsername());
        if (userOptional.isEmpty()) {
            throw new SYSAuthException("Invalid username or password");
        }

        SYSUser user = userOptional.get();

        // Verify password (Note: Should use encrypted password in production)
        if (!loginRequest.getPassword().equals(user.getPassword())) {
            throw new SYSAuthException("Invalid username or password");
        }

        // Check user status
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new SYSAuthException("User account is disabled");
        }

        // 生成JWT Token
        String token = jwtUtil.generateToken(user.getUserId(), user.getUserName());

        // 计算过期时间
        long expiresAt = System.currentTimeMillis() + TOKEN_EXPIRATION_TIME;

        // 构建用户信息
        SYSLoginResponse.UserInfo userInfo = SYSLoginResponse.UserInfo.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .description(user.getDescription())
                .status(user.getStatus())
                .build();

        // 构建登录响应
        return SYSLoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresAt(expiresAt)
                .userInfo(userInfo)
                .build();
    }

    /**
     * 验证Token
     *
     * @param token JWT token
     * @return 是否有效
     */
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    /**
     * 从Token中提取用户名
     *
     * @param token JWT token
     * @return 用户名
     */
    public String extractUserName(String token) {
        return jwtUtil.extractUserName(token);
    }

    /**
     * 从Token中提取用户ID
     *
     * @param token JWT token
     * @return 用户ID
     */
    public Long extractUserId(String token) {
        return jwtUtil.extractUserId(token);
    }

    /**
     * 刷新Token
     *
     * @param token 旧的JWT token
     * @return 新的登录响应
     */
    public SYSLoginResponse refreshToken(String token) {
        // Validate token
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Token is expired or invalid");
        }

        // Extract user information
        String userName = jwtUtil.extractUserName(token);
        Long userId = jwtUtil.extractUserId(token);

        // Get latest user information from database
        Optional<SYSUser> userOptional = userDao.findById(userId);
        if (userOptional.isEmpty()) {
            throw new SYSAuthException("User not found");
        }

        SYSUser user = userOptional.get();

        // Check user status
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new RuntimeException("User account is disabled");
        }

        // 生成新的Token
        String newToken = jwtUtil.refreshToken(token);

        // 计算过期时间
        long expiresAt = System.currentTimeMillis() + TOKEN_EXPIRATION_TIME;

        // 构建用户信息
        SYSLoginResponse.UserInfo userInfo = SYSLoginResponse.UserInfo.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .description(user.getDescription())
                .status(user.getStatus())
                .build();

        // 构建响应
        return SYSLoginResponse.builder()
                .token(newToken)
                .tokenType("Bearer")
                .expiresAt(expiresAt)
                .userInfo(userInfo)
                .build();
    }

    /**
     * 根据Token获取用户信息
     *
     * @param token JWT token
     * @return 用户信息
     */
    @Transactional(readOnly = true)
    public SYSUser getUserByToken(String token) {
        // Validate token
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Token is expired or invalid");
        }

        // Extract user ID
        Long userId = jwtUtil.extractUserId(token);

        // Query user
        Optional<SYSUser> userOptional = userDao.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        return userOptional.get();
    }
}