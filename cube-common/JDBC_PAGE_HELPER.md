# JDBC分页工具使用指南

## 简介

JDBC分页工具提供了简单易用的分页查询功能，支持自动生成count查询，帮助开发者快速实现数据分页。

## 支持的数据库

工具支持多种主流数据库，并会**自动检测数据库类型**：

| 数据库 | 版本 | 分页语法 | 说明 |
|--------|------|----------|------|
| **MySQL** | 5.x+ | `LIMIT x OFFSET y` | 默认数据库 |
| **PostgreSQL** | 9.x+ | `LIMIT x OFFSET y` | 与MySQL语法相同 |
| **Oracle** | 12c+ | `OFFSET x ROWS FETCH NEXT y ROWS ONLY` | 使用标准SQL语法 |
| **Oracle** | 11g及以下 | `ROWNUM` | 使用专用类`Oracle11gPageHelper` |

**特性：**
- ✅ **自动检测** - 无需手动配置，自动识别数据库类型
- ✅ **手动指定** - 支持显式指定数据库类型
- ✅ **扩展支持** - 可继承扩展支持其他数据库

**使用示例：**

```java
// 方式1：自动检测数据库类型（推荐）
JdbcPageHelper pageHelper = new JdbcPageHelper(jdbcTemplate);

// 方式2：手动指定数据库类型
JdbcPageHelper mysqlHelper = new JdbcPageHelper(jdbcTemplate, DatabaseType.MYSQL);
JdbcPageHelper pgHelper = new JdbcPageHelper(jdbcTemplate, DatabaseType.POSTGRESQL);
JdbcPageHelper oracleHelper = new JdbcPageHelper(jdbcTemplate, DatabaseType.ORACLE);

// 方式3：Oracle 11g使用专用类
Oracle11gPageHelper oracle11gHelper = new Oracle11gPageHelper(jdbcTemplate);

// 查看当前数据库类型
System.out.println("数据库类型: " + pageHelper.getDatabaseType());
```

## 核心类

### 1. PageRequest - 分页请求参数

封装分页查询的参数，包括页码和每页大小。

**特性：**
- 页码从1开始
- 自动计算offset和limit
- 参数校验（页码和每页大小最小为1）

**使用示例：**

```java
// 方式1：使用构造函数
PageRequest page1 = new PageRequest(1, 10);  // 第1页，每页10条

// 方式2：使用静态方法
PageRequest page2 = PageRequest.of(2, 20);   // 第2页，每页20条

// 获取offset和limit（用于SQL查询）
int offset = page1.getOffset();  // 返回 0
int limit = page1.getLimit();    // 返回 10
```

### 2. PageResult - 分页结果

封装分页查询的结果，包括总记录数、总页数、当前页数据等。

**属性：**
- `pageNum`: 当前页码
- `pageSize`: 每页大小
- `total`: 总记录数
- `pages`: 总页数
- `records`: 当前页数据列表

**方法：**
- `hasPrevious()`: 是否有上一页
- `hasNext()`: 是否有下一页
- `isFirst()`: 是否第一页
- `isLast()`: 是否最后一页
- `getSize()`: 当前页数据数量

**使用示例：**

```java
PageResult<User> result = pageHelper.queryForPage(...);

// 获取分页信息
System.out.println("总记录数: " + result.getTotal());
System.out.println("总页数: " + result.getPages());
System.out.println("当前页: " + result.getPageNum());
System.out.println("当前页数据量: " + result.getSize());

// 判断分页状态
if (result.hasNext()) {
    System.out.println("还有下一页");
}

// 获取当前页数据
List<User> users = result.getRecords();
users.forEach(System.out::println);
```

### 3. JdbcPageHelper - 分页工具类

提供分页查询的核心功能。

**主要方法：**

1. `queryForPage(String sql, PageRequest pageRequest, RowMapper<T> rowMapper, Object... args)`
   - 使用RowMapper进行结果映射

2. `queryForPage(String sql, PageRequest pageRequest, Class<T> elementType, Object... args)`
   - 适用于简单类型（String, Integer, Long等）

