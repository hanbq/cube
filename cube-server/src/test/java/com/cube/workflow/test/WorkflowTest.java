package com.cube.workflow.test;

import com.cube.CubeApplication;
import com.cube.common.utils.SnowflakeIdUtil;
import com.cube.workflow.engine.WFEngine;
import com.cube.workflow.listener.WFListener;
import com.cube.workflow.test.event.UserCreateEvent;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

@SpringBootTest(classes = CubeApplication.class)
public class WorkflowTest {

    @Resource
    private WFEngine wfEngine;

    @Resource
    private WFListener wfListener;

    @PostConstruct
    public void init() {
        // The registration logic has been moved to WFListener's PostConstruct method.
        // This test class now relies on the engine to have the listener registered automatically.
        wfEngine.register(wfListener);
    }

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