package com.cube.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * 密码加密器配置类
 * 独立配置，避免与SecurityConfig产生循环依赖
 *
 * @author cube
 * @since 2026-01-04
 */
@Configuration
public class EncoderConfig {

    /**
     * 密码编码器
     * 使用BCrypt加密算法，默认强度10
     *
     * @return BCryptPasswordEncoder实例
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}