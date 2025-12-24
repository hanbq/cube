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
 * 按钮角色关联DAO
 *
 * @author cube
 * @since 2025-12-24
 */
@Repository
public class SYSButtonRoleDao {

    private final JdbcTemplate jdbcTemplate;

    private static final String TABLE_NAME = "CUBE_SYS_BUTTON_ROLE";

    private static final String INSERT_SQL =
            "INSERT INTO " + TABLE_NAME +
            " (button_id, role_id, created_time, deleted) VALUES (?, ?, ?, false)";

    private static final String DELETE_BY_BUTTON_AND_ROLE_SQL =
            "UPDATE " + TABLE_NAME + " SET deleted = true, updated_time = ? " +
            "WHERE button_id = ? AND role_id = ? AND deleted = false";

    private static final String DELETE_BY_BUTTON_SQL =
            "UPDATE " + TABLE_NAME + " SET deleted = true, updated_time = ? " +
            "WHERE button_id = ? AND deleted = false";

    private static final String DELETE_BY_ROLE_SQL =
            "UPDATE " + TABLE_NAME + " SET deleted = true, updated_time = ? " +
            "WHERE role_id = ? AND deleted = false";

    private static final String EXISTS_SQL =
            "SELECT COUNT(*) FROM " + TABLE_NAME +
            " WHERE button_id = ? AND role_id = ? AND deleted = false";

    public SYSButtonRoleDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * 插入按钮角色关联
     *
     * @param buttonId 按钮ID
     * @param roleId 角色ID
     * @return 插入后的主键ID
     */
    public Long insert(Long buttonId, Long roleId) {
        // 检查是否已存在
        if (exists(buttonId, roleId)) {
            throw new DataBaseException("Button role association already exists");
        }

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, buttonId);
            ps.setLong(2, roleId);
            ps.setTimestamp(3, Timestamp.from(ZonedDateTime.now().toInstant()));
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    /**
     * 删除按钮角色关联（软删除）
     *
     * @param buttonId 按钮ID
     * @param roleId 角色ID
     * @return 删除的行数
     */
    public int deleteByButtonIdAndRoleId(Long buttonId, Long roleId) {
        return jdbcTemplate.update(DELETE_BY_BUTTON_AND_ROLE_SQL,
                Timestamp.from(ZonedDateTime.now().toInstant()),
                buttonId,
                roleId
        );
    }

    /**
     * 删除按钮的所有角色关联（软删除）
     *
     * @param buttonId 按钮ID
     * @return 删除的行数
     */
    public int deleteByButtonId(Long buttonId) {
        return jdbcTemplate.update(DELETE_BY_BUTTON_SQL,
                Timestamp.from(ZonedDateTime.now().toInstant()),
                buttonId
        );
    }

    /**
     * 删除角色的所有按钮关联（软删除）
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
     * 判断按钮角色关联是否存在
     *
     * @param buttonId 按钮ID
     * @param roleId 角色ID
     * @return 是否存在关联
     */
    public boolean exists(Long buttonId, Long roleId) {
        var count = jdbcTemplate.queryForObject(EXISTS_SQL, Integer.class, buttonId, roleId);
        return count != null && count > 0;
    }
}