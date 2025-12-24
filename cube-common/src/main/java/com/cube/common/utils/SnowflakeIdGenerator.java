package com.cube.common.utils;

/**
 * 雪花ID生成器
 * <p>
 * 基于Twitter的Snowflake算法实现的分布式ID生成器
 * <p>
 * ID结构（64位）：
 * 1位符号位（固定为0） + 41位时间戳 + 10位工作机器ID（5位数据中心ID + 5位机器ID） + 12位序列号
 * <p>
 * 特点：
 * - 趋势递增
 * - 不依赖数据库
 * - 高性能，理论上单机每秒可生成409.6万个ID
 * - 按时间有序
 *
 * @author cube
 * @since 2025-12-24
 */
public class SnowflakeIdGenerator {

    /**
     * 起始时间戳（2025-01-01 00:00:00）
     */
    private static final long START_TIMESTAMP = 1735660800000L;

    /**
     * 数据中心ID占用位数
     */
    private static final long DATACENTER_ID_BITS = 5L;

    /**
     * 机器ID占用位数
     */
    private static final long WORKER_ID_BITS = 5L;

    /**
     * 序列号占用位数
     */
    private static final long SEQUENCE_BITS = 12L;

    /**
     * 数据中心ID最大值（31）
     */
    private static final long MAX_DATACENTER_ID = ~(-1L << DATACENTER_ID_BITS);

    /**
     * 机器ID最大值（31）
     */
    private static final long MAX_WORKER_ID = ~(-1L << WORKER_ID_BITS);

    /**
     * 序列号最大值（4095）
     */
    private static final long MAX_SEQUENCE = ~(-1L << SEQUENCE_BITS);

    /**
     * 机器ID左移位数（12位）
     */
    private static final long WORKER_ID_SHIFT = SEQUENCE_BITS;

    /**
     * 数据中心ID左移位数（17位）
     */
    private static final long DATACENTER_ID_SHIFT = SEQUENCE_BITS + WORKER_ID_BITS;

    /**
     * 时间戳左移位数（22位）
     */
    private static final long TIMESTAMP_SHIFT = SEQUENCE_BITS + WORKER_ID_BITS + DATACENTER_ID_BITS;

    /**
     * 数据中心ID
     */
    private final long datacenterId;

    /**
     * 机器ID
     */
    private final long workerId;

    /**
     * 序列号
     */
    private long sequence = 0L;

    /**
     * 上次生成ID的时间戳
     */
    private long lastTimestamp = -1L;

    /**
     * 构造函数
     *
     * @param datacenterId 数据中心ID (0-31)
     * @param workerId     机器ID (0-31)
     */
    public SnowflakeIdGenerator(long datacenterId, long workerId) {
        if (datacenterId < 0 || datacenterId > MAX_DATACENTER_ID) {
            throw new IllegalArgumentException(
                    String.format("数据中心ID必须在0-%d之间", MAX_DATACENTER_ID));
        }
        if (workerId < 0 || workerId > MAX_WORKER_ID) {
            throw new IllegalArgumentException(
                    String.format("机器ID必须在0-%d之间", MAX_WORKER_ID));
        }
        this.datacenterId = datacenterId;
        this.workerId = workerId;
    }

    /**
     * 生成下一个ID（线程安全）
     *
     * @return 雪花ID
     */
    public synchronized long nextId() {
        long timestamp = getCurrentTimestamp();

        // 时钟回拨检测
        if (timestamp < lastTimestamp) {
            throw new RuntimeException(
                    String.format("时钟回拨异常，拒绝生成ID。上次时间戳：%d，当前时间戳：%d",
                            lastTimestamp, timestamp));
        }

        // 同一毫秒内
        if (timestamp == lastTimestamp) {
            // 序列号递增
            sequence = (sequence + 1) & MAX_SEQUENCE;
            // 序列号溢出，等待下一毫秒
            if (sequence == 0) {
                timestamp = waitNextMillis(lastTimestamp);
            }
        } else {
            // 不同毫秒，序列号重置
            sequence = 0L;
        }

        lastTimestamp = timestamp;

        // 组装ID：时间戳 | 数据中心ID | 机器ID | 序列号
        return ((timestamp - START_TIMESTAMP) << TIMESTAMP_SHIFT)
                | (datacenterId << DATACENTER_ID_SHIFT)
                | (workerId << WORKER_ID_SHIFT)
                | sequence;
    }

    /**
     * 等待下一毫秒
     *
     * @param lastTimestamp 上次时间戳
     * @return 当前时间戳
     */
    private long waitNextMillis(long lastTimestamp) {
        long timestamp = getCurrentTimestamp();
        while (timestamp <= lastTimestamp) {
            timestamp = getCurrentTimestamp();
        }
        return timestamp;
    }

    /**
     * 获取当前时间戳
     *
     * @return 当前时间戳（毫秒）
     */
    private long getCurrentTimestamp() {
        return System.currentTimeMillis();
    }

    /**
     * 解析雪花ID
     *
     * @param id 雪花ID
     * @return ID信息
     */
    public static SnowflakeIdInfo parseId(long id) {
        long timestamp = (id >> TIMESTAMP_SHIFT) + START_TIMESTAMP;
        long datacenterId = (id >> DATACENTER_ID_SHIFT) & MAX_DATACENTER_ID;
        long workerId = (id >> WORKER_ID_SHIFT) & MAX_WORKER_ID;
        long sequence = id & MAX_SEQUENCE;

        return new SnowflakeIdInfo(timestamp, datacenterId, workerId, sequence);
    }

    /**
     * 雪花ID信息
     */
    public static class SnowflakeIdInfo {
        /**
         * 时间戳（毫秒）
         */
        private final long timestamp;

        /**
         * 数据中心ID
         */
        private final long datacenterId;

        /**
         * 机器ID
         */
        private final long workerId;

        /**
         * 序列号
         */
        private final long sequence;

        public SnowflakeIdInfo(long timestamp, long datacenterId, long workerId, long sequence) {
            this.timestamp = timestamp;
            this.datacenterId = datacenterId;
            this.workerId = workerId;
            this.sequence = sequence;
        }

        public long getTimestamp() {
            return timestamp;
        }

        public long getDatacenterId() {
            return datacenterId;
        }

        public long getWorkerId() {
            return workerId;
        }

        public long getSequence() {
            return sequence;
        }

        @Override
        public String toString() {
            return "SnowflakeIdInfo{" +
                    "timestamp=" + timestamp +
                    ", datacenterId=" + datacenterId +
                    ", workerId=" + workerId +
                    ", sequence=" + sequence +
                    '}';
        }
    }
}