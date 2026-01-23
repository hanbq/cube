package com.cube.system.entity;

import com.cube.common.entity.BaseEntity;

import java.util.Map;

/**
 * 小组件实体类
 * 对应前端 Widget 接口
 *
 * @author cube
 * @since 2025-12-29
 */
public class SYSWidget extends BaseEntity {
    /**
     * 小组件ID
     */
    private String id;
    
    /**
     * 小组件类型：statistic | chart | table | text
     */
    private String type;
    
    /**
     * 小组件标题
     */
    private String title;
    
    /**
     * 小组件尺寸：small | medium | large
     */
    private String size;
    
    /**
     * 小组件数据
     */
    private Map<String, Object> data;
    
    /**
     * 在工作区中的位置
     */
    private Integer position;
    
    /**
     * 所属工作区ID（后端使用，不返回给前端）
     */
    private Long workspaceId;

    private String userId;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public Long getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(Long workspaceId) {
        this.workspaceId = workspaceId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}