3. `queryTotal(String sql, Object... args)`
   - 单独查询总记录数

## 使用示例

### 基本使用

```java
import com.cube.common.page.JdbcPageHelper;
import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;
import org.springframework.jdbc.core.JdbcTemplate;

public class UserService {

    private final JdbcPageHelper pageHelper;

    public UserService(JdbcTemplate jdbcTemplate) {
        this.pageHelper = new JdbcPageHelper(jdbcTemplate);
    }

    public PageResult<User> getUserPage(int pageNum, int pageSize, Integer status) {
        // 1. 创建分页请求
        PageRequest pageRequest = PageRequest.of(pageNum, pageSize);

        // 2. 准备SQL
        String sql = "SELECT id, name, email, status, create_time " +
                     "FROM user " +
                     "WHERE status = ? " +
                     "ORDER BY create_time DESC";

        // 3. 执行分页查询
        return pageHelper.queryForPage(
            sql,
            pageRequest,
            (rs, rowNum) -> {
                User user = new User();
                user.setId(rs.getLong("id"));
                user.setName(rs.getString("name"));
                user.setEmail(rs.getString("email"));
                user.setStatus(rs.getInt("status"));
                user.setCreateTime(rs.getTimestamp("create_time"));
                return user;
            },
            status
        );
    }
}
```

### Spring Boot集成

#### 1. 配置Bean

```java
import com.cube.common.page.JdbcPageHelper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class PageHelperConfig {

    @Bean
    public JdbcPageHelper jdbcPageHelper(JdbcTemplate jdbcTemplate) {
        return new JdbcPageHelper(jdbcTemplate);
    }
}
```

#### 2. 在Service中使用

```java
import com.cube.common.page.JdbcPageHelper;
import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final JdbcPageHelper pageHelper;

    public UserService(JdbcPageHelper pageHelper) {
        this.pageHelper = pageHelper;
    }

    public PageResult<User> findUsers(int pageNum, int pageSize) {
        PageRequest pageRequest = PageRequest.of(pageNum, pageSize);
        String sql = "SELECT * FROM user WHERE deleted = 0 ORDER BY id DESC";

        return pageHelper.queryForPage(sql, pageRequest, new UserRowMapper());
    }
}
```

#### 3. 在Controller中使用

```java
import com.cube.common.page.PageResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public PageResult<User> getUsers(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize) {
        return userService.findUsers(pageNum, pageSize);
    }
}
```

### 高级用法

#### 1. 动态SQL查询

```java
public PageResult<User> searchUsers(UserQuery query, int pageNum, int pageSize) {
    PageRequest pageRequest = PageRequest.of(pageNum, pageSize);

    // 动态构建SQL
    StringBuilder sql = new StringBuilder("SELECT * FROM user WHERE 1=1");
    List<Object> params = new ArrayList<>();

    if (query.getName() != null) {
        sql.append(" AND name LIKE ?");
        params.add("%" + query.getName() + "%");
    }

    if (query.getStatus() != null) {
        sql.append(" AND status = ?");
        params.add(query.getStatus());
    }

    sql.append(" ORDER BY create_time DESC");

    return pageHelper.queryForPage(
        sql.toString(),
        pageRequest,
        new UserRowMapper(),
        params.toArray()
    );
}
```

#### 2. 查询简单类型

```java
// 查询ID列表
public PageResult<Long> getUserIds(int pageNum, int pageSize) {
    PageRequest pageRequest = PageRequest.of(pageNum, pageSize);
    String sql = "SELECT id FROM user ORDER BY id";

    return pageHelper.queryForPage(sql, pageRequest, Long.class);
}

// 查询用户名列表
public PageResult<String> getUserNames(int pageNum, int pageSize) {
    PageRequest pageRequest = PageRequest.of(pageNum, pageSize);
    String sql = "SELECT name FROM user ORDER BY name";

    return pageHelper.queryForPage(sql, pageRequest, String.class);
}
```

#### 3. 自定义RowMapper

