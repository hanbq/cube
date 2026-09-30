package com.cube.workflow.event;

import java.util.concurrent.ConcurrentHashMap;

public class WFEvent {

    Long requestId;

    ConcurrentHashMap<String, Object> extension;

    Class<?> clazz;

    Long startTime;

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public ConcurrentHashMap<String, Object> getExtension() {
        return extension;
    }

    public void setExtension(ConcurrentHashMap<String, Object> extension) {
        this.extension = extension;
    }

    public Class<?> getClazz() {
        return clazz;
    }
    public void setClazz(Class<?> clazz) {
        this.clazz = clazz;
    }

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }
}