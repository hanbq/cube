package com.cube.system;

import com.cube.common.entity.CubeResponse;
import com.cube.system.entity.SYSLoginRequest;
import com.cube.system.entity.SYSLoginResponse;
import com.cube.system.service.SYSAuthService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证Controller
 * 处理用户登录、Token刷新等请求
 *
 * @author cube
 * @since 2025-12-24
 */
@RestController
@RequestMapping("/api/auth")
public class SYSAuthController {

    @Resource
    private SYSAuthService authenticationService;

    /**
     * 用户登录
     *
     * @param loginRequest 登录请求
     * @return 登录响应
     */
    @PostMapping("/login")
    public CubeResponse<SYSLoginResponse> login(@RequestBody SYSLoginRequest loginRequest) {
        try {
            var loginResponse = authenticationService.login(loginRequest);
            return CubeResponse.success(loginResponse, "Login successful");
        } catch (RuntimeException e) {
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 刷新Token
     *
     * @param authorizationHeader Authorization header (Bearer token)
     * @return 新的登录响应
     */
    @PostMapping("/refresh")
    public CubeResponse<SYSLoginResponse> refreshToken(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            // 提取token（移除"Bearer "前缀）
            var token = extractToken(authorizationHeader);
            if (token == null) {
                return CubeResponse.failed("Invalid Authorization header format");
            }
            var loginResponse = authenticationService.refreshToken(token);
            return CubeResponse.success(loginResponse, "Token refreshed successfully");
        } catch (RuntimeException e) {
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 验证Token
     *
     * @param authorizationHeader Authorization header (Bearer token)
     * @return 验证结果
     */
    @GetMapping("/validate")
    public CubeResponse<Map<String, Object>> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            // 提取token
            String token = extractToken(authorizationHeader);
            if (token == null) {
                return CubeResponse.failed("Invalid Authorization header format");
            }

            boolean isValid = authenticationService.validateToken(token);
            Map<String, Object> data = new HashMap<>();
            data.put("valid", isValid);

            if (isValid) {
                // 提取用户信息
                String userName = authenticationService.extractUserName(token);
                Long userId = authenticationService.extractUserId(token);
                data.put("userId", userId);
                data.put("userName", userName);
            }
            return CubeResponse.success(data, "Token validation completed");
        } catch (Exception e) {
            return CubeResponse.failed("Token validation failed");
        }
    }

    /**
     * 登出（可选，主要用于前端清除token）
     *
     * @return 登出响应
     */
    @PostMapping("/logout")
    public CubeResponse<Void> logout() {
        return CubeResponse.success(null, "Logout successful");
    }

    /**
     * 从Authorization header中提取token
     *
     * @param authorizationHeader Authorization header
     * @return token
     */
    private String extractToken(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }
}
