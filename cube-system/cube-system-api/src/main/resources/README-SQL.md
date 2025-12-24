# 数据库DDL脚本说明

## 概述

本目录包含了基于 `com.cube.system.bean` 包下实体类生成的数据库DDL脚本。

## 文件列表

### PostgreSQL

1. **schema-postgresql.sql** - PostgreSQL建表脚本
   - 包含所有表的创建语句
   - 包含索引、外键约束
   - 包含自动更新时间的触发器
   - 包含表和字段注释

2. **drop-postgresql.sql** - PostgreSQL删除表脚本
   - 按依赖关系删除所有表
   - 删除触发器和函数

### MySQL

3. **schema-mysql.sql** - MySQL建表脚本
   - 包含所有表的创建语句
   - 包含索引、外键约束
   - 使用 `ON UPDATE CURRENT_TIMESTAMP` 自动更新时间

## 表结构说明

### 实体表（8张）

| 序号 | 表名 | 说明 | 主键 | 继承BaseBean |
|------|------|------|------|-------------|
| 1 | CUBE_SYS_BUTTON | 按钮表 | button_id | 是 |
| 2 | CUBE_SYS_USER | 用户表 | user_id | 是 |
| 3 | CUBE_SYS_ROLE | 角色表 | role_id | 否 |
| 4 | CUBE_SYS_MENU | 菜单表 | menu_id | 是 |
| 5 | CUBE_SYS_USER_ROLE | 用户角色关联表 | id | 是 |
| 6 | CUBE_SYS_MENU_ROLE | 菜单角色关联表 | id | 是 |
| 7 | CUBE_SYS_BUTTON_ROLE | 按钮角色关联表 | id | 是 |
| 8 | CUBE_SYS_SYS_LOG | 系统日志表 | log_id | 否 |

### BaseBean字段说明

继承 `BaseBean` 的表包含以下通用字段：

- `created_time` - 创建时间（TIMESTAMP WITH TIME ZONE / DATETIME）
- `created_by` - 创建人（VARCHAR(100)）
- `updated_time` - 更新时间（TIMESTAMP WITH TIME ZONE / DATETIME）
- `updated_by` - 更新人（VARCHAR(100)）
- `deleted` - 删除标记（BOOLEAN / TINYINT(1)）

## 使用方法

### PostgreSQL

#### 1. 创建表

```bash
# 方式1：使用psql命令行
psql -U username -d database_name -f schema-postgresql.sql

# 方式2：在psql中执行
\i /path/to/schema-postgresql.sql
```

#### 2. 删除表

```bash
psql -U username -d database_name -f drop-postgresql.sql
```

#### 3. 验证表创建

```sql
-- 查看所有表
\dt CUBE_SYS_*

-- 查看表结构
\d CUBE_SYS_USER

-- 查看表注释
SELECT
    c.relname AS table_name,
    obj_description(c.oid) AS table_comment
FROM pg_class c
WHERE c.relname LIKE 'cube_sys_%'
ORDER BY c.relname;
```

### MySQL

#### 1. 创建表

```bash
# 方式1：使用mysql命令行
mysql -u username -p database_name < schema-mysql.sql

# 方式2：在mysql中执行
source /path/to/schema-mysql.sql
```

#### 2. 验证表创建

```sql
-- 查看所有表
SHOW TABLES LIKE 'CUBE_SYS_%';

-- 查看表结构
DESC CUBE_SYS_USER;

-- 查看建表语句
SHOW CREATE TABLE CUBE_SYS_USER;
```

## 表关系说明

### ER关系

```
CUBE_SYS_USER (用户)
    ↓ 1:N
CUBE_SYS_USER_ROLE (用户角色关联)
    ↓ N:1
CUBE_SYS_ROLE (角色)
    ↓ 1:N
CUBE_SYS_MENU_ROLE (菜单角色关联)
    ↓ N:1
CUBE_SYS_MENU (菜单)

CUBE_SYS_ROLE
    ↓ 1:N
CUBE_SYS_BUTTON_ROLE (按钮角色关联)
    ↓ N:1
CUBE_SYS_BUTTON (按钮)

CUBE_SYS_MENU (菜单自关联)
    ↓ 1:N
CUBE_SYS_MENU (子菜单)
```

### 外键约束

1. **CUBE_SYS_MENU.parent_id** → CUBE_SYS_MENU.menu_id
   - 菜单自关联，支持树形结构

2. **CUBE_SYS_USER_ROLE.user_id** → CUBE_SYS_USER.user_id
   - 用户角色关联到用户

3. **CUBE_SYS_USER_ROLE.role_id** → CUBE_SYS_ROLE.role_id
   - 用户角色关联到角色

4. **CUBE_SYS_MENU_ROLE.menu_id** → CUBE_SYS_MENU.menu_id
   - 菜单角色关联到菜单

