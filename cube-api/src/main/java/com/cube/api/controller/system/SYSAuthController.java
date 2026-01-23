package com.cube.api.controller.system;

import com.cube.common.annotation.LogMasking;
import com.cube.common.entity.CubeResponse;
import com.cube.api.annotation.SysLog;
import com.cube.system.entity.SYSLoginRequest;
import com.cube.system.entity.SYSLoginResponse;
import com.cube.system.entity.SYSRegisterRequest;
import com.cube.system.entity.SYSRegisterResponse;
import com.cube.system.service.SYSAuthService;
import org.springframework.web.bind.annotation.*;

/**
 * 系统认证相关接口
 *
 * @author eden
 * @since 2025-12-24
 */
@RestController
@RequestMapping("/api/auth")
public class SYSAuthController {

    private final SYSAuthService authService;

    public SYSAuthController(SYSAuthService authService) {
        this.authService = authService;
    }

    /**
     * 用户注册
     */
    @PostMapping("/register")
    @SysLog(value = "用户注册", operation = "USER_REGISTER")
    @LogMasking(maskRequest = true, maskResponse = false)
    public CubeResponse<SYSRegisterResponse> register(@RequestBody SYSRegisterRequest registerRequest) {
        try {
            SYSRegisterResponse response = authService.register(registerRequest);
            if (response.isSuccess()) {
                return CubeResponse.success(response, "Registration successful");
            } else {
                return CubeResponse.failed(response.getMessage());
            }
        } catch (Exception e) {
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 用户登录
     */
    @PostMapping("/login")
    @SysLog(value = "用户登录", operation = "USER_LOGIN")
    @LogMasking(maskRequest = true, maskResponse = false)
    public CubeResponse<SYSLoginResponse> login(@RequestBody SYSLoginRequest loginRequest) {
        try {
            SYSLoginResponse response = authService.login(loginRequest);
            return CubeResponse.success(response, "Login successful");
        } catch (Exception e) {
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 刷新Token
     */
    @PostMapping("/refresh")
    public CubeResponse<SYSLoginResponse> refresh(@RequestParam String token) {
        SYSLoginResponse response = authService.refreshToken(token);
        return CubeResponse.success(response, "Token refreshed successfully");
    }

    /**
     * 用户登出
     */
    @PostMapping("/logout")
    public CubeResponse<Void> logout() {
        return CubeResponse.success(null, "Logout successful");
    }
}