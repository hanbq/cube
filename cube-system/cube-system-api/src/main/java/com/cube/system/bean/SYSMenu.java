package com.cube.system.bean;

import com.cube.bean.BaseBean;

import java.util.List;

public class SYSMenu extends BaseBean {

    String menuName;
    String path;
    String iconCls;
    Long parentId;
    Integer sort;
    String component;
    List<SYSMenu> children;
}
