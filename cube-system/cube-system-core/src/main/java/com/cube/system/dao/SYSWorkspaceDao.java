package com.cube.system.dao;

import com.cube.system.entity.SYSWidgetPosition;
import com.cube.system.entity.SYSWorkspace;
import com.cube.system.entity.SYSWidget;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

/**
 * 工作区DAO
 *
 * @author cube
 * @since 2025-12-29
 */
@Repository
public class SYSWorkspaceDao {

    private static final Logger LOG = LoggerFactory.getLogger(SYSWorkspaceDao.class);

    private final JdbcTemplate jdbcTemplate;
    private ObjectMapper objectMapper;

    private static final String TABLE_NAME = "cube_sys_workspaces";
    private static final String WIDGET_TABLE_NAME = "cube_sys_widgets";

    private static final String INSERT_SQL =
            "INSERT INTO " + TABLE_NAME +
            " (name, description, is_default, created_time, created_by, updated_time, updated_by, user_id) " +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id";

    private static final String UPDATE_SQL =
            "UPDATE " + TABLE_NAME +
            " SET name = ?, description = ?, is_default = ?, " +
            " updated_time = ?, updated_by = ? " +
            " WHERE id = ?";

    private static final String DELETE_SQL =
            "DELETE FROM " + TABLE_NAME + " WHERE id = ? AND is_default = false";

    private static final String FIND_BY_USER_ID_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE user_id = ? ORDER BY created_time";

    private static final String INSERT_WIDGET_SQL =
            "INSERT INTO " + WIDGET_TABLE_NAME + " (id, type, title, size, data, position, workspace_id, created_time, created_by, updated_time, updated_by, user_id) " +
            "VALUES (?, ?, ?, ?, CAST(? AS JSON), ?, ?, ?, ?, ?, ?, ?)";

    private static final String UPDATE_WIDGET_SQL =
            "UPDATE " + WIDGET_TABLE_NAME +
            " SET type = ?, title = ?, size = ?, data = CAST(? AS JSON), " +
            " updated_time = ?, updated_by = ? " +
            " WHERE id = ?";

    private static final String DELETE_WIDGET_SQL =
            "DELETE FROM " + WIDGET_TABLE_NAME + " WHERE id = ?";

    private static final String FIND_WIDGETS_BY_WORKSPACE_ID_SQL =
            "SELECT * FROM " + WIDGET_TABLE_NAME + " WHERE workspace_id = ? and user_id = ? ORDER BY position";

