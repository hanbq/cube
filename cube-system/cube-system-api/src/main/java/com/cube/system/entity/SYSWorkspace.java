package com.cube.system.entity;

import com.cube.common.entity.BaseEntity;

import java.util.List;

/**
 * 工作区实体类
 * 对应前端 Workspace 接口
 *
 * @author cube
 * @since 2025-12-29
 */
public class SYSWorkspace extends BaseEntity {
    /**
     * 工作区ID
     */
    private Long id;
    
    /**
     * 工作区名称
     */
    private String name;
    
    /**
     * 工作区描述
     */
    private String description;
    
    /**
     * 是否为默认工作区
     */
    private Boolean isDefault;

    private Long userId;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Boolean getIsDefault() {
        return isDefault;
    }
    
    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }
    
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}