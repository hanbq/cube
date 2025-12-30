package com.cube.gateway.entity;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

/**
 * 自定义用户认证主体
 * 扩展了Spring Security的UserDetails，增加了userId字段
 * 这样可以在Controller中直接获取userId，无需再次查询数据库
 *
 * @author cube
 * @since 2025-12-29
 */
public record UserPrincipal(Long userId, String userName, String password,
                            Collection<? extends GrantedAuthority> authorities, boolean accountNonExpired,
                            boolean accountNonLocked, boolean credentialsNonExpired,
                            boolean enabled) implements UserDetails {

    /**
     * 获取用户ID
     * 这是自定义添加的字段，可以直接获取userId而不需要查询数据库
     */
    @Override
    public Long userId() {
        return userId;
    }

    @Override
    public String getUsername() {
        return userName;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    /**
     * 静态工厂方法 - 构建UserPrincipal对象
     */
    public static UserPrincipal create(Long userId,
                                       String userName,
                                       String password,
                                       Collection<? extends GrantedAuthority> authorities) {
        return new UserPrincipal(
                userId,
                userName,
                password,
                authorities,
                true,  // accountNonExpired
                true,  // accountNonLocked
                true,  // credentialsNonExpired
                true   // enabled
        );
    }
}