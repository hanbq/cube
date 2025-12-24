-- ========================================
-- MySQL 表创建脚本
-- 基于 com.cube.system.bean 包下的实体类
-- 生成时间: 2025-12-24
-- ========================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ========================================
-- 1. 按钮表 (SYSButton)
-- ========================================
CREATE TABLE IF NOT EXISTS `CUBE_SYS_BUTTON` (
    `button_id`       BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '按钮ID（主键）',
    `button_name`     VARCHAR(100) NOT NULL COMMENT '按钮名称',
    `description`     VARCHAR(500) COMMENT '描述',
    `created_time`    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `created_by`      VARCHAR(100) COMMENT '创建人',
    `updated_time`    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `updated_by`      VARCHAR(100) COMMENT '更新人',
    `deleted`         TINYINT(1) DEFAULT 0 COMMENT '删除标记'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='按钮表';

-- ========================================
-- 2. 用户表 (SYSUser)
-- ========================================
CREATE TABLE IF NOT EXISTS `CUBE_SYS_USER` (
    `user_id`         BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID（主键）',
    `user_name`       VARCHAR(100) NOT NULL UNIQUE COMMENT '用户名',
    `password`        VARCHAR(255) NOT NULL COMMENT '密码',
    `description`     VARCHAR(500) COMMENT '描述',
    `email`           VARCHAR(255) COMMENT '邮箱',
    `status`          VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    `created_time`    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `created_by`      VARCHAR(100) COMMENT '创建人',
    `updated_time`    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `updated_by`      VARCHAR(100) COMMENT '更新人',
    `deleted`         TINYINT(1) DEFAULT 0 COMMENT '删除标记',
    INDEX `idx_user_name` (`user_name`),
    INDEX `idx_user_email` (`email`),
    INDEX `idx_user_status` (`status`),
    INDEX `idx_user_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ========================================
-- 3. 角色表 (SYSRole)
-- ========================================
CREATE TABLE IF NOT EXISTS `CUBE_SYS_ROLE` (
    `role_id`         BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '角色ID（主键）',
    `role_name`       VARCHAR(100) NOT NULL UNIQUE COMMENT '角色名称',
    `description`     VARCHAR(500) COMMENT '描述',
    INDEX `idx_role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- ========================================
-- 4. 菜单表 (SYSMenu)
-- ========================================
CREATE TABLE IF NOT EXISTS `CUBE_SYS_MENU` (
    `menu_id`         BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '菜单ID（主键）',
    `menu_name`       VARCHAR(100) NOT NULL COMMENT '菜单名称',
    `path`            VARCHAR(255) COMMENT '菜单路径',
    `icon_cls`        VARCHAR(100) COMMENT '图标样式',
    `parent_id`       BIGINT COMMENT '父菜单ID',
    `sort`            INT DEFAULT 0 COMMENT '排序',
    `component`       VARCHAR(255) COMMENT '组件路径',
    `created_time`    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `created_by`      VARCHAR(100) COMMENT '创建人',
    `updated_time`    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `updated_by`      VARCHAR(100) COMMENT '更新人',
    `deleted`         TINYINT(1) DEFAULT 0 COMMENT '删除标记',
    INDEX `idx_menu_parent_id` (`parent_id`),
    INDEX `idx_menu_sort` (`sort`),
    INDEX `idx_menu_deleted` (`deleted`),
    CONSTRAINT `fk_menu_parent` FOREIGN KEY (`parent_id`) REFERENCES `CUBE_SYS_MENU`(`menu_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单表';

-- ========================================
-- 5. 用户角色关联表 (SYSUserRole)
-- ========================================
CREATE TABLE IF NOT EXISTS `CUBE_SYS_USER_ROLE` (
    `id`              BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `user_id`         BIGINT NOT NULL COMMENT '用户ID',
    `role_id`         BIGINT NOT NULL COMMENT '角色ID',
    `created_time`    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `created_by`      VARCHAR(100) COMMENT '创建人',
    `updated_time`    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `updated_by`      VARCHAR(100) COMMENT '更新人',
    `deleted`         TINYINT(1) DEFAULT 0 COMMENT '删除标记',
    INDEX `idx_user_role_user_id` (`user_id`),
    INDEX `idx_user_role_role_id` (`role_id`),
    UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
    CONSTRAINT `fk_user_role_user` FOREIGN KEY (`user_id`) REFERENCES `CUBE_SYS_USER`(`user_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_user_role_role` FOREIGN KEY (`role_id`) REFERENCES `CUBE_SYS_ROLE`(`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- ========================================
-- 6. 菜单角色关联表 (SYSMenuRole)
-- ========================================
CREATE TABLE IF NOT EXISTS `CUBE_SYS_MENU_ROLE` (
    `id`              BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `menu_id`         BIGINT NOT NULL COMMENT '菜单ID',
    `role_id`         BIGINT NOT NULL COMMENT '角色ID',
    `created_time`    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `created_by`      VARCHAR(100) COMMENT '创建人',
    `updated_time`    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `updated_by`      VARCHAR(100) COMMENT '更新人',
    `deleted`         TINYINT(1) DEFAULT 0 COMMENT '删除标记',
    INDEX `idx_menu_role_menu_id` (`menu_id`),
    INDEX `idx_menu_role_role_id` (`role_id`),
    UNIQUE KEY `uk_menu_role` (`menu_id`, `role_id`),
    CONSTRAINT `fk_menu_role_menu` FOREIGN KEY (`menu_id`) REFERENCES `CUBE_SYS_MENU`(`menu_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_menu_role_role` FOREIGN KEY (`role_id`) REFERENCES `CUBE_SYS_ROLE`(`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单角色关联表';

-- ========================================
-- 7. 按钮角色关联表 (SYSButtonRole)
-- ========================================
CREATE TABLE IF NOT EXISTS `CUBE_SYS_BUTTON_ROLE` (
    `id`              BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `button_id`       BIGINT NOT NULL COMMENT '按钮ID',
    `role_id`         BIGINT NOT NULL COMMENT '角色ID',
    `created_time`    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `created_by`      VARCHAR(100) COMMENT '创建人',
    `updated_time`    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `updated_by`      VARCHAR(100) COMMENT '更新人',
    `deleted`         TINYINT(1) DEFAULT 0 COMMENT '删除标记',
    INDEX `idx_button_role_button_id` (`button_id`),
    INDEX `idx_button_role_role_id` (`role_id`),
    UNIQUE KEY `uk_button_role` (`button_id`, `role_id`),
    CONSTRAINT `fk_button_role_button` FOREIGN KEY (`button_id`) REFERENCES `CUBE_SYS_BUTTON`(`button_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_button_role_role` FOREIGN KEY (`role_id`) REFERENCES `CUBE_SYS_ROLE`(`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='按钮角色关联表';

-- ========================================
-- 8. 系统日志表 (SYSSysLog)
-- ========================================
CREATE TABLE IF NOT EXISTS `CUBE_SYS_SYS_LOG` (
    `log_id`          BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '日志ID（主键）',
    `user_name`       VARCHAR(100) COMMENT '用户名',
    `operation`       VARCHAR(200) COMMENT '操作描述',
    `method`          VARCHAR(500) COMMENT '方法名',
    `params`          TEXT COMMENT '参数',
    `ip`              VARCHAR(50) COMMENT 'IP地址',
    `created_time`    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX `idx_log_user_name` (`user_name`),
    INDEX `idx_log_created_time` (`created_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统日志表';

-- ========================================
-- 初始化数据（可选）
-- ========================================

-- 插入默认角色
INSERT INTO `CUBE_SYS_ROLE` (`role_name`, `description`) VALUES
    ('ADMIN', '系统管理员'),
    ('USER', '普通用户')
ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);

-- 插入默认管理员用户（密码需要加密后再使用）
-- INSERT INTO `CUBE_SYS_USER` (`user_name`, `password`, `description`, `email`, `status`) VALUES
--     ('admin', '$2a$10$...加密后的密码...', '系统管理员', 'admin@cube.com', 'ACTIVE')
-- ON DUPLICATE KEY UPDATE `description` = VALUES(`description`);

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- 完成
-- ========================================
