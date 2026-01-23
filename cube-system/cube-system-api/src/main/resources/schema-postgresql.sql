-- ========================================
-- PostgreSQL 表创建脚本
-- 基于 com.cube.system.bean 包下的实体类
-- 生成时间: 2025-12-24
-- ========================================

-- ========================================
-- 1. 按钮表 (SYSButton)
-- ========================================
CREATE TABLE IF NOT EXISTS CUBE_SYS_BUTTON (
    button_id       BIGSERIAL PRIMARY KEY,
    button_name     VARCHAR(100) NOT NULL,
    description     VARCHAR(500),
    created_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by      VARCHAR(100),
    updated_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by      VARCHAR(100),
    deleted         BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE CUBE_SYS_BUTTON IS '按钮表';
COMMENT ON COLUMN CUBE_SYS_BUTTON.button_id IS '按钮ID（主键）';
COMMENT ON COLUMN CUBE_SYS_BUTTON.button_name IS '按钮名称';
COMMENT ON COLUMN CUBE_SYS_BUTTON.description IS '描述';
COMMENT ON COLUMN CUBE_SYS_BUTTON.created_time IS '创建时间';
COMMENT ON COLUMN CUBE_SYS_BUTTON.created_by IS '创建人';
COMMENT ON COLUMN CUBE_SYS_BUTTON.updated_time IS '更新时间';
COMMENT ON COLUMN CUBE_SYS_BUTTON.updated_by IS '更新人';
COMMENT ON COLUMN CUBE_SYS_BUTTON.deleted IS '删除标记';

-- ========================================
-- 2. 用户表 (SYSUser)
-- ========================================
CREATE TABLE IF NOT EXISTS CUBE_SYS_USER (
    user_id         BIGSERIAL PRIMARY KEY,
    username       VARCHAR(100) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    description     VARCHAR(500),
    email           VARCHAR(255),
    status          VARCHAR(20) DEFAULT 'ACTIVE',
    is_super_admin  BOOLEAN DEFAULT FALSE,
    created_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by      VARCHAR(100),
    updated_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by      VARCHAR(100),
    deleted         BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE CUBE_SYS_USER IS '用户表';
COMMENT ON COLUMN CUBE_SYS_USER.user_id IS '用户ID（主键）';
COMMENT ON COLUMN CUBE_SYS_USER.username IS '用户名';
COMMENT ON COLUMN CUBE_SYS_USER.password IS '密码';
COMMENT ON COLUMN CUBE_SYS_USER.description IS '描述';
COMMENT ON COLUMN CUBE_SYS_USER.email IS '邮箱';
COMMENT ON COLUMN CUBE_SYS_USER.status IS '状态';
COMMENT ON COLUMN CUBE_SYS_USER.created_time IS '创建时间';
COMMENT ON COLUMN CUBE_SYS_USER.created_by IS '创建人';
COMMENT ON COLUMN CUBE_SYS_USER.updated_time IS '更新时间';
COMMENT ON COLUMN CUBE_SYS_USER.updated_by IS '更新人';
COMMENT ON COLUMN CUBE_SYS_USER.deleted IS '删除标记';

-- ========================================
-- 3. 角色表 (SYSRole)
-- ========================================
CREATE TABLE IF NOT EXISTS CUBE_SYS_ROLE (
    role_id         BIGSERIAL PRIMARY KEY,
    role_name       VARCHAR(100) NOT NULL UNIQUE,
    description     VARCHAR(500),
    created_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by      VARCHAR(100),
    updated_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by      VARCHAR(100),
    deleted         BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE CUBE_SYS_ROLE IS '角色表';
COMMENT ON COLUMN CUBE_SYS_ROLE.role_id IS '角色ID（主键）';
COMMENT ON COLUMN CUBE_SYS_ROLE.role_name IS '角色名称';
COMMENT ON COLUMN CUBE_SYS_ROLE.description IS '描述';

-- ========================================
-- 4. 菜单表 (SYSMenu)
-- ========================================
CREATE TABLE IF NOT EXISTS CUBE_SYS_MENU (
    menu_id         BIGSERIAL PRIMARY KEY,
    menu_name       VARCHAR(100) NOT NULL,
    menu_name_eng       VARCHAR(100) NOT NULL,
    path            VARCHAR(255),
    icon_cls        VARCHAR(100),
    parent_id       BIGINT,
    sort            INTEGER DEFAULT 0,
    component       VARCHAR(255),
    created_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by      VARCHAR(100),
    updated_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by      VARCHAR(100),
    deleted         BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE CUBE_SYS_MENU IS '菜单表';
COMMENT ON COLUMN CUBE_SYS_MENU.menu_id IS '菜单ID（主键）';
COMMENT ON COLUMN CUBE_SYS_MENU.menu_name IS '菜单名称';
COMMENT ON COLUMN CUBE_SYS_MENU.path IS '菜单路径';
COMMENT ON COLUMN CUBE_SYS_MENU.icon_cls IS '图标样式';
COMMENT ON COLUMN CUBE_SYS_MENU.parent_id IS '父菜单ID';
COMMENT ON COLUMN CUBE_SYS_MENU.sort IS '排序';
COMMENT ON COLUMN CUBE_SYS_MENU.component IS '组件路径';
COMMENT ON COLUMN CUBE_SYS_MENU.created_time IS '创建时间';
COMMENT ON COLUMN CUBE_SYS_MENU.created_by IS '创建人';
COMMENT ON COLUMN CUBE_SYS_MENU.updated_time IS '更新时间';
COMMENT ON COLUMN CUBE_SYS_MENU.updated_by IS '更新人';
COMMENT ON COLUMN CUBE_SYS_MENU.deleted IS '删除标记';

-- ========================================
-- 5. 用户角色关联表 (SYSUserRole)
-- ========================================
CREATE TABLE IF NOT EXISTS CUBE_SYS_USER_ROLE (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    role_id         BIGINT NOT NULL,
    created_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by      VARCHAR(100),
    updated_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by      VARCHAR(100),
    deleted         BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE CUBE_SYS_USER_ROLE IS '用户角色关联表';
COMMENT ON COLUMN CUBE_SYS_USER_ROLE.id IS '主键ID';
COMMENT ON COLUMN CUBE_SYS_USER_ROLE.user_id IS '用户ID';
COMMENT ON COLUMN CUBE_SYS_USER_ROLE.role_id IS '角色ID';
COMMENT ON COLUMN CUBE_SYS_USER_ROLE.created_time IS '创建时间';
COMMENT ON COLUMN CUBE_SYS_USER_ROLE.created_by IS '创建人';
COMMENT ON COLUMN CUBE_SYS_USER_ROLE.updated_time IS '更新时间';
COMMENT ON COLUMN CUBE_SYS_USER_ROLE.updated_by IS '更新人';
COMMENT ON COLUMN CUBE_SYS_USER_ROLE.deleted IS '删除标记';

-- ========================================
-- 6. 菜单角色关联表 (SYSMenuRole)
-- ========================================
CREATE TABLE IF NOT EXISTS CUBE_SYS_MENU_ROLE (
    id              BIGSERIAL PRIMARY KEY,
    menu_id         BIGINT NOT NULL,
    role_id         BIGINT NOT NULL,
    created_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by      VARCHAR(100),
    updated_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by      VARCHAR(100),
    deleted         BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE CUBE_SYS_MENU_ROLE IS '菜单角色关联表';
COMMENT ON COLUMN CUBE_SYS_MENU_ROLE.id IS '主键ID';
COMMENT ON COLUMN CUBE_SYS_MENU_ROLE.menu_id IS '菜单ID';
COMMENT ON COLUMN CUBE_SYS_MENU_ROLE.role_id IS '角色ID';
COMMENT ON COLUMN CUBE_SYS_MENU_ROLE.created_time IS '创建时间';
COMMENT ON COLUMN CUBE_SYS_MENU_ROLE.created_by IS '创建人';
COMMENT ON COLUMN CUBE_SYS_MENU_ROLE.updated_time IS '更新时间';
COMMENT ON COLUMN CUBE_SYS_MENU_ROLE.updated_by IS '更新人';
COMMENT ON COLUMN CUBE_SYS_MENU_ROLE.deleted IS '删除标记';

-- ========================================
-- 7. 按钮角色关联表 (SYSButtonRole)
-- ========================================
CREATE TABLE IF NOT EXISTS CUBE_SYS_BUTTON_ROLE (
    id              BIGSERIAL PRIMARY KEY,
    button_id       BIGINT NOT NULL,
    role_id         BIGINT NOT NULL,
    created_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by      VARCHAR(100),
    updated_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by      VARCHAR(100),
    deleted         BOOLEAN DEFAULT FALSE
);

COMMENT ON TABLE CUBE_SYS_BUTTON_ROLE IS '按钮角色关联表';
COMMENT ON COLUMN CUBE_SYS_BUTTON_ROLE.id IS '主键ID';
COMMENT ON COLUMN CUBE_SYS_BUTTON_ROLE.button_id IS '按钮ID';
COMMENT ON COLUMN CUBE_SYS_BUTTON_ROLE.role_id IS '角色ID';
COMMENT ON COLUMN CUBE_SYS_BUTTON_ROLE.created_time IS '创建时间';
COMMENT ON COLUMN CUBE_SYS_BUTTON_ROLE.created_by IS '创建人';
COMMENT ON COLUMN CUBE_SYS_BUTTON_ROLE.updated_time IS '更新时间';
COMMENT ON COLUMN CUBE_SYS_BUTTON_ROLE.updated_by IS '更新人';
COMMENT ON COLUMN CUBE_SYS_BUTTON_ROLE.deleted IS '删除标记';

-- ========================================
-- 8. 系统日志表 (SYSSysLog)
-- ========================================
CREATE TABLE IF NOT EXISTS CUBE_SYS_SYS_LOG (
    log_id          BIGSERIAL PRIMARY KEY,
    username       VARCHAR(100),
    operation       VARCHAR(200),
    method          VARCHAR(500),
    params          TEXT,
    ip              VARCHAR(50),
    status          VARCHAR(20) DEFAULT 'SUCCESS',
    created_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE CUBE_SYS_SYS_LOG IS '系统日志表';
COMMENT ON COLUMN CUBE_SYS_SYS_LOG.log_id IS '日志ID（主键）';
COMMENT ON COLUMN CUBE_SYS_SYS_LOG.username IS '用户名';
COMMENT ON COLUMN CUBE_SYS_SYS_LOG.operation IS '操作描述';
COMMENT ON COLUMN CUBE_SYS_SYS_LOG.method IS '方法名';
COMMENT ON COLUMN CUBE_SYS_SYS_LOG.params IS '参数';
COMMENT ON COLUMN CUBE_SYS_SYS_LOG.ip IS 'IP地址';
COMMENT ON COLUMN CUBE_SYS_SYS_LOG.status IS '操作状态';
COMMENT ON COLUMN CUBE_SYS_SYS_LOG.created_time IS '创建时间';

CREATE INDEX IF NOT EXISTS idx_sys_log_username ON CUBE_SYS_SYS_LOG(username);
CREATE INDEX IF NOT EXISTS idx_sys_log_created_time ON CUBE_SYS_SYS_LOG(created_time);
CREATE INDEX IF NOT EXISTS idx_sys_log_status ON CUBE_SYS_SYS_LOG(status);


-- ========================================
-- 创建更新时间触发器
-- ========================================

-- 创建更新时间自动更新函数
CREATE OR REPLACE FUNCTION update_updated_time_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为相关表创建触发器
CREATE TRIGGER update_button_updated_time BEFORE UPDATE ON CUBE_SYS_BUTTON
    FOR EACH ROW EXECUTE FUNCTION update_updated_time_column();

CREATE TRIGGER update_user_updated_time BEFORE UPDATE ON CUBE_SYS_USER
    FOR EACH ROW EXECUTE FUNCTION update_updated_time_column();

CREATE TRIGGER update_menu_updated_time BEFORE UPDATE ON CUBE_SYS_MENU
    FOR EACH ROW EXECUTE FUNCTION update_updated_time_column();

CREATE TRIGGER update_user_role_updated_time BEFORE UPDATE ON CUBE_SYS_USER_ROLE
    FOR EACH ROW EXECUTE FUNCTION update_updated_time_column();

CREATE TRIGGER update_menu_role_updated_time BEFORE UPDATE ON CUBE_SYS_MENU_ROLE
    FOR EACH ROW EXECUTE FUNCTION update_updated_time_column();

CREATE TRIGGER update_button_role_updated_time BEFORE UPDATE ON CUBE_SYS_BUTTON_ROLE
    FOR EACH ROW EXECUTE FUNCTION update_updated_time_column();

-- ========================================
-- 初始化数据（可选）
-- ========================================

-- 插入默认角色
INSERT INTO CUBE_SYS_ROLE (role_name, description) VALUES
    ('ADMIN', '系统管理员'),
    ('USER', '普通用户')
ON CONFLICT (role_name) DO NOTHING;

-- 插入默认管理员用户（密码需要加密后再使用）
-- INSERT INTO CUBE_SYS_USER (username, password, description, email, status) VALUES
--     ('admin', '$2a$10$...加密后的密码...', '系统管理员', 'admin@cube.com', 'ACTIVE')
-- ON CONFLICT (username) DO NOTHING;

-- ========================================
-- 完成
-- ========================================


-- 工作区相关数据库表设计
-- 适配前端 Workspace 和 Widget 接口

-- ========================================
-- 1. 工作区表 (workspaces)
-- 存储工作区的基本信息
-- ========================================
CREATE TABLE IF NOT EXISTS CUBE_SYS_WORKSPACES (
    ID   BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by      VARCHAR(100),
    updated_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by      VARCHAR(100),
    user_id         BIGSERIAL
);

-- 创建索引
CREATE INDEX idx_workspaces_name ON workspaces(name);
CREATE INDEX idx_workspaces_is_default ON workspaces(is_default);
CREATE INDEX idx_workspaces_created_time ON workspaces(created_time);

-- ========================================
-- 2. 小组件表 (widgets)
-- 存储工作区内的小组件信息
-- ========================================
CREATE TABLE IF NOT EXISTS CUBE_SYS_WIDGETS (
    id VARCHAR(36) PRIMARY KEY,
    workspace_id INT8 NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('statistic', 'chart', 'table', 'text')),
    title VARCHAR(100) NOT NULL,
    size VARCHAR(10) NOT NULL CHECK (size IN ('small', 'medium', 'large')),
    data JSON,
    position INTEGER NOT NULL DEFAULT 0,
    created_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by      VARCHAR(100),
    updated_time    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by      VARCHAR(100),
    user_id        INT8 NOT NULL,
);

-- 创建索引
CREATE INDEX idx_widgets_workspace_id ON widgets(workspace_id);
CREATE INDEX idx_widgets_type ON widgets(type);
CREATE INDEX idx_widgets_position ON widgets(workspace_id, position);
CREATE INDEX idx_widgets_created_time ON widgets(created_time);