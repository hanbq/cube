package com.cube.workflow.handler;

import com.cube.workflow.event.WFEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WFEndHandler extends WFHandler {

    private static final Logger logger = LoggerFactory.getLogger(WFEndHandler.class);

    @Override
    public void handle(WFEvent event){
        Long start = event.getStartTime();
        Long end = System.currentTimeMillis();
        logger.info("Total workflow execution time for request: [{}] is {} ms", event.getRequestId(), end - start);
    }


}
