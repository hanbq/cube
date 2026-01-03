package com.cube.workflow.engine;

import com.cube.workflow.event.WFEvent;
import com.cube.workflow.listener.WFListener;
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
    @Resource
    private WFListener wfListener;

    @PostConstruct
    public void register() {
        workflowEventBus.register(wfListener);
    }

    public void unregister() {
        workflowEventBus.unregister(wfListener);
    }

    public void post(WFEvent event) {
        workflowEventBus.post(event);
    }

}