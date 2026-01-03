package com.cube.workflow.task;

import com.cube.workflow.bean.WFEvent;
import com.cube.workflow.bean.WFUnexpectedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WFUnexpectedTask extends WFTask {

    private static final Logger log = LoggerFactory.getLogger(WFUnexpectedTask.class);

    @Override
    public void handle(WFEvent event) {
        if (event instanceof WFUnexpectedEvent unexpectedEvent) {
            log.error("Workflow execution failed for request: [{}]. Task class: [{}].",
                    unexpectedEvent.getRequestId(),
                    unexpectedEvent.getUnexpectedClass().getName(),
                    unexpectedEvent.getThrowable());
        }
    }
}