package com.cube.workflow.engine;

import com.cube.workflow.bean.WFEvent;
import com.google.common.eventbus.EventBus;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * 工作流引擎
 */
@Component
public class WFEngine{

    @Resource
    private EventBus workflowEventBus;

    private static final Logger logger = LoggerFactory.getLogger(WFEngine.class);

    public void register(Object listener) {
        workflowEventBus.register(listener);
    }

    public void unregister(Object listener) {
        workflowEventBus.unregister(listener);
    }

    public void post(WFEvent event) {
        logger.info("Posting event: [{}]", event);
        workflowEventBus.post(event);
    }

}