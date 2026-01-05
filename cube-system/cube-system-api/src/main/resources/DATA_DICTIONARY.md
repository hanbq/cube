# 系统数据字典

生成时间：2025-12-24

## 表总览

| 序号 | 表名 | 中文名称 | 说明 |
|------|------|----------|------|
| 1 | CUBE_SYS_BUTTON | 按钮表 | 存储系统按钮权限配置 |
| 2 | CUBE_SYS_USER | 用户表 | 存储系统用户信息 |
| 3 | CUBE_SYS_ROLE | 角色表 | 存储系统角色信息 |
| 4 | CUBE_SYS_MENU | 菜单表 | 存储系统菜单信息（树形结构） |
| 5 | CUBE_SYS_USER_ROLE | 用户角色关联表 | 存储用户与角色的多对多关系 |
| 6 | CUBE_SYS_MENU_ROLE | 菜单角色关联表 | 存储菜单与角色的多对多关系 |
| 7 | CUBE_SYS_BUTTON_ROLE | 按钮角色关联表 | 存储按钮与角色的多对多关系 |
| 8 | CUBE_SYS_SYS_LOG | 系统日志表 | 存储系统操作日志 |

---

## 1. CUBE_SYS_BUTTON（按钮表）

**表说明**：存储系统按钮权限配置

| 序号 | 字段名 | 类型 | 长度 | 主键 | 非空 | 默认值 | 说明 |
|------|--------|------|------|------|------|--------|------|
| 1 | button_id | BIGINT | - | ✓ | ✓ | 自增 | 按钮ID（主键） |
| 2 | button_name | VARCHAR | 100 | | ✓ | | 按钮名称 |
| 3 | description | VARCHAR | 500 | | | | 描述 |
| 4 | created_time | TIMESTAMP | - | | | CURRENT_TIMESTAMP | 创建时间 |
| 5 | created_by | VARCHAR | 100 | | | | 创建人 |
| 6 | updated_time | TIMESTAMP | - | | | CURRENT_TIMESTAMP | 更新时间 |
| 7 | updated_by | VARCHAR | 100 | | | | 更新人 |
| 8 | deleted | BOOLEAN | - | | | FALSE | 删除标记 |

**索引**：
- PRIMARY KEY: button_id

---

## 2. CUBE_SYS_USER（用户表）

**表说明**：存储系统用户信息

| 序号 | 字段名 | 类型 | 长度 | 主键 | 非空 | 默认值 | 说明 |
|------|--------|------|------|------|------|--------|------|
| 1 | user_id | BIGINT | - | ✓ | ✓ | 自增 | 用户ID（主键） |
| 2 | user_name | VARCHAR | 100 | | ✓ | | 用户名（唯一） |
| 3 | password | VARCHAR | 255 | | ✓ | | 密码（加密存储） |
| 4 | description | VARCHAR | 500 | | | | 描述 |
| 5 | email | VARCHAR | 255 | | | | 邮箱 |
| 6 | status | VARCHAR | 20 | | | 'ACTIVE' | 状态（ACTIVE/INACTIVE） |
| 7 | created_time | TIMESTAMP | - | | | CURRENT_TIMESTAMP | 创建时间 |
| 8 | created_by | VARCHAR | 100 | | | | 创建人 |
| 9 | updated_time | TIMESTAMP | - | | | CURRENT_TIMESTAMP | 更新时间 |
| 10 | updated_by | VARCHAR | 100 | | | | 更新人 |
| 11 | deleted | BOOLEAN | - | | | FALSE | 删除标记 |

**索引**：
- PRIMARY KEY: user_id
- UNIQUE KEY: user_name
- INDEX: idx_user_name
- INDEX: idx_user_email
- INDEX: idx_user_status
- INDEX: idx_user_deleted

**约束**：
- user_name 唯一约束

---

## 3. CUBE_SYS_ROLE（角色表）

**表说明**：存储系统角色信息

| 序号 | 字段名 | 类型 | 长度 | 主键 | 非空 | 默认值 | 说明 |
|------|--------|------|------|------|------|--------|------|
| 1 | role_id | BIGINT | - | ✓ | ✓ | 自增 | 角色ID（主键） |
| 2 | role_name | VARCHAR | 100 | | ✓ | | 角色名称（唯一） |
| 3 | description | VARCHAR | 500 | | | | 描述 |

**索引**：
- PRIMARY KEY: role_id
- UNIQUE KEY: role_name
- INDEX: idx_role_name

**约束**：
- role_name 唯一约束

**预设角色**：
- ADMIN - 系统管理员
- USER - 普通用户

---

## 4. CUBE_SYS_MENU（菜单表）

**表说明**：存储系统菜单信息（树形结构）

