package com.cube.gateway.service;

import com.cube.gateway.entity.UserPrincipal;
import com.cube.system.entity.SYSUser;
import com.cube.system.entity.SYSRole;
import com.cube.system.service.SYSUserService;
import com.cube.system.service.SYSRoleService;
import jakarta.annotation.Nonnull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 自定义UserDetailsService实现
 * 从数据库加载用户信息
 *
 * @author cube
 * @since 2025-12-29
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger LOG = LoggerFactory.getLogger(CustomUserDetailsService.class);

    private final SYSUserService userService;
    private final SYSRoleService roleService;

    public CustomUserDetailsService(SYSUserService userService,
                                    SYSRoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @Override
    @Nonnull
    public UserDetails loadUserByUsername(@Nonnull String username) throws UsernameNotFoundException {
        LOG.debug("Loading user by username: {}", username);

        // 从数据库查询用户
        Optional<SYSUser> userOptional = userService.getUserByUserName(username);

        if (userOptional.isEmpty()) {
            LOG.error("User not found: {}", username);
            throw new UsernameNotFoundException("User not found: " + username);
        }

        SYSUser sysUser = userOptional.get();

        // 检查用户状态
        if (sysUser.getDeleted() != null && sysUser.getDeleted()) {
            LOG.error("User is deleted: {}", username);
            throw new UsernameNotFoundException("User is deleted: " + username);
        }

        // 构建权限列表 - 从数据库动态加载用户的角色
        List<GrantedAuthority> authorities = new ArrayList<>();

        // 如果是超级管理员，直接添加ROLE_SUPER_ADMIN权限
        if (Boolean.TRUE.equals(sysUser.getIsSuperAdmin())) {
            authorities.add(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"));
            LOG.debug("User {} is super admin", username);
        }

        // 从数据库通过JOIN一次性查询用户的所有角色（性能优化，避免N+1查询）
        List<SYSRole> roles = roleService.getRolesByUserId(sysUser.getUserId());

        for (SYSRole role : roles) {
            // 添加角色权限（角色名前加ROLE_前缀是Spring Security的约定）
            String authority = "ROLE_" + role.getRoleName().toUpperCase();
            authorities.add(new SimpleGrantedAuthority(authority));
            LOG.debug("User {} has role: {}", username, authority);
        }

        // 如果用户没有任何角色，给一个默认的USER角色
        if (authorities.isEmpty()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
            LOG.debug("User {} has default ROLE_USER", username);
        }

        // 创建自定义的UserPrincipal对象（包含userId）
        return UserPrincipal.create(
                sysUser.getUserId(),
                sysUser.getUsername(),
                sysUser.getPassword() != null ? sysUser.getPassword() : "",
                authorities
        );
    }
}