    public SYSWorkspaceDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * RowMapper for SYSWorkspace
     */
    private final RowMapper<SYSWorkspace> rowMapper = (rs, rowNum) -> {
        SYSWorkspace workspace = new SYSWorkspace();
        workspace.setId(rs.getLong("id"));
        workspace.setName(rs.getString("name"));
        workspace.setDescription(rs.getString("description"));
        workspace.setIsDefault(rs.getBoolean("is_default"));

        // BaseEntity fields
        Timestamp createdTime = rs.getTimestamp("created_time");
        if (createdTime != null) {
            workspace.setCreatedTime(ZonedDateTime.ofInstant(createdTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        workspace.setCreatedBy(rs.getString("created_by"));

        Timestamp updatedTime = rs.getTimestamp("updated_time");
        if (updatedTime != null) {
            workspace.setUpdatedTime(ZonedDateTime.ofInstant(updatedTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        workspace.setUpdatedBy(rs.getString("updated_by"));

        return workspace;
    };

    /**
     * RowMapper for SYSWidget
     */
    private final RowMapper<SYSWidget> widgetRowMapper = (rs, rowNum) -> {
        SYSWidget widget = new SYSWidget();
        widget.setId(rs.getString("id"));
        widget.setType(rs.getString("type"));
        widget.setTitle(rs.getString("title"));
        widget.setSize(rs.getString("size"));
        
        // 处理JSON类型的data字段
        String dataJson = rs.getString("data");
        if (dataJson != null && !dataJson.isEmpty()) {
            try {
                Map<String, Object> dataMap = objectMapper.readValue(dataJson, new TypeReference<Map<String, Object>>() {});
                widget.setData(dataMap);
            } catch (JsonProcessingException e) {
                LOG.error("Error parsing widget data JSON", e);
                widget.setData(Map.of()); // 设置空Map作为默认值
            }
        } else {
            widget.setData(Map.of()); // 设置空Map作为默认值
        }
        
        widget.setPosition(rs.getInt("position"));
        widget.setWorkspaceId(rs.getLong("workspace_id"));

        // BaseEntity fields
        Timestamp createdTime = rs.getTimestamp("created_time");
        if (createdTime != null) {
            widget.setCreatedTime(ZonedDateTime.ofInstant(createdTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        widget.setCreatedBy(rs.getString("created_by"));

        Timestamp updatedTime = rs.getTimestamp("updated_time");
        if (updatedTime != null) {
            widget.setUpdatedTime(ZonedDateTime.ofInstant(updatedTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        widget.setUpdatedBy(rs.getString("updated_by"));

        return widget;
    };

    /**
     * 添加工作区
     *
     * @param entity 工作区对象
     * @param userId 用户ID
     * @return 插入后的主键ID
     */
    public Long insert(SYSWorkspace entity, Long userId) {
        LOG.info("=== SYSWorkspaceDao.insert called ===");
        LOG.info("Inserting workspace: {}", entity.getName());
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            // Specify only the id column to be returned (PostgreSQL specific)
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, new String[]{"id"});
            ps.setString(1, entity.getName());
            ps.setString(2, entity.getDescription());
            ps.setBoolean(3, entity.getIsDefault());

            // BaseEntity fields
            ZonedDateTime now = ZonedDateTime.now();
            ps.setTimestamp(4, Timestamp.from(now.toInstant())); // created_time
            ps.setString(5, entity.getCreatedBy());
            ps.setTimestamp(6, Timestamp.from(now.toInstant())); // updated_time
            ps.setString(7, entity.getUpdatedBy());
            ps.setLong(8, userId); // user_id

            return ps;
        }, keyHolder);

        // Now we can safely use getKey() since only workspace_id is returned
        Number key = keyHolder.getKey();
        Long workspaceId = key != null ? key.longValue() : null;
        LOG.info("Insert completed. Generated workspace_id: {}", workspaceId);
        return workspaceId;
    }

    /**
     * 编辑工作区
     *
     * @param entity 工作区对象
     * @return 更新的行数
     */
    public int update(SYSWorkspace entity) {
        return jdbcTemplate.update(UPDATE_SQL,
                entity.getName(),
                entity.getDescription(),
                entity.getIsDefault(),
                Timestamp.from(ZonedDateTime.now().toInstant()), // updated_time
                entity.getUpdatedBy(),
                entity.getId()
        );
    }

    /**
     * 删除工作区（物理删除）
     * 默认工作区不能删除
     *
     * @param id 工作区ID
     * @return 删除的行数
     */
    public int delete(Long id) {
        return jdbcTemplate.update(DELETE_SQL, id);
    }

    /**
     * 根据用户ID查询该用户有权限的所有工作区
     *
     * @param userId 用户ID
     * @return 工作区列表
     */
    public List<SYSWorkspace> findByUserId(Long userId) {
        return jdbcTemplate.query(FIND_BY_USER_ID_SQL, rowMapper, userId);
    }

    /**
     * 根据ID查询工作区是否为默认工作区
     *
     * @param id 工作区ID
     * @return 是否为默认工作区
     */
    public boolean isDefaultWorkspace(Long id) {
        String sql = "SELECT is_default FROM " + TABLE_NAME + " WHERE id = ?";
        Boolean isDefault = jdbcTemplate.queryForObject(sql, Boolean.class, id);
        return Boolean.TRUE.equals(isDefault);
    }

    /**
     * 添加小组件
     *
     * @param entity 小组件对象
     * @return 插入后的主键ID
     */
    public String insertWidget(SYSWidget entity, String userId) {
        LOG.info("=== SYSWorkspaceDao.insertWidget called ===");
        LOG.info("Inserting widget: {}", entity.getTitle());
        
        // 将Map类型的data转换为JSON字符串
        String dataJson;
        try {
            dataJson = objectMapper.writeValueAsString(entity.getData());
        } catch (JsonProcessingException e) {
            LOG.error("Error converting widget data to JSON", e);
            dataJson = "{}"; // 使用空JSON对象作为默认值
        }
        
        jdbcTemplate.update(INSERT_WIDGET_SQL,
                entity.getId(),
                entity.getType(),
                entity.getTitle(),
                entity.getSize(),
                dataJson, // 使用转换后的JSON字符串，SQL中会进行CAST(? AS JSON)
                entity.getPosition(),
                entity.getWorkspaceId(),
                Timestamp.from(ZonedDateTime.now().toInstant()), // created_time
                entity.getCreatedBy(),
                Timestamp.from(ZonedDateTime.now().toInstant()), // updated_time
                entity.getUpdatedBy(),
                Long.parseLong(userId) // 转换为Long类型，因为数据库中user_id是bigint类型
        );
        
        // 返回雪花ID
        String widgetId = entity.getId();
        LOG.info("Insert completed. Generated id: {}", widgetId);
        return widgetId;
    }

    /**
     * 编辑小组件
     *
     * @param entity 小组件对象
     * @return 更新的行数
     */
    public int updateWidget(SYSWidget entity) {
        LOG.info("=== SYSWorkspaceDao.updateWidget called ===");
        LOG.info("Updating widget: {}", entity.getTitle());
        
        // 将Map类型的data转换为JSON字符串
        String dataJson;
        try {
            dataJson = objectMapper.writeValueAsString(entity.getData());
        } catch (JsonProcessingException e) {
            LOG.error("Error converting widget data to JSON", e);
            dataJson = "{}"; // 使用空JSON对象作为默认值
        }
        
        // 验证id不为空
        if (entity.getId() == null) {
            throw new IllegalArgumentException("Widget ID cannot be null for update");
        }
        
        return jdbcTemplate.update(UPDATE_WIDGET_SQL,
                entity.getType(),
                entity.getTitle(),
                entity.getSize(),
                dataJson, // 使用转换后的JSON字符串，SQL中会进行CAST(? AS JSON)
                Timestamp.from(ZonedDateTime.now().toInstant()), // updated_time
                entity.getUpdatedBy(),
                entity.getId()
        );
    }

    /**
     * 删除小组件（物理删除）
     *
     * @param id 小组件ID
     * @return 删除的行数
     */
    public int deleteWidget(String id) {
        return jdbcTemplate.update(DELETE_WIDGET_SQL, id);
    }

    /**
     * 根据工作区ID查询小组件列表
     *
     * @param workspaceId 工作区ID
     * @return 小组件列表
     */
    public List<SYSWidget> findWidgetsByWorkspaceId(Long workspaceId, String userId) {
        return jdbcTemplate.query(FIND_WIDGETS_BY_WORKSPACE_ID_SQL, widgetRowMapper, workspaceId, Long.parseLong(userId));
    }

    /**
     * 批量更新小组件位置
     *
     * @param workspaceId 工作区ID
     * @param userId 用户ID
     * @param widgetPositions 小组件ID和位置列表
     * @return 更新的行数
     */
    public int batchUpdateWidgetPositions(Long workspaceId, String userId, List<SYSWidgetPosition> widgetPositions) {
        int[] results = jdbcTemplate.batchUpdate(
            "UPDATE " + WIDGET_TABLE_NAME + 
            " SET position = ?, updated_time = ?" +
            " WHERE id = ? AND workspace_id = ? AND user_id = ?",
            widgetPositions.stream()
                .map(wp -> new Object[]{
                    wp.getPosition(),
                    Timestamp.from(ZonedDateTime.now().toInstant()),
                    wp.getWidgetId(),
                    workspaceId,
                    Long.parseLong(userId) // 转换为Long类型，因为数据库中user_id是bigint类型
                })
                .collect(java.util.stream.Collectors.toList())
        );
        
        return java.util.Arrays.stream(results).sum();
    }
}