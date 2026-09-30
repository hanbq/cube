package com.cube.workflow.handler;


import com.cube.workflow.event.WFEndEvent;
import com.cube.workflow.event.WFEvent;
import com.cube.workflow.event.WFUnexpectedEvent;
import com.cube.workflow.engine.WFEngine;
import com.cube.workflow.util.WFSpringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;

public abstract class WFHandler {

    private static final Logger logger = LoggerFactory.getLogger(WFHandler.class);

    protected WFEngine engine;

    protected WFHandler() {
        this.engine = WFSpringUtil.getBean(WFEngine.class);
    }

    public final void execute(WFEvent event) {
        long start = System.currentTimeMillis();
        try {
            handle(event);
        } catch (Exception e) {
            postUnexpected(event, e);
        } finally {
            long end = System.currentTimeMillis();
            logger.info("request: [{}] task [{}] cost {} ms", event.getRequestId(), this.getClass().getSimpleName(), end - start);
        }

    }

    public abstract void handle(WFEvent event);

    public void postUnexpected(WFEvent event, Exception e) {
        var unexpectedEvent = new WFUnexpectedEvent();
        BeanUtils.copyProperties(event, unexpectedEvent);
        unexpectedEvent.setUnexpectedClass(event.getClass());
        unexpectedEvent.setThrowable(e);
        engine.post(unexpectedEvent);
    }

    public void postNext(WFEvent event) {
        engine.post(event);
    }

    /**
     * 发布任务结束事件
     *
     * @param event 任务结束事件
     */
    public void postEnd(WFEvent event) {
        var endEvent = new WFEndEvent();
        BeanUtils.copyProperties(event, endEvent);
        endEvent.setClazz(WFEndHandler.class);
        engine.post(endEvent);
    }
}