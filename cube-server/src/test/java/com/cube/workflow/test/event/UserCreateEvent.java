package com.cube.workflow.test.event;

import com.cube.workflow.test.task.UserCreateTask;

import java.util.concurrent.CountDownLatch;

public class UserCreateEvent extends BaseTestEvent {

    public UserCreateEvent(CountDownLatch latch) {
        super(latch);
        this.setClazz(UserCreateTask.class);
    }
}