5. **CUBE_SYS_MENU_ROLE.role_id** → CUBE_SYS_ROLE.role_id
   - 菜单角色关联到角色

6. **CUBE_SYS_BUTTON_ROLE.button_id** → CUBE_SYS_BUTTON.button_id
   - 按钮角色关联到按钮

7. **CUBE_SYS_BUTTON_ROLE.role_id** → CUBE_SYS_ROLE.role_id
   - 按钮角色关联到角色

## 索引说明

### 主要索引

1. **用户表（CUBE_SYS_USER）**
   - `idx_user_name` - 用户名索引（查询优化）
   - `idx_user_email` - 邮箱索引（查询优化）
   - `idx_user_status` - 状态索引（按状态筛选）
   - `idx_user_deleted` - 删除标记索引（软删除查询）

2. **角色表（CUBE_SYS_ROLE）**
   - `idx_role_name` - 角色名索引（查询优化）

3. **菜单表（CUBE_SYS_MENU）**
   - `idx_menu_parent_id` - 父菜单ID索引（树形查询）
   - `idx_menu_sort` - 排序索引（排序查询）
   - `idx_menu_deleted` - 删除标记索引（软删除查询）

4. **关联表索引**
   - 所有关联表都在外键字段上建立索引

## 特殊功能

### PostgreSQL特有功能

1. **自动更新时间触发器**
   - 所有继承BaseBean的表都有自动更新 `updated_time` 的触发器
   - 在 UPDATE 操作时自动更新为当前时间

2. **BIGSERIAL类型**
   - 主键使用 BIGSERIAL 类型，自动递增
   - 等同于 BIGINT + SEQUENCE

3. **TIMESTAMP WITH TIME ZONE**
   - 时间字段使用带时区的时间戳
   - 支持跨时区应用

### MySQL特有功能

1. **AUTO_INCREMENT**
   - 主键自动递增

2. **ON UPDATE CURRENT_TIMESTAMP**
   - `updated_time` 字段自动更新

3. **引擎选择**
   - 使用 InnoDB 引擎
   - 支持事务和外键

## 初始化数据

脚本中包含了默认角色的初始化数据：

- `ADMIN` - 系统管理员
- `USER` - 普通用户

默认用户的初始化语句已注释，使用前需要：
1. 使用BCrypt等算法加密密码
2. 取消注释并填入加密后的密码

## 注意事项

1. **时区问题**
   - PostgreSQL使用 `TIMESTAMP WITH TIME ZONE`
   - MySQL使用 `DATETIME`
   - 建议统一使用UTC时区

2. **软删除**
   - 使用 `deleted` 字段标记删除
   - 查询时需要添加 `WHERE deleted = false` 条件

3. **外键级联**
   - 所有外键使用 `ON DELETE CASCADE`
   - 删除主表数据时会级联删除关联数据

4. **唯一约束**
   - 用户名（user_name）有唯一约束
   - 角色名（role_name）有唯一约束
   - 关联表有复合唯一约束

5. **字段长度**
   - 根据实际业务需求调整字段长度
   - params 字段使用 TEXT 类型存储大文本

## 升级与维护

### 添加新字段

```sql
-- PostgreSQL
ALTER TABLE CUBE_SYS_USER ADD COLUMN phone VARCHAR(20);
COMMENT ON COLUMN CUBE_SYS_USER.phone IS '手机号';

-- MySQL
ALTER TABLE `CUBE_SYS_USER` ADD COLUMN `phone` VARCHAR(20) COMMENT '手机号';
```

### 修改字段

```sql
-- PostgreSQL
ALTER TABLE CUBE_SYS_USER ALTER COLUMN email TYPE VARCHAR(320);

-- MySQL
ALTER TABLE `CUBE_SYS_USER` MODIFY COLUMN `email` VARCHAR(320);
```

### 添加索引

```sql
-- PostgreSQL
CREATE INDEX idx_user_phone ON CUBE_SYS_USER(phone);

-- MySQL
CREATE INDEX `idx_user_phone` ON `CUBE_SYS_USER`(`phone`);
```

## 性能建议

1. **定期分析表**
   ```sql
   -- PostgreSQL
   ANALYZE CUBE_SYS_USER;

   -- MySQL
   ANALYZE TABLE CUBE_SYS_USER;
   ```

2. **监控慢查询**
   - 开启慢查询日志
   - 定期检查和优化

3. **分区表**
   - 对日志表考虑按时间分区
   - 提高查询和维护效率

4. **索引优化**
   - 定期检查索引使用情况
   - 删除未使用的索引

## 备份建议

```bash
# PostgreSQL备份
pg_dump -U username -d database_name -t 'CUBE_SYS_*' -f backup.sql

# MySQL备份
mysqldump -u username -p database_name CUBE_SYS_* > backup.sql
```

## 联系方式

如有问题，请联系开发团队。
