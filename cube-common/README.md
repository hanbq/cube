# Cube Common 组件

本组件提供通用工具类和基础功能支持。

## 功能列表

- **雪花ID生成器** - 分布式唯一ID生成
- **JDBC分页工具** - 简单易用的分页查询

---

## JDBC分页工具

### 快速开始

```java
import com.cube.common.page.JdbcPageHelper;
import com.cube.common.page.PageRequest;
import com.cube.common.page.PageResult;

// 1. 创建分页工具（自动检测数据库类型）
JdbcPageHelper pageHelper = new JdbcPageHelper(jdbcTemplate);

// 2. 执行分页查询
PageRequest pageRequest = PageRequest.of(1, 10);  // 第1页，每页10条
PageResult<User> result = pageHelper.queryForPage(
    "SELECT * FROM user WHERE status = ?",
    pageRequest,
    (rs, rowNum) -> {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setName(rs.getString("name"));
        return user;
    },
    1  // status参数
);

// 3. 使用结果
System.out.println("总记录数: " + result.getTotal());
System.out.println("总页数: " + result.getPages());
result.getRecords().forEach(System.out::println);
```

### 核心特性

- **多数据库支持** - 自动支持MySQL、PostgreSQL、Oracle
- **自动检测** - 智能识别数据库类型，无需手动配置
- **自动生成COUNT查询** - 无需手写count SQL
- **简洁的API** - 链式调用，易于使用
- **性能优化** - 自动移除ORDER BY提高count查询性能
- **类型安全** - 泛型支持，编译时类型检查
- **Spring集成** - 无缝集成Spring Boot

### 详细文档

查看完整文档：[JDBC_PAGE_HELPER.md](JDBC_PAGE_HELPER.md)

---

## 雪花ID生成器

### 简介

雪花ID（Snowflake ID）是Twitter开发的分布式ID生成算法，可以生成全局唯一的64位整数ID。

#### 特点

- **趋势递增**：生成的ID按时间递增
- **不依赖数据库**：无需依赖数据库等外部系统
- **高性能**：理论上单机每秒可生成409.6万个ID
- **按时间有序**：ID包含时间戳信息
- **线程安全**：支持多线程并发生成
- **自动配置**：无需手动配置，基于MAC地址自动生成机器ID

#### ID结构（64位）

```
+----------+----------+----------+----------+
| 1位符号位 | 41位时间戳 | 10位机器ID | 12位序列号 |
+----------+----------+----------+----------+
|    0     | 时间差值ms | 数据中心+机器 | 毫秒内序号 |
+----------+----------+----------+----------+
```

- **1位符号位**：固定为0
- **41位时间戳**：精确到毫秒，可使用约69年
- **10位工作机器ID**：5位数据中心ID + 5位机器ID，最多支持1024个节点
- **12位序列号**：同一毫秒内的序列号，最多支持4096个ID

### 使用方法

#### 方式一：使用单例工具类（推荐）

```java
import com.cube.common.utils.SnowflakeIdUtil;

// 直接使用默认配置生成ID（自动生成机器ID）
long id = SnowflakeIdUtil.nextId();

// 生成字符串格式的ID
String idStr = SnowflakeIdUtil.nextIdStr();

// 解析ID
SnowflakeIdGenerator.SnowflakeIdInfo info = SnowflakeIdUtil.parseId(id);
System.out.println("时间戳: " + info.getTimestamp());
System.out.println("数据中心ID: " + info.getDatacenterId());
System.out.println("机器ID: " + info.getWorkerId());
System.out.println("序列号: " + info.getSequence());

// 查看自动生成的配置（调试用）
SnowflakeIdUtil.printConfig();
```

#### 方式二：自定义配置

```java
// 在应用启动时初始化（设置数据中心ID和机器ID）
SnowflakeIdUtil.init(1L, 5L);  // 数据中心ID=1, 机器ID=5

// 生成ID
long id = SnowflakeIdUtil.nextId();
```

#### 方式三：创建独立实例

```java
import com.cube.common.utils.SnowflakeIdGenerator;

// 创建独立的生成器实例
SnowflakeIdGenerator generator = new SnowflakeIdGenerator(1L, 5L);

// 生成ID
long id = generator.nextId();

// 解析ID
SnowflakeIdGenerator.SnowflakeIdInfo info = SnowflakeIdGenerator.parseId(id);
```

### 配置说明

#### 自动生成机器ID（推荐）

**无需任何配置，开箱即用！**

雪花ID工具类会自动基于本机特征生成唯一的机器ID（0-31），省去了手动配置的麻烦。

自动生成策略（按优先级）：
1. 基于MAC地址计算哈希值
2. 如果MAC地址获取失败，使用主机名哈希值
3. 如果主机名获取失败，使用进程ID

```java
// 直接使用，无需配置
long id = SnowflakeIdUtil.nextId();

// 查看自动生成的配置
SnowflakeIdUtil.printConfig();
// 输出示例：
// ========== 雪花ID生成器配置 ==========
// 数据中心ID: 0
// 机器ID: 12
// =======================================
```

