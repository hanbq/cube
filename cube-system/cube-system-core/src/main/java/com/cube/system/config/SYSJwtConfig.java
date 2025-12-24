package com.cube.system.config;

import com.cube.system.utils.SYSJwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * JWT配置类
 * 可以通过application.properties或application.yml配置密钥和过期时间
 *
 * @author cube
 * @since 2025-12-24
 */
@Configuration
public class SYSJwtConfig {

    /**
     * JWT密钥（从配置文件读取，如果未配置则使用默认值）
     */
    @Value("${jwt.secret-key:cube-system-jwt-secret-key-2025-please-change-this-in-production}")
    private String secretKey;

    /**
     * Token有效期（毫秒，默认24小时）
     */
    @Value("${jwt.expiration-time:86400000}")
    private long expirationTime;

    /**
     * 创建JwtUtil Bean
     *
     * @return JwtUtil实例
     */
    @Bean
    public SYSJwtUtil jwtUtil() {
        return new SYSJwtUtil(secretKey, expirationTime);
    }
}
