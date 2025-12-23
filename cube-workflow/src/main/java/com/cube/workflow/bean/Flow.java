package com.cube.workflow.bean;

import lombok.Data;
import java.time.ZonedDateTime;
import java.util.Map;

@Data
public class Flow<T> {

    Long requestId;

    Map<String, Object> extension;

    Class<T> classType;

    ZonedDateTime startTime;

}
