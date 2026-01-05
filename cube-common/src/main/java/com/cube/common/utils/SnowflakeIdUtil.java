package com.cube.common.utils;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * 雪花ID工具类（单例模式）
 * <p>
 * 提供便捷的雪花ID生成方法
 * <p>
 * 使用示例：
 * <pre>
 * // 生成ID
 * long id = SnowflakeIdUtil.nextId();
 *
 * // 生成字符串格式的ID
 * String idStr = SnowflakeIdUtil.nextIdStr();
 *
 * // 解析ID
 * SnowflakeIdGenerator.SnowflakeIdInfo info = SnowflakeIdUtil.parseId(id);
 * </pre>
 *
 * @author cube
 * @since 2025-12-24
 */
public class SnowflakeIdUtil {

    /**
     * 默认数据中心ID
     */
    private static final long DEFAULT_DATACENTER_ID = 0L;

    /**
     * 雪花ID生成器实例
     */
    private static SnowflakeIdGenerator instance;

    /**
     * 私有构造函数
     */
    private SnowflakeIdUtil() {
    }

    /**
     * 获取雪花ID生成器实例（双重检查锁定）
     *
     * @return 雪花ID生成器实例
     */
    private static SnowflakeIdGenerator getInstance() {
        if (instance == null) {
            synchronized (SnowflakeIdUtil.class) {
                if (instance == null) {
                    // 可以通过配置文件或环境变量读取数据中心ID和机器ID
                    long datacenterId = getDatacenterId();
                    long workerId = getWorkerId();
                    instance = new SnowflakeIdGenerator(datacenterId, workerId);
                }
            }
        }
        return instance;
    }

    /**
     * 初始化雪花ID生成器
     * <p>
     * 在应用启动时调用，设置数据中心ID和机器ID
     *
     * @param datacenterId 数据中心ID (0-31)
     * @param workerId     机器ID (0-31)
     */
    public static synchronized void init(long datacenterId, long workerId) {
        if (instance != null) {
            throw new IllegalStateException("雪花ID生成器已经初始化，不能重复初始化");
        }
        instance = new SnowflakeIdGenerator(datacenterId, workerId);
    }

    /**
     * 生成雪花ID
     *
     * @return 雪花ID
     */
    public static long nextId() {
        return getInstance().nextId();
    }

    /**
     * 生成字符串格式的雪花ID
     *
     * @return 字符串格式的雪花ID
     */
    public static String nextIdStr() {
        return String.valueOf(nextId());
    }

    /**
     * 解析雪花ID
     *
     * @param id 雪花ID
     * @return ID信息
     */
    public static SnowflakeIdGenerator.SnowflakeIdInfo parseId(long id) {
        return SnowflakeIdGenerator.parseId(id);
    }

    /**
     * 解析雪花ID
     *
     * @param idStr 字符串格式的雪花ID
     * @return ID信息
     */
    public static SnowflakeIdGenerator.SnowflakeIdInfo parseId(String idStr) {
        return SnowflakeIdGenerator.parseId(Long.parseLong(idStr));
    }

    /**
     * 获取当前配置信息（用于调试）
     * <p>
     * 打印当前使用的数据中心ID和机器ID
     */
    @SuppressWarnings("java:S106")  // 调试方法使用System.out是合理的
    public static void printConfig() {
        long datacenterId = getDatacenterId();
        long workerId = getWorkerId();
        System.out.println("========== 雪花ID生成器配置 ==========");
        System.out.println("数据中心ID: " + datacenterId);
        System.out.println("机器ID: " + workerId);
        System.out.println("=======================================");
    }

    /**
     * 获取数据中心ID
     * <p>
     * 优先级：
     * 1. 系统属性 snowflake.datacenter.id
     * 2. 环境变量 SNOWFLAKE_DATACENTER_ID
     * 3. 默认值 0
     *
     * @return 数据中心ID (0-31)
     */
    private static long getDatacenterId() {
        // 1. 从系统属性读取
        String datacenterIdStr = System.getProperty("snowflake.datacenter.id");
        if (datacenterIdStr != null && !datacenterIdStr.isEmpty()) {
            return Long.parseLong(datacenterIdStr);
        }

        // 2. 从环境变量读取
        datacenterIdStr = System.getenv("SNOWFLAKE_DATACENTER_ID");
        if (datacenterIdStr != null && !datacenterIdStr.isEmpty()) {
            return Long.parseLong(datacenterIdStr);
        }

        // 3. 使用默认值
        return DEFAULT_DATACENTER_ID;
    }

    /**
     * 获取机器ID
     * <p>
     * 优先级：
     * 1. 系统属性 snowflake.worker.id
     * 2. 环境变量 SNOWFLAKE_WORKER_ID
     * 3. 自动生成（基于主机名）
     *
     * @return 机器ID (0-31)
     */
    private static long getWorkerId() {
        // 1. 从系统属性读取
        String workerIdStr = System.getProperty("snowflake.worker.id");
        if (workerIdStr != null && !workerIdStr.isEmpty()) {
            return Long.parseLong(workerIdStr);
        }

        // 2. 从环境变量读取
        workerIdStr = System.getenv("SNOWFLAKE_WORKER_ID");
        if (workerIdStr != null && !workerIdStr.isEmpty()) {
            return Long.parseLong(workerIdStr);
        }

        // 3. 自动生成（基于主机名）
        return generateWorkerIdFromHostname();
    }

    /**
     * 基于主机名生成机器ID
     * <p>
     * 通过主机名哈希值生成唯一的机器ID，如果主机名获取失败则使用进程ID
     *
     * @return 机器ID (0-31)
     */
    private static long generateWorkerIdFromHostname() {
        try {
            String hostname = InetAddress.getLocalHost().getHostName();
            // 使用主机名的哈希值
            return Math.abs(hostname.hashCode() % 32);
        } catch (UnknownHostException e) {
            // 最后的后备方案：使用进程ID
            return Math.abs((int) (ProcessHandle.current().pid() % 32));
        }
    }
}