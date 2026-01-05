package com.cube.workflow.test.event;

import com.cube.workflow.test.task.ActivationTask;

import java.util.concurrent.CountDownLatch;

public class ActivationEvent extends BaseTestEvent {

    public ActivationEvent(CountDownLatch latch) {
        super(latch);
        this.setClazz(ActivationTask.class);
    }
}