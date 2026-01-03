package com.cube.workflow.config;

import com.google.common.eventbus.EventBus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@Configuration
public class WFConfig {

    @Bean("workflowExecutor")
    public ThreadPoolExecutor workflowThreadPool() {
        return new ThreadPoolExecutor(
                10, // corePoolSize
                20, // maximumPoolSize
                60, // keepAliveTime
                TimeUnit.SECONDS, // unit
                new ArrayBlockingQueue<>(1000) // workQueue
        );
    }

    @Bean("workflowEventBus")
    public EventBus workflowEventBus() {
        return new EventBus();
    }
}