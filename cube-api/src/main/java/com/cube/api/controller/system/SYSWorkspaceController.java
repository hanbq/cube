package com.cube.api.controller.system;

import com.cube.common.entity.CubeResponse;
import com.cube.api.annotation.SysLog;
import com.cube.api.entity.UserPrincipal;
import com.cube.system.entity.SYSWidgetPosition;
import com.cube.system.entity.SYSWorkspace;
import com.cube.system.entity.SYSWidget;
import com.cube.system.service.SYSWorkspaceService;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 工作区Controller
 * 处理工作区的增删改查请求
 *
 * @author cube
 * @since 2025-12-29
 */
@RestController
@RequestMapping("/api/workspaces")
public class SYSWorkspaceController {

    private static final Logger LOG = LoggerFactory.getLogger(SYSWorkspaceController.class);

    @Resource
    SYSWorkspaceService workspaceService;

    /**
     * 创建工作区
     *
     * @param workspace 工作区对象
     * @return 创建后的工作区ID
     */
    @PostMapping
    @SysLog(value = "创建工作区", operation = "CREATE_WORKSPACE", saveRequestData = true)
    public CubeResponse<Long> createWorkspace(@RequestBody SYSWorkspace workspace) {
        LOG.info("Received workspace: {}", workspace.getName());
        try {
            Long userId = getUserId();
            Long workspaceId = workspaceService.createWorkspace(workspace, userId);
            LOG.info("Workspace created successfully with ID: {}", workspaceId);
            return CubeResponse.success(workspaceId, "Workspace created successfully");
        } catch (Exception e) {
            LOG.error("Error creating workspace", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 更新工作区
     *
     * @param id        工作区ID
     * @param workspace 工作区对象
     * @return 更新结果
     */
    @PutMapping("/{id}")
    @SysLog(value = "更新工作区", operation = "UPDATE_WORKSPACE", saveRequestData = true)
    public CubeResponse<Boolean> updateWorkspace(@PathVariable Long id, @RequestBody SYSWorkspace workspace) {
        try {
            // 设置工作区ID
            boolean success = workspaceService.updateWorkspace(workspace);
            if (success) {
                return CubeResponse.success(true, "Workspace updated successfully");
            } else {
                return CubeResponse.failed("Workspace not found or update failed");
            }
        } catch (Exception e) {
            LOG.error("Error updating workspace", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 删除工作区
     * 默认工作区不能删除
     *
     * @param id 工作区ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    @SysLog(value = "删除工作区", operation = "DELETE_WORKSPACE")
    public CubeResponse<Boolean> deleteWorkspace(@PathVariable Long id) {
        try {
            boolean success = workspaceService.deleteWorkspace(id);
            if (success) {
                return CubeResponse.success(true, "Workspace deleted successfully");
            } else {
                return CubeResponse.failed("Workspace not found or delete failed");
            }
        } catch (Exception e) {
            LOG.error("Error deleting workspace", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 根据当前登录用户ID查询该用户有权限的所有工作区
     *
     * @return 工作区列表
     */
    @GetMapping
    public CubeResponse<List<SYSWorkspace>> getWorkspacesByCurrentUser() {
        try {
            Long userId = getUserId();

            // 根据用户ID查询工作区
            List<SYSWorkspace> workspaces = workspaceService.getWorkspacesByUserId(userId);
            return CubeResponse.success(workspaces);
        } catch (Exception e) {
            LOG.error("Error querying workspaces by user ID", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    private Long getUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        // 获取当前用户ID
        assert authentication != null;
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        assert principal != null;
        return principal.userId();
    }

    /**
     * 创建小组件
     *
     * @param widget 小组件对象
     * @return 创建后的小组件ID
     */
    @PostMapping("/widgets")
    @SysLog(value = "创建小组件", operation = "CREATE_WIDGET", saveRequestData = true)
    public CubeResponse<String> createWidget(@RequestBody SYSWidget widget) {
        LOG.info("Creating widget: {}", widget.getTitle());
        try {
            var userId = String.valueOf(getUserId());
            var widgetId = workspaceService.createWidget(widget, userId);
            LOG.info("Widget created successfully with ID: {}", widgetId);
            return CubeResponse.success(widgetId, "Widget created successfully");
        } catch (Exception e) {
            LOG.error("Error creating widget", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 更新小组件
     *
     * @param widget 小组件对象
     * @return 更新结果
     */
    @PutMapping("/widgets")
    @SysLog(value = "更新小组件", operation = "UPDATE_WIDGET", saveRequestData = true)
    public CubeResponse<Boolean> updateWidget(@RequestBody SYSWidget widget) {
        try {
            boolean success = workspaceService.updateWidget(widget);
            if (success) {
                return CubeResponse.success(true, "Widget updated successfully");
            } else {
                return CubeResponse.failed("Widget not found or update failed");
            }
        } catch (Exception e) {
            LOG.error("Error updating widget", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 删除小组件
     *
     * @param id 小组件ID
     * @return 删除结果
     */
    @DeleteMapping("/widgets/{id}")
    @SysLog(value = "删除小组件", operation = "DELETE_WIDGET")
    public CubeResponse<Boolean> deleteWidget(@PathVariable String id) {
        try {
            boolean success = workspaceService.deleteWidget(id);
            if (success) {
                return CubeResponse.success(true, "Widget deleted successfully");
            } else {
                return CubeResponse.failed("Widget not found or delete failed");
            }
        } catch (Exception e) {
            LOG.error("Error deleting widget", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 根据工作区ID查询小组件列表
     *
     * @param workspaceId 工作区ID
     * @return 小组件列表
     */
    @GetMapping("/{workspaceId}/widgets")
    public CubeResponse<List<SYSWidget>> getWidgetsByWorkspaceId(@PathVariable Long workspaceId) {
        try {
            String userId = String.valueOf(getUserId());
            List<SYSWidget> widgets = workspaceService.getWidgetsByWorkspaceId(workspaceId, userId);
            return CubeResponse.success(widgets);
        } catch (Exception e) {
            LOG.error("Error querying widgets by workspace ID", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

    /**
     * 批量更新小组件位置
     *
     * @param workspaceId 工作区ID
     * @param widgetPositions 包含小组件位置更新请求
     * @return 更新结果
     */
    @PutMapping("/{workspaceId}/widgets/positions")
    @SysLog(value = "批量更新小组件位置", operation = "UPDATE_WIDGET_POSITIONS", saveRequestData = true)
    public CubeResponse<Boolean> updateWidgetPositions(
            @PathVariable Long workspaceId, 
            @RequestBody List<SYSWidgetPosition> widgetPositions) {
        try {
            String userId = String.valueOf(getUserId());
            boolean success = workspaceService.updateWidgetPositions(workspaceId, userId, widgetPositions);
            if (success) {
                return CubeResponse.success(true, "Widget positions updated successfully");
            } else {
                return CubeResponse.failed("Failed to update widget positions");
            }
        } catch (Exception e) {
            LOG.error("Error updating widget positions", e);
            return CubeResponse.failed(e.getMessage());
        }
    }

}