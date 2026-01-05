package com.cube.system.service;

import com.cube.common.enums.Status;
import com.cube.common.exception.AuthException;
import com.cube.system.utils.SYSJwtUtil;
import com.cube.system.entity.SYSUser;
import com.cube.system.dao.SYSUserDao;
import com.cube.system.entity.SYSLoginRequest;
import com.cube.system.entity.SYSLoginResponse;
import com.cube.system.entity.SYSRegisterRequest;
import com.cube.system.entity.SYSRegisterResponse;
import com.cube.system.exception.SYSAuthException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * 认证Service
 * 处理用户登录、注册、Token验证等功能
 *
 * @author cube
 * @since 2025-12-24
 */
@Service
@Transactional
public class SYSAuthService {

    private final SYSUserDao userDao;
    private final SYSJwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public SYSAuthService(SYSUserDao userDao, SYSJwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userDao = userDao;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 用户注册
     *
     * @param registerRequest 注册请求
     * @return 注册响应
     */
    public SYSRegisterResponse register(SYSRegisterRequest registerRequest) {
        // 验证请求参数
        if (registerRequest.getUsername() == null || registerRequest.getUsername().trim().isEmpty()) {
            return new SYSRegisterResponse(false, "Username is required");
        }
        if (registerRequest.getPassword() == null || registerRequest.getPassword().trim().isEmpty()) {
            return new SYSRegisterResponse(false, "Password is required");
        }
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            return new SYSRegisterResponse(false, "Passwords do not match");
        }
        if (registerRequest.getEmail() == null || registerRequest.getEmail().trim().isEmpty()) {
            return new SYSRegisterResponse(false, "Email is required");
        }

        // 检查用户名是否已存在
        if (userDao.findByUserName(registerRequest.getUsername()).isPresent()) {
            return new SYSRegisterResponse(false, "Username already exists");
        }

        // 检查邮箱是否已存在
        if (userDao.findByEmail(registerRequest.getEmail()).isPresent()) {
            return new SYSRegisterResponse(false, "Email already exists");
        }

        // 创建新用户
        SYSUser newUser = new SYSUser();
        newUser.setUsername(registerRequest.getUsername());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword())); // 使用BCrypt加密密码
        newUser.setEmail(registerRequest.getEmail());
        newUser.setDescription(registerRequest.getDescription());
        newUser.setStatus(Status.ACTIVE.name()); // 默认状态为激活
        newUser.setIsSuperAdmin(false); // 默认不是超级管理员

        // 保存用户
        userDao.insert(newUser);

        // 返回成功响应
        return new SYSRegisterResponse(true, "Registration successful", newUser.getUserId(), newUser.getUsername());
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

        // Verify password using BCrypt
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new SYSAuthException("Invalid username or password");
        }

        // Check user status
        if (!Status.ACTIVE.name().equalsIgnoreCase(user.getStatus())) {
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
        if (!Status.ACTIVE.name().equals(user.getStatus())) {
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