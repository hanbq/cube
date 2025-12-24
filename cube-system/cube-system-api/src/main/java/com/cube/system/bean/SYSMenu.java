package com.cube.system.bean;

import com.cube.bean.BaseBean;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class SYSMenu extends BaseBean {

    Long menuId;
    String menuName;
    String path;
    String iconCls;
    Long parentId;
    Integer sort;
    String component;
    List<SYSMenu> children;
}
