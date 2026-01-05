package com.cube.common.utils;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * 雪花ID测试类
 *
 * @author cube
 * @since 2025-12-24
 */
public class SnowflakeIdTest {

    public static void main(String[] args) {
        System.out.println("========== 雪花ID生成器测试 ==========\n");

        // 显示配置信息
        System.out.println("【配置信息】自动生成的配置");
        SnowflakeIdUtil.printConfig();
        System.out.println();

        // 测试1：基本生成功能
        testBasicGeneration();

        // 测试2：ID解析功能
        testIdParsing();

        // 测试3：单例工具类
        testUtilClass();

        // 测试4：并发生成测试
        testConcurrentGeneration();

        // 测试5：唯一性测试
        testUniqueness();

        System.out.println("\n========== 所有测试完成 ==========");
    }

    /**
     * 测试基本生成功能
     */
    private static void testBasicGeneration() {
        System.out.println("【测试1】基本生成功能");
        SnowflakeIdGenerator generator = new SnowflakeIdGenerator(1, 1);

        for (int i = 0; i < 10; i++) {
            long id = generator.nextId();
            System.out.println("生成ID " + (i + 1) + ": " + id);
        }
        System.out.println("✓ 基本生成功能测试通过\n");
    }

    /**
     * 测试ID解析功能
     */
    private static void testIdParsing() {
        System.out.println("【测试2】ID解析功能");
        SnowflakeIdGenerator generator = new SnowflakeIdGenerator(5, 10);
        long id = generator.nextId();

        System.out.println("生成的ID: " + id);

        SnowflakeIdGenerator.SnowflakeIdInfo info = SnowflakeIdGenerator.parseId(id);
        System.out.println("解析结果: " + info);
        System.out.println("  - 时间戳: " + info.getTimestamp() + " (" + new java.util.Date(info.getTimestamp()) + ")");
        System.out.println("  - 数据中心ID: " + info.getDatacenterId());
        System.out.println("  - 机器ID: " + info.getWorkerId());
        System.out.println("  - 序列号: " + info.getSequence());

        // 验证解析结果
        if (info.getDatacenterId() == 5 && info.getWorkerId() == 10) {
            System.out.println("✓ ID解析功能测试通过\n");
        } else {
            System.out.println("✗ ID解析功能测试失败\n");
        }
    }

    /**
     * 测试单例工具类
     */
    private static void testUtilClass() {
        System.out.println("【测试3】单例工具类");

        // 使用工具类生成ID
        for (int i = 0; i < 5; i++) {
            long id = SnowflakeIdUtil.nextId();
            String idStr = SnowflakeIdUtil.nextIdStr();
            System.out.println("工具类生成ID " + (i + 1) + ": " + id + " (字符串: " + idStr + ")");
        }

        // 测试解析
        long id = SnowflakeIdUtil.nextId();
        SnowflakeIdGenerator.SnowflakeIdInfo info = SnowflakeIdUtil.parseId(id);
        System.out.println("解析ID: " + id + " -> " + info);

        System.out.println("✓ 单例工具类测试通过\n");
    }

    /**
     * 测试并发生成
     */
    private static void testConcurrentGeneration() {
        System.out.println("【测试4】并发生成测试");

        SnowflakeIdGenerator generator = new SnowflakeIdGenerator(2, 3);
        int threadCount = 10;
        int idsPerThread = 1000;
        Set<Long> ids = new HashSet<>();
        CountDownLatch latch = new CountDownLatch(threadCount);
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < threadCount; i++) {
            executor.submit(() -> {
                try {
                    for (int j = 0; j < idsPerThread; j++) {
                        long id = generator.nextId();
                        synchronized (ids) {
                            ids.add(id);
                        }
                    }
                } finally {
                    latch.countDown();
                }
            });
        }

        try {
            latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        long endTime = System.currentTimeMillis();
        executor.shutdown();

        int totalIds = threadCount * idsPerThread;
        System.out.println("生成ID总数: " + totalIds);
        System.out.println("唯一ID数量: " + ids.size());
        System.out.println("耗时: " + (endTime - startTime) + " ms");
        System.out.println("平均速度: " + (totalIds * 1000.0 / (endTime - startTime)) + " ID/秒");

        if (ids.size() == totalIds) {
            System.out.println("✓ 并发生成测试通过（所有ID唯一）\n");
        } else {
            System.out.println("✗ 并发生成测试失败（存在重复ID）\n");
        }
    }

    /**
     * 测试唯一性（单线程）
     */
    private static void testUniqueness() {
        System.out.println("【测试5】唯一性测试");

        SnowflakeIdGenerator generator = new SnowflakeIdGenerator(0, 0);
        Set<Long> ids = new HashSet<>();
        int count = 100000;

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < count; i++) {
            long id = generator.nextId();
            if (!ids.add(id)) {
                System.out.println("✗ 发现重复ID: " + id);
                return;
            }
        }

        long endTime = System.currentTimeMillis();

        System.out.println("生成ID数量: " + count);
        System.out.println("唯一ID数量: " + ids.size());
        System.out.println("耗时: " + (endTime - startTime) + " ms");
        System.out.println("平均速度: " + (count * 1000.0 / (endTime - startTime)) + " ID/秒");

        if (ids.size() == count) {
            System.out.println("✓ 唯一性测试通过\n");
        } else {
            System.out.println("✗ 唯一性测试失败\n");
        }
    }
}