package com.cube.workflow.test;

import com.cube.CubeApplication;
import com.cube.common.utils.SnowflakeIdUtil;
import com.cube.workflow.engine.WFEngine;
import com.cube.workflow.test.event.UserCreateEvent;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

@SpringBootTest(classes = CubeApplication.class)
class WorkflowTest {

    @Resource
    private WFEngine wfEngine;

    @Test
    void testWorkflow() throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(1);
        UserCreateEvent event = new UserCreateEvent(latch);
        event.setRequestId(SnowflakeIdUtil.nextId());
        event.setStartTime(System.currentTimeMillis());

        wfEngine.post(event);

        latch.await(5, TimeUnit.SECONDS);
    }
}