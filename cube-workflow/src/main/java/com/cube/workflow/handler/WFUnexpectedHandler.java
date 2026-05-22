package com.cube.workflow.handler;

import com.cube.workflow.event.WFEvent;
import com.cube.workflow.event.WFUnexpectedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WFUnexpectedHandler extends WFHandler {

    private static final Logger log = LoggerFactory.getLogger(WFUnexpectedHandler.class);

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