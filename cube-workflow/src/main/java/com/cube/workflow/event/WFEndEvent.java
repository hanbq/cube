package com.cube.workflow.event;

import com.cube.workflow.task.WFEndTask;

public class WFEndEvent extends WFEvent {

    @Override
    public Class<WFEndTask> getClazz() {
        return WFEndTask.class;
    }

}
