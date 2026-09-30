package com.cube.workflow.test.task;

import com.cube.workflow.event.WFEvent;
import com.cube.workflow.handler.WFHandler;
import com.cube.workflow.test.event.BaseTestEvent;
import com.cube.workflow.test.event.WelcomeEmailEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserCreateTask extends WFHandler {

    private static final Logger log = LoggerFactory.getLogger(UserCreateTask.class);

    @Override
    public void handle(WFEvent event) {
        log.info("Executing UserCreateTask for request: {}", event.getRequestId());
        // Simulate user creation logic
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        log.info("User created successfully for request: {}", event.getRequestId());

        // Post the next event
        if (event instanceof BaseTestEvent baseTestEvent) {
            WelcomeEmailEvent nextEvent = new WelcomeEmailEvent(baseTestEvent.getLatch());
            nextEvent.setRequestId(event.getRequestId());
            nextEvent.setStartTime(baseTestEvent.getStartTime());
            postNext(nextEvent);
        }
    }
}