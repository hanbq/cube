package com.cube.system.service;

import com.cube.common.exception.AuthException;
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
        String token = jwtUtil.generateToken(user.getUserId(), user.getUsername());

        // 计算过期时间
        long expiresAt = System.currentTimeMillis() + SYSJwtUtil.DEFAULT_EXPIRATION_TIME;

        // 构建用户信息
        SYSLoginResponse.UserInfo userInfo = SYSLoginResponse.UserInfo.builder()
                .userId(user.getUserId())
                .userName(user.getUsername())
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
     * 刷新Token
     *
     * @param token 旧的JWT token
     * @return 新的登录响应
     */
    public SYSLoginResponse refreshToken(String token) throws AuthException {
        // Validate token
        if (Boolean.FALSE.equals(jwtUtil.validateToken(token))) {
            throw new AuthException("Token is expired or invalid");
        }

        // Extract user information
        Long userId = jwtUtil.extractUserId(token);

        // Get latest user information from database
        Optional<SYSUser> userOptional = userDao.findById(userId);
        if (userOptional.isEmpty()) {
            throw new SYSAuthException("User not found");
        }

        SYSUser user = userOptional.get();

        // Check user status
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new AuthException("User account is disabled");
        }

        // 生成新的Token
        String newToken = jwtUtil.refreshToken(token);

        // 计算过期时间
        long expiresAt = System.currentTimeMillis() + SYSJwtUtil.DEFAULT_EXPIRATION_TIME;

        // 构建用户信息
        SYSLoginResponse.UserInfo userInfo = SYSLoginResponse.UserInfo.builder()
                .userId(user.getUserId())
                .userName(user.getUsername())
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

}