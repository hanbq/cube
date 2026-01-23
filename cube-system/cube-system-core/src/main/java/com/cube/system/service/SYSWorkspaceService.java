package com.cube.system.service;

import com.cube.system.entity.SYSWidgetPosition;
import com.cube.system.entity.SYSWorkspace;
import com.cube.system.entity.SYSWidget;
import com.cube.system.dao.SYSWorkspaceDao;
import com.cube.common.utils.SnowflakeIdUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 工作区Service
 *
 * @author cube
 * @since 2025-12-29
 */
@Service
@Transactional
public class SYSWorkspaceService {

    private final SYSWorkspaceDao workspaceDao;

    public SYSWorkspaceService(SYSWorkspaceDao workspaceDao) {
        this.workspaceDao = workspaceDao;
    }

    /**
     * 创建工作区
     *
     * @param workspace 工作区对象
     * @return 创建后的工作区ID
     */
    public Long createWorkspace(SYSWorkspace workspace, Long userId) {
        return workspaceDao.insert(workspace, userId);
    }

    /**
     * 更新工作区
     *
     * @param workspace 工作区对象
     * @return 是否更新成功
     */
    public boolean updateWorkspace(SYSWorkspace workspace) {
        return workspaceDao.update(workspace) > 0;
    }

    /**
     * 删除工作区
     * 默认工作区不能删除
     *
     * @param workspaceId 工作区ID
     * @return 是否删除成功
     */
    public boolean deleteWorkspace(Long workspaceId) {
        return workspaceDao.delete(workspaceId) > 0;
    }

    /**
     * 根据用户ID查询该用户有权限的所有工作区
     * 如果用户没有工作区，则创建一个默认工作区
     *
     * @param userId 用户ID
     * @return 工作区列表
     */
    public List<SYSWorkspace> getWorkspacesByUserId(Long userId) {
        List<SYSWorkspace> workspaces = workspaceDao.findByUserId(userId);
        
        // 如果用户没有工作区，创建一个默认工作区
        if (workspaces == null || workspaces.isEmpty()) {
            return createDefaultWorkspace(userId);
        }
        
        return workspaces;
    }
    
    /**
     * 为用户创建默认工作区
     *
     * @param userId 用户ID
     * @return 包含默认工作区的列表
     */
    public List<SYSWorkspace> createDefaultWorkspace(Long userId) {
        SYSWorkspace defaultWorkspace = new SYSWorkspace();
        defaultWorkspace.setName("Default Workspace");
        defaultWorkspace.setDescription("This is your default workspace");
        defaultWorkspace.setIsDefault(true);
        defaultWorkspace.setCreatedBy("system");
        defaultWorkspace.setUpdatedBy("system");
        
        Long workspaceId = workspaceDao.insert(defaultWorkspace, userId);
        defaultWorkspace.setId(workspaceId);
        return List.of(defaultWorkspace);
    }

    /**
     * 创建小组件
     *
     * @param widget 小组件对象
     * @return 创建后的组件ID
     */
    public String createWidget(SYSWidget widget, String userId) {
        // 使用雪花ID生成器生成ID
        String widgetId = String.valueOf(SnowflakeIdUtil.nextId());
        widget.setId(widgetId);
        return workspaceDao.insertWidget(widget, userId);
    }

    /**
     * 更新小组件
     *
     * @param widget 小组件对象
     * @return 是否更新成功
     */
    public boolean updateWidget(SYSWidget widget) {
        return workspaceDao.updateWidget(widget) > 0;
    }

    /**
     * 删除小组件
     *
     * @param widgetId 小组件ID
     * @return 是否删除成功
     */
    public boolean deleteWidget(String widgetId) {
        return workspaceDao.deleteWidget(widgetId) > 0;
    }

    /**
     * 根据工作区ID查询小组件列表
     *
     * @param workspaceId 工作区ID
     * @return 小组件列表
     */
    @Transactional(readOnly = true)
    public List<SYSWidget> getWidgetsByWorkspaceId(Long workspaceId, String userId) {
        return workspaceDao.findWidgetsByWorkspaceId(workspaceId, userId);
    }

    /**
     * 批量更新小组件位置
     *
     * @param workspaceId 工作区ID
     * @param userId 用户ID
     * @param widgetPositions 小组件ID和位置列表
     * @return 是否更新成功
     */
    public boolean updateWidgetPositions(Long workspaceId, String userId, List<SYSWidgetPosition> widgetPositions) {
        int affectedRows = workspaceDao.batchUpdateWidgetPositions(workspaceId, userId, widgetPositions);
        return affectedRows > 0;
    }
}