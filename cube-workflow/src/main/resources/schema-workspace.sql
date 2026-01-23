-- 工作区相关数据库表设计
-- 适配前端 Workspace 和 Widget 接口

-- ========================================
-- 1. 工作区表 (workspaces)
-- 存储工作区的基本信息
-- ========================================
CREATE TABLE IF NOT EXISTS workspaces (
    id VARCHAR(36) PRIMARY KEY DEFAULT (uuid_generate_v4()),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_workspaces_name ON workspaces(name);
CREATE INDEX idx_workspaces_is_default ON workspaces(is_default);
CREATE INDEX idx_workspaces_created_at ON workspaces(created_at);

-- ========================================
-- 2. 小组件表 (widgets)
-- 存储工作区内的小组件信息
-- ========================================
CREATE TABLE IF NOT EXISTS widgets (
    id VARCHAR(36) PRIMARY KEY DEFAULT (uuid_generate_v4()),
    workspace_id VARCHAR(36) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('statistic', 'chart', 'table', 'text')),
    title VARCHAR(100) NOT NULL,
    content JSONB,
    size VARCHAR(10) NOT NULL CHECK (size IN ('small', 'medium', 'large')),
    data JSONB,
    data_source JSONB,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- 其他自定义属性存储在JSON字段中
    properties JSONB
);

-- 创建索引
CREATE INDEX idx_widgets_workspace_id ON widgets(workspace_id);
CREATE INDEX idx_widgets_type ON widgets(type);
CREATE INDEX idx_widgets_position ON widgets(workspace_id, position);
CREATE INDEX idx_widgets_created_at ON widgets(created_at);