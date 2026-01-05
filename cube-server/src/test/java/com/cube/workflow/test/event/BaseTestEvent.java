package com.cube.workflow.test.event;

import com.cube.workflow.event.WFEvent;

import java.util.concurrent.CountDownLatch;

public class BaseTestEvent extends WFEvent {

    private CountDownLatch latch;

    public BaseTestEvent(CountDownLatch latch) {
        this.latch = latch;
    }

    public CountDownLatch getLatch() {
        return latch;
    }

    public void setLatch(CountDownLatch latch) {
        this.latch = latch;
    }
}