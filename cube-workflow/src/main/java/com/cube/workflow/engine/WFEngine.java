package com.cube.workflow.engine;

import com.cube.workflow.event.WFEvent;
import com.google.common.eventbus.EventBus;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

/**
 * 工作流引擎
 */
@Component
public class WFEngine{

    @Resource
    private EventBus workflowEventBus;

    public void register(Object listener) {
        workflowEventBus.register(listener);
    }

    public void unregister(Object listener) {
        workflowEventBus.unregister(listener);
    }

    public void post(WFEvent event) {
        workflowEventBus.post(event);
    }

}