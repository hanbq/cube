package com.cube.system.dao;

import com.cube.common.exception.DataBaseException;
import com.cube.system.entity.SYSMenuRole;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
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

    private static final String INSERT_SQL =
            "INSERT INTO " + TABLE_NAME +
            " (menu_id, role_id, created_time, deleted) VALUES (?, ?, ?, false)";

    private static final String BATCH_INSERT_SQL =
            "INSERT INTO " + TABLE_NAME +
            " (menu_id, role_id, created_time, deleted) VALUES (?, ?, ?, false)";

    private static final String DELETE_BY_MENU_AND_ROLE_SQL =
            "UPDATE " + TABLE_NAME + " SET deleted = true, updated_time = ? " +
            "WHERE menu_id = ? AND role_id = ? AND deleted = false";

    private static final String DELETE_BY_MENU_SQL =
            "UPDATE " + TABLE_NAME + " SET deleted = true, updated_time = ? " +
            "WHERE menu_id = ? AND deleted = false";

    private static final String DELETE_BY_ROLE_SQL =
            "UPDATE " + TABLE_NAME + " SET deleted = true, updated_time = ? " +
            "WHERE role_id = ? AND deleted = false";

    private static final String EXISTS_SQL =
            "SELECT COUNT(*) FROM " + TABLE_NAME +
            " WHERE menu_id = ? AND role_id = ? AND deleted = false";

    private static final String FIND_ALL_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE deleted = false ORDER BY id";

    private static final String FIND_BY_MENU_ID_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE menu_id = ? AND deleted = false ORDER BY id";

    private static final String FIND_BY_ROLE_ID_SQL =
            "SELECT * FROM " + TABLE_NAME + " WHERE role_id = ? AND deleted = false ORDER BY id";

    private static final String PHYSICAL_DELETE_BY_MENU_AND_ROLE_SQL =
            "DELETE FROM " + TABLE_NAME + " WHERE menu_id = ? AND role_id = ?";

    private static final String PHYSICAL_DELETE_BY_ID_SQL =
            "DELETE FROM " + TABLE_NAME + " WHERE id = ?";

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
     * 插入菜单角色关联
     *
     * @param menuId 菜单ID
     * @param roleId 角色ID
     * @return 插入后的主键ID
     */
    public Long insert(Long menuId, Long roleId) {
        // 检查是否已存在
        if (exists(menuId, roleId)) {
            throw new DataBaseException("Menu role association already exists");
        }

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, menuId);
            ps.setLong(2, roleId);
            ps.setTimestamp(3, Timestamp.from(ZonedDateTime.now().toInstant()));
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    /**
     * 删除菜单角色关联（软删除）
     *
     * @param menuId 菜单ID
     * @param roleId 角色ID
     * @return 删除的行数
     */
    public int deleteByMenuIdAndRoleId(Long menuId, Long roleId) {
        return jdbcTemplate.update(DELETE_BY_MENU_AND_ROLE_SQL,
                Timestamp.from(ZonedDateTime.now().toInstant()),
                menuId,
                roleId
        );
    }

    /**
     * 删除菜单的所有角色关联（软删除）
     *
     * @param menuId 菜单ID
     * @return 删除的行数
     */
    public int deleteByMenuId(Long menuId) {
        return jdbcTemplate.update(DELETE_BY_MENU_SQL,
                Timestamp.from(ZonedDateTime.now().toInstant()),
                menuId
        );
    }

    /**
     * 删除角色的所有菜单关联（软删除）
     *
     * @param roleId 角色ID
     * @return 删除的行数
     */
    public int deleteByRoleId(Long roleId) {
        return jdbcTemplate.update(DELETE_BY_ROLE_SQL,
                Timestamp.from(ZonedDateTime.now().toInstant()),
                roleId
        );
    }

    /**
     * 判断菜单角色关联是否存在
     *
     * @param menuId 菜单ID
     * @param roleId 角色ID
     * @return 是否存在关联
     */
    public boolean exists(Long menuId, Long roleId) {
        Integer count = jdbcTemplate.queryForObject(EXISTS_SQL, Integer.class, menuId, roleId);
        return count != null && count > 0;
    }

    /**
     * 查询所有菜单角色关联
     *
     * @return 菜单角色关联列表
     */
    public List<SYSMenuRole> findAll() {
        return jdbcTemplate.query(FIND_ALL_SQL, rowMapper);
    }

    /**
     * 根据菜单ID查询角色关联
     *
     * @param menuId 菜单ID
     * @return 菜单角色关联列表
     */
    public List<SYSMenuRole> findByMenuId(Long menuId) {
        return jdbcTemplate.query(FIND_BY_MENU_ID_SQL, rowMapper, menuId);
    }

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
            public void setValues(PreparedStatement ps, int i) throws SQLException {
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
     * 物理删除菜单角色关联
     *
     * @param menuId 菜单ID
     * @param roleId 角色ID
     * @return 删除的行数
     */
    public int physicalDeleteByMenuIdAndRoleId(Long menuId, Long roleId) {
        return jdbcTemplate.update(PHYSICAL_DELETE_BY_MENU_AND_ROLE_SQL, menuId, roleId);
    }

    /**
     * 批量物理删除菜单角色关联
     *
     * @param ids ID列表
     * @return 删除的数量
     */
    public int physicalDeleteByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return 0;
        }

        int[] results = jdbcTemplate.batchUpdate(PHYSICAL_DELETE_BY_ID_SQL, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                ps.setLong(1, ids.get(i));
            }

            @Override
            public int getBatchSize() {
                return ids.size();
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
}