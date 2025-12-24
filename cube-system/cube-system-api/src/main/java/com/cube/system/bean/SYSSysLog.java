package com.cube.system.bean;

import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class SYSSysLog {
    Long logId;
    String userName;
    String operation;
    String method;
    String params;
    String ip;
    ZonedDateTime createdTime;
}
