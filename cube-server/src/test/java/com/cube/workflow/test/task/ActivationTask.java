package com.cube.workflow.test.task;

import com.cube.workflow.event.WFEvent;
import com.cube.workflow.handler.WFHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ActivationTask extends WFHandler {

    private static final Logger log = LoggerFactory.getLogger(ActivationTask.class);

    @Override
    public void handle(WFEvent event) {
        log.info("Executing ActivationTask for request: {}", event.getRequestId());
        // Simulate account activation
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        log.info("Account activated successfully for request: {}", event.getRequestId());

        // End of the workflow, countdown the latch
        postEnd(event);
    }
}