#### 手动配置（可选）

如果需要手动指定ID，支持以下三种方式：

##### 1. 通过系统属性配置

```bash
java -Dsnowflake.datacenter.id=1 -Dsnowflake.worker.id=5 -jar your-app.jar
```

或在代码中设置：

```java
System.setProperty("snowflake.datacenter.id", "1");
System.setProperty("snowflake.worker.id", "5");
```

##### 2. 通过环境变量配置

```bash
export SNOWFLAKE_DATACENTER_ID=1
export SNOWFLAKE_WORKER_ID=5
java -jar your-app.jar
```

##### 3. 通过代码初始化

```java
// 在应用启动时初始化
SnowflakeIdUtil.init(1L, 5L);  // 数据中心ID=1, 机器ID=5
```

#### 配置优先级

**数据中心ID**：
1. 系统属性 `snowflake.datacenter.id`
2. 环境变量 `SNOWFLAKE_DATACENTER_ID`
3. 默认值 0

**机器ID**：
1. 系统属性 `snowflake.worker.id`
2. 环境变量 `SNOWFLAKE_WORKER_ID`
3. 自动生成（基于MAC地址）

#### 配置范围

- **数据中心ID**：0-31
- **机器ID**：0-31

### 性能测试

根据测试结果：

- **单线程**：约300万ID/秒
- **并发（10线程）**：约66万ID/秒
- **唯一性**：10万次生成测试，100%唯一

### 注意事项

1. **数据中心ID和机器ID配置**：
   - 在分布式环境中，每个节点必须配置不同的数据中心ID和机器ID组合
   - 如果使用自动生成，确保不同机器的MAC地址不同
   - 建议在生产环境使用手动配置，避免MAC地址冲突

2. **时钟回拨问题**：
   - 如果检测到系统时钟回拨，会抛出异常
   - 建议使用NTP同步服务器时间

3. **起始时间戳**：
   - 默认起始时间为2025-01-01 00:00:00
   - 可支持约69年（到2094年）

4. **线程安全**：
   - `SnowflakeIdGenerator`类的`nextId()`方法使用`synchronized`保证线程安全
   - 在高并发场景下可能存在性能瓶颈

### 示例代码

完整示例请参考测试类：`com.cube.common.utils.SnowflakeIdTest`

运行测试：

```bash
cd cube-common
mvn test-compile
java -cp target/classes:target/test-classes com.cube.common.utils.SnowflakeIdTest
```

### 常见问题

#### Q: 为什么会出现时钟回拨异常？
A: 当系统时钟被回拨（如NTP同步）时，可能导致生成的ID时间戳小于之前的ID。为保证ID的唯一性和递增性，遇到时钟回拨会抛出异常。

#### Q: 如何在分布式环境中使用？
A: 方式1（推荐）：手动配置，确保每个节点的数据中心ID和机器ID组合是唯一的。例如：
- 节点1：datacenterId=0, workerId=0
- 节点2：datacenterId=0, workerId=1
- 节点3：datacenterId=1, workerId=0

方式2：使用自动生成，但需要确保不同节点的MAC地址不同（通常情况下都是不同的）。

#### Q: 自动生成的机器ID会冲突吗？
A: 由于机器ID范围是0-31，理论上存在冲突的可能性。如果部署超过32个节点，或者对唯一性要求极高，建议使用手动配置。

#### Q: 可以自定义起始时间戳吗？
A: 可以修改`SnowflakeIdGenerator`类中的`START_TIMESTAMP`常量。注意：修改后生成的ID格式会不兼容。

## 文件结构

```
cube-common/
├── src/main/java/com/cube/common/
│   ├── page/                          # 分页工具
│   │   ├── DatabaseType.java          # 数据库类型枚举
│   │   ├── JdbcPageHelper.java        # JDBC分页工具类
│   │   ├── Oracle11gPageHelper.java   # Oracle 11g专用工具类
│   │   ├── PageRequest.java           # 分页请求参数
│   │   └── PageResult.java            # 分页结果
│   └── utils/                         # 工具类
│       ├── SnowflakeIdGenerator.java  # 雪花ID核心生成器
│       └── SnowflakeIdUtil.java       # 雪花ID便捷工具类
├── src/test/java/com/cube/
│   ├── JdbcPageHelperExample.java     # 分页工具示例
│   ├── SnowflakeIdExample.java        # 雪花ID示例
│   └── SnowflakeIdTest.java           # 雪花ID测试
├── JDBC_PAGE_HELPER.md                # 分页工具详细文档
└── README.md                          # 主文档
```

## 贡献者

- cube

## 更新日志

### 2025-12-24
- 实现JDBC分页工具
  - 支持多数据库：MySQL、PostgreSQL、Oracle（12c+）、Oracle 11g
  - 自动检测数据库类型
  - 支持自动生成COUNT查询
  - 支持多种结果类型映射
  - 自动优化count查询性能
- 实现雪花ID生成器
  - 支持基于主机名自动生成机器ID
  - 支持系统属性和环境变量配置
  - 提供完整的测试用例