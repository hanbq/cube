# Jasypt配置加密使用指南

## 快速开始

### 1. 运行加密工具生成加密值

```bash
# 方法1：使用测试类生成（推荐）
mvn test -Dtest=JasyptEncryptorTest#encryptDatabaseConfig

# 方法2：使用Maven插件
mvn jasypt:encrypt-value \
  -Djasypt.encryptor.password="cube-secret-key-2026" \
  -Djasypt.plugin.value="123456"

# 方法3：使用在线工具
# 访问：https://www.devglan.com/online-tools/jasypt-online-encryption-decryption
# 算法选择：PBEWITHHMACSHA512ANDAES_256
# 输入密钥：cube-secret-key-2026
# 输入要加密的值，点击加密
```

### 2. 更新配置文件

将生成的加密值替换到 `application-dev.yml` 中：

```yaml
spring:
  datasource:
    url: ENC(加密后的URL)
    username: ENC(加密后的用户名)
    password: ENC(加密后的密码)
```

**示例（假设加密结果）：**
```yaml
spring:
  datasource:
    url: ENC(xMpCOKC5I4INQ8dOJoH35SfwQXYmPqWr4.....)
    username: ENC(kfALWeLpvAJQNBuYuRcqBvZJxA==)
    password: ENC(yN9JgJK+KPzN0qLEkWmYW7dVxA==)
```

### 3. 设置加密密钥

**生产环境（推荐）- 使用环境变量：**
```bash
export JASYPT_ENCRYPTOR_PASSWORD="cube-secret-key-2026"
java -jar cube-server.jar
```

**开发环境 - 使用启动参数：**
```bash
mvn spring-boot:run -Djasypt.encryptor.password="cube-secret-key-2026"

# 或
java -jar cube-server.jar --jasypt.encryptor.password=cube-secret-key-2026
```

**IDE中配置（IntelliJ IDEA）：**
1. Run > Edit Configurations
2. Environment variables: `JASYPT_ENCRYPTOR_PASSWORD=cube-secret-key-2026`
3. 或 VM options: `-Djasypt.encryptor.password=cube-secret-key-2026`

## 手动加密值（不依赖Maven）

创建临时Java文件：

```java
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;

public class QuickEncrypt {
    public static void main(String[] args) {
        StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
        encryptor.setPassword("cube-secret-key-2026"); // 加密密钥
        encryptor.setAlgorithm("PBEWITHHMACSHA512ANDAES_256");

        // 加密数据库密码
        String encrypted = encryptor.encrypt("123456");
        System.out.println("加密结果: ENC(" + encrypted + ")");
    }
}
```

## 常见问题

### Q1: 启动时报错 "Failed to decrypt"
**原因：** 加密密钥不匹配
**解决：** 确保环境变量 `JASYPT_ENCRYPTOR_PASSWORD` 与加密时使用的密钥一致

### Q2: 如何在Docker中使用？
```dockerfile
# Dockerfile
ENV JASYPT_ENCRYPTOR_PASSWORD=cube-secret-key-2026

# 或 docker-compose.yml
services:
  cube-server:
    environment:
      - JASYPT_ENCRYPTOR_PASSWORD=cube-secret-key-2026
```

### Q3: 密钥保存在哪里？
**开发环境：** 开发者本地保管
**生产环境：**
- Kubernetes Secret
- AWS Secrets Manager
- Azure Key Vault
- 环境变量（CI/CD配置）

### Q4: 每次加密结果都不同？
**答：** 正常现象。Jasypt使用随机盐值，相同明文加密后结果不同，但都能正确解密。

## 当前配置需要加密的值

| 配置项 | 原始值 | 需要加密 |
|--------|--------|----------|
| spring.datasource.url | `jdbc:postgresql://127.0.0.1:5432/docker_postgres` | ✅ |
| spring.datasource.username | `postgres` | ✅ |
| spring.datasource.password | `123456` | ✅ 强烈推荐 |

## 安全建议

1. ⚠️ **永远不要将加密密钥提交到Git**
2. ✅ 生产环境必须使用环境变量传递密钥
3. ✅ 定期更换加密密钥
4. ✅ 不同环境使用不同的密钥

## 下一步

1. 运行 `JasyptEncryptorTest` 生成加密值
2. 替换 `application-dev.yml` 中的占位符
3. 设置环境变量 `JASYPT_ENCRYPTOR_PASSWORD`
4. 启动应用验证