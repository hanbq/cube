package com.cube.workflow.event;

import com.cube.workflow.handler.WFEndHandler;

public class WFEndEvent extends WFEvent {

    @Override
    public Class<WFEndHandler> getClazz() {
        return WFEndHandler.class;
    }

}
