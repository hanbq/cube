package com.cube.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class AsyncConfig {

    @Bean(name = "sysLogExecutor")
    public TaskExecutor sysLogExecutor() {
        var exec = new ThreadPoolTaskExecutor();
        exec.setCorePoolSize(5);        // 常驻 4 个线程
        exec.setMaxPoolSize(20);        // 最多扩到 16 个
        exec.setQueueCapacity(200);     // 队列 200 个（超过才扩线程）
        exec.setThreadNamePrefix("syslog-");
        exec.initialize();
        return exec;
    }
}