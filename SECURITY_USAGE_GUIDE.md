# Spring Security 权限使用指南

## 1. 权限注解使用

### 1.1 基本使用 - @PreAuthorize

```java
@RestController
@RequestMapping("/api/users")
public class SYSUserController {

    // 只有超级管理员才能删除用户
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public CubeResponse<Boolean> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return CubeResponse.success(true);
    }

    // ADMIN 或 SUPER_ADMIN 都可以访问
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PostMapping
    public CubeResponse<Long> createUser(@RequestBody SYSUser user) {
        Long userId = userService.createUser(user);
        return CubeResponse.success(userId);
    }

    // 所有登录用户都可以访问（不检查具体角色）
    @GetMapping("/me")
    public CubeResponse<SYSUser> getCurrentUser(Authentication authentication) {
        String userName = authentication.getName();
        Optional<SYSUser> user = userService.getUserByUserName(userName);
        return CubeResponse.success(user.orElse(null));
    }
}
```

### 1.2 高级用法 - 参数和表达式

```java
@RestController
@RequestMapping("/api/users")
public class SYSUserController {

    // 用户只能修改自己的信息，或者是管理员
    @PreAuthorize("#userId == authentication.principal.username or hasRole('ADMIN')")
    @PutMapping("/{userId}")
    public CubeResponse<Boolean> updateUser(
            @PathVariable Long userId,
            @RequestBody SYSUser user) {
        // ...
    }

    // 组合条件：必须是管理员 AND userId > 100
    @PreAuthorize("hasRole('ADMIN') and #userId > 100")
    @GetMapping("/{userId}")
    public CubeResponse<SYSUser> getUser(@PathVariable Long userId) {
        // ...
    }

    // 检查具体权限（而不是角色）
    @PreAuthorize("hasAuthority('USER_DELETE')")
    @DeleteMapping("/{id}")
    public CubeResponse<Boolean> deleteUser(@PathVariable Long id) {
        // ...
    }
}
```

### 1.3 方法级别的后置检查 - @PostAuthorize

```java
// 在方法执行后检查权限
@PostAuthorize("returnObject.userName == authentication.name or hasRole('ADMIN')")
@GetMapping("/{id}")
public SYSUser getUser(@PathVariable Long id) {
    return userService.getUserById(id).orElse(null);
}
```

---

## 2. 在代码中获取当前用户信息

### 2.1 直接获取 userId（推荐方式）

本系统已经实现了自定义的 `UserPrincipal`，可以直接从 `Authentication` 对象中获取 `userId`，**无需查询数据库**。

```java
import com.cube.security.UserPrincipal;

@RestController
@RequestMapping("/api/menus")
public class SYSMenuController {

    @GetMapping("/my-menus")
    public CubeResponse<List<SYSMenu>> getMyMenus(Authentication authentication) {
        // 直接获取 userId，无需查询数据库
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        Long userId = principal.getUserId();
        String userName = principal.getUsername();

        // 使用 userId 进行业务逻辑
        List<SYSMenu> menus = menuService.getMenusByUserId(userId);

        return CubeResponse.success(menus);
    }

    @GetMapping("/my-info")
    public CubeResponse<Map<String, Object>> getMyInfo(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        Map<String, Object> info = new HashMap<>();
        info.put("userId", principal.getUserId());
        info.put("userName", principal.getUsername());
        info.put("roles", principal.getAuthorities());

        return CubeResponse.success(info);
    }
}
```

**在 Service 层中使用：**

```java
@Service
public class MyService {

    public void someMethod() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            Long userId = principal.getUserId();
            String userName = principal.getUsername();

            // 使用 userId 进行业务逻辑
            // ...
        }
    }
}
```

### 2.2 通过 Authentication 对象获取基本信息

```java
@GetMapping("/example1")
public CubeResponse<String> example1(Authentication authentication) {
    // 获取用户名
    String userName = authentication.getName();

    // 获取权限
    Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

    // 检查是否有某个角色
    boolean isAdmin = authorities.stream()
        .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

    return CubeResponse.success("User: " + userName + ", isAdmin: " + isAdmin);
}
```

### 2.3 通过 SecurityContextHolder（在Service层）

```java
@Service
public class MyService {

    public void someMethod() {
        // 获取当前认证信息
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            String userName = authentication.getName();

            // 获取权限
            boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

            // 使用权限做业务逻辑
            if (isAdmin) {
                // 管理员逻辑
            } else {
                // 普通用户逻辑
            }
        }
    }
}
```

### 2.4 获取用户的roleId（从数据库查询）

```java
@GetMapping("/my-role")
public CubeResponse<Long> getMyRoleId(Authentication authentication) {
    // 获取当前用户名
    String userName = authentication.getName();

    // 查询用户信息
    Optional<SYSUser> userOptional = userService.getUserByUserName(userName);
    if (userOptional.isEmpty()) {
        return CubeResponse.failed("User not found");
    }

    SYSUser user = userOptional.get();

    // 查询用户的角色
    List<SYSUserRole> userRoles = userRoleService.getUserRolesByUserId(user.getUserId());

    if (userRoles.isEmpty()) {
        return CubeResponse.failed("No role assigned");
    }

    // 返回第一个角色ID（如果用户有多个角色）
    Long roleId = userRoles.get(0).getRoleId();

    return CubeResponse.success(roleId);
}
```

---

## 3. 数据库角色配置

### 3.1 角色表结构

