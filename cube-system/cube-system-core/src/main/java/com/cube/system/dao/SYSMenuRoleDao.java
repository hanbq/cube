package com.cube.system.dao;

import com.cube.common.exception.DataBaseException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.ZonedDateTime;

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

    public SYSMenuRoleDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

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
}