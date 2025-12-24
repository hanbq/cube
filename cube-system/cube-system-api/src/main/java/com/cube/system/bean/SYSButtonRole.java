package com.cube.system.bean;

import com.cube.bean.BaseBean;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class SYSButtonRole extends BaseBean {
    Long id;
    Long buttonId;
    Long roleId;
}