| 序号 | 字段名 | 类型 | 长度 | 主键 | 非空 | 默认值 | 说明 |
|------|--------|------|------|------|------|--------|------|
| 1 | menu_id | BIGINT | - | ✓ | ✓ | 自增 | 菜单ID（主键） |
| 2 | menu_name | VARCHAR | 100 | | ✓ | | 菜单名称 |
| 3 | path | VARCHAR | 255 | | | | 菜单路径（路由路径） |
| 4 | icon_cls | VARCHAR | 100 | | | | 图标样式类 |
| 5 | parent_id | BIGINT | - | | | | 父菜单ID（自关联） |
| 6 | sort | INTEGER | - | | | 0 | 排序号 |
| 7 | component | VARCHAR | 255 | | | | 组件路径 |
| 8 | created_time | TIMESTAMP | - | | | CURRENT_TIMESTAMP | 创建时间 |
| 9 | created_by | VARCHAR | 100 | | | | 创建人 |
| 10 | updated_time | TIMESTAMP | - | | | CURRENT_TIMESTAMP | 更新时间 |
| 11 | updated_by | VARCHAR | 100 | | | | 更新人 |
| 12 | deleted | BOOLEAN | - | | | FALSE | 删除标记 |

**索引**：
- PRIMARY KEY: menu_id
- INDEX: idx_menu_parent_id
- INDEX: idx_menu_sort
- INDEX: idx_menu_deleted

**外键**：
- fk_menu_parent: parent_id → CUBE_SYS_MENU.menu_id (CASCADE)

**树形结构说明**：
- parent_id = NULL 表示根节点菜单
- parent_id 指向父菜单的 menu_id
- 通过 sort 字段控制同级菜单的显示顺序

---

## 5. CUBE_SYS_USER_ROLE（用户角色关联表）

**表说明**：存储用户与角色的多对多关系

| 序号 | 字段名 | 类型 | 长度 | 主键 | 非空 | 默认值 | 说明 |
|------|--------|------|------|------|------|--------|------|
| 1 | id | BIGINT | - | ✓ | ✓ | 自增 | 主键ID |
| 2 | user_id | BIGINT | - | | ✓ | | 用户ID |
| 3 | role_id | BIGINT | - | | ✓ | | 角色ID |
| 4 | created_time | TIMESTAMP | - | | | CURRENT_TIMESTAMP | 创建时间 |
| 5 | created_by | VARCHAR | 100 | | | | 创建人 |
| 6 | updated_time | TIMESTAMP | - | | | CURRENT_TIMESTAMP | 更新时间 |
| 7 | updated_by | VARCHAR | 100 | | | | 更新人 |
| 8 | deleted | BOOLEAN | - | | | FALSE | 删除标记 |

**索引**：
- PRIMARY KEY: id
- INDEX: idx_user_role_user_id
- INDEX: idx_user_role_role_id
- UNIQUE KEY: uk_user_role (user_id, role_id)

**外键**：
- fk_user_role_user: user_id → CUBE_SYS_USER.user_id (CASCADE)
- fk_user_role_role: role_id → CUBE_SYS_ROLE.role_id (CASCADE)

**约束**：
- (user_id, role_id) 复合唯一约束，防止重复分配

---

## 6. CUBE_SYS_MENU_ROLE（菜单角色关联表）

**表说明**：存储菜单与角色的多对多关系

| 序号 | 字段名 | 类型 | 长度 | 主键 | 非空 | 默认值 | 说明 |
|------|--------|------|------|------|------|--------|------|
| 1 | id | BIGINT | - | ✓ | ✓ | 自增 | 主键ID |
| 2 | menu_id | BIGINT | - | | ✓ | | 菜单ID |
| 3 | role_id | BIGINT | - | | ✓ | | 角色ID |
| 4 | created_time | TIMESTAMP | - | | | CURRENT_TIMESTAMP | 创建时间 |
| 5 | created_by | VARCHAR | 100 | | | | 创建人 |
| 6 | updated_time | TIMESTAMP | - | | | CURRENT_TIMESTAMP | 更新时间 |
| 7 | updated_by | VARCHAR | 100 | | | | 更新人 |
| 8 | deleted | BOOLEAN | - | | | FALSE | 删除标记 |

**索引**：
- PRIMARY KEY: id
- INDEX: idx_menu_role_menu_id
- INDEX: idx_menu_role_role_id
- UNIQUE KEY: uk_menu_role (menu_id, role_id)

**外键**：
- fk_menu_role_menu: menu_id → CUBE_SYS_MENU.menu_id (CASCADE)
- fk_menu_role_role: role_id → CUBE_SYS_ROLE.role_id (CASCADE)

**约束**：
- (menu_id, role_id) 复合唯一约束，防止重复分配

---

## 7. CUBE_SYS_BUTTON_ROLE（按钮角色关联表）

**表说明**：存储按钮与角色的多对多关系

| 序号 | 字段名 | 类型 | 长度 | 主键 | 非空 | 默认值 | 说明 |
|------|--------|------|------|------|------|--------|------|
| 1 | id | BIGINT | - | ✓ | ✓ | 自增 | 主键ID |
| 2 | button_id | BIGINT | - | | ✓ | | 按钮ID |
| 3 | role_id | BIGINT | - | | ✓ | | 角色ID |
| 4 | created_time | TIMESTAMP | - | | | CURRENT_TIMESTAMP | 创建时间 |
| 5 | created_by | VARCHAR | 100 | | | | 创建人 |
| 6 | updated_time | TIMESTAMP | - | | | CURRENT_TIMESTAMP | 更新时间 |
| 7 | updated_by | VARCHAR | 100 | | | | 更新人 |
| 8 | deleted | BOOLEAN | - | | | FALSE | 删除标记 |