```sql
-- 角色表
CUBE_SYS_ROLE
  role_id (主键)
  role_name (角色名，如：ADMIN、MANAGER、USER)

-- 用户角色关联表
CUBE_SYS_USER_ROLE
  id (主键)
  user_id (用户ID)
  role_id (角色ID)
```

### 3.2 角色命名约定

在数据库中的角色名会自动加上 `ROLE_` 前缀：

| 数据库中的role_name | Spring Security中的权限 | 使用方式 |
|-------------------|----------------------|---------|
| ADMIN             | ROLE_ADMIN           | `hasRole('ADMIN')` |
| MANAGER           | ROLE_MANAGER         | `hasRole('MANAGER')` |
| USER              | ROLE_USER            | `hasRole('USER')` |
| EDITOR            | ROLE_EDITOR          | `hasRole('EDITOR')` |

**注意：** `hasRole()` 会自动添加 `ROLE_` 前缀，所以不要写 `hasRole('ROLE_ADMIN')`

---

## 4. 权限检查工具类（可选）

创建一个工具类方便在代码中检查权限：

```java
@Component
public class SecurityUtils {

    /**
     * 获取当前登录用户名
     */
    public static String getCurrentUserName() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }

    /**
     * 检查当前用户是否有某个角色
     */
    public static boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }

        String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        return authentication.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals(roleWithPrefix));
    }

    /**
     * 检查当前用户是否是超级管理员
     */
    public static boolean isSuperAdmin() {
        return hasRole("SUPER_ADMIN");
    }

    /**
     * 获取当前用户的所有角色
     */
    public static List<String> getCurrentUserRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return Collections.emptyList();
        }

        return authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());
    }
}
```

使用方式：

```java
@Service
public class MyService {

    public void doSomething() {
        String userName = SecurityUtils.getCurrentUserName();
        boolean isAdmin = SecurityUtils.hasRole("ADMIN");

        if (isAdmin) {
            // 管理员逻辑
        } else {
            // 普通用户逻辑
        }
    }
}
```

---

## 5. 常见场景示例

### 5.1 用户只能访问自己的数据

**推荐方式（使用 UserPrincipal）：**

```java
@GetMapping("/my-data")
public CubeResponse<List<MyData>> getMyData(Authentication authentication) {
    // 直接获取 userId，无需查询数据库
    UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
    Long userId = principal.getUserId();

    // 只查询当前用户的数据
    List<MyData> data = myDataService.getByUserId(userId);

    return CubeResponse.success(data);
}
```

**传统方式（需要查询数据库）：**

```java
@GetMapping("/my-data-old")
public CubeResponse<List<MyData>> getMyDataOld(Authentication authentication) {
    String userName = authentication.getName();
    SYSUser user = userService.getUserByUserName(userName).orElseThrow();

    // 只查询当前用户的数据
    List<MyData> data = myDataService.getByUserId(user.getUserId());

    return CubeResponse.success(data);
}
```

### 5.2 管理员可以看所有数据，普通用户只能看自己的

```java
@GetMapping("/data")
public CubeResponse<List<MyData>> getData(
        @RequestParam(required = false) Long userId,
        Authentication authentication) {

    boolean isAdmin = authentication.getAuthorities().stream()
        .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

    if (isAdmin && userId != null) {
        // 管理员可以查询任何用户的数据
        return CubeResponse.success(myDataService.getByUserId(userId));
    } else {
        // 普通用户只能查自己的
        String userName = authentication.getName();
        SYSUser user = userService.getUserByUserName(userName).orElseThrow();
        return CubeResponse.success(myDataService.getByUserId(user.getUserId()));
    }
}
```

### 5.3 根据角色返回不同的数据

```java
@GetMapping("/dashboard")
public CubeResponse<DashboardData> getDashboard(Authentication authentication) {
    boolean isAdmin = authentication.getAuthorities().stream()
        .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

    if (isAdmin) {
        // 管理员看到全局统计
        return CubeResponse.success(dashboardService.getGlobalStatistics());
    } else {
        // 普通用户只看自己的统计
        String userName = authentication.getName();
        SYSUser user = userService.getUserByUserName(userName).orElseThrow();
        return CubeResponse.success(dashboardService.getUserStatistics(user.getUserId()));
    }
}
```

---

## 6. 测试权限

### 6.1 在Postman中测试

1. **登录获取token**
```
POST http://localhost:8080/api/auth/login
Body: {
  "userName": "admin",
  "password": "password"
}
```

2. **使用token访问受保护接口**
```
GET http://localhost:8080/api/users
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

3. **测试权限拒绝**
```
DELETE http://localhost:8080/api/users/1
Headers:
  Authorization: Bearer <普通用户的token>

预期结果: 403 Forbidden（如果只有ADMIN才能删除）
```

---

## 7. 权限配置总结

| 配置位置 | 作用 |
|---------|------|
| `SecurityConfig.java` | 配置哪些URL需要认证、哪些公开 |
| `CustomUserDetailsService.java` | 从数据库加载用户角色 |
| `@PreAuthorize` | Controller方法级别的权限控制 |
| `Authentication` 对象 | 获取当前用户信息和权限 |

**核心流程：**
1. 用户登录 → 验证成功 → 生成JWT token
2. 请求携带token → JWT过滤器验证 → 调用CustomUserDetailsService加载角色
3. 设置到SecurityContext → Controller检查@PreAuthorize → 执行业务逻辑