```java
public class UserRowMapper implements RowMapper<User> {
    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        user.setStatus(rs.getInt("status"));
        user.setCreateTime(rs.getTimestamp("create_time"));
        return user;
    }
}

// 使用自定义RowMapper
PageResult<User> result = pageHelper.queryForPage(
    sql,
    pageRequest,
    new UserRowMapper(),
    args
);
```

#### 4. 只查询总数

```java
public long getTotalUsers(Integer status) {
    String sql = "SELECT * FROM user WHERE status = ?";
    return pageHelper.queryTotal(sql, status);
}
```

## 性能优化

### 1. COUNT查询优化

工具会自动移除ORDER BY子句以提高count查询性能：

```sql
-- 原始SQL
SELECT * FROM user WHERE status = ? ORDER BY create_time DESC

-- 自动生成的COUNT SQL
SELECT COUNT(*) FROM (SELECT * FROM user WHERE status = ?) AS count_table
```

### 2. 索引优化建议

- 为WHERE条件字段添加索引
- 为ORDER BY字段添加索引
- 使用覆盖索引提高查询效率

### 3. 大数据量优化

对于大数据量分页，建议：
- 限制最大页码（避免深度分页）
- 使用游标分页（基于ID范围）
- 使用缓存存储总记录数

## 注意事项

1. **SQL注入防护**
   - 始终使用参数化查询（`?` 占位符）
   - 不要直接拼接用户输入到SQL中

2. **数据库兼容性**
   - 默认使用MySQL的LIMIT/OFFSET语法
   - 其他数据库需要重写`buildPageSql()`方法

3. **性能考虑**
   - 避免深度分页（pageNum过大）
   - 复杂查询考虑分离count和data查询
   - 合理设置pageSize，避免单次查询过多数据

4. **空结果处理**
   - 当总记录数为0时，直接返回空结果，不执行数据查询
   - `PageResult.empty()` 返回空分页结果

## 完整示例

参考测试类：`com.cube.JdbcPageHelperExample`

运行示例：

```bash
cd cube-common
mvn test-compile
java -cp target/classes:target/test-classes com.cube.JdbcPageHelperExample
```

## 常见问题

### Q: 如何处理复杂的JOIN查询？
A: 直接编写完整的SQL语句，工具会自动生成对应的count查询。

```java
String sql = "SELECT u.*, r.role_name " +
             "FROM user u " +
             "LEFT JOIN role r ON u.role_id = r.id " +
             "WHERE u.status = ? " +
             "ORDER BY u.create_time DESC";
```

### Q: 如何自定义count查询？
A: 可以继承`JdbcPageHelper`并重写`buildCountSql()`方法。

```java
public class CustomPageHelper extends JdbcPageHelper {
    @Override
    protected String buildCountSql(String sql) {
        // 自定义count查询逻辑
        return "SELECT COUNT(DISTINCT user_id) FROM (" + sql + ") AS t";
    }
}
```

### Q: 如何在Oracle数据库中使用？
A: 工具会自动检测Oracle数据库并使用对应的分页语法。

```java
// Oracle 12c及以上版本（自动检测）
JdbcPageHelper pageHelper = new JdbcPageHelper(jdbcTemplate);
// 自动使用: OFFSET x ROWS FETCH NEXT y ROWS ONLY

// Oracle 11g及以下版本（使用专用类）
Oracle11gPageHelper pageHelper = new Oracle11gPageHelper(jdbcTemplate);
// 自动使用: ROWNUM语法
```

### Q: 如何查看当前使用的数据库类型？
A: 使用`getDatabaseType()`方法查看。

```java
JdbcPageHelper pageHelper = new JdbcPageHelper(jdbcTemplate);
DatabaseType dbType = pageHelper.getDatabaseType();
System.out.println("数据库类型: " + dbType);  // 输出: MySQL, PostgreSQL, Oracle等
```

### Q: 自动检测失败怎么办？
A: 可以手动指定数据库类型。

```java
// 手动指定为MySQL
JdbcPageHelper pageHelper = new JdbcPageHelper(jdbcTemplate, DatabaseType.MYSQL);

// 或使用静态工厂方法
JdbcPageHelper pageHelper = JdbcPageHelper.create(jdbcTemplate, DatabaseType.POSTGRESQL);
```