**索引**：
- PRIMARY KEY: id
- INDEX: idx_button_role_button_id
- INDEX: idx_button_role_role_id
- UNIQUE KEY: uk_button_role (button_id, role_id)

**外键**：
- fk_button_role_button: button_id → CUBE_SYS_BUTTON.button_id (CASCADE)
- fk_button_role_role: role_id → CUBE_SYS_ROLE.role_id (CASCADE)

**约束**：
- (button_id, role_id) 复合唯一约束，防止重复分配

---

## 8. CUBE_SYS_SYS_LOG（系统日志表）

**表说明**：存储系统操作日志

| 序号 | 字段名 | 类型 | 长度 | 主键 | 非空 | 默认值 | 说明 |
|------|--------|------|------|------|------|--------|------|
| 1 | log_id | BIGINT | - | ✓ | ✓ | 自增 | 日志ID（主键） |
| 2 | user_name | VARCHAR | 100 | | | | 操作用户名 |
| 3 | operation | VARCHAR | 200 | | | | 操作描述 |
| 4 | method | VARCHAR | 500 | | | | 调用方法名 |
| 5 | params | TEXT | - | | | | 请求参数（JSON格式） |
| 6 | ip | VARCHAR | 50 | | | | 操作IP地址 |
| 7 | created_time | TIMESTAMP | - | | | CURRENT_TIMESTAMP | 创建时间 |

**索引**：
- PRIMARY KEY: log_id
- INDEX: idx_log_user_name
- INDEX: idx_log_created_time

**注意事项**：
- 日志表不需要 updated_time 和 deleted 字段
- params 使用 TEXT 类型存储大量参数数据
- 建议定期归档或清理历史日志

---

## 数据类型映射

### PostgreSQL vs MySQL

| Java类型 | PostgreSQL | MySQL |
|----------|------------|-------|
| Long | BIGINT | BIGINT |
| String | VARCHAR(n) | VARCHAR(n) |
| String (大文本) | TEXT | TEXT |
| ZonedDateTime | TIMESTAMP WITH TIME ZONE | DATETIME |
| Boolean | BOOLEAN | TINYINT(1) |
| Integer | INTEGER | INT |

---

## 字段命名规范

1. **驼峰命名转下划线**
   - Java: userId → Database: user_id
   - Java: createdTime → Database: created_time

2. **主键命名**
   - 格式：{表名单数}_id
   - 示例：user_id, role_id, menu_id

3. **外键命名**
   - 格式：{关联表名单数}_id
   - 示例：user_id, role_id (在关联表中)

4. **索引命名**
   - 普通索引：idx_{表名}_{字段名}
   - 唯一索引：uk_{表名}_{字段名}
   - 外键：fk_{表名}_{关联表名}

---

## 软删除机制

所有继承 BaseBean 的表都支持软删除：

- **deleted 字段**：BOOLEAN类型，默认为 FALSE
- **删除操作**：将 deleted 设置为 TRUE，不实际删除数据
- **查询时**：添加 `WHERE deleted = FALSE` 条件
- **优点**：
  - 数据可恢复
  - 保留数据历史
  - 避免级联删除问题

---

## 审计字段

所有继承 BaseBean 的表都包含审计字段：

| 字段 | 说明 | 使用场景 |
|------|------|----------|
| created_time | 创建时间 | 记录数据创建时间 |
| created_by | 创建人 | 记录是谁创建的数据 |
| updated_time | 更新时间 | 记录最后修改时间（自动更新） |
| updated_by | 更新人 | 记录是谁最后修改的 |

**自动更新机制**：
- PostgreSQL: 通过触发器自动更新 updated_time
- MySQL: 通过 `ON UPDATE CURRENT_TIMESTAMP` 自动更新

---

## 权限控制模型

### RBAC（基于角色的访问控制）

```
用户(User) → 用户角色(UserRole) → 角色(Role)
                                      ↓
                        菜单角色(MenuRole) → 菜单(Menu)
                        按钮角色(ButtonRole) → 按钮(Button)
```

### 权限检查流程

1. 用户登录获取用户ID
2. 通过 USER_ROLE 表查询用户的所有角色
3. 通过 MENU_ROLE 表查询角色可访问的菜单
4. 通过 BUTTON_ROLE 表查询角色可使用的按钮
5. 前端根据权限显示/隐藏菜单和按钮

---

## 维护建议

1. **定期清理日志**
   ```sql
   -- 删除30天前的日志
   DELETE FROM CUBE_SYS_SYS_LOG
   WHERE created_time < CURRENT_TIMESTAMP - INTERVAL '30 days';
   ```

2. **性能监控**
   - 监控慢查询
   - 定期 ANALYZE 表
   - 检查索引使用情况

3. **备份策略**
   - 每日全量备份
   - 关键操作前手动备份
   - 定期验证备份可用性

4. **安全建议**
   - 密码使用 BCrypt 加密
   - 敏感字段考虑加密存储
   - 定期审计用户权限
