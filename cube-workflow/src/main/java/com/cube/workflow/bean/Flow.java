package com.cube.workflow.bean;

import com.cube.bean.BaseBean;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;
import java.time.ZonedDateTime;
import java.util.Map;

@EqualsAndHashCode(callSuper = true)
@Data
public class Flow<T> extends BaseBean {

    @Serial
    private static final long serialVersionUID = 6416139306229007462L;

    Map<String, Object> extension;

    Class<T> classType;

    ZonedDateTime startTime;


}
