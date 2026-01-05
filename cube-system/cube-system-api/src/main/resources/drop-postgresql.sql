-- ========================================
-- PostgreSQL 删除表脚本
-- 基于 com.cube.system.bean 包下的实体类
-- 生成时间: 2025-12-24
-- ========================================

-- 注意：执行此脚本将删除所有相关表及数据，请谨慎操作！

-- 删除触发器
DROP TRIGGER IF EXISTS update_button_updated_time ON CUBE_SYS_BUTTON;
DROP TRIGGER IF EXISTS update_user_updated_time ON CUBE_SYS_USER;
DROP TRIGGER IF EXISTS update_menu_updated_time ON CUBE_SYS_MENU;
DROP TRIGGER IF EXISTS update_user_role_updated_time ON CUBE_SYS_USER_ROLE;
DROP TRIGGER IF EXISTS update_menu_role_updated_time ON CUBE_SYS_MENU_ROLE;
DROP TRIGGER IF EXISTS update_button_role_updated_time ON CUBE_SYS_BUTTON_ROLE;

-- 删除函数
DROP FUNCTION IF EXISTS update_updated_time_column();

-- 删除表（按依赖关系倒序删除）
DROP TABLE IF EXISTS CUBE_SYS_BUTTON_ROLE CASCADE;
DROP TABLE IF EXISTS CUBE_SYS_MENU_ROLE CASCADE;
DROP TABLE IF EXISTS CUBE_SYS_USER_ROLE CASCADE;
DROP TABLE IF EXISTS CUBE_SYS_SYS_LOG CASCADE;
DROP TABLE IF EXISTS CUBE_SYS_MENU CASCADE;
DROP TABLE IF EXISTS CUBE_SYS_ROLE CASCADE;
DROP TABLE IF EXISTS CUBE_SYS_USER CASCADE;
DROP TABLE IF EXISTS CUBE_SYS_BUTTON CASCADE;
