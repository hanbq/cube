package com.cube.system.param;

import com.cube.common.page.PageRequest;

import java.time.ZonedDateTime;

public class SYSLogParam extends PageRequest {

    String username;
    String operation;
    String method;
    String ip;
    ZonedDateTime createdTimeStart;
    ZonedDateTime createdTimeEnd;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public ZonedDateTime getCreatedTimeStart() {
        return createdTimeStart;
    }

    public void setCreatedTimeStart(ZonedDateTime createdTimeStart) {
        this.createdTimeStart = createdTimeStart;
    }

    public ZonedDateTime getCreatedTimeEnd() {
        return createdTimeEnd;
    }

    public void setCreatedTimeEnd(ZonedDateTime createdTimeEnd) {
        this.createdTimeEnd = createdTimeEnd;
    }
}