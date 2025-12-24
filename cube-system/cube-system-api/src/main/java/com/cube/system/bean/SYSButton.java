package com.cube.system.bean;

import com.cube.bean.BaseBean;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class SYSButton extends BaseBean {
    Long buttonId;
    String buttonName;
    String description;
}
