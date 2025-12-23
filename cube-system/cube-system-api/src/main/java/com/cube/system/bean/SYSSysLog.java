package com.cube.system.bean;

import lombok.Data;

@Data
public class SYSSysLog {
    String userName;
    String operation;
    String method;
    String params;
    String ip;
}
