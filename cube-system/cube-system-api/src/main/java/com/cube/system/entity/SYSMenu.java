package com.cube.system.entity;

import com.cube.bean.BaseBean;

import java.util.List;

public class SYSMenu extends BaseBean {

    Long menuId;
    String menuName;
    String menuNameEng;
    String path;
    String iconCls;
    Long parentId;
    Integer sort;
    String component;
    List<SYSMenu> children;

    public Long getMenuId() {
        return menuId;
    }

    public void setMenuId(Long menuId) {
        this.menuId = menuId;
    }

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    public String getMenuNameEng() {
        return menuNameEng;
    }

    public void setMenuNameEng(String menuNameEng) {
        this.menuNameEng = menuNameEng;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getIconCls() {
        return iconCls;
    }

    public void setIconCls(String iconCls) {
        this.iconCls = iconCls;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public String getComponent() {
        return component;
    }

    public void setComponent(String component) {
        this.component = component;
    }

    public List<SYSMenu> getChildren() {
        return children;
    }

    public void setChildren(List<SYSMenu> children) {
        this.children = children;
    }
}