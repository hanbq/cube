package com.cube.system.bean;

import com.cube.bean.BaseBean;
import lombok.Data;

@Data
public class SYSUserRole extends BaseBean {

    Long id;
    Long userId;
    Long roleId;

}
