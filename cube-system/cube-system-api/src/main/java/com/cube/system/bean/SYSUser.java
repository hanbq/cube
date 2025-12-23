package com.cube.system.bean;

import com.cube.bean.BaseBean;
import lombok.Data;

import java.util.List;


@Data
public class SYSUser extends BaseBean {
    Long userId;
    String userName;
    String password;
    String description;
    String email;
    String status;
    List<SYSRole> roles;
}
