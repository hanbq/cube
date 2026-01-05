package com.cube;

import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;
import org.junit.jupiter.api.Test;

/**
 * Jasypt加密工具测试类
 * 用于生成加密后的配置值
 *
 * @author cube
 * @since 2026-01-04
 */
public class JasyptEncryptorTest {

    /**
     * 配置加密器
     */
    private static PooledPBEStringEncryptor getEncryptor() {
        PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
        SimpleStringPBEConfig config = new SimpleStringPBEConfig();

        // ⚠️ 重要：这个密钥需要保密，生产环境通过环境变量传入
        config.setPassword("test");
        config.setAlgorithm("PBEWithMD5AndDES");
        config.setPoolSize("1");
        config.setStringOutputType("base64");


        encryptor.setConfig(config);
        return encryptor;
    }

    /**
     * 加密测试 - 生成数据库配置的加密值
     */
    @Test
    public void encryptDatabaseConfig() {
        PooledPBEStringEncryptor encryptor = getEncryptor();

        // 数据库密码
        String dbPassword = "123456";
        String encryptedPassword = encryptor.encrypt(dbPassword);
        System.out.println("=====================================");
        System.out.println("数据库密码加密结果：");
        System.out.println("原始值: " + dbPassword);
        System.out.println("加密值: " + encryptedPassword);
        System.out.println("配置文件中使用: password: ENC(" + encryptedPassword + ")");
        System.out.println("=====================================");
        System.out.println();
    }

    /**
     * 解密测试 - 验证加密值是否正确
     */
    @Test
    public void decryptTest() {
        PooledPBEStringEncryptor encryptor = getEncryptor();

        // 替换为你上面生成的加密值进行测试
        String encryptedValue = "YOUR_ENCRYPTED_VALUE_HERE";

        try {
            String decryptedValue = encryptor.decrypt(encryptedValue);
            System.out.println("解密成功: " + decryptedValue);
        } catch (Exception e) {
            System.out.println("解密失败，请检查密钥是否正确");
        }
    }

    /**
     * 自定义值加密 - 加密任意文本
     */
    @Test
    public void encryptCustomValue() {
        PooledPBEStringEncryptor encryptor = getEncryptor();

        // 在这里修改要加密的值
        String valueToEncrypt = "your-secret-value";

        String encrypted = encryptor.encrypt(valueToEncrypt);
        System.out.println("=====================================");
        System.out.println("自定义值加密结果：");
        System.out.println("原始值: " + valueToEncrypt);
        System.out.println("加密值: " + encrypted);
        System.out.println("使用方式: ENC(" + encrypted + ")");
        System.out.println("=====================================");
    }
}