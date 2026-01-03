package com.cube.workflow.test.task;

import com.cube.workflow.event.WFEvent;
import com.cube.workflow.task.WFTask;
import com.cube.workflow.test.event.ActivationEvent;
import com.cube.workflow.test.event.BaseTestEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WelcomeEmailTask extends WFTask {

    private static final Logger log = LoggerFactory.getLogger(WelcomeEmailTask.class);

    @Override
    public void handle(WFEvent event) {
        log.info("Executing WelcomeEmailTask for request: {}", event.getRequestId());
        // Simulate sending welcome email
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        log.info("Welcome email sent successfully for request: {}", event.getRequestId());

        // Post the next event
        if (event instanceof BaseTestEvent) {
            BaseTestEvent baseTestEvent = (BaseTestEvent) event;
            ActivationEvent nextEvent = new ActivationEvent(baseTestEvent.getLatch());
            nextEvent.setRequestId(event.getRequestId());
            nextEvent.setStartTime(baseTestEvent.getStartTime());
            postNext(nextEvent);
        }
    }
}