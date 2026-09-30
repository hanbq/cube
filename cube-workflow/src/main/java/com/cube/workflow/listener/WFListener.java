package com.cube.workflow.listener;

import com.cube.workflow.event.WFEvent;
import com.cube.workflow.exception.WFException;
import com.cube.workflow.handler.WFHandler;
import com.google.common.eventbus.Subscribe;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

import java.util.concurrent.ThreadPoolExecutor;

/**
 * 工作流事件监听器
 */
@Component
public class WFListener {

    @Resource
    private ThreadPoolExecutor workflowExecutor;

    @Subscribe
    void onEvent(WFEvent event){

        Class<?> taskClass = event.getClazz();

        if (taskClass == null) {
            throw new WFException("task class is null");
        }

        workflowExecutor.execute(() -> {
            try {
                Object taskInstance = taskClass.getDeclaredConstructor().newInstance();
                if (taskInstance instanceof WFHandler task) {
                    task.execute(event);
                }
            } catch (Exception e) {
                throw new WFException("execute error", e);
            }
        });

    }
}