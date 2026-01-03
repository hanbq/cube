package com.cube.workflow.task;

import com.cube.workflow.bean.WFEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WFEndTask extends WFTask {

    private static final Logger logger = LoggerFactory.getLogger(WFEndTask.class);

    @Override
    public void handle(WFEvent event){
        long start = event.getStartTime();
        long end = System.currentTimeMillis();
        logger.info("Total workflow execution time for request: [{}] is {} ms", event.getRequestId(), end - start);
    }
}
