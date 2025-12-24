package com.cube.system.bean;

import com.cube.bean.BaseBean;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class SYSMenuRole extends BaseBean {
    Long id;
    Long menuId;
    Long roleId;
}
