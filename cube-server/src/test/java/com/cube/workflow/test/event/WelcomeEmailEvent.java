package com.cube.workflow.test.event;

import com.cube.workflow.test.task.WelcomeEmailTask;

import java.util.concurrent.CountDownLatch;

public class WelcomeEmailEvent extends BaseTestEvent {

    public WelcomeEmailEvent(CountDownLatch latch) {
        super(latch);
        this.setClazz(WelcomeEmailTask.class);
    }
}