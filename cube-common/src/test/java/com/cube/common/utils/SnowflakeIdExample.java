package com.cube.common.utils;

/**
 * 雪花ID使用示例
 *
 * @author cube
 * @since 2025-12-24
 */
public class SnowflakeIdExample {

    public static void main(String[] args) {
        System.out.println("========== 雪花ID使用示例 ==========\n");

        // 示例1：最简单的用法（推荐）
        example1_SimpleUsage();

        // 示例2：查看配置信息
        example2_ViewConfig();

        // 示例3：解析ID
        example3_ParseId();

        // 示例4：手动初始化
        example4_ManualInit();

        // 示例5：创建独立实例
        example5_IndependentInstance();

        System.out.println("\n========== 示例结束 ==========");
    }

    /**
     * 示例1：最简单的用法
     * 直接使用，无需任何配置，自动生成机器ID
     */
    private static void example1_SimpleUsage() {
        System.out.println("【示例1】最简单的用法");

        // 生成ID
        long id1 = SnowflakeIdUtil.nextId();
        long id2 = SnowflakeIdUtil.nextId();
        String idStr = SnowflakeIdUtil.nextIdStr();

        System.out.println("生成的ID1: " + id1);
        System.out.println("生成的ID2: " + id2);
        System.out.println("字符串格式: " + idStr);
        System.out.println();
    }

    /**
     * 示例2：查看配置信息
     */
    private static void example2_ViewConfig() {
        System.out.println("【示例2】查看配置信息");

        // 打印当前配置
        SnowflakeIdUtil.printConfig();
        System.out.println();
    }

    /**
     * 示例3：解析ID
     */
    private static void example3_ParseId() {
        System.out.println("【示例3】解析ID");

        // 生成ID
        long id = SnowflakeIdUtil.nextId();
        System.out.println("生成的ID: " + id);

        // 解析ID
        SnowflakeIdGenerator.SnowflakeIdInfo info = SnowflakeIdUtil.parseId(id);
        System.out.println("解析结果:");
        System.out.println("  - 时间戳: " + info.getTimestamp() + " (" + new java.util.Date(info.getTimestamp()) + ")");
        System.out.println("  - 数据中心ID: " + info.getDatacenterId());
        System.out.println("  - 机器ID: " + info.getWorkerId());
        System.out.println("  - 序列号: " + info.getSequence());
        System.out.println();
    }

    /**
     * 示例4：手动初始化
     * 注意：此示例需要在新的JVM进程中运行，因为SnowflakeIdUtil是单例
     */
    private static void example4_ManualInit() {
        System.out.println("【示例4】手动初始化");
        System.out.println("注意：手动初始化需要在首次使用前调用");
        System.out.println("代码示例：");
        System.out.println("  SnowflakeIdUtil.init(1L, 5L);  // 数据中心ID=1, 机器ID=5");
        System.out.println("  long id = SnowflakeIdUtil.nextId();");
        System.out.println();
    }

    /**
     * 示例5：创建独立实例
     */
    private static void example5_IndependentInstance() {
        System.out.println("【示例5】创建独立实例");

        // 创建两个不同配置的生成器
        SnowflakeIdGenerator generator1 = new SnowflakeIdGenerator(1, 1);
        SnowflakeIdGenerator generator2 = new SnowflakeIdGenerator(2, 3);

        // 分别生成ID
        long id1 = generator1.nextId();
        long id2 = generator2.nextId();

        System.out.println("生成器1（DC=1, Worker=1）生成的ID: " + id1);
        System.out.println("生成器2（DC=2, Worker=3）生成的ID: " + id2);

        // 解析ID
        SnowflakeIdGenerator.SnowflakeIdInfo info1 = SnowflakeIdGenerator.parseId(id1);
        SnowflakeIdGenerator.SnowflakeIdInfo info2 = SnowflakeIdGenerator.parseId(id2);

        System.out.println("ID1的机器标识: DC=" + info1.getDatacenterId() + ", Worker=" + info1.getWorkerId());
        System.out.println("ID2的机器标识: DC=" + info2.getDatacenterId() + ", Worker=" + info2.getWorkerId());
        System.out.println();
    }
}
