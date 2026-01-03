package com.cube.workflow.task;


import com.cube.workflow.bean.WFEvent;
import com.cube.workflow.bean.WFUnexpectedEvent;
import com.cube.workflow.engine.WFEngine;
import com.cube.workflow.util.WFSpringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;

public abstract class WFTask {

    private static final Logger logger = LoggerFactory.getLogger(WFTask.class);

    protected WFEngine engine;

    protected WFTask() {
        this.engine = WFSpringUtil.getBean(WFEngine.class);
    }

    public final void execute(WFEvent event) {
        long start = System.currentTimeMillis();
        try {
            handle(event);
        } catch (Throwable t) {//NOSONAR
            postUnexpected(event, t);
        } finally {
            long end = System.currentTimeMillis();
            logger.info("request: [{}] task [{}] cost {} ms", event.getRequestId(), this.getClass().getSimpleName(), end - start);
        }

    }

    public abstract void handle(WFEvent event);

    public void postUnexpected(WFEvent event, Throwable throwable) {
        var unexpectedEvent = new WFUnexpectedEvent();
        BeanUtils.copyProperties(event, unexpectedEvent);
        unexpectedEvent.setUnexpectedClass(event.getClass());
        unexpectedEvent.setThrowable(throwable);
        postEnd(unexpectedEvent);
    }

    /**
     * 发布任务结束事件
     *
     * @param event 任务结束事件
     */
    public void postEnd(WFEvent event) {
        var endEvent = new WFUnexpectedEvent();
        BeanUtils.copyProperties(event, endEvent);
        engine.post(endEvent);
    }
}