package com.cube.system.dao;

import com.cube.system.entity.SYSMenuRole;
import org.jspecify.annotations.NonNull;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.List;

/**
 * 菜单角色关联DAO
 *
 * @author cube
 * @since 2025-12-24
 */
@Repository
public class SYSMenuRoleDao {

    private final JdbcTemplate jdbcTemplate;

    private static final String TABLE_NAME = "CUBE_SYS_MENU_ROLE";

    private static final String BATCH_INSERT_SQL =
            "INSERT INTO " + TABLE_NAME +
            " (menu_id, role_id, created_time, deleted) VALUES (?, ?, ?, false)";

    private static final String FIND_BY_ROLE_ID_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE role_id = ? AND deleted = false ORDER BY id";

    private static final String PHYSICAL_DELETE_BY_ROLE_ID_SQL =
            "DELETE FROM " + TABLE_NAME + " WHERE role_id = ?";

    private static final String PHYSICAL_DELETE_BY_MENU_ID_SQL =
            "DELETE FROM " + TABLE_NAME + " WHERE menu_id = ?";

    public SYSMenuRoleDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * RowMapper for SYSMenuRole
     */
    private final RowMapper<SYSMenuRole> rowMapper = (rs, rowNum) -> {
        SYSMenuRole menuRole = new SYSMenuRole();
        menuRole.setId(rs.getLong("id"));
        menuRole.setMenuId(rs.getLong("menu_id"));
        menuRole.setRoleId(rs.getLong("role_id"));

        // BaseBean fields
        Timestamp createdTime = rs.getTimestamp("created_time");
        if (createdTime != null) {
            menuRole.setCreatedTime(ZonedDateTime.ofInstant(createdTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        menuRole.setCreatedBy(rs.getString("created_by"));

        Timestamp updatedTime = rs.getTimestamp("updated_time");
        if (updatedTime != null) {
            menuRole.setUpdatedTime(ZonedDateTime.ofInstant(updatedTime.toInstant(),
                    java.time.ZoneId.systemDefault()));
        }
        menuRole.setUpdatedBy(rs.getString("updated_by"));
        menuRole.setDeleted(rs.getBoolean("deleted"));

        return menuRole;
    };

    /**
     * 根据角色ID查询菜单关联
     *
     * @param roleId 角色ID
     * @return 菜单角色关联列表
     */
    public List<SYSMenuRole> findByRoleId(Long roleId) {
        return jdbcTemplate.query(FIND_BY_ROLE_ID_SQL, rowMapper, roleId);
    }

    /**
     * 批量插入菜单角色关联
     *
     * @param menuRoles 菜单角色关联列表（包含menuId和roleId）
     * @return 插入的数量
     */
    public int batchInsert(List<SYSMenuRole> menuRoles) {
        if (menuRoles == null || menuRoles.isEmpty()) {
            return 0;
        }

        int[] results = jdbcTemplate.batchUpdate(BATCH_INSERT_SQL, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(@NonNull PreparedStatement ps, int i) throws SQLException {
                SYSMenuRole menuRole = menuRoles.get(i);
                ps.setLong(1, menuRole.getMenuId());
                ps.setLong(2, menuRole.getRoleId());
                ps.setTimestamp(3, Timestamp.from(ZonedDateTime.now().toInstant()));
            }

            @Override
            public int getBatchSize() {
                return menuRoles.size();
            }
        });

        int successCount = 0;
        for (int result : results) {
            if (result > 0) {
                successCount++;
            }
        }
        return successCount;
    }

    /**
     * 根据角色ID物理删除所有菜单关联
     *
     * @param roleId 角色ID
     */
    public void physicalDeleteByRoleId(Long roleId) {
        jdbcTemplate.update(PHYSICAL_DELETE_BY_ROLE_ID_SQL, roleId);
    }

    /**
     * 根据菜单ID物理删除所有角色关联
     *
     * @param menuId 菜单ID
     */
    public void physicalDeleteByMenuId(Long menuId) {
        jdbcTemplate.update(PHYSICAL_DELETE_BY_MENU_ID_SQL, menuId);